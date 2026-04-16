import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Hello World",
  });
});

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
