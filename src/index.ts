import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { searchForUrls } from "./utils.ts";

dotenv.config();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT;

app.post("/", async (req, res, next) => {
  try {
    const response = await searchForUrls(req.body.text, [req.body.keyword]);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT || 4000, () => {
  console.log(`App listening on port ${PORT}`);
});

// todo: set up express
