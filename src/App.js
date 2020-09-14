import React, { useCallback, useEffect, useState } from "react";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
import * as parkData from "./data.json";
import skate from "./skate-side-view.svg";
import "./App.css";

function App() {
  const [viewport, setViewPort] = useState({
    latitude: 45.45211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 10,
  });
  const [selectedPark, setSelectedPark] = useState(null);
  const handleClick = useCallback((event, park) => {
    event.preventDefault();
    setSelectedPark(park);
  }, []);
  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  });
  return (
    <div>
      <ReactMapGl
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
        mapStyle={"mapbox://styles/valefar/ckf2kcptu29ou1aljqkudpwzx"}
        onViewportChange={(viewport) => {
          setViewPort(viewport);
        }}
      >
        {parkData.features.map((park) => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
            <button
              className={"markerButton"}
              onClick={(e) => handleClick(e, park)}
            >
              <img src={skate} alt="skate park icon" />
            </button>
          </Marker>
        ))}
        {selectedPark && (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => setSelectedPark(null)}
          >
            <div>
              <h2>{selectedPark.properties.NAME}</h2>
              <h3>{selectedPark.properties.ADDRESS}</h3>
              <p>
                {selectedPark.properties.DESCRIPTION}
                <br />
                {selectedPark.properties.FACILITY}
              </p>
            </div>
          </Popup>
        )}
      </ReactMapGl>
    </div>
  );
}

export default App;
