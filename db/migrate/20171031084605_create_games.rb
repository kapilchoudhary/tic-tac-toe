class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.integer :user_id
      t.integer :opponent_id
      t.integer :winner_id
      t.string :winner_symbol
      t.integer :status, default: 0
      t.timestamps
    end
  end
end
