desc "generates csv of all installations"
task :generate_installs_csv => :environment do
  puts "Generating CSV..."
  NRELService.new.create_installs_csv
  puts "done!"
end
