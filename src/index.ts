import fetch from "node-fetch";

const response = await fetch("https://github.com/");
const text = await response.text();

console.log(text);
