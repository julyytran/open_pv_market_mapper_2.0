require 'csv'

class NRELService
  include StatesHelper

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

      state = State.find_by(abbreviation: abbr)
      Geometry.create(state_id: state.id, shape: state_shapes["#{abbr}"],
      coordinates: state_coordinates["#{abbr}"] )
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

  def create_installs_csv
    state_abbreviations.each do |abbr|
      raw_data = @connection.get("/api/solar/open_pv/installs/index?api_key=#{ENV["NREL_API_KEY"]}&state=#{abbr}&nppage=300000&export=true").body.split(/\n/)
      raw_data.shift

      input_data = raw_data.map do |raw_datum|
        raw_datum.split
      end

      CSV.open("/lib/assets/installs_data.csv", "a") do |csv|
        input_data.each do |row|
          csv << row[0].split(",")
        end
      end
    end
  end

  private

  def parse(path)
    JSON.parse(@connection.get(path).body)
  end
end
