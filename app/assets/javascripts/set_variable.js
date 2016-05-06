function setVariable(name, usLayer, map) {
  var b = document.querySelector("#variables");
  b.setAttribute( "data-name", name );

  changeLegend(map);

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

  var closeTooltip;

  function mousemove(e) {
    var popup = new L.Popup({ autoPan: false });
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

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function zoomToMap(e) {
    map.setView([38.97416, -95.23252], 4)
  }
}
