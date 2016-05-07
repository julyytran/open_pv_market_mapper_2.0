function changeLegend(map) {
  if (previousLegend) map.legendControl.removeLegend(previousLegend);
  var newLegend = getLegendHTML();
  map.legendControl.addLegend(newLegend);
  previousLegend = newLegend;
}

function getLegendHTML() {
  var b = document.querySelector("#variables");
  var property = b.getAttribute( "data-name" );

  if (property == "Average Cost ($/W)") {
    var grades = [0, 6.00, 7.00, 8.00, 9.00, 10.00],
    labels = [],
    from, to;
} else if (property == "Total Installs") {
    var grades = [0, 100, 500, 1000, 3000, 10000],
    labels = [],
    from, to;
} else {
    var grades = [0, 1, 5, 25, 100, 300],
    labels = [],
    from, to;
}

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<li><span class="swatch" style="background:' + getColor(from + 1, property) + '"></span> ' +
      from.toLocaleString() + (to ? ' &ndash; ' + to.toLocaleString() : '+')) + '</li>';
  }

  return '<span><b>' + property + '</b></span><ul>' + labels.join('') + '</ul>';
}

function getColor(p, property) {
  if (property == "Total Installs") {
     return p > 10000 ? '#006d2c' :
         p > 3000  ? '#31a354' :
         p > 1000  ? '#74c476' :
         p > 500  ? '#a1d99b' :
         p > 100   ? '#c7e9c0' :
         '#edf8e9';
  } else if (property == "Average Cost ($/W)") {
    return p > 10 ? '#006d2c' :
        p > 9  ? '#31a354' :
        p > 8  ? '#74c476' :
        p > 7  ? '#a1d99b' :
        p > 6   ? '#c7e9c0' :
        '#edf8e9';
  } else {
    return p > 300 ? '#006d2c' :
        p > 100  ? '#31a354' :
        p > 25  ? '#74c476' :
        p > 5  ? '#a1d99b' :
        p > 1   ? '#c7e9c0' :
        '#edf8e9';
  }
}
