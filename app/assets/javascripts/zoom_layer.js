function createZoomLayer(){
  var zoomLayer = L.geoJson(statesCoordinates,  {
       style: getStyle,
   }).addTo(map);

   function getStyle(feature) {
       return {
           weight: 2,
           opacity: 0.1,
           color: 'black',
           fillOpacity: 0,
       };
   }

   zoomLayer.eachLayer(function(layer) {
     layer.on({
       click: zoomToFeature,
       dblclick: zoomToMap
     });
   });

  function zoomToMap(e) {
    map.setView([38.97416, -95.23252], 4)
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }
}
