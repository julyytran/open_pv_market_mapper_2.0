class Geometry < ActiveRecord::Base
  belongs_to :state
  validates :shape, presence: true
  validates :coordinates, presence: true
end
