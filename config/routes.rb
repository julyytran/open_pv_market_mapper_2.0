Rails.application.routes.draw do
  root 'maps#index'

  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      resources :states, only: [:index]
    end
  end

  resources :updates, only: [:index]
end
