FactoryBot.define do
  factory :user do
    sequence :name {|n| "test#{n}"} 
    sequence :email { |n| "person#{n}@example.com" }
    password 12345678
    password_confirmation 12345678
  
    factory :user_with_games do
      transient do
        games_count 3
      end

      after(:create) do |user, evaluator|
        create_list(:game, evaluator.games_count, user: user)
      end
    end
  end
end