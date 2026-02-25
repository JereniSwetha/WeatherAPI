const Weather = require("../models/Weather");


// weather by month
exports.getWeatherByMonth = async (req, res) => {
  try {
    const month = Number(req.params.month);

    const data = await Weather.find({ month })
      .select("date condition temperature humidity pressure");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// weather by date
exports.getWeatherByDate = async (req, res) => {
  try {
    const data = await Weather.find({
      date: req.params.date
    }).select("condition temperature humidity pressure");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// monthly stats
exports.getMonthlyStats = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const stats = await Weather.aggregate([
      { $match: { year, temperature: { $ne: null } } },

      {
        $group: {
          _id: "$month",
          maxTemp: { $max: "$temperature" },
          minTemp: { $min: "$temperature" },
          temps: { $push: "$temperature" }
        }
      },
      {
        $project: {
          month: "$_id",
          maxTemp: 1,
          minTemp: 1,
          medianTemp: {
            $arrayElemAt: [
              { $sortArray: { input: "$temps", sortBy: 1 } },
              { $floor: { $divide: [{ $size: "$temps" }, 2] } }
            ]
          }
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};