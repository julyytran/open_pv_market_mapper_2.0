class NRELService
  attr_reader :connection

  def initialize
    @connection = Faraday.new("https://developer.nrel.gov")
  end

  def get_state_data
    states.map do |state|
      result = parse("/api/solar/open_pv/installs/summaries?api_key=#{ENV["NREL_API_KEY"]}&state=#{state}")
      avg_cost_pw = result["result"]["avg_cost_pw"]
      total_capacity = result["result"]["total_capacity"]
      total_installs = result["result"]["total_installs"]
      State.create(abbreviation: state, avg_cost_pw: avg_cost_pw,
      total_capacity: total_capacity, total_installs: total_installs)
    end
  end

  private

  def parse(path)
    JSON.parse(@connection.get(path).body)
  end

  def states
    ["AK", "AL", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
      "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
      "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
      "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
      "WI", "WY"]
  end
end
