class GameProcessingJob < ApplicationJob
  queue_as :default

  def perform(args)
    game = Game.find args[0]

    case args[1]
    when 'new_game'
      ActionCable.server.broadcast "player_#{game.opponent_id}", { action: args[1], game_id: game.id, name: game.user.name }
    when 'game_start'
      cross, nought = [game.user_id, game.opponent_id].shuffle
      ActionCable.server.broadcast "player_#{cross}", { action: "game_start", game_id: game.id, msg: "cross" }
      ActionCable.server.broadcast "player_#{nought}", { action: "game_start", game_id: game.id, msg: "nought" }
    when 'take_turn'
      if args[2]['id'] == game.user_id
      ActionCable.server.broadcast "player_#{game.opponent_id}", { action: args[1], data:args[2] }
    else
      ActionCable.server.broadcast "player_#{game.user_id}", { action: args[1], data:args[2] }
    end
    when 'finish_game'
      ActionCable.server.broadcast "player_#{game.opponent_id}", { action: args[1] }
    when 'withdraw_game'
    end
  end
end
