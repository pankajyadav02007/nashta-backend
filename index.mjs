import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Hello World",
  });
});

// login
app.post("/login", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    name: "login",
  });
});

// signup
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    },
  });
  res.json({ user });
});

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
