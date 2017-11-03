class GamesController < ApplicationController
  respond_to :json

  def create
    game = Game.new_game params[:user_id], params[:opponent_id]
    if game
      respond_with game
    else
      render json: { errors: game.errors }
    end
  end

  def show
    game = Game.find params[:id]
    byebug
    game.withdraw current_user.id if game.status == "in_process"
    respond_with game
  end
end
