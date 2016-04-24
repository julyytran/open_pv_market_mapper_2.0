function getLegendHTML() {
  var b = document.querySelector("#variables");
  var property = b.getAttribute( "data-name" );

  if (property == "Total Installs") {
  var grades = [100, 500, 1000, 3000, 10000],
  labels = [],
  from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
      from.toLocaleString() + (to ? ' &ndash; ' + to.toLocaleString() : '+')) + '</li>';
  }

  return '<span><b>' + property + '</b></span><ul>' + labels.join('') + '</ul>';
}

function getColor(d) {
     return d > 10000 ? '#006d2c' :
         d > 3000  ? '#31a354' :
         d > 1000  ? '#74c476' :
         d > 500  ? '#bae4b3' :
         d > 100   ? '#edf8e9' :
         '#ffffe5';
 }
}
