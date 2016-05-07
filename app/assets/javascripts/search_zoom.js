$('#search').keypress(function(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    var input = $('#search').val();
    var query = input[0].toUpperCase() + input.slice(1);

    var hiddenLayer = L.geoJson(usCoordinates, {
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

    hiddenLayer.eachLayer(function(layer) {
      if (layer.feature.properties.name == query) {
        map.fitBounds(layer.getBounds());
        $('#search').val('');
      };
    });

    map.removeLayer(hiddenLayer);
  };
});
