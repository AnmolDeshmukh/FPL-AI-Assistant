import soccerdata as sd
import pandas as pd
import os

# 1. Initialize the FBref scraper for the Premier League
# We grab the last 3 seasons to be safe.
seasons = ['2023-2024', '2024-2025', '2025-2026']
fb = sd.FBref(leagues="ENG-Premier League", seasons=seasons)

print("Fetching match stats... this may take time due to rate limits.")

# 2. Fetch "Defensive Actions"
# This returns a multi-index DataFrame with Tackles, Interceptions, Clearances, etc.
defensive_stats = fb.read_player_match_stats(stat_type="defense")

# 3. Flatten the Multi-Index for easier ML processing
defensive_stats.columns = ['_'.join(col).strip() for col in defensive_stats.columns.values]
defensive_stats.reset_index(inplace=True)

# 4. Filter for the columns we care about for the NEW FPL RULE
# Rule: 2 pts for hitting stats (10 for defenders, 12 for mids/fwds)
# Relevant FBref columns: 'Tackles_Tkl', 'Interceptions_Int', 'Clearances_Clr'
target_cols = [
    'season', 'date', 'player', 'team', 'opponent', 
    'Tackles_Tkl', 'Interceptions_Int', 'Clearances_Clr'
]

# Note: Column names in FBref change occasionally. 
# If this fails, print(defensive_stats.columns) to check the exact naming.
try:
    final_df = defensive_stats[target_cols]
    
    # Create the 'Total Defensive Actions' metric
    final_df['total_def_actions'] = (
        final_df['Tackles_Tkl'] + 
        final_df['Interceptions_Int'] + 
        final_df['Clearances_Clr']
    )

    # Save
    os.makedirs('data/external', exist_ok=True)
    final_df.to_csv('data/external/fbref_defensive_history.csv', index=False)
    print("Defensive data scraped and saved!")
    print(final_df.head())

except KeyError as e:
    print(f"Column mismatch error: {e}")
    print("Available columns:", defensive_stats.columns.tolist())