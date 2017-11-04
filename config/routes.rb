Rails.application.routes.draw do
  mount_ember_app :frontend, to: "/"
  mount ActionCable.server => '/cable'
  defaults format: :json do
    devise_for :users, controllers: { sessions: 'sessions', registrations: 'registrations'}
    resources :users, only: :index do 
      delete :offline, on: :member
    end
    resources :games, only: [:create, :show]
  end
end
