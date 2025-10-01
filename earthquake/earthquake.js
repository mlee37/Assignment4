var map = L.map('earthquakemap').setView([38, -95], 4);
var basemapUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var basemap =  L.tileLayer(basemapUrl, {attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-08-01&endtime=2025-08-05&minmagnitude=1.0";
//map and markers
$.getJSON(url, function(data) {
    
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng){
            var mag = feature.properties.mag
            var color = mag >= 5 ? 'red': mag >= 3 ? 'orange': mag >= 1 ? 'yellow': 'white';
        
    return L.circleMarker(latlng, {
          radius: 2,
          color: color,
          fillOpacity: 0.6
            });
        },

          onEachFeature: function(feature, layer) {
        var props = feature.properties;
        var popupContent = `
          <strong>${props.place}</strong><br>
          Magnitude: ${props.mag}<br>
         Time: ${props.starttime}
        `;
        layer.bindPopup(popupContent);
      }
    }).addTo(map);

  });


// legend
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [1, 3, 5];
  var colors = ['yellow', 'orange', 'red'];

  div.innerHTML = '<strong>Earthquake Magnitude</strong><br>';
for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '; width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(map);