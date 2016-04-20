module Api
  module V1
    class StatesController < ApiController
      respond_to :json

      def index
        respond_with State.all
      end
    end
  end
end
