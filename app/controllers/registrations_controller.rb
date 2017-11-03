class RegistrationsController < Devise::RegistrationsController

skip_before_action :authenticate_user_from_token!


def create
  user = User.create(user_params)
  return head :ok
end

  private
  
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

end
