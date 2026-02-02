import requests
import pandas as pd
import io
import time
import random

# We will grab the "Defensive Actions" table for the last 2 completed seasons
seasons = {
    '2023-2024': 'https://fbref.com/en/comps/9/2023-2024/defense/2023-2024-Premier-League-Stats',
    '2024-2025': 'https://fbref.com/en/comps/9/2024-2025/defense/2024-2025-Premier-League-Stats'
}

# This header makes you look like a Chrome user on a Mac
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

all_defense_data = []

for season_name, url in seasons.items():
    print(f"Attempting to fetch {season_name}...")
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            # Pandas can read HTML tables directly from the text
            # The defensive table is usually the first or second one on the page
            dfs = pd.read_html(io.StringIO(response.text), attrs={'id': 'stats_squads_defense_for'}) 
            
            # If that ID fails, try the player table ID
            if not dfs:
                dfs = pd.read_html(io.StringIO(response.text), attrs={'id': 'stats_defense'})
            
            if dfs:
                df = dfs[0]
                
                # Flatten the multi-level columns (e.g., Tackles -> Tkl)
                df.columns = ['_'.join(col).strip() if isinstance(col, tuple) else col for col in df.columns.values]
                
                # Clean up and add season column
                df['season'] = season_name
                all_defense_data.append(df)
                print(f"Success! Got {len(df)} rows for {season_name}.")
            else:
                print(f"Could not find table for {season_name}")
        else:
            print(f"Blocked (Status {response.status_code}) for {season_name}")
            
    except Exception as e:
        print(f"Error: {e}")

    # IMPORTANT: Wait 10 seconds between requests to be polite and avoid bans
    time.sleep(10)

if all_defense_data:
    final_df = pd.concat(all_defense_data)
    final_df.to_csv('data/external/fbref_defense_season_totals.csv', index=False)
    print("\nSAVED: data/external/fbref_defense_season_totals.csv")
else:
    print("\nFAILED: Still blocked. We will proceed without defensive retrofitting for now.")