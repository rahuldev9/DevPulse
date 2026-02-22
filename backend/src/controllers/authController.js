const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4️⃣ Login URL
    const loginUrl = `${process.env.CLIENT_URL}/login`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5️⃣ Send Welcome Email
    const info = await transporter.sendMail({
      from: `"DevPlue Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to DevPlue 🎉",
      html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:12px;overflow:hidden;">
                
                <tr>
                  <td align="center"
                    style="background:linear-gradient(135deg,#f97316,#2563eb);padding:35px;">
                    <h1 style="color:#ffffff;margin:0;">
                      Welcome to DevPlue 🚀
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px 35px;">
                    <h2>Hello ${name} 👋</h2>
                    <p style="font-size:15px;line-height:1.6;">
                      Your account has been successfully created.
                      You can now log in and start exploring DevPlue.
                    </p>

                    <div style="text-align:center;margin:30px 0;">
                      <a href="${loginUrl}"
                        style="display:inline-block;padding:14px 28px;
                        background:linear-gradient(135deg,#f97316,#2563eb);
                        color:#ffffff;text-decoration:none;border-radius:8px;
                        font-weight:bold;">
                        Login to Your Account
                      </a>
                    </div>

                    <p style="font-size:13px;color:#6b7280;">
                      If you did not create this account, please contact support.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="background:#f9fafb;padding:20px;">
                    <p style="font-size:12px;color:#6b7280;margin:0;">
                      © ${new Date().getFullYear()} DevPlue.
                      All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });

    // 6️⃣ Rollback if email fails
    if (!info.accepted || info.accepted.length === 0) {
      await User.findByIdAndDelete(user._id);
      return res.status(400).json({ message: "Email not deliverable" });
    }

    return res.status(201).json({
      message: "User registered successfully. Email sent.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

// =============================
// LOGIN
// =============================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};

// =============================
// PROFILE
// =============================
// =============================
// PROFILE
// =============================
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      ...user.toObject(),
      hasPassword: !!req.user.password, // true if password exists
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// LOGOUT
// =============================
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// =============================
// UPDATE NAME
// =============================
exports.updateName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.name = req.body.name || user.name;
    await user.save();

    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE AVATAR
// =============================
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old avatar
    if (user.avatar) {
      const oldPath = path.join(__dirname, "../../", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// FORGOT PASSWORD
// =============================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DevPlue Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password – DevPlue",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    next(err);
  }
};

// =============================
// RESET PASSWORD
// =============================
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
  }
};
exports.googleLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }

    const { email, name, avatar, existingUser } = req.user;

    let user = existingUser;
    let isNewUser = false;

    // 1️⃣ Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "google",
      });

      isNewUser = true;
    }

    // 2️⃣ Send welcome email if new user
    if (isNewUser) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"DevPlue Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to DevPlue 🎉",
        html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">

<tr>
<td align="center" style="background:linear-gradient(135deg,#f97316,#2563eb);padding:35px;">
  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
    Welcome to DevPlue 🚀
  </h1>
</td>
</tr>

<tr>
<td style="padding:40px 35px;">
  <h2 style="margin-top:0;color:#111827;">Hello ${name} 👋</h2>

  <p style="color:#374151;font-size:15px;line-height:1.6;">
    Your account has been successfully created using 
    <strong>Google Sign-In</strong>.
  </p>

  <p style="color:#374151;font-size:15px;line-height:1.6;">
    You can now access your dashboard and start exploring DevPlue.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
    <tr>
      <td align="center">
        <a href="${process.env.CLIENT_URL}/dashboard"
          style="
            display:inline-block;
            padding:14px 28px;
            font-size:16px;
            color:#ffffff;
            background:linear-gradient(135deg,#f97316,#2563eb);
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          ">
          Go to Dashboard
        </a>
      </td>
    </tr>
  </table>

  <p style="color:#6b7280;font-size:13px;">
    If you did not sign up using Google, please contact support immediately.
  </p>
</td>
</tr>

<tr>
<td align="center" style="background:#f9fafb;padding:20px;">
  <p style="margin:0;font-size:12px;color:#6b7280;">
    © ${new Date().getFullYear()} DevPlue. All rights reserved.
  </p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
      });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5️⃣ Redirect
    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// SET / CHANGE PASSWORD (Logged-in user)
// =============================
exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({
      message: "Password set successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
