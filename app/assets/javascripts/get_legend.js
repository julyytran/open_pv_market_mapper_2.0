function getLegend(name) {
  if (name === "Total Installs") {
    $('#total_installs').show()
    $('#avg_cost').hide()
    $('#total_capacity').hide()
  } else if (name === "Average Cost ($/W)") {
    $('#total_installs').hide()
    $('#avg_cost').show()
    $('#total_capacity').hide()
  } else if (name === "Total Capacity (MW)") {
    $('#total_installs').hide()
    $('#avg_cost').hide()
    $('#total_capacity').show()
  } else {
    $('#total_installs').hide()
    $('#avg_cost').hide()
    $('#total_capacity').hide()
  }
}
