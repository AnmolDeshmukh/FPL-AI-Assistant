import pandas as pd
import glob
import os

print("--- MERGING HISTORICAL & LIVE DATA (V2) ---")

try:
    current_players = pd.read_csv('data/current_season/players_raw.csv')
except FileNotFoundError:
    print("❌ Error: Live data not found. Run fetch_live_data.py first.")
    exit()

history_files = glob.glob('Fantasy-Premier-League/data/202*-2*/gws/merged_gw.csv')
history_list = []
for f in history_files:
    df = pd.read_csv(f, encoding='latin1', low_memory=False)
    # Extract season from path
    season_label = f.split('/')[-3]
    df['season'] = season_label
    history_list.append(df)

full_history = pd.concat(history_list)
full_history['kickoff_time'] = pd.to_datetime(full_history['kickoff_time'])
full_history = full_history.sort_values(['element', 'kickoff_time'])

# --- NEW FEATURE: Points vs Specific Opponent ---
print("⚙️ Calculating historical performance against opponents...")
# Group by Player AND Opponent, calculate expanding mean, shift by 1 to avoid data leakage
full_history['avg_points_vs_opponent'] = full_history.groupby(['element', 'opponent_team'])['total_points'].transform(
    lambda x: x.expanding().mean().shift(1)
)

# Fill NaN (First time playing this team) with the player's global average
global_avg = full_history.groupby('element')['total_points'].transform('mean')
full_history['avg_points_vs_opponent'] = full_history['avg_points_vs_opponent'].fillna(global_avg)

full_history.to_csv('data/training_dataset.csv', index=False)
print("✅ Saved V2 Master Dataset with Opponent History.")
