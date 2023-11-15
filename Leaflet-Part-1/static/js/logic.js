let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url).then(data => {

    console.log(data);

    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(features, layer){
    layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p>`);};

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(features, coordinates) {
        let depth = features.properties.mag;
        let geoMarkers = {
            radius: depth * 5,
            fillColor: colors(depth),
            fillOpacity: 0.7,
            weight: 0.5
        };
        return L.circleMarker(coordinates, geoMarkers);
    }
    });

  createMap(earthquakes);
};

function colors(depth) {

    // variable to hold the color
    let color = "";

    if (depth <= 1) {
        return color = "#8afed3";
    }
    else if (depth <= 2) {
        return color = "#20fdac";
    }
    else if (depth <= 3) {
        return color = "#01f89d";
    }
    else if (depth <= 4) {
        return color = "#01b170";
    }
    else if (depth <= 5) {
        return color = "#018d5a";
    }
    else {
        return color = "#006a43";
    }

};
// function to create the map
function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?',{layers: 'TOPO-WMS'});

    let grayscale = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'YnpQEhRDopnhG3NFNlYUwXCpK50fR3yagyHj5MwZJKWU0gnuq4iYH7xJ49UjNWaC'
    });

    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
        "Grayscale Map": grayscale
    };

    // overlay object for street map and topgraphic map
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Add the layer control to the map.
    // To choose between map view options
    L.control.layers(baseMaps, overlayMaps, {
    }).addTo(myMap);
};