require "rails_helper"

describe Game do

  let :user { create :user }
  let :opponent { create :user }
  let :game { create :game, user: user, opponent: opponent } 

  before do
    ActiveJob::Base.queue_adapter = :test
  end
   
  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:opponent) }
    it { should belong_to(:winner) }
  end

  describe "scopes" do
    context "draw" do
    
      it "include game" do
        game.update_columns winner_id: nil, status: 'finished'
        expect(Game.draw).to include game
      end

      it "not include game" do
        game.update_columns winner_id: nil
        expect(Game.draw).to_not include game
      end
    end

    context "with_user" do

      it "include game with matching user id" do
        expect(Game.with_user user.id).to include game
      end

      it "not include game with un match user id" do
        expect(Game.with_user opponent.id).to_not include game
      end
    end
    
    context "with_opponent" do

      it "include game with matching opponent id" do
        expect(Game.with_opponent opponent.id).to include game
      end

      it "not include game with un match opponent id" do
        expect(Game.with_opponent user.id).to_not include game
      end
    end

    context "winning_respect_to_specific_player" do

      it "include game" do
        game.update_columns winner_id: user.id, status: "finished"
        expect(Game.winning_respect_to_specific_player(opponent.id)).to include game 
      end

      it "not include game" do
        new_game = create :game, user: user, opponent: create(:user) 
        game.update_columns winner_id: user.id, status: "finished"
        expect(Game.winning_respect_to_specific_player(new_game.opponent.id)).to_not include game 
      end
    end
  end

  describe "methods" do

    it "create new record" do
      game
      expect(Game.count).to eq 1
      Game.new_game user.id, opponent.id
      expect(Game.count).to eq 2
    end

    it "update status to in_process" do
      game.start
      expect(game.status).to eq "in_process"
    end

    context "finish" do 

      it "update status to finished"  do
        game.finish user.id
        expect(game.status).to eq "finished"
      end

      it "set winner on finished" do
        game.finish user.id
        expect(game.winner).to eq user
      end

    end

    context "withdraw" do
      it "update status to withdraw" do
        game.withdraw user.id
        expect(game.status).to eq "withdrawn"
      end

      it "set winner to opponent" do
        game.withdraw user.id
        expect(game.winner).to eq opponent
      end
    end

    context "broadcast_data" do

      it "call job to broadcast data" do
        expect { game.broadcast_data "new_game" }.to have_enqueued_job(GameProcessingJob) 
      end
    end
  end
end