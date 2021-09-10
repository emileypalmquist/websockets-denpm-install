Rails.application.routes.draw do
  resources :direct_messages
  resources :users
  resources :messages

  post '/login', to: 'users#login'
  mount ActionCable.server => '/cable'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
