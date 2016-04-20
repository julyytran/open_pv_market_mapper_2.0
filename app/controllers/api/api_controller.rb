module Api
  class ApiController < ApplicationController
    protect_from_forgery with: :null_session

    skip_before_action :verify_authenticity_token, if: :like_js_request?

    protected

    def like_js_request?
      request.format.json? || request.format.js?
    end
  end
end
