$(document).ready(function(){
  renderMap();
});

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
    'Total Capacity (MW)',
    'Total Installs',
    'Total Installs Time Lapse'
  ];

   var timeLapse = L.mapbox.styleLayer('mapbox://styles/julyytran/cinji91jy001hadnjt6mazqnj')

   var style =
     'Map {' +
     '-torque-time-attribute: "date";' +
     '-torque-aggregation-function: "count(cartodb_id)";' +
     '-torque-frame-count: 760;' +
     '-torque-animation-duration: 17;' +
     '-torque-resolution: 1' +
     '}' +
     '#layer {' +
     '  marker-width: 2;' +
     '  marker-fill-opacity: 1;' +
     '  marker-fill: #0F3B82; ' +
     '  comp-op: "lighten";' +
     '  [value > 2] { marker-fill: #A0F4FF; }' +
     '  [value > 7] { marker-fill: #FFFFFF; }' +
     '  [frame-offset = 1] { marker-width: 10; marker-fill-opacity: 0.05;}' +
     '  [frame-offset = 2] { marker-width: 20; marker-fill-opacity: 0.02;}' +
     '}';

     var torqueLayer = new L.TorqueLayer({
       user: 'julyytran',
       table: 'installs_data',
       cartocss: style,
       blendmode: 'lighter',
       tiler_protocol: 'https',
       tiler_port: 443
     });

  var $select = $('<select></select>')
    .appendTo($('#variables'))
    .on('change', function() {
      if ($(this).val() == "Total Installs Time Lapse") {
        map.removeLayer(usLayer)
        renderTimeLapse();
      } else {
        // debugger
        map.removeLayer(timeLapse);
        map.removeLayer(torqueLayer);
        map.addLayer(usLayer)
        setVariable($(this).val());

        // var b = document.querySelector("#variables");
        // var property = b.getAttribute( "data-name" );
          //
          // if (typeof timeLapse !== 'undefined') {
          //   debugger
          //   map.removeLayer(timeLapse);
          //   map.addLayer(usLayer)
          //   setVariable($(this).val());
          // } else {
          //   map.addLayer(usLayer)
          //   setVariable($(this).val());
          // }
      }
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

    getLegend(name);

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

function getLegend(name) {
  if (name === "Total Installs") {
    $('#total_installs').show()
    $('#avg_cost').hide()
    $('#total_capacity').hide()
  } else if (name === "Average Cost ($/W)") {
    $('#total_installs').hide()
    $('#avg_cost').show()
    $('#total_capacity').hide()
  } else if (name === "Total Capacity (MW)") {
    $('#total_installs').hide()
    $('#avg_cost').hide()
    $('#total_capacity').show()
  } else {
    debugger
    $('#total_installs').hide()
    $('#avg_cost').hide()
    $('#total_capacity').hide()
  }
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

// --------time lapse--------------
  function renderTimeLapse() {
    var b = document.querySelector("#variables");
    b.setAttribute( "data-name", "time-lapse" );
    var name = b.getAttribute( "data-name" );

    getLegend(name);

    timeLapse.addTo(map)
    torqueLayer.addTo(map);
    torqueLayer.play();
  }
}
