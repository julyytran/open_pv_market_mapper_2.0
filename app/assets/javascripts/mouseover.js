var closeTooltip;

// var popup = new L.Popup({ autoPan: false });

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

function mouseout(e, statesInstalls) {
   statesInstalls.resetStyle(e.target);
   closeTooltip = window.setTimeout(function() {
       map.closePopup();
   }, 100);
}
