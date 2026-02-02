import pandas as pd
import glob

# 1. Load the LIVE 2025/26 Data (Target)
current_players = pd.read_csv('data/current_season/players_raw.csv')
print(f"Loaded {len(current_players)} current players.")

# 2. Load the HISTORICAL Data (Vaastav Repo)
# We look for the 'merged_gw.csv' inside the cloned repo
# Adjust this path if your folder structure is different
history_files = glob.glob('Fantasy-Premier-League/data/202*-2*/gws/merged_gw.csv')

history_list = []
for f in history_files:
    df = pd.read_csv(f, encoding='latin1') # latin1 handles accents like Ødegaard
    # Extract season from filename (e.g., "2023-24")
    season_label = f.split('/')[-3] 
    df['season'] = season_label
    history_list.append(df)

if not history_list:
    print("ERROR: Could not find historical files. Check your 'Fantasy-Premier-League' folder path.")
    exit()

full_history = pd.concat(history_list)
print(f"Loaded {len(full_history)} historical rows from {len(history_files)} seasons.")

# 3. Create a Name Mapping (The Tricky Part)
# We need to link "Haaland" in history to "Haaland" in live data.
# We map based on 'name' (or web_name).
# Note: In a real production app, we would use fuzzy matching, but direct match works for 90%
history_names = full_history[['name', 'element']].drop_duplicates()

# 4. Feature Engineering: Calculate Form from History
# We want to know: "How many points did this player average in the last 3 games?"
full_history = full_history.sort_values(['name', 'round'])
full_history['points_last_3'] = full_history.groupby('name')['total_points'].transform(lambda x: x.rolling(3).mean())

# 5. Save the Master Training Set
# This file contains every match played by every player for the last 2 years
full_history.to_csv('data/training_dataset.csv', index=False)
print("SUCCESS: Created 'data/training_dataset.csv'. You are ready to train.")