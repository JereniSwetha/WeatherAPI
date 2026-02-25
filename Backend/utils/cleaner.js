const parseNumber = (val) => {
  if (!val || val === "-9999") return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const parseBool = (val) => Number(val) === 1;

const cleanWeatherData = (rows) => {
  return rows.map((row) => {

    // convert: 19961101-11:00 → ISO date
    const raw = row.datetime_utc;

    const formatted =
      raw.slice(0,4) + "-" +
      raw.slice(4,6) + "-" +
      raw.slice(6,8) + "T" +
      raw.slice(9);

    const d = new Date(formatted);

    return {
      datetime: d,
      date: d.toISOString().split("T")[0],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      hour: d.getHours(),

      condition: row._conds || null,

      temperature: parseNumber(row._tempm),
      dewPoint: parseNumber(row._dewptm),
      heatIndex: parseNumber(row._heatindexm),
      windChill: parseNumber(row._windchillm),

      humidity: parseNumber(row._hum),
      pressure: parseNumber(row._pressurem),
      visibility: parseNumber(row._vism),
      precipitation: parseNumber(row._precipm),

      windDirectionDeg: parseNumber(row._wdird),
      windDirection: row._wdire || null,
      windSpeed: parseNumber(row._wspdm),
      windGust: parseNumber(row._wgustm),

      fog: parseBool(row._fog),
      hail: parseBool(row._hail),
      rain: parseBool(row._rain),
      snow: parseBool(row._snow),
      thunder: parseBool(row._thunder),
      tornado: parseBool(row._tornado)
    };
  });
};

module.exports = cleanWeatherData;