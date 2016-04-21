var statesData = {};

$(document).ready(function(){
  getData();
});

var getData = function() {
  $.getJSON("http://localhost:3000/api/v1/states", function(data) {
    statesData = data;
  });
}

//   // mapbox.geoJson(data).addTo(map)
