require 'rails_helper'

RSpec.describe Geometry, type: :model do
  it { should belong_to(:state) }
  it { should validate_presence_of :shape }
  it { should validate_presence_of :coordinates }
end
