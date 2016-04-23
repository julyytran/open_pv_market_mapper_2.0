class State < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  validates :abbreviation, presence: true, uniqueness: true
  validates :avg_cost_pw, presence: true
  validates :total_capacity, presence: true
  validates :total_installs, presence: true

  has_one :geometry

  def build_geojson
    {"type" => "Feature",
      "id" => "#{self.id}",
      "properties" =>
      {
        "name" => "#{self.name}",
        "Average Cost ($/W)" => "#{self.avg_cost_pw}",
        "Total Installs" => "#{self.total_installs}",
        "Total Capacity" => "#{self.total_capacity}"
      },
      "geometry" => {"type" => "#{self.geometry.shape}",
      "coordinates" => JSON.parse(self.geometry.coordinates)}}
  end
end
