import { buildingDefaults } from "../constants";

export default function BuildingInfo({ formData, setFormData }) {
  const handleBuildingTypeChange = (type) => {
    setFormData({
      ...formData,
      buildingType: type,
      lpcd: buildingDefaults[type].lpcd,
      peakFactor: buildingDefaults[type].peakFactor,
    });
  };

  return (
    <div className="card">
      <h2>Building Information</h2>

      <label>Building Type</label>

      <select
        value={formData.buildingType}
        onChange={(e) => handleBuildingTypeChange(e.target.value)}
      >
        {Object.keys(buildingDefaults).map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>

      <label>Population</label>

      <input
        type="number"
        value={formData.population}
        onChange={(e) =>
          setFormData({
            ...formData,
            population: Number(e.target.value),
          })
        }
      />

      <label>LPCD</label>

      <input
        type="number"
        value={formData.lpcd}
        onChange={(e) =>
          setFormData({
            ...formData,
            lpcd: Number(e.target.value),
          })
        }
      />
    </div>
  );
}