RSpec.describe "get states index" do
  it "returns a list of all states" do
    State.create(abbreviation: "JT", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    State.create(abbreviation: "TJ", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    State.create(abbreviation: "YT", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")

    get "/api/v1/states"

    expect(response.status).to eq 200

    json_body = JSON.parse(response.body)

    expect(json_body.count).to eq(3)

    state = json_body[0]

    expect(state).to eq ({
      "id" => 2,
      "abbreviation" => "JT",
      "avg_cost_pw" => "100",
      "total_capacity" => "200",
      "total_installs" => "300"
      })
  end
end
