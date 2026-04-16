import express from "express";
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
app.post("/signup", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    name: "signup",
  });
});

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
