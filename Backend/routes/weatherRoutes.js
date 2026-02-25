const express = require("express");
const router = express.Router();

const {
  getWeatherByMonth,
  getWeatherByDate,
  getMonthlyStats
} = require("../controllers/weatherController");

router.get("/month/:month", getWeatherByMonth);
router.get("/date/:date", getWeatherByDate);
router.get("/stats/:year", getMonthlyStats);

module.exports = router;