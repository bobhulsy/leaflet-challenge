// Initialize the map and set its view to a central point. Adjust the coordinates and zoom level to your preference.
var myMap = L.map("mapid").setView([37.8, -96], 4);

// Add a tile layer (OpenStreetMap) to add to our map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(myMap);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 20000; // Adjust the multiplier as needed to visually optimize marker sizes
}

// Function to determine marker color based on earthquake depth
function depthColor(depth) {
  if (depth > 90) return "#ff0000";
  else if (depth > 70) return "#ff8c00";
  else if (depth > 50) return "#ffd700";
  else if (depth > 30) return "#9acd32";
  else if (depth > 10) return "#0f9d58";
  else return "#2e8b57";
}

// Define the GeoJSON URL (USGS Earthquake data feed)
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Use D3 to fetch the GeoJSON data
d3.json(queryUrl).then(function (data) {
  // Create a GeoJSON layer containing the features array of the earthquake data
  // Each feature will run the function to create a marker for each earthquake
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: depthColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h3>" +
          feature.properties.place +
          "</h3><hr><p>" +
          new Date(feature.properties.time) +
          "</p>" +
          "<p>Magnitude: " +
          feature.properties.mag +
          "</p>" +
          "<p>Depth: " +
          feature.geometry.coordinates[2] +
          " km</p>"
      );
    },
  }).addTo(myMap);
});
