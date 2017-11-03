class Game < ApplicationRecord
	belongs_to :user
  belongs_to :opponent, foreign_key: 'opponent_id', class_name: User.name
  has_one :winner, foreign_key: 'winner_id', class_name: User.name

  enum status: [ :waiting, :in_process, :finished, :withdrawn ]

 	#after_create :broadcast_data

 	def self.new_game id, opponent_id
 		game = create user_id: id, opponent_id: opponent_id 
 		game.broadcast_data 'new_game'
 		game
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

 	def withdrawn
 	end

 	def broadcast_data action, data = nil
 		GameProcessingJob.perform_now [id, action, data]
 	end

end
