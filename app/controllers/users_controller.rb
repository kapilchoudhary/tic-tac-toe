class UsersController < ApplicationController

  respond_to :json

  def index
    users = User.where("id <> ?", current_user.id)
    respond_with users
  end

end
