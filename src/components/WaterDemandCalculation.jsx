export default function WaterDemandCalculation({
  formData,
  setFormData,
}) {
  return (
    <div className="card">
      <h2>Water Demand Calculation</h2>

      <label>Peak Factor</label>

      <input
        type="number"
        step="0.1"
        value={formData.peakFactor}
        onChange={(e) =>
          setFormData({
            ...formData,
            peakFactor: Number(e.target.value),
          })
        }
      />
    </div>
  );
}