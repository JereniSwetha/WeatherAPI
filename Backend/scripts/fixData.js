const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Weather = require("../models/Weather");
dotenv.config();

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
}

function parseCustomDate(dateStr) {
  if (!dateStr) return null;
  const [datePart, timePart] = dateStr.split("-");
  if (!datePart || !timePart) return null;

  const year = datePart.substring(0, 4);
  const month = datePart.substring(4, 6);
  const day = datePart.substring(6, 8);

  return new Date(`${year}-${month}-${day}T${timePart}:00Z`);
}

async function fixData() {
  try {
    await connectDB();

    const cursor = Weather.find().cursor();

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const updates = {};

      if (typeof doc.datetime_utc === "string") {
        updates.datetime_utc = parseCustomDate(doc.datetime_utc);
      }

      if (typeof doc._hum === "string") {
        const humVal = parseInt(doc._hum, 10);
        updates._hum = isNaN(humVal) ? null : humVal;
      }

      if (Object.keys(updates).length > 0) {
        await Weather.updateOne({ _id: doc._id }, { $set: updates });
        console.log(`Updated document ${doc._id}`);
      }
    }

    console.log("Data correction complete");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error fixing data:", err.message);
    mongoose.connection.close();
  }
}

fixData();