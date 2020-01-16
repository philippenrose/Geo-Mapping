const API_KEY="pk.eyJ1Ijoia3NtdXJhc2tpIiwiYSI6ImNrMm1rM3J4MDBpcnczZHBoYnpoYTdub28ifQ.A3yO3Khkd8t_FdP2egKtDg"

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var map = L.map("map", {
    center: [38.2243, -97.5562],
    zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(map);


d3.json(url, function(data) {  

    L.geoJson(data, {

      pointToLayer: function(feature, latlng) {
        var style = {
          radius: feature.properties.mag*5,
          color: "gray",
          fillColor: magColour(Math.ceil(feature.properties.mag)),
          opacity: 0.8,
          fillOpacity: 0.8,
          weight: 1,
        }

        return L.circleMarker(latlng, style);

      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup("<h4>" + "Location:" + feature.properties.place + "Magnitude:" + feature.properties.mag + "</h4>");
      }

    }).addTo(map);

});




function magColour(value) {
    switch (value) {
    case 1:
      return "#9eff00";
    case 2:
      return "#ddff87";
    case 3:
      return "#ffd61f";
    case 4:
      return "#e8af02";
    case 5:
      return "#e88802";
    case 5:
      return "#e84302";
    default:
      return "#6308d1";
    }
  }


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + magColour(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);