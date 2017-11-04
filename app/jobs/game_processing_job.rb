class GameProcessingJob < ApplicationJob
  queue_as :default

  def perform(args)
    game = Game.find args[0]

    case args[1]
    when 'new_game'
      ActionCable.server.broadcast "player_#{game.opponent_id}", { action: args[1], game_id: game.id, name: game.user.name }
    when 'game_start'
      cross, nought = [game.user, game.opponent].shuffle
      ActionCable.server.broadcast "player_#{cross.id}", { action: "game_start", game_id: game.id, msg: "cross", name: nought.name }
      ActionCable.server.broadcast "player_#{nought.id}", { action: "game_start", game_id: game.id, msg: "nought", name: cross.name }
    when 'take_turn'
      if args[2]['id'] == game.user_id
        ActionCable.server.broadcast "player_#{game.opponent_id}", { action: args[1], data:args[2] }
      else
        ActionCable.server.broadcast "player_#{game.user_id}", { action: args[1], data:args[2] }
      end
    when 'withdraw_game'
      ActionCable.server.broadcast "player_#{game.opponent_id}", { action: args[1], data: args[2] }
      ActionCable.server.broadcast "player_#{game.user_id}", { action: args[1], data: args[2] }
    end
  end
end
