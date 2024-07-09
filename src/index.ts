import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const response = await fetch("https://github.com/");
const text = await response.text();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

console.log(text);
console.log(PORT);
console.log(process.env.STATUS);

// todo: set up express
