$(document).ready(function(){
  renderMap();
});

$('#about').on('click', function(){
  $('#info').toggle()
})

$('#info').on('click', function(){
  $(this).toggle()
})

function renderMap(statesData){
  var statesCoordinates;

  $('#search').keypress(function(e){
    if (e.keyCode == 13) {
      e.preventDefault()
      var query = $('#search').val()

      var hiddenLayer = L.geoJson(statesCoordinates,  {
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
          $('#search').val('')
         }
       });

      map.removeLayer(hiddenLayer)
    }
  })

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
      .loadURL('/api/v1/coordinates')
      .addTo(map)
      .on('ready', loadData);

  function loadData() {
    $.getJSON('/api/v1/states')
      .done(function(data) {
        joinData(data, usLayer);
        statesCoordinates = data;
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

    if (name === "Total Installs") {
      $('#total_installs').show()
      $('#avg_cost').hide()
      $('#total_capacity').hide()
    } else if (name === "Average Cost ($/W)") {
      $('#total_installs').hide()
      $('#avg_cost').show()
      $('#total_capacity').hide()
    } else {
      $('#total_installs').hide()
      $('#avg_cost').hide()
      $('#total_capacity').show()
    }

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
  }

// ----------------mouseover-----------------
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

// -----------------zoom--------------------
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function zoomToMap(e) {
    map.setView([38.97416, -95.23252], 4)
  }
}
