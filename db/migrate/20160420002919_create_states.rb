class CreateStates < ActiveRecord::Migration
  def change
    create_table :states do |t|
      t.string :abbreviation
      t.string :avg_cost_pw
      t.string :total_capacity
      t.string :total_installs

      t.timestamps null: false
    end
  end
end
