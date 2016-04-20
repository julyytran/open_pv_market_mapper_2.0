$(document).ready(function(){
  debugger
  console.log(statesData);

});

var statesData = function(){
  $.getJSON( "https:http://localhost:3000/api/v1/states");
};

// function renderStates(data) {
//   debugger
//   console.log(data);
//   // mapbox.geoJson(data).addTo(map)
// }
