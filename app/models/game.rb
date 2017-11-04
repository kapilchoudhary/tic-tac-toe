class Game < ApplicationRecord
	belongs_to :user
  belongs_to :opponent, foreign_key: 'opponent_id', class_name: User.name
  belongs_to :winner, foreign_key: 'winner_id', optional: true, class_name: User.name

  enum status: [ :waiting, :in_process, :finished, :withdrawn ]

  scope :winning_respect_to_specific_player, -> (id) { where("opponent_id = ? OR user_id = ?", id, id) }
  scope :draw, -> { where("winner_id is null AND status = ?", Game::statuses["finished"]) }
  scope :with_user, -> (id) { where(user_id: id) }
  scope :with_opponent, -> (id) { where(opponent_id: id) }

 	def self.new_game id, opponent_id
 		game = create user_id: id, opponent_id: opponent_id 
 		game.broadcast_data 'new_game'
 		game
 	end

  def as_json options =  nil
    { id: id, user_id: user_id, opponent_id: opponent_id, total_game: user.total_games_respect_to_specific_player(opponent_id)  , user_win: user.total_win_respect_to_specific_player(opponent_id) , opponent_win: opponent.total_win_respect_to_specific_player(user_id), total_draw: user.total_draw_respect_to_specific_player(opponent_id), status: status }
  end

 	def start  
 		update_attributes status: Game::statuses["in_process"]
 	 	broadcast_data 'game_start'
 	end

 	def take_turn data
 		broadcast_data 'take_turn', data
 	end

 	def finish winner_id
 	  update_attributes status: Game::statuses["finished"], winner_id: winner_id
 	  #broadcast_data id, 'finish'
 	end

  def withdraw current_user_id
    winner_id = current_user_id == user_id ? opponent_id : user_id
    update_attributes status: Game::statuses["withdrawn"], winner_id: winner_id
    broadcast_data 'withdraw_game', { winner_id: winner_id } 
 	end

 	def broadcast_data action, data = nil
 		GameProcessingJob.perform_later [id, action, data]
 	end

end
