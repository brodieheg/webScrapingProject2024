import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { searchForUrls } from "./utils.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/", async (req, res, next) => {
  try {
    const response = await searchForUrls(req.body.text, [req.body.keyword]);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// todo: set up express
