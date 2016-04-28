desc " Heroku scheduler to update summaries API data"
task :update_state_data => :environment do
  puts "Updating state data..."
  NRELService.new.update_state_data
  puts "Done!"
end
