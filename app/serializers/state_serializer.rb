class StateSerializer < ActiveModel::Serializer
  attributes :id, :abbreviation, :avg_cost_pw, :total_capacity, :total_installs
end
