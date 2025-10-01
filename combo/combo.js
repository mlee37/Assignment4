//basemaps
var map = L.map('combomap').setView([38, -95], 4);
var basemapUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var basemap =  L.tileLayer(basemapUrl, {attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

//earthquake data pull
var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-08-01&endtime=2025-08-05&minmagnitude=1.0";

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

//weather data pull
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true
};
var radar = L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(map);

//add weather alerts layer
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';
$.getJSON(weatherAlertsUrl, function(data) {
    //L.geoJSON(data).addTo(map);
    L.geoJSON(data, {
        style: function(feature){
            var alertColor = 'orange';
            if (feature.properties.severity === 'Severe') alertColor = 'red'; 
            if (feature.properties.severity === 'Minor')alertColor = 'yellow';
            if (feature.properties.severity === 'Extreme')alertColor = 'purple';
            return { color: alertColor };
          },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.headline);
                
            }
          
      }).addTo(map);
      });

