function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function zoomToMap(e) {
  map.setView([38.97416, -95.23252], 4)
}
