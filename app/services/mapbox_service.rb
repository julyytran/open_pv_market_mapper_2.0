class MapboxService
  attr_reader :connection

  def initialize
    @connection = Faraday.new("https://www.mapbox.com/mapbox.js/assets/data/us.geojson")
  end

  def get
    JSON.parse(@connection.get.body)
  end
end
