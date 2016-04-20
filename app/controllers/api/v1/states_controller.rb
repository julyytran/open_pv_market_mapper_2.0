module Api
  module V1
    class StatesController < ApiController
      respond_to :json

      def index
        render json: State.all, callback: "renderStates"
      end
    end
  end
end
