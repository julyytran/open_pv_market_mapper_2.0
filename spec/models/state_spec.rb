require 'rails_helper'

RSpec.describe State, type: :model do
  it { should validate_presence_of :name }
  it { should validate_uniqueness_of :name }
  it { should validate_presence_of :abbreviation }
  it { should validate_uniqueness_of :abbreviation }
  it { should validate_presence_of :avg_cost_pw }
  it { should validate_presence_of :total_capacity }
  it { should validate_presence_of :total_installs }
end
