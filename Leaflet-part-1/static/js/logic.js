// Initialize the map
var mymap = L.map("mapid").setView([37.8, -96], 4); // Adjust the center and zoom level to your preference

// Add a base layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(mymap);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 20000; // Scale factor to visually represent magnitude
}

// Function to choose color based on earthquake depth
function depthColor(depth) {
  if (depth > 90) return "#ff0000";
  else if (depth > 70) return "#ff6600";
  else if (depth > 50) return "#ffcc00";
  else if (depth > 30) return "#ccff00";
  else if (depth > 10) return "#66ff00";
  else return "#00ff00";
}

// GeoJson
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
).then(function (data) {
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
          "</h3><hr><p>Magnitude: " +
          feature.properties.mag +
          "<br>Depth: " +
          feature.geometry.coordinates[2] +
          "</p>"
      );
    },
  }).addTo(mymap);
});

