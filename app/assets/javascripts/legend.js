function getLegendHTML() {
  var grades = [0, 100, 200, 500, 1000, 2000, 5000, 10000],
  labels = [],
  from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
      from + (to ? '&ndash;' + to : '+')) + '</li>';
  }

  return '<span>Total Installs</span><ul>' + labels.join('') + '</ul>';
}
