class State < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  validates :abbreviation, presence: true, uniqueness: true
  validates :avg_cost_pw, presence: true
  validates :total_capacity, presence: true
  validates :total_installs, presence: true
end
