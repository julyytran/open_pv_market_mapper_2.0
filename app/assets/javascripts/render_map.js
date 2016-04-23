$(document).ready(function(){
  renderMap();
});

function renderMap(statesData){

  L.mapbox.accessToken = 'pk.eyJ1IjoianVseXl0cmFuIiwiYSI6ImNpbXMzbmtrYzAxYzh3Ymx1aGU5bWZuMzAifQ.DjfzN_9iu_oXX2TnI_-r4g';

  var map = L.mapbox.map('map').setView([38.97416, -95.23252], 4);

  var hues = [
    '#eff3ff',
    '#bdd7e7',
    '#6baed6',
    '#3182bd',
    '#08519c'];

  var variables = [
    'avg_cost_pw',
    'total_installs',
    'total_capacity'];

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
      usLayer.eachLayer(function(layer) {
          // Decide the color for each state by finding its
          // place between min & max, and choosing a particular
          // color as index.
          var division = Math.floor(
              (hues.length - 1) *
              ((layer.feature.properties[name] - scale.min) /
              (scale.max - scale.min)));
          layer.setStyle({
              fillColor: hues[division],
              fillOpacity: 0.8,
              weight: 0.5
          });
      });
  }}


// //   function onEachFeature(feature, layer) {
// //       layer.on({
// //           mousemove: mousemove,
// //           mouseout: mouseout,
// //           click: zoomToFeature
// //       });
// //   }
// //
// //   map.legendControl.addLegend(getLegendHTML());
// //
// //   var popup = new L.Popup({ autoPan: false });
// //
// // // ----------------mouseover.js-----------------
// //     var closeTooltip;
// //
// //    function mousemove(e) {
// //        var layer = e.target;
// //
// //        popup.setLatLng(e.latlng);
// //        popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
// //            parseInt(layer.feature.properties.total_installs).toLocaleString() + ' total installs');
// //
// //        if (!popup._map) popup.openOn(map);
// //        window.clearTimeout(closeTooltip);
// //
// //        layer.setStyle({
// //            weight: 3,
// //            opacity: 0.3,
// //            fillOpacity: 0.9
// //        });
// //
// //        if (!L.Browser.ie && !L.Browser.opera) {
// //            layer.bringToFront();
// //        }
// //    }
// //
// //    function mouseout(e) {
// //        statesInstalls.resetStyle(e.target);
// //        closeTooltip = window.setTimeout(function() {
// //            map.closePopup();
// //        }, 100);
// //    }
// // // --------------------------------------------
// //
// // // -----------------zoom.js--------------------
// //    function zoomToFeature(e) {
// //        map.fitBounds(e.target.getBounds());
// //    }
// // // ------------------------------------
// //
// //
// }
