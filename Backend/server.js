const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/weather", weatherRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);