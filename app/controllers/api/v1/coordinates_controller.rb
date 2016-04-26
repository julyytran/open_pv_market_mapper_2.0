module Api
  module V1
    class CoordinatesController < ApiController
      respond_to :json

      def index
        response = MapboxService.new.get
        respond_with response
      end
    end
  end
end
