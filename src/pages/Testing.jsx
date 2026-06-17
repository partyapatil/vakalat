import { useEffect, useMemo, useState } from "react";
import {add,subtract,multiply } from "../pages/index";
export default function Testing() {
  const [formData, setFormData] = useState({
    buildingType: "Residential",
    population: 100,
    lpcd: 135, // Liters Per Capita Per Day
    peakFactor: 2.5,
  });
  const [input,setinput]=useState(0)

  // CORRECT USECASE: 
  // 1. It performs an actual calculation.
  // 2. It has a dependency array [formData.population, formData.lpcd]
  const totalWaterDemand = useMemo(() => {
    // console.log("Calculating water demand..."); // This will only log when population or lpcd changes
    return formData.population * formData.lpcd;
  }, [formData.population, formData.lpcd,input]); 

const fetchUserProfile = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 101, name: "Alex Mercer", role: "Admin" }), 1200);
  });
};

useEffect(()=>{
  const data=fetchUserProfile().then(e=>console.log(e))

  // console.log(data)
},[])


function deepClone(value) {
  add()
  // 1. Base Case: If it's not an object, or if it is null, return it directly
  if (typeof value !== "object" || value === null) {
    return value;
  }

  // 2. Handle Arrays
  if (Array.isArray(value)) {
    const newArray = [];
    for (let i = 0; i < value.length; i++) {
      // RECURSION: The function calls itself to handle items inside the array
      newArray[i] = deepClone(value[i]);
    }
    return newArray;
  }

  // 3. Handle Objects
  const newObject = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      // RECURSION: The function calls itself to handle nested properties
      newObject[key] = deepClone(value[key]);
    }
  }
  return newObject;
}
const original = { name: "Apple", details: { color: "Red" },test:[4,8,12] };

console.log(deepClone(original))


  return (
    <div style={{ display: "flex", gap: "30px", padding: "30px", flexDirection: "column" }}>
 
 <input onChange={(e)=>setinput(e.target.value)} placeholder="enter value"/>
 
     <h3>Water Management Calculator</h3>
      <p>Total Water Demand: <strong>{totalWaterDemand} Liters/Day</strong></p>
      
      {/* Button to trigger a re-render by changing a completely different state property */}
      <button onClick={() => setFormData({ ...formData, buildingType: "Commercial" })}>
        Change Type to Commercial (Won't re-run calculation)
      </button>

      {/* Button to trigger a re-render that SHOULD update the calculation */}
      <button onClick={() => setFormData({ ...formData, population: 200 })}>
        Double the Population (Will re-run calculation)
      </button>
    </div>
  );
}