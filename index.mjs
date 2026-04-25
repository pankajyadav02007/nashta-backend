import "dotenv/config";

import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
import { sendOTP } from "./resend.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Hello World",
  });
});

// login
app.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401).json({ error: "password not match" });
    return;
  }

  // generate token
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET,
  );

  res.status(200).json({
    massage: `login successfull Welcome, ${user.name}`,
    token,
  });
});

// signup
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      address: req.body.address,
      password: hashPassword,
    },
  });
  res.json({ user });
});

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});

// forgot password
app.patch("/forgot_password", async (req, res) => {
  console.log(req.body);

  // 1. find user
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 2. generate OTP
  const otp = Math.floor(Math.random() * 899999 + 100000);
  const strOTP = `${otp}`;

  // 3. save OTP
  await prisma.user.update({
    where: {
      email: req.body.email,
    },
    data: {
      otp: strOTP,
    },
  });

  // 4. send OTP
  await sendOTP(user.email, strOTP);

  // 5. response
  res.json({
    message: "Check your email",
  });
});

// // reset password
// app.patch("/reset_password", async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

//     const user = await prisma.user.findFirst({
//       where: {
//         id: decoded.id,
//         resetToken: token,
//       },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid token" });
//     }

//     // expiry check
//     if (user.resetTokenExpiry < new Date()) {
//       return res.status(400).json({ message: "Token expired" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         password: hashedPassword,
//         resetToken: null,
//         resetTokenExpiry: null,
//       },
//     });

//     res.json({ message: "Password reset successful" });
//   } catch (err) {
//     res.status(400).json({ message: "Invalid or expired token" });
//   }
// });
