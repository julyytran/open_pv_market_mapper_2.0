function renderTimeLapse(darkBase, torqueLayer, map) {
  var b = document.querySelector("#variables");
  b.setAttribute( "data-name", "time-lapse" );
  var name = b.getAttribute( "data-name" );

  if (previousLegend) map.legendControl.removeLegend(previousLegend)

  darkBase.addTo(map)
  torqueLayer.addTo(map);

  createSlider(torqueLayer);
  torqueLayer.play();

  createZoomLayer()
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
