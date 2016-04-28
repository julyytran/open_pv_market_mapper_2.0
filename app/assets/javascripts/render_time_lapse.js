function renderTimeLapse() {
  var b = document.querySelector("#variables");
  b.setAttribute( "data-name", "time-lapse" );

  timeLapse.addTo(map)

  torqueLayer.addTo(map);
  torqueLayer.play();
}
