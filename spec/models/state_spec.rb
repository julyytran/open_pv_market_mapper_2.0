require 'rails_helper'

RSpec.describe State, type: :model do
  it { should have_one(:geometry) }
  it { should validate_presence_of :name }
  it { should validate_uniqueness_of :name }
  it { should validate_presence_of :abbreviation }
  it { should validate_uniqueness_of :abbreviation }
  it { should validate_presence_of :avg_cost_pw }
  it { should validate_presence_of :total_capacity }
  it { should validate_presence_of :total_installs }

  it "builds geojson" do
    state1 = State.create(name: "Julyarado", abbreviation: "JT", avg_cost_pw: "100", total_capacity: "200", total_installs: "300")
    Geometry.create(state_id: state1.id, shape: "Polygon", coordinates: "[[[10]]]" )

    expect(state1.build_geojson).to eq(
     {"type"=>"Feature", "id"=>"#{state1.id}", "properties"=>{"name"=>"Julyarado", "Average Cost ($/W)"=>"100", "Total Installs"=>"300", "Total Capacity"=>"200"}, "geometry"=>{"type"=>"Polygon", "coordinates"=>[[[10]]]}}
    )
  end
end
