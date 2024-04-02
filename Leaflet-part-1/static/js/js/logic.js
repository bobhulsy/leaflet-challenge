// Add missing import statement for the L object from the Leaflet library
import L from 'leaflet';

const API_KEY = "pk.eyJ1IjoiaHVsc3kiLCJhIjoiY2x1OW83cXJzMGM2OTJpcDliZDY3ZnZkaCJ9.zGn-H7l22ZPtbccxAB4EEw";

const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(data => {
    createFeatures(data.features);
});

function markerSize(magnitude) {
    return magnitude * 5000;
};

function chooseColor(depth) {
    return depth < 10 ? "#78f100" :
                 depth < 30 ? "#dcf400" :
                 depth < 50 ? "#f7db11" :
                 depth < 70 ? "#fdb72a" :
                 depth < 90 ? "#fca35d" :
                                            "#ff5f65";
}

function createFeatures(earthquakeData) {
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        },
        pointToLayer: (feature, latlng) => {
            return L.circle(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.5
            });
        }
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    const grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
        attribution: "© Mapbox © OpenStreetMap Improve this map",
        style: 'mapbox/light-v11',
        access_token: API_KEY
    });

    const myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [grayscale, earthquakes]
    });

    const overlayMaps = { Earthquakes: earthquakes };

    const legend = L.control({position: "bottomright"});
    legend.onAdd = () => {
        const div = L.DomUtil.create("div", "legend");
        const depth_values = [-10, 10, 30, 50, 70, 90];
        const depth_colors = ["#78f100", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];
        depth_values.forEach((value, index) => {
            div.innerHTML += `<div class="legend-item"><i style="background:${depth_colors[index]}"></i>${value}</div>`;
        });
        return div;
    };
    legend.addTo(myMap);

    L.control.layers(overlayMaps, {collapsed: false}).addTo(myMap);
};