RSpec.describe "get states index" do
  it "returns a list of all states" do
    state1 = State.create(name: "Julyarado", abbreviation: "JT", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    state2 = State.create(name: "Julyifornia", abbreviation: "TJ", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    state3 = State.create(name: "Juyork", abbreviation: "YT", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")

    get "/api/v1/states"

    expect(response.status).to eq 200

    json_body = JSON.parse(response.body)

    expect(json_body.count).to eq(3)

    state = json_body[0]

    expect(state).to eq (
      {"type"=>"Feature",
        "id"=>"#{state["id"]}",
        "properties"=>{
            "name"=>"Julyarado",
            "Average Cost ($/W)"=>"100",
            "Total Installs"=>"300",
            "Total Capacity (MW)"=>"200"
        }
      )
  end
end
