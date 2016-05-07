class StateSerializer < ActiveModel::Serializer
  attributes :name, :abbreviation
  attribute :avg_cost_pw, key: 'Average Cost ($/W)'
  attribute :total_capacity, key: 'Total Capacity (MW)'
  attribute :total_installs, key: 'Total Installs'
end
