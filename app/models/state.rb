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
        "avg_cost_pw" => "#{self.avg_cost_pw}",
        "total_installs" => "#{self.total_installs}",
        "total_capacity" => "#{self.total_capacity}"
      },
      "geometry" => {"type" => "#{self.geometry.shape}",
      "coordinates" => JSON.parse(self.geometry.coordinates)}}.to_json
    end
end
