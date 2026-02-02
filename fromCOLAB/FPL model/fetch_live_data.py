import requests
import pandas as pd
import os

print("--- FETCHING LIVE FPL DATA ---")
base_url = 'https://fantasy.premierleague.com/api/'
r = requests.get(base_url + 'bootstrap-static/')
json_data = r.json()

players_df = pd.DataFrame(json_data['elements'])
teams_df = pd.DataFrame(json_data['teams'])
events_df = pd.DataFrame(json_data['events'])

cols_to_keep = ['id', 'web_name', 'first_name', 'second_name', 'element_type', 'team', 'now_cost', 'total_points', 'form', 'ep_next', 'status', 'news']
clean_players = players_df[cols_to_keep]

team_map = pd.Series(teams_df.name.values, index=teams_df.id).to_dict()
clean_players['team_name'] = clean_players['team'].map(team_map)

os.makedirs('data/current_season', exist_ok=True)
clean_players.to_csv('data/current_season/players_raw.csv', index=False)
events_df.to_csv('data/current_season/gameweeks.csv', index=False)
print("✅ Live data saved.")
