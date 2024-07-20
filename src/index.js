import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { searchForUrls } from "./utils.js";
import cors from 'cors';


dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());



const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/", async (req, res, next) => {
  try {
    console.log('trying')
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
