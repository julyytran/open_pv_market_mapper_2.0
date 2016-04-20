class NRELService
  attr_reader :connection

  def initialize
    @connection = Faraday.new("https://developer.nrel.gov")
  end

  def get_state_data
    state_abbreviations.map do |abbr|
      response = parse("/api/solar/open_pv/installs/summaries?api_key=#{ENV["NREL_API_KEY"]}&state=#{abbr}")

      avg_cost_pw = response["result"]["avg_cost_pw"]
      total_capacity = response["result"]["total_capacity"]
      total_installs = response["result"]["total_installs"]

      State.create(name: state_names["#{abbr}"], abbreviation: abbr, avg_cost_pw: avg_cost_pw,
      total_capacity: total_capacity, total_installs: total_installs)
    end
  end

  def update_state_data
    state_abbreviations.map do |abbr|
      response = parse("/api/solar/open_pv/installs/summaries?api_key=#{ENV["NREL_API_KEY"]}&state=#{abbr}")

      avg_cost_pw = response["result"]["avg_cost_pw"]
      total_capacity = response["result"]["total_capacity"]
      total_installs = response["result"]["total_installs"]

      state = State.find_by(abbreviation: abbr)
      state.update(avg_cost_pw: avg_cost_pw, total_capacity: total_capacity, total_installs: total_installs)
    end
  end

  private

  def parse(path)
    JSON.parse(@connection.get(path).body)
  end

  def state_abbreviations
    state_names.keys
  end

  def state_names
    {"AK" => "Alaska", "AL" => "Alabama", "AZ" => "Arizona", "AR" => "Arkansas",
      "CA" => "California", "CO" => "Colorado", "CT" => "Connecticut", "DE" => "Delaware",
      "FL" => "Florida", "GA" => "Georgia", "HI" => "Hawaii", "ID" => "Idaho",
      "IL" => "Illinois", "IN" => "Indiana", "IA" => "Iowa", "KS" => "Kansas",
      "KY" => "Kentucky", "LA" => "Louisiana", "ME" => "Maine", "MD" => "Maryland",
      "MA" => "Massachusetts", "MI" => "Michigan", "MN" => "Minnesota", "MS" => "Mississippi",
      "MO" => "Missouri", "MT" => "Montana", "NE" => "Nebraska", "NV" => "Nevada",
      "NH" => "New Hampshire", "NJ" => "New Jersey", "NM" => "New Mexico",
      "NY" => "New York", "NC" => "North Carolina", "ND" => "North Dakota", "OH" => "Ohio",
      "OK" => "Oklahoma", "OR" => "Oregon", "PA" => "Pennsylvania", "RI" => "Rhode Island",
      "SC" => "South Carolina", "SD" => "South Dakota", "TN" => "Tennessee", "TX" => "Texas",
      "UT" => "Utah", "VT" => "Vermont", "VA" => "Virginia", "WA" => "Washington",
      "WV" => "West Virginia", "WI" => "Wisconsin", "WY" => "Wyoming"}
  end
end
