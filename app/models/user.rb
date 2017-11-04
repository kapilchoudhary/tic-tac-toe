class User < ApplicationRecord
  has_many :games_as_user,  -> { where("status <> ?", Game::statuses[:waiting]) }, foreign_key: :user_id, class_name: Game.name
  has_many :games_as_opponent, -> { where("status <> ?", Game::statuses[:waiting]) }, foreign_key: :opponent_id, class_name: Game.name
  
  has_many :winning_games, -> { where(status: Game::statuses[:finished]) }, foreign_key: :winner_id, class_name: Game.name

  devise :database_authenticatable, :registerable, :validatable

  validates :name, presence: true

  before_save :ensure_authentication_token

  def total_win
    winning_games.size
  end

  def games
    games_as_user + games_as_opponent
  end

  def total_games
    games.size
  end

  def total_draw
    (games_as_user.draw + games_as_opponent.draw).size
  end

  def total_draw_respect_to_specific_player id
    (games_as_user.with_opponent(id).draw + games_as_opponent.with_user(id).draw).size
  end

  def total_games_respect_to_specific_player id
    (games_as_user.with_opponent(id) + games_as_opponent.with_user(id)).size
  end

  def total_win_respect_to_specific_player opponent_id
    winning_games.winning_respect_to_specific_player(opponent_id).size
  end

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def as_json(options={})
    super.as_json(options).merge({total_game: total_games, total_win: total_win, total_draw: total_draw, online: all_signed_in_in_touch.include?(id.to_s)})
  end

  def all_signed_in_in_touch
    ids = []
    $redis_onlines.scan_each( match: 'user*' ){|u| ids << u.gsub("user:", "") }
    ids
  end

  private

    def generate_authentication_token
      loop do
        token = Devise.friendly_token
        break token unless User.where(authentication_token: token).first
      end
    end

end
