# Open PV Market Mapper 2.0

![solar installs time lapse](https://cloud.githubusercontent.com/assets/14022835/15048083/1ddef1ae-12a5-11e6-9ba5-a46944e60ea3.gif)

The Open PV Market Mapper 2.0 visualizes data regarding solar panel installations in the United States, using the [National Renewable Energy Laboratory's (NREL) Open PV database](https://openpv.nrel.gov/about). The database contains information on installs dating from 1969 onwards, and is continually updated with user-inputted data from the public, government, and industry. The data in these visualizations are updated daily with any changes made to the NREL database.

You can currently view by state 1 of 3 summary data metrics calculated using all points in the database:
  - Average Cost ($/W): the average cost per watt for an installation
  - Total Capacity (MW): the collective amount of power, in megawatts, that can be produced by the systems
  - Total Installs: number of total solar installations
  - Total Installs Time Lapse: the number of installations as they happen each year

More visualizations over time and by county are coming soon!

# Development
This app uses Ruby on Rails as a web app framework, the JavaScript libraries [Mapbox](https://www.mapbox.com/), [Leaflet](http://leafletjs.com/), and [CartoDB](https://cartodb.com/) to create the maps, and [jQuery](https://jquery.com/) and [Bootstrap](http://getbootstrap.com/) for styling. Data are collected from the [NREL Open PV API](https://developer.nrel.gov/docs/solar/openpv/) and are joined with coordinate data to be served as an internal API of [GeoJSON](http://geojson.org/).

### To run locally:

```
git clone git@github.com:julyytran/open_pv_market_mapper_2.0.git
cd open_pv_market_mapper_2.0
bundle
rake db:create
rake db:migrate
rake db:seed
rails s
  ```
### Visit in Production
[Open PV Market Mapper 2.0](http://open-pv-market-mapper-2.herokuapp.com/)
