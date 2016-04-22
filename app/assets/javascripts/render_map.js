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

  var map = L.mapbox.map('map').setView([38.97416, -95.23252], 4);

  var layers = document.getElementById('menu-ui');

  var statesInstalls = L.geoJson(statesData,  {
      style: getInstalls,
      onEachFeature: onEachFeature
  })

  var statesCapacities = L.geoJson(statesData,  {
      style: getCapacities,
      onEachFeature: onEachFeature
  })

  var statesCosts = L.geoJson(statesData,  {
      style: getCosts,
      onEachFeature: onEachFeature
  })

  addLayer(statesInstalls, 'Total Installs', 1, map, layers);
  addLayer(statesCapacities, 'Total Capacity', 2, map, layers);
  addLayer(statesCosts, 'Avg Cost $/W', 3, map, layers);

  function onEachFeature(feature, layer) {
      layer.on({
          mousemove: mousemove,
          mouseout: mouseout,
          click: zoomToFeature
      });
  }

  var popup = new L.Popup({ autoPan: false });

// ----------------mouseover.js-----------------
    var closeTooltip;

   function mousemove(e) {
       var layer = e.target;

       popup.setLatLng(e.latlng);
       popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
           layer.feature.properties.total_installs + ' total installs');

       if (!popup._map) popup.openOn(map);
       window.clearTimeout(closeTooltip);

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
       statesInstalls.resetStyle(e.target);
       closeTooltip = window.setTimeout(function() {
           map.closePopup();
       }, 100);
   }
// --------------------------------------------

// -----------------zoom.js--------------------
   function zoomToFeature(e) {
       map.fitBounds(e.target.getBounds());
   }
// ------------------------------------

   map.legendControl.addLegend(getLegendHTML());

}
