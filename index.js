require("dotenv").config(); // 👈 أهم سطر لقراءة ملف الـ .env
const cors = require("cors");
const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// قراءة رابط الداتابيز من ملف الـ .env
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/todo_db";
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ تم الاتصال بـ MongoDB بنجاح!"))
  .catch((err) => console.error("❌ فشل الاتصال بقاعدة البيانات:", err));

const WeatherSchema = new mongoose.Schema({}, { strict: false });
const Weather = mongoose.model("Weather", WeatherSchema);

app.post("/api/todos", async (req, res) => {
  try {
    const newWeatherData = new Weather(req.body);
    await newWeatherData.save();
    res.status(201).json({
      message: "تم حفظ بيانات الطقس بنجاح في قاعدة البيانات!",
      data: newWeatherData,
    });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء حفظ البيانات" });
  }
});

// قراءة البورت من ملف الـ .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل الآن على البورت: http://localhost:${PORT}`);
  setTimeout(() => {
    getWeatherDataFromOpenWeatherMap();
  }, 1000);
});

let weatherData = {};

function getWeatherDataFromOpenWeatherMap() {
  // 👈 هون سحبنا الـ Token من البيئة المحمية بدون ما نكشفه بالكود
  const apiKey = process.env.OPENWEATHER_API_KEY;

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=Dura&appid=${apiKey}&units=metric&lang=ar`,
    )
    .then(function (Response) {
      console.log("🌤️ تم جلب بيانات الطقس لمدينة دورا بنجاح.");
      weatherData = Response.data;
      createLocationForWeatherData();
    })
    .catch(function (error) {
      console.log("فشل الحصول على البيانات من OpenWeatherMap", error.message);
    });
}

function createLocationForWeatherData() {
  axios
    .post(`http://localhost:${PORT}/api/todos`, weatherData)
    .then(function (response) {
      console.log(
        "🎯 تم إرسال البيانات بنجاح إلى السيرفر الخاص بك:",
        response.data.message,
      );
    })
    .catch(function (error) {
      console.log("فشل إرسال البيانات إلى السيرفر الخاص بك:", error.message);
    });
}
