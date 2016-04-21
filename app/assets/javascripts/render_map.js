$(document).ready(function(){
  getData();
});

var getData = function() {
  $.getJSON("http://localhost:3000/api/v1/states", function(statesData) {
    renderMap(statesData)
  });
}

function renderMap(statesData){
  L.mapbox.accessToken = 'pk.eyJ1IjoianVseXl0cmFuIiwiYSI6ImNpbXMzbmtrYzAxYzh3Ymx1aGU5bWZuMzAifQ.DjfzN_9iu_oXX2TnI_-r4g';

    var map = L.mapbox.map('map', 'mapbox.streets')
      .setView([37.8, -96], 4);

    var popup = new L.Popup({ autoPan: false });

    var statesLayer = L.geoJson(statesData,  {
        style: getStyle,
        onEachFeature: onEachFeature
    }).addTo(map);

    function getStyle(feature) {
        return {
            weight: 2,
            opacity: 0.1,
            color: 'black',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.total_installs)
        };
    }

    // get color depending on total_installs value
    function getColor(p) {
        return p > 10000 ? '#005824' :
            p > 5000  ? '#238b45' :
            p > 2000  ? '#41ae76' :
            p > 1000  ? '#66c2a4' :
            p > 500   ? '#99d8c9' :
            p > 200   ? '#ccece6' :
            p > 100   ? '#e5f5f9' :
            '#f7fcfd';
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mousemove: mousemove,
            mouseout: mouseout,
            click: zoomToFeature
        });
    }

    var closeTooltip;

   function mousemove(e) {
       var layer = e.target;

       popup.setLatLng(e.latlng);
       popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
           layer.feature.properties.total_installs + ' total installs');

       if (!popup._map) popup.openOn(map);
       window.clearTimeout(closeTooltip);

       // highlight feature
       layer.setStyle({
           weight: 3,
           opacity: 0.3,
           fillOpacity: 0.9
       });

       if (!L.Browser.ie && !L.Browser.opera) {
           layer.bringToFront();
       }
   }

   function mouseout(e) {
       statesLayer.resetStyle(e.target);
       closeTooltip = window.setTimeout(function() {
           map.closePopup();
       }, 100);
   }

   function zoomToFeature(e) {
       map.fitBounds(e.target.getBounds());
   }

   map.legendControl.addLegend(getLegendHTML());

   function getLegendHTML() {
     var grades = [0, 100, 200, 500, 1000, 2000, 5000, 10000],
     labels = [],
     from, to;

     for (var i = 0; i < grades.length; i++) {
       from = grades[i];
       to = grades[i + 1];

       labels.push(
         '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
         from + (to ? '&ndash;' + to : '+')) + '</li>';
     }

     return '<span>Total Installs</span><ul>' + labels.join('') + '</ul>';
 }
}
