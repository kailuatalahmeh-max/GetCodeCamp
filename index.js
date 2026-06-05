const cors = require("cors");
const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173" 
}));


const mongoURI = "mongodb://localhost:27017/todo_db";
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل الآن على البورت: http://localhost:${PORT}`);
  setTimeout(() => {
    getWeatherDataFromOpenWeatherMap();
  }, 1000);
});

let weatherData = {};

function getWeatherDataFromOpenWeatherMap() {
  axios
    .get(
      "https://api.openweathermap.org/data/2.5/weather?q=Dura&appid=4b75b5c3b73a8dc3ccfd60fb4511b919&units=metric&lang=ar",
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
    .post("http://localhost:5000/api/todos", weatherData)
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
