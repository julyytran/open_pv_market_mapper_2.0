# Open PV Market Mapper 2.0

The Open PV Market Mapper 2.0 visualizes data regarding solar panel installations in the United States, using the [National Renewable Energy Laboratory's (NREL) Open PV database](https://openpv.nrel.gov/about). The database contains information on installs dating from 1969 onwards, and is continually updated with user-inputted data from the public, government, and industry. The data in these visualizations are updated daily with any changes made to the NREL database.

You can currently view by state 1 of 3 summary data metrics calculated using all points in the database:
  - Average Cost ($/W): the average cost per watt for an installation
  - Total Capacity (MW): the collective amount of power, in megawatts, that can be produced by the systems
  - Total Installations: number of total solar installations
  - Total Installations Time Lapse: the number of installations as they happen each year

More visualizations over time and by county are coming soon!

To run locally:

```
git clone git@github.com:julyytran/open_pv_market_mapper_2.0.git
cd open_pv_market_mapper_2.0
bundle
rake db:create
rake db:migrate
rake db:seed
rails s
  ```

Versioning information coming soon.
