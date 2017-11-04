class UsersController < ApplicationController

  respond_to :json

  before_action :clear_from_signed_in_touch, only: :offline

  def index
    users = User.where("id <> ?", current_user.id)
    respond_with users
  end

  def offline
    return head :ok
  end

  private

  def clear_from_signed_in_touch
    $redis_onlines.del( "user:#{params[:id]}" )
  end

end
