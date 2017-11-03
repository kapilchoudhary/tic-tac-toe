Rails.application.routes.draw do
  mount_ember_app :frontend, to: "/"
  mount ActionCable.server => '/cable'

  devise_for :users, controllers: { sessions: 'sessions', registrations: 'registrations'}, defaults: { format: :json }
  resources :users
  resources :games
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
