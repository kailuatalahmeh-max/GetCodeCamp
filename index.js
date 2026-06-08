require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*", 
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "السيرفر يعمل بنجاح، وجاهز للفحص يا محمد! 🚀" });
});

app.get("/api/todos", (req, res) => {
  res.json({ message: "Ready" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل الآن بأمان على البورت: ${PORT}`);
});
