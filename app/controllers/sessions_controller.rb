class SessionsController < Devise::SessionsController

  def create
    super do |user|
      if request.format.json?
        data = {
          name: user.name,
          id: user.id,
          token: user.authentication_token,
          email: user.email
        }
        render json: data, status: 201 and return
      end
    end
  end

end