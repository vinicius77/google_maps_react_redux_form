import React, { useState, useEffect } from "react";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import mapStyles from "./mapStyles";

const marker = {
  id: "marker_id",
  lng: -79.38011,
  lat: 43.656148,
  icon: "https://img.icons8.com/color/48/000000/map-pin.png",
  title: "Mock",
  description: "My mock Location",
};

function Map(props) {
  const [selectedPark, setSelectedPark] = useState(null);
  const { markers } = props;

  console.log({ props });

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
  }, []);

  console.log({
    markers,
    selectedPark,
    env: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  return (
    <GoogleMap
      defaultZoom={19}
      defaultCenter={{ lat: 43.6561, lng: -79.3802 }}
      options={{ styles: mapStyles }}
    >
      {markers.length
        ? markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{
                lat: marker.lat,
                lng: marker.lng,
              }}
              onClick={() => {
                setSelectedPark(marker);
              }}
              icon={{
                url: marker.icon,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          ))
        : null}

      {selectedPark && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedPark(null);
          }}
          position={{
            lat: selectedPark.lat,
            lng: selectedPark.lng,
          }}
        >
          <div>
            <h2>{selectedPark.title}</h2>
            <p>{selectedPark.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

const FormLocation = ({ setMarkers, markers }) => {
  const onSubmit = (e) => {
    e.preventDefault();

    const elements = new FormData(e.currentTarget);

    const formDataObj = {};
    elements.forEach((value, key) => (formDataObj[key] = value));

    setMarkers([
      {
        ...formDataObj,
        id: Date.now().toString(),
        icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        lng: -79.380633,
        lat: 43.655857,
      },
      ...markers,
    ]);
  };

  return (
    <form
      style={{ width: "20%", display: "flex", flexDirection: "column" }}
      onSubmit={onSubmit}
    >
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" />
      <label for="description">Description:</label>
      <input type="text" id="description" name="description" />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default function Main() {
  const [markers, setMarkers] = useState([
    marker,
    {
      id: "marker_id_2",
      lng: -79.380423,
      lat: 43.656132,
      icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      title: "Bar Area",
      description:
        "Alcoholic beverages served to only 19+ after looking at a photo ID.",
    },
  ]);

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <FormLocation setMarkers={setMarkers} markers={markers} />
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places}`}
        loadingElement={<div style={{ width: `80%`, height: "100%" }} />}
        containerElement={<div style={{ width: `80%`, height: "100%" }} />}
        mapElement={<div style={{ width: `80%`, height: "100%" }} />}
        markers={markers}
      />
    </div>
  );
}
