require "rails_helper"

describe User do

  let :user { create :user_with_games }

  describe "associations" do
    it { should have_many(:games_as_user) }
    it { should have_many(:games_as_opponent) }
    it { should have_many(:winning_games) }  
  end

  describe "methods" do

    before do
      user.games.each do |game|
        game.opponent_id = create(:user)
        game.save
      end
      3.times { create :game, opponent: user, user: create(:user) }
      create :game, user: create(:user), opponent: create(:user)
      user.reload
    end
    
    it "return total games" do
      expect(user.total_games).to eq 6
    end

    context "total_win" do
      before do
        user.games.first(2).each do |game|
          game.winner_id = game.user_id == user.id ? user.id : game.opponent_id
          game.status = "finished"
          game.save
        end
      end

      it "return total win" do
        expect(user.total_win).to eq 2
      end

      it "return no win if status is not finished" do 
        user.games.map {|game| game.update_column(:status, :in_process) } 
        expect(user.total_win).to eq 0
      end

    end

    context "total_draw" do
      before do
        user.games.first(2).each do |game| 
          game.status = "finished"
          game.save
        end
      end
    
      it "return total draw" do 
        expect(user.total_draw).to eq 2
      end
    end

    describe "between two players" do

     let :opponent { create :user }

      before do
        user.games.first(3).map { |game| game.update_column :opponent_id, opponent.id }
      end

      context "total_draw_respect_to_specific_player" do
        it "return total_games between two players" do
          opponent.games_as_opponent.last(2).map {|game| game.update_columns status: 'finished', winner_id: nil}
          expect(user.total_draw_respect_to_specific_player(opponent.id)).to eq 2
        end
      end

      context "total_games_respect_to_specific_player" do

        it "return total_games between two players" do
          expect(user.total_games_respect_to_specific_player(opponent.id)).to eq 3
        end
      end

      context "total_win_respect_to_specific_player" do 
        it "return total_win between two players" do
          opponent.games_as_opponent.first(2).map {|game| game.update_columns status: 'finished', winner_id: user.id}
          expect(user.total_win_respect_to_specific_player(opponent.id)).to eq 2
        end
      end
    end
  end

end