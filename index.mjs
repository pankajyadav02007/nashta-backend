import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
import bcrypt from "bcrypt";
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

  res.status(200).json({
    massage: `login successfull Welcome, ${user.name}`,
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
      password: hashPassword,
    },
  });
  res.json({ user });
});

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
