desc "This task is called by the Heroku scheduler add-on"
task :update_state_data => :environment do
  puts "Updating state data..."
  NRELService.new.update_state_data
  puts "done!"
end
