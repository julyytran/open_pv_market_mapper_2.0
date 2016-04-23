$(document).ready(function(){
  renderMap();
});

function renderMap(statesData){

  L.mapbox.accessToken = 'pk.eyJ1IjoianVseXl0cmFuIiwiYSI6ImNpbXMzbmtrYzAxYzh3Ymx1aGU5bWZuMzAifQ.DjfzN_9iu_oXX2TnI_-r4g';

  var map = L.mapbox.map('map').setView([38.97416, -95.23252], 4);

  var hues = [
    '#f7fcf5',
    '#e5f5e0',
    '#c7e9c0',
    '#a1d99b',
    '#74c476',
    '#41ab5d',
    '#238b45',
    '#005a32'];

  var variables = [
    'Average Cost ($/W)',
    'Total Installs',
    'Total Capacity'];

  var ranges = {};

  var $select = $('<select></select>')
    .appendTo($('#variables'))
    .on('change', function() {
      setVariable($(this).val());
    });

  for (var i = 0; i < variables.length; i++) {
    ranges[variables[i]] = { min: Infinity, max: -Infinity };
    $('<option></option>')
      .text(variables[i])
      .attr('value', variables[i])
      .appendTo($select);
  }

  var usLayer = L.mapbox.featureLayer()
      .loadURL('https://www.mapbox.com/mapbox.js/assets/data/us.geojson')
      .addTo(map)
      .on('ready', loadData);

  function loadData() {
    $.getJSON('http://localhost:3000/api/v1/states')
      .done(function(data) {
        joinData(data, usLayer);
      });
  }

  function joinData(data, layer) {
    var usGeoJSON = usLayer.getGeoJSON(),
        byState = {};

    for (var i = 0; i < usGeoJSON.features.length; i++) {
      byState[usGeoJSON.features[i].properties.name] =
        usGeoJSON.features[i];
    }

    for (i = 0; i < data.length; i++) {
      byState[data[i].properties.name] = data[i];
      for (var j = 0; j < variables.length; j++) {
        var n = variables[j];
        ranges[n].min = Math.min(parseFloat(data[i].properties[n]), ranges[n].min);
        ranges[n].max = Math.max(parseFloat(data[i].properties[n]), ranges[n].max);
      }
    }

    var newFeatures = [];
    for (i in byState) {
      newFeatures.push(byState[i]);
    }

    usLayer.setGeoJSON(newFeatures);
    setVariable(variables[0]);
  }

  function setVariable(name) {
    var scale = ranges[name];
    var b = document.querySelector("#variables");
    b.setAttribute( "data-name", name );

    usLayer.eachLayer(function(layer) {
        // var division = Math.floor(
        //     (layer.feature.properties[name]) /
        //     (scale.max) * (hues.length - 1));
        //     console.log(division)
      var division = Math.floor(
        (hues.length - 1) *
        ((layer.feature.properties[name] - scale.min) /
        (scale.max - scale.min)));

      layer.setStyle({
        fillColor: hues[division],
        fillOpacity: 0.8,
        weight: 0.5,
        opacity: 0.5,
      });

      layer.on({
        mousemove: mousemove,
        mouseout: mouseout,
        click: zoomToFeature,
        dblclick: zoomToMap
      });
    });
  }

  // map.legendControl.addLegend(getLegendHTML());

// ----------------mouseover.js-----------------
  var popup = new L.Popup({ autoPan: false });
  var closeTooltip;

  function mousemove(e) {
    var layer = e.target;
    var b = document.querySelector("#variables");
    var property = b.getAttribute( "data-name" );

    if (property == "Average Cost ($/W)") {
      var data = "$" + parseFloat(layer.feature.properties[property]).toFixed(2) + " per watt"
  } else if (property == "Total Installs") {
      var data = parseInt(layer.feature.properties[property]).toLocaleString() + " installations"
  } else {
      var data = parseFloat(layer.feature.properties[property]).toLocaleString() + " MW"
  }

    popup.setLatLng(e.latlng);
    popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' + data);

    if (!popup._map) popup.openOn(map);
      window.clearTimeout(closeTooltip);

    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      fillOpacity: 0.9
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }

  function mouseout(e) {
    var layer = e.target;

    var b = document.querySelector("#variables");
    var property = b.getAttribute( "data-name" );
    var scale = ranges[property];

    var division = Math.floor(
      (hues.length - 1) *
      ((layer.feature.properties[property] - scale.min) /
      (scale.max - scale.min)));

    layer.setStyle({
      fillColor: hues[division],
      fillOpacity: 0.8,
      weight: 0.5,
      opacity: 0.5,
    });

    closeTooltip = window.setTimeout(function() {
      map.closePopup();
    }, 100);
  }

// -----------------zoom.js--------------------
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function zoomToMap(e) {
    map.setView([38.97416, -95.23252], 4)
  }
}
