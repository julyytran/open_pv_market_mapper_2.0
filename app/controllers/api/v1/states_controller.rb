module Api
  module V1
    class StatesController < ApiController
      def index
        @states = State.all
        @state_geojson = @states.map do |state|
          state.build_geojson
        end

        respond_to do |format|
          format.html
          format.json { render json: @state_geojson }
          # , callback: "renderStates"
        end

      end
    end
  end
end

# class GeoJsonBuilder
# def build_geojson(state)
#   {"type" => "Feature",
#     "id" => "#{state.id}",
#     "properties" =>
#     {
#       "name" => "#{state.name}",
#       "avg_cost_pw" => "#{state.avg_cost_pw}",
#       "total_installs" => "#{state.total_installs}",
#       "total_capacity" => "#{state.total_capacity}"
#     },
#     "geometry" => {"type" => "#{state.geometry.type}",
#     "coordinates" => JSON.parse(state.geometry.coordinates)}}.to_json
#   end
# end
