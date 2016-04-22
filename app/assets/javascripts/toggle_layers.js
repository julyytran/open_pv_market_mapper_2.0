function addLayer(layer, name, zIndex) {
  layer.addTo(map)
  layer.setZIndex(zIndex);

  var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.innerHTML = name;

  link.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (map.hasLayer(layer)) {
          map.removeLayer(layer);
          this.className = '';
      } else {
          map.addLayer(layer);
          this.className = 'active';
      }
  };

  layers.appendChild(link);
}
