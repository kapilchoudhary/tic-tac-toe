FactoryBot.define do
  factory :game do      
    association :user, factory: :user
    association :opponent, factory: :user
    winner_id nil
    status 'in_process'
  end
end