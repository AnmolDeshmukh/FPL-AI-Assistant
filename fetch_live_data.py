import requests
import pandas as pd
import os

# 1. Set up the endpoint
base_url = 'https://fantasy.premierleague.com/api/'

# 2. Fetch the "Bootstrap Static" (General Info)
r = requests.get(base_url + 'bootstrap-static/')
json_data = r.json()

# 3. Parse Players (Elements)
# This gives you current Price, Total Points, Position ID, Team ID
players_df = pd.DataFrame(json_data['elements'])
teams_df = pd.DataFrame(json_data['teams'])
events_df = pd.DataFrame(json_data['events']) # Gameweek info

# 4. Clean and Save
# Keep only relevant columns for now
cols_to_keep = ['id', 'web_name', 'element_type', 'team', 'now_cost', 'total_points', 'form', 'ep_next']
clean_players = players_df[cols_to_keep]

# Map Team Names (optional but helpful)
team_map = pd.Series(teams_df.name.values, index=teams_df.id).to_dict()
clean_players['team_name'] = clean_players['team'].map(team_map)

# Save to CSV
os.makedirs('data/current_season', exist_ok=True)
clean_players.to_csv('data/current_season/players_raw.csv', index=False)
events_df.to_csv('data/current_season/gameweeks.csv', index=False)

print(f"Successfully fetched {len(clean_players)} players.")
print(clean_players.head())