function joinData(data, usLayer, map) {
  var usGeoJSON = usLayer.getGeoJSON(),
      byState = {};

  for (var i = 0; i < usGeoJSON.features.length; i++) {
    byState[usGeoJSON.features[i].properties.name] =
      usGeoJSON.features[i];
  }

  for (i = 0; i < data.length; i++) {
    byState[data[i].properties.name] = data[i];
  }

  var newFeatures = [];
  for (i in byState) {
    newFeatures.push(byState[i]);
  }

  usLayer.setGeoJSON(newFeatures);
  setVariable(variables[0], usLayer, map);
}
