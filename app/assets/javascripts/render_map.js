$(document).ready(function(){
  renderMap();
});

var variables = [
  'Average Cost ($/W)',
  'Total Capacity (MW)',
  'Total Installs',
  'Total Installs Time Lapse'
];

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

  var map = L.mapbox.map('map').setView([38.97416, -95.23252], 4);

   var darkBase = L.mapbox.styleLayer('mapbox://styles/julyytran/cinji91jy001hadnjt6mazqnj')

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
        $('#torque-pause').addClass('playing');
      } else {
        $('#torque-slider').hide()
        $('#torque-pause').hide()

        torqueLayer.stop();
        map.removeLayer(darkBase);
        map.removeLayer(torqueLayer);

        map.addLayer(usLayer)
        setVariable($(this).val(), usLayer);
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
        joinData(data, usLayer, map);
        statesCoordinates = data;
      });
  }

// -----------------zoom--------------------


// --------time lapse--------------
  function renderTimeLapse() {
    var b = document.querySelector("#variables");
    b.setAttribute( "data-name", "time-lapse" );
    var name = b.getAttribute( "data-name" );

    getLegend(name);

    darkBase.addTo(map)
    torqueLayer.addTo(map);
    createSlider(torqueLayer);
    torqueLayer.play();
  }

  function createSlider(torqueLayer) {
    var torqueTime = $('#torque-time');
    $("#torque-slider").slider({
         min: 0,
         max: torqueLayer.options.steps,
         value: 0,
         step: 1,
         slide: function(event, ui){
           var step = ui.value;
           torqueLayer.setStep(step);
         }
     });

     torqueLayer.on('change:time', function(changes) {
       $("#torque-slider" ).slider({ value: changes.step });
       var month_year = changes.time.toString().substr(4).split(' ');
       torqueTime.text(month_year[2]);
     });

     $("#torque-pause").on("click", function() {
       torqueLayer.toggle();
       $(this).toggleClass('playing');
     });

     $('#torque-slider').show()
     $('#torque-pause').show()
   };

}
