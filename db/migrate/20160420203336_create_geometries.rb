class CreateGeometries < ActiveRecord::Migration
  def change
    create_table :geometries do |t|
      t.references :state
      t.string :shape
      t.string :coordinates

      t.timestamps null: false
    end
  end
end
