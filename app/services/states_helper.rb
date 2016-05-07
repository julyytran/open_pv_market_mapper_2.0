module NRELServiceHelper
  def state_abbreviations
    ["AK", "AL", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
     "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
     "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
     "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
     "WI", "WY"]
  end

  def parse(path)
    JSON.parse(@connection.get(path).body)
  end

  def write_to_csv(input_data)
    CSV.open("/lib/assets/installs_data.csv", "a") do |csv|
      input_data.each do |row|
        csv << row[0].split(",")
      end
    end
  end
end
