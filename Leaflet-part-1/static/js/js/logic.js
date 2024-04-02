// Constants
const API_KEY = "pk.eyJ1IjoiaHVsc3kiLCJhIjoiY2x1OW8wdHo5MGIzdTJrbGRnOGx4bXV0MiJ9.7FIEfH545yOuX3asxM8zCg";
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5000;
}

// Function to determine marker color based on depth
function chooseColor(depth) {
    return depth < 10 ? "#78f100" :
        depth < 30 ? "#dcf400" :
        depth < 50 ? "#f7db11" :
        depth < 70 ? "#fdb72a" :
        depth < 90 ? "#fca35d" :
        "#ff5f65";
}

// Function to create earthquake markers and popups
function createFeatures(earthquakeData) {
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        },
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.5
            });
        }
    }).addTo(map); 

    createLegend(); 
}

// Function to create map
function createMap() {
    const grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: "© Mapbox © OpenStreetMap",
        style: 'mapbox/light-v11',
        accessToken: API_KEY 
    }).addTo(map);
}

// Function to create legend
function createLegend() {
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = () => {
        const div = L.DomUtil.create("div", "legend");
        const depths = [-10, 10, 30, 50, 70, 90];
        const colors = ["#78f100", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += `
                <div class="legend-item">
                    <i style="background:${colors[i]}"></i> 
                    ${depths[i]}+
                </div>
            `;
        }

        return div;
    };
    legend.addTo(map);
}

// Fetch and process data
d3.json(queryUrl).then(earthquakeData => {
    createFeatures(earthquakeData.features); 
    createMap(); 
}); 

