const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  datetime: Date,
  date: String,
  year: Number,
  month: Number,
  hour: Number,
  condition: String,
  temperature: Number,     
  dewPoint: Number,        
  heatIndex: Number,       
  windChill: Number,      
  humidity: Number,        
  pressure: Number,        
  visibility: Number,      
  precipitation: Number,   
  windDirectionDeg: Number, 
  windDirection: String,    
  windSpeed: Number,        
  windGust: Number,         
  fog: Boolean,
  hail: Boolean,
  rain: Boolean,
  snow: Boolean,
  thunder: Boolean,
  tornado: Boolean
});

weatherSchema.index({ date: 1 });
weatherSchema.index({ month: 1 });
weatherSchema.index({ year: 1 });

module.exports = mongoose.model("Weather", weatherSchema);