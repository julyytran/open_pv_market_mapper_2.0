class CreateGeometries < ActiveRecord::Migration
  def change
    create_table :geometries do |t|
      t.references :state
      t.string :shape
      t.integer :coordinates, array:true, default: []

      t.timestamps null: false
    end
  end
end
