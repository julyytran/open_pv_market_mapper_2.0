RSpec.describe "get states index" do
  it "returns a list of all states" do
    state1 = State.create(name: "Julyarado", abbreviation: "JT", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    Geometry.create(state_id: state1.id, shape: "Polygon", coordinates: "[[[10]]]" )
    state2 = State.create(name: "Julyifornia", abbreviation: "TJ", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    Geometry.create(state_id: state2.id, shape: "Polygon", coordinates: "[[[10]]]" )
    state3 = State.create(name: "Juyork", abbreviation: "YT", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    Geometry.create(state_id: state3.id, shape: "Polygon", coordinates: "[[[10]]]" )

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
            "Total Capacity"=>"200"
        },
          "geometry"=>{"type"=>"Polygon",
          "coordinates"=>[[[10]]]}}
      )
  end
end
