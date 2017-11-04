class ApplicationController < ActionController::Base
  #protect_from_forgery with: :null_session

  before_action :authenticate_user_from_token!
  before_action :set_online

  private

  def set_online
    if !!current_user
      $redis_onlines.set( "user:#{current_user.id}", nil, ex: 10*60 )
    end
  end

  def authenticate_user_from_token!
    authenticate_with_http_token do |token, options|
      user_email = options[:email].presence
      user  = user_email && User.find_by_email(user_email)

      if user && Devise.secure_compare(user.authentication_token, token)
        sign_in user, store: false
      end
    end
  end
end
