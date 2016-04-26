RSpec.describe "get coordinates index" do
  it "returns a list of state coordinates" do
    VCR.use_cassette 'mapbox_service#get_coordinates' do
    get "/api/v1/coordinates"

    expect(response.status).to eq 200

    json_body = JSON.parse(response.body)

    expect(json_body["type"]).to eq "FeatureCollection"
    end
  end
end
