// Constants
const API_KEY =
  "pk.eyJ1IjoiaHVsc3kiLCJhIjoiY2x1OW8wdHo5MGIzdTJrbGRnOGx4bXV0MiJ9.7FIEfH545yOuX3asxM8zCg";
const queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// ... markerSize, chooseColor remain the same ...

// Function to create earthquake markers and popups
function createFeatures(earthquakeData) {
  // ... your existing createFeatures implementation ...
}

// Function to create map
function createMap() {
  // ... your existing createMap implementation ...
}

// Function to create legend
function createLegend() {
  // ... your existing createLegend implementation ...
}

// Function to fetch and process earthquake data
function getEarthquakeData() {
  d3.json(queryUrl)
    .then((earthquakeData) => {
      createFeatures(earthquakeData.features);
      createMap();
    })
    .catch((error) => {
      console.error("Error fetching earthquake data:", error);
      // Optionally display an error message to the user
    });
}

// Call the function to initiate the map creation processes
getEarthquakeData();
