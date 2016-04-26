describe MapboxService do

  before(:each) do
    @service = MapboxService.new
  end

  it 'returns coordinates of states' do
    VCR.use_cassette 'mapbox_service#get_coordinates' do
      response = @service.get

      expect(response["type"]).to eq "FeatureCollection"
    end
  end
end
