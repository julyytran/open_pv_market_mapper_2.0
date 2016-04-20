module Api
  module V1
    class StatesController < ApiController
      respond_to :json

      def index
        @states_geojson = State.all.map do |state|
          state.build_geojson
        end

        respond_with @states_geojson
      end
    end
  end
end
