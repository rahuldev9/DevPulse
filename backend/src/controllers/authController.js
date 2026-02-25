// =============================
// IMPORTS
// =============================
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

// =============================
// MAIL TRANSPORTER
// =============================
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// =============================
// REGISTER
// =============================
// =============================
// REGISTER
// =============================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    //     const loginUrl = `${process.env.CLIENT_URL}/login`;

    //     // 4️⃣ Mail Transport
    //     const transporter = nodemailer.createTransport({
    //       service: "gmail",
    //       auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //       },
    //     });

    //     // 5️⃣ Send Welcome Email (Same Design)
    //     const info = await transporter.sendMail({
    //       from: `"DevPlue Support" <${process.env.EMAIL_USER}>`,
    //       to: email,
    //       subject: "Welcome to DevPlue 🎉",
    //       html: `
    // <!DOCTYPE html>
    // <html>
    // <head>
    // <meta charset="UTF-8" />
    // </head>

    // <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial, Helvetica, sans-serif;">

    // <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    // <tr>
    // <td align="center">

    // <table width="600" cellpadding="0" cellspacing="0"
    // style="background:#ffffff;border-radius:12px;overflow:hidden;
    // box-shadow:0 10px 30px rgba(0,0,0,0.05);">

    // <!-- HEADER -->
    // <tr>
    // <td align="center"
    // style="background:linear-gradient(135deg,#f97316,#2563eb);padding:35px;">
    //   <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
    //     Welcome to DevPlue 🚀
    //   </h1>
    // </td>
    // </tr>

    // <!-- CONTENT -->
    // <tr>
    // <td style="padding:40px 35px;">
    //   <h2 style="margin-top:0;color:#111827;">
    //     Hello ${name} 👋
    //   </h2>

    //   <p style="color:#374151;font-size:15px;line-height:1.6;">
    //     Your account has been successfully created.
    //   </p>

    //   <p style="color:#374151;font-size:15px;line-height:1.6;">
    //     You can now log in and start exploring DevPlue.
    //   </p>

    //   <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
    //     <tr>
    //       <td align="center">
    //         <a href="${loginUrl}"
    //           style="
    //             display:inline-block;
    //             padding:14px 28px;
    //             font-size:16px;
    //             color:#ffffff;
    //             background:linear-gradient(135deg,#f97316,#2563eb);
    //             text-decoration:none;
    //             border-radius:8px;
    //             font-weight:bold;
    //           ">
    //           Login to Your Account
    //         </a>
    //       </td>
    //     </tr>
    //   </table>

    //   <p style="color:#6b7280;font-size:13px;">
    //     If you did not create this account, please contact support.
    //   </p>
    // </td>
    // </tr>

    // <!-- FOOTER -->
    // <tr>
    // <td align="center" style="background:#f9fafb;padding:20px;">
    //   <p style="margin:0;font-size:12px;color:#6b7280;">
    //     © ${new Date().getFullYear()} DevPlue. All rights reserved.
    //   </p>
    // </td>
    // </tr>

    // </table>

    // </td>
    // </tr>
    // </table>

    // </body>
    // </html>
    // `,
    //     });

    //     // 6️⃣ Rollback if email fails
    //     if (!info.accepted || info.accepted.length === 0) {
    //       await User.findByIdAndDelete(user._id);

    //       return res.status(400).json({
    //         message: "Email not deliverable",
    //       });
    //     }

    res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (err) {
    res.status(500).json({
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
      path: "/",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};

// =============================
// PROFILE
// =============================
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      ...user.toObject(),
      hasPassword: !!req.user.password,
    });
  } catch {
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

    if (user.avatar) {
      const oldPath = path.join(__dirname, "../../", user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// FORGOT PASSWORD
// =============================
// =============================
// FORGOT PASSWORD
// =============================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Do not reveal user existence
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // 1️⃣ Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 2️⃣ Send Email (Same Design)
    await transporter.sendMail({
      from: `"DevPlue Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password – DevPlue",
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
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,0.05);">

<!-- HEADER -->
<tr>
<td align="center"
style="background:linear-gradient(135deg,#f97316,#2563eb);padding:35px;">
  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
    DevPlue Password Reset 🔐
  </h1>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px 35px;">
  <h2 style="margin-top:0;color:#111827;">
    Hello ${user.name} 👋
  </h2>

  <p style="color:#374151;font-size:15px;line-height:1.6;">
    We received a request to reset your password.
  </p>

  <p style="color:#374151;font-size:15px;line-height:1.6;">
    Click the button below to create a new password.
    This link will expire in <strong>15 minutes</strong>.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
    <tr>
      <td align="center">
        <a href="${resetUrl}"
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
          Reset Password
        </a>
      </td>
    </tr>
  </table>

  <p style="color:#6b7280;font-size:13px;">
    If you didn’t request this password reset,
    you can safely ignore this email.
  </p>
</td>
</tr>

<!-- FOOTER -->
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

    res.status(200).json({
      message: "Reset link sent",
    });
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

    if (!user)
      return res.status(400).json({
        message: "Invalid or expired token",
      });

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

// =============================
// DELETE ACCOUNT
// =============================
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.clearCookie("token");

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// SET PASSWORD
// =============================
exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password)
      return res.status(400).json({
        message: "Password is required",
      });

    const user = await User.findById(req.user._id);

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      message: "Password set successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =============================
// GOOGLE LOGIN CALLBACK
// =============================
// =============================
// GOOGLE LOGIN
// =============================
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

    // 2️⃣ Send Welcome Email (Same Design)
    //     if (isNewUser) {
    //       const transporter = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //           user: process.env.EMAIL_USER,
    //           pass: process.env.EMAIL_PASS,
    //         },
    //       });

    //       await transporter.sendMail({
    //         from: `"DevPlue Support" <${process.env.EMAIL_USER}>`,
    //         to: email,
    //         subject: "Welcome to DevPlue 🎉",
    //         html: `
    // <!DOCTYPE html>
    // <html>
    // <head>
    // <meta charset="UTF-8" />
    // </head>

    // <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial, Helvetica, sans-serif;">

    // <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    // <tr>
    // <td align="center">

    // <table width="600" cellpadding="0" cellspacing="0"
    // style="background:#ffffff;border-radius:12px;overflow:hidden;
    // box-shadow:0 10px 30px rgba(0,0,0,0.05);">

    // <!-- HEADER -->
    // <tr>
    // <td align="center"
    // style="background:linear-gradient(135deg,#f97316,#2563eb);padding:35px;">
    //   <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
    //     Welcome to DevPlue 🚀
    //   </h1>
    // </td>
    // </tr>

    // <!-- CONTENT -->
    // <tr>
    // <td style="padding:40px 35px;">
    //   <h2 style="margin-top:0;color:#111827;">
    //     Hello ${name} 👋
    //   </h2>

    //   <p style="color:#374151;font-size:15px;line-height:1.6;">
    //     Your account has been successfully created using
    //     <strong>Google Sign-In</strong>.
    //   </p>

    //   <p style="color:#374151;font-size:15px;line-height:1.6;">
    //     You can now access your dashboard and start exploring DevPlue.
    //   </p>

    //   <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
    //     <tr>
    //       <td align="center">
    //         <a href="${process.env.CLIENT_URL}/dashboard"
    //           style="
    //             display:inline-block;
    //             padding:14px 28px;
    //             font-size:16px;
    //             color:#ffffff;
    //             background:linear-gradient(135deg,#f97316,#2563eb);
    //             text-decoration:none;
    //             border-radius:8px;
    //             font-weight:bold;
    //           ">
    //           Go to Dashboard
    //         </a>
    //       </td>
    //     </tr>
    //   </table>

    //   <p style="color:#6b7280;font-size:13px;">
    //     If you did not sign up using Google, please contact support immediately.
    //   </p>
    // </td>
    // </tr>

    // <!-- FOOTER -->
    // <tr>
    // <td align="center" style="background:#f9fafb;padding:20px;">
    //   <p style="margin:0;font-size:12px;color:#6b7280;">
    //     © ${new Date().getFullYear()} DevPlue. All rights reserved.
    //   </p>
    // </td>
    // </tr>

    // </table>

    // </td>
    // </tr>
    // </table>

    // </body>
    // </html>
    // `,
    //       });
    //     }

    // 3️⃣ Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4️⃣ Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 5️⃣ Redirect user
    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};
