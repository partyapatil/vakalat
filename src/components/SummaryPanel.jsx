export default function SummaryPanel({ formData }) {
  const dailyDemand =
    formData.population * formData.lpcd;

  const dailyDemandKld = dailyDemand / 1000;

  const averageHourlyDemand =
    dailyDemand / 24;

  const peakHourlyDemand =
    averageHourlyDemand * formData.peakFactor;

  return (
    <div className="summary">
      <h2>Summary</h2>

      <p>
        <b>Building Type:</b> {formData.buildingType}
      </p>

      <p>
        <b>Population:</b> {formData.population}
      </p>

      <p>
        <b>LPCD:</b> {formData.lpcd}
      </p>

      <p>
        <b>Peak Factor:</b> {formData.peakFactor}
      </p>

      <hr />

      <p>
        <b>Daily Demand:</b>{" "}
        {dailyDemand.toFixed(2)} L/day
      </p>

      <p>
        <b>Daily Demand:</b>{" "}
        {dailyDemandKld.toFixed(2)} KLD
      </p>

      <p>
        <b>Average Hourly Demand:</b>{" "}
        {averageHourlyDemand.toFixed(2)} L/hr
      </p>

      <p>
        <b>Peak Hourly Demand:</b>{" "}
        {peakHourlyDemand.toFixed(2)} L/hr
      </p>
    </div>
  );
}