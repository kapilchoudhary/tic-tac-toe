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
		respond_with game
	end
end
