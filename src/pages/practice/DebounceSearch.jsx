// DebounceSearch.jsx
import { useRef, useState } from "react";
import { mockSearchApi } from "../mocjApi";

const DebounceSearch = () => {
  const [ser, setSer] = useState("");
  const [selected, setselecetd] = useState("");
  const ref = useRef();

  const handalType = (data) => {
    setselecetd(data);
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      fetchfruites(data);
      console.log("called");
    }, 1000);
  };

  const fetchfruites = async (payload) => {
    try {
      const data = await mockSearchApi(payload);
      setSer(data);
    } catch (e) {
      alert(e);
    }
  };

  const handalselectMenu = (e) => {
    setselecetd(e);
    setSer(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <h3>Debounce Search Practice</h3>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "25px", flexDirection: "column", width: "100%", maxWidth: "500px" }}>
        <input
          value={selected}
          placeholder="search fruit"
          onChange={(e) => handalType(e.target.value)}
          style={{ border: "1px solid black", borderRadius: "5px", padding: "10px", width: "100%" }}
        />
        {ser?.length > 0 && (
          <ul style={{ width: "100%", paddingLeft: 0, listStyle: "none" }}>
            {ser?.map((e, index) => (
              <li
                onClick={() => handalselectMenu(e)}
                style={{ background: "#f0f0f0", padding: "8px", borderRadius: "8px", border: "1px solid black ", margin: "5px 0", cursor: "pointer" }}
                key={index}
              >
                {e}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DebounceSearch;