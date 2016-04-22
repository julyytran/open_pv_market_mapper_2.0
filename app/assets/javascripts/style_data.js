function getInstalls(feature) {
  return {
    weight: 2,
    opacity: 0.1,
    color: 'black',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.total_installs)
  };
}

function getCapacities(feature) {
  return {
    weight: 2,
    opacity: 0.1,
    color: 'black',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.total_capacity)
  };
}

function getCosts(feature) {
  return {
    weight: 2,
    opacity: 0.1,
    color: 'black',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.avg_cost_pw)
  };
}

function getColor(p) {
    return p > 10000 ? '#005824' :
        p > 5000  ? '#238b45' :
        p > 2000  ? '#41ae76' :
        p > 1000  ? '#66c2a4' :
        p > 500   ? '#99d8c9' :
        p > 200   ? '#ccece6' :
        p > 100   ? '#e5f5f9' :
        '#f7fcfd';
}
