class CreateStates < ActiveRecord::Migration
  def change
    create_table :states do |t|
      t.string :name
      t.string :abbreviation
      t.float :avg_cost_pw
      t.float :total_capacity
      t.float :total_installs

      t.timestamps null: false
    end
  end
end
