$(document).ready(function(){
  renderMap();
});

var variables = [
  'Average Cost ($/W)',
  'Total Capacity (MW)',
  'Total Installs',
  'Total Installs Time Lapse'
];

var statesCoordinates;
var previousLegend;

function renderMap() {

  var darkBase = L.mapbox.styleLayer('mapbox://styles/julyytran/cinji91jy001hadnjt6mazqnj');

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
        map.removeLayer(usLayer);
        renderTimeLapse(darkBase, torqueLayer, map);
        $('#torque-pause').addClass('playing');
      } else {
        $('#torque-slider').hide();
        $('#torque-pause').hide();

        torqueLayer.stop();
        map.removeLayer(darkBase);
        map.removeLayer(torqueLayer);

        map.addLayer(usLayer);
        setVariable($(this).val(), usLayer, map);
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
}
