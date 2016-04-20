class UpdatesController < ActionController::Base
  def index
    NRELService.new.update_state_data
    render text: "Database updated!"
  end
end
