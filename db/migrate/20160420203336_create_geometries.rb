class CreateGeometries < ActiveRecord::Migration
  def change
    create_table :geometries do |t|
      t.references :state
      t.string :shape
      t.string :coordinates
      # , array:true, default: []

      t.timestamps null: false
    end
  end
end
