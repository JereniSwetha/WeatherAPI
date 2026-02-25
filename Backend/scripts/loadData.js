require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Weather = require("../models/Weather");


connectDB();

const filePath = path.join(__dirname, "..", "data", "testset.csv");

const parseDate = (dateStr) => {
  if (!dateStr) return null;

  try {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const time = dateStr.substring(9);

    return new Date(`${year}-${month}-${day}T${time}:00Z`);
  } catch {
    return null;
  }
};


const cleanValue = (value) => {
  if (
    value === "" ||
    value === "N/A" ||
    value === "-9999" ||
    value === undefined
  ) {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? value : num;
};


const loadData = async () => {
  try {
    const batchSize = 5000; 
    let batch = [];

    console.log("📥 Reading CSV...");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {

        // ✅ convert datetime
        row.datetime_utc = parseDate(row.datetime_utc);

        // ✅ clean all fields
        Object.keys(row).forEach((key) => {
          row[key] = cleanValue(row[key]);
        });

        batch.push(row);

        // ✅ insert in batches (important for big dataset)
        if (batch.length >= batchSize) {
          await Weather.insertMany(batch, { ordered: false });
          console.log(`✅ Inserted ${batch.length} records`);
          batch = [];
        }
      })

      .on("end", async () => {
        // insert remaining rows
        if (batch.length > 0) {
          await Weather.insertMany(batch, { ordered: false });
          console.log(`✅ Inserted remaining ${batch.length}`);
        }

        console.log("🎉 Data Imported Successfully");
        mongoose.connection.close();
      })

      .on("error", (err) => {
        console.error("❌ File Read Error:", err);
      });

  } catch (error) {
    console.error("❌ Import Error:", error);
    mongoose.connection.close();
  }
};

loadData();