require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const cookieParser = require("cookie-parser");
const passport = require("./src/config/passport");
const crypto = require("crypto");
const codeRoutes = require("./src/routes/codeRoutes");

const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
// CORS (important for cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/code", codeRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`CodeInsight API running on ${process.env.PORT}`);
});
