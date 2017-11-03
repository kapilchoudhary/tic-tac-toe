class GameChannel < ApplicationCable::Channel
  def subscribed
     stream_from "player_#{params[:id]}"
  end

  def unsubscribed
  end
  
  def start_game data
  	game(data["game_id"]).start
  end

  def take_turn data
    #byebug
  	game(data["game_id"]).take_turn(data["item"])
  end

  def finish_game data
  	game(data["game_id"]).finish(data["winner_id"])
  end

  def withdraw_game data
    game(data["game_id"]).withdraw(data["user_id"])
  end

  private

  def game id
  	Game.find_by_id id
  end
end