$(document).ready(function(){
  renderMap();
});

function renderMap(statesData){

  L.mapbox.accessToken = 'pk.eyJ1IjoianVseXl0cmFuIiwiYSI6ImNpbXMzbmtrYzAxYzh3Ymx1aGU5bWZuMzAifQ.DjfzN_9iu_oXX2TnI_-r4g';

  var map = L.mapbox.map('map', null, { zoomControl: false }).setView([38.97416, -95.23252], 4);

  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);

  var variables = [
    'Average Cost ($/W)',
    'Total Installs',
    'Total Capacity (MW)'];

  var $select = $('<select></select>')
    .appendTo($('#variables'))
    .on('change', function() {
      setVariable($(this).val());
    });

  for (var i = 0; i < variables.length; i++)
    $('<option></option>')
      .text(variables[i])
      .attr('value', variables[i])
      .appendTo($select);

  var usLayer = L.mapbox.featureLayer()
      .loadURL('http://localhost:3000/api/v1/coordinates')
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
    }

    var newFeatures = [];
    for (i in byState) {
      newFeatures.push(byState[i]);
    }

    usLayer.setGeoJSON(newFeatures);
    setVariable(variables[0]);
  }

  function setVariable(name) {
    var b = document.querySelector("#variables");
    b.setAttribute( "data-name", name );

    usLayer.eachLayer(function(layer) {
      color = getColor(layer.feature.properties[name], name)

      layer.setStyle({
        fillColor: color,
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

    map.legendControl.addLegend(getLegendHTML());

  }

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

    color = getColor(layer.feature.properties[property], property)

    layer.setStyle({
      fillColor: color,
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
