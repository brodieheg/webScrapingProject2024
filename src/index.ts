import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { searchForUrls } from "./utils.ts";

dotenv.config();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT;

app.post("/", async (req, res) => {
  console.log(await searchForUrls(req.body.text, [req.body.keyword]));
  res.send("hi");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

console.log(PORT);
console.log(process.env.STATUS);

// todo: set up express
