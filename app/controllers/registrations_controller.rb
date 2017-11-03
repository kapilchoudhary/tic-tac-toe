class RegistrationsController < Devise::RegistrationsController

skip_before_action :authenticate_user_from_token!


def create
  user = User.create(user_params)
  render json: user, status: 201
end

  private
  
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

end
