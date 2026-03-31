# FPL AI Assistant — Complete Project Knowledge Document

> **Last Updated:** March 2026  
> **Author:** Anmol Deshmukh  
> **GitHub:** [AnmolDeshmukh/FPL-AI-Assistant](https://github.com/AnmolDeshmukh/FPL-AI-Assistant)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Design Philosophy](#2-architecture--design-philosophy)
3. [Technology Stack](#3-technology-stack)
4. [Repository Layout (GitHub)](#4-repository-layout-github)
5. [Local Workspace Layout](#5-local-workspace-layout)
6. [Detailed File Reference](#6-detailed-file-reference)
7. [Data Pipeline](#7-data-pipeline)
8. [Machine Learning Model](#8-machine-learning-model)
9. [Optimization Engine](#9-optimization-engine)
10. [Transfer Recommender](#10-transfer-recommender)
11. [React UI (Frontend)](#11-react-ui-frontend)
12. [External Data Sources](#12-external-data-sources)
13. [Data Schema Reference](#13-data-schema-reference)
14. [Setup & Installation](#14-setup--installation)
15. [Weekly Workflow](#15-weekly-workflow)
16. [Configuration & Environment Variables](#16-configuration--environment-variables)
17. [Known Limitations & Future Roadmap](#17-known-limitations--future-roadmap)
18. [Credits & Licenses](#18-credits--licenses)

---

## 1. Project Overview

**FPL AI Assistant** is an end-to-end AI system designed to solve the Fantasy Premier League (FPL) game for the 2025/26 season. It goes beyond simple "form-based" predictors by using a **Two-Stage Architecture**:

1. **The Oracle (Prediction Engine):** A trained **XGBoost Regressor** that predicts how many FPL points every Premier League player will score in the next Gameweek. It learns from 5+ seasons of historical data (~139,000+ rows), incorporating player form, recent minutes, and specific player-vs-opponent history.

2. **The Solver (Optimization Engine):** A **Linear Programming** model (using PuLP/CBC) that takes the predictions and finds the mathematically optimal 15-player squad or the single best transfer, while respecting FPL's budget (£100m) and squad composition constraints.

The project also includes:
- Automated data fetching scripts (FPL API + historical repo)
- Defensive stats scrapers (FBref)
- A React/TypeScript UI for interactive squad management (in development)
- Both a Google Colab version and a local/portable Jupyter notebook version

### What Problem Does It Solve?

FPL managers must pick a 15-player squad under a £100m budget, choosing from ~800 players across 20 teams. Each gameweek they can make limited transfers. This project automates:
- **Point prediction** for every player for the next gameweek
- **Optimal squad selection** (Wildcard mode) — the best possible 15-player team from scratch
- **Transfer recommendation** (Transfer mode) — the single best sell/buy swap for an existing team, with a configurable "threshold" to avoid sideways moves

---

## 2. Architecture & Design Philosophy

```
┌─────────────────────────────────────────────────────────────────┐
│                     FPL AI Assistant Pipeline                    │
├─────────────┬───────────────┬──────────────┬────────────────────┤
│  DATA LAYER │  MODEL LAYER  │ SOLVER LAYER │     UI LAYER       │
│             │               │              │                    │
│ FPL API ────┤               │              │  React/TypeScript  │
│ (live)      │  XGBoost      │  PuLP/CBC    │  Tailwind CSS      │
│             │  Regressor    │  Linear Prog │  Components:       │
│ Vaastav's ──┤  (V2)         │              │  - Header          │
│ Repo        │               │  Wildcard    │  - UserInfoPanel   │
│ (historical)│  Features:    │  Solver      │  - CurrentTeamPanel│
│             │  - form_last_3│              │  - OptimizedSquad  │
│ FBref ──────┤  - minutes    │  Transfer    │  - TransferRec     │
│ (defensive) │  - vs_opponent│  Recommender │  - OptimizeButton  │
│             │  - difficulty │              │                    │
└─────────────┴───────────────┴──────────────┴────────────────────┘
```

### Design Principles

- **Portability:** The main notebook (`FPL_Project_portable.ipynb`) uses relative paths and environment variables, allowing it to run both on Google Colab and locally.
- **Modularity:** Data fetching, merging, training, prediction, and optimization are separate cells/scripts that can be run independently.
- **Anti-leakage:** Features like `avg_points_vs_opponent` use `expanding().mean().shift(1)` to prevent data leakage from future games into past training rows.
- **Conservative Transfer Strategy:** A configurable threshold (default: +3.0 pts) prevents "sideways" transfers that don't meaningfully improve the team.

---

## 3. Technology Stack

### Backend / ML (Python)

| Technology | Version / Notes | Purpose |
|---|---|---|
| **Python** | 3.10+ | Core language |
| **pandas** | Latest | Data manipulation, CSV I/O, feature engineering |
| **XGBoost** | Latest | Gradient-boosted tree regressor for point prediction |
| **scikit-learn** | Latest | `mean_absolute_error` metric, train/test split logic |
| **joblib** | Latest | Model serialization (`.pkl` files) |
| **PuLP** | Latest | Linear Programming solver (CBC backend) |
| **requests** | Latest | HTTP calls to FPL API |
| **soccerdata** | Latest | FBref scraping wrapper (defensive stats) |
| **Jupyter Notebook** | — | Interactive development environment |
| **Google Colab** | — | Cloud alternative for notebook execution |

### Frontend (React/TypeScript) — In Development

| Technology | Version | Purpose |
|---|---|---|
| **React** | 17.0.2 | UI framework |
| **TypeScript** | 4.4.4 | Type-safe JavaScript |
| **Tailwind CSS** | 2.2.19 | Utility-first CSS framework |
| **react-scripts** | 4.0.3 | Create React App toolchain |
| **Node.js** | 14.x+ | JavaScript runtime |
| **npm** | 6.x+ | Package manager |

### Data Sources

| Source | Type | URL |
|---|---|---|
| **Official FPL API** | REST API (JSON) | `https://fantasy.premierleague.com/api/bootstrap-static/` |
| **FPL Fixtures API** | REST API (JSON) | `https://fantasy.premierleague.com/api/fixtures/?future=1` |
| **Vaastav's FPL Repo** | Git repository (CSV) | `https://github.com/vaastav/Fantasy-Premier-League` |
| **FBref** | Web scraping (HTML tables) | `https://fbref.com/en/comps/9/` |

---

## 4. Repository Layout (GitHub)

The GitHub repository at `https://github.com/AnmolDeshmukh/FPL-AI-Assistant` has this structure:

```
FPL-AI-Assistant/
├── .gitignore                      # Ignores data/, pkl, checkpoints, etc.
├── FPL_Project_portable.ipynb      # Main notebook (8 cells, portable paths)
├── README.md                       # Project documentation (React UI + backend)
├── UI_SETUP_GUIDE.md               # React UI setup instructions
├── package.json                    # npm config for React UI
├── tsconfig.json                   # TypeScript compiler options
├── FPL model/                      # Working directory for Python pipeline
│   ├── fetch_live_data.py          # Fetches live data from FPL API
│   ├── merge_data.py               # Merges historical + live data
│   ├── scrape_defense_stealth.py   # FBref defensive data scraper (requests)
│   ├── scrape_defensive_data.py    # FBref defensive data scraper (soccerdata)
│   ├── fpl_model.pkl               # Saved XGBoost model (V1)
│   ├── fpl_model_v2.pkl            # Saved XGBoost model (V2, with opponent history)
│   ├── predictions.csv             # Latest generated predictions
│   ├── data/                       # [gitignored] Generated datasets
│   │   ├── training_dataset.csv
│   │   └── current_season/
│   │       ├── players_raw.csv
│   │       └── gameweeks.csv
│   └── Fantasy-Premier-League/     # [gitignored] Cloned external data repo
└── ui/
    └── src/
        ├── App.tsx                 # Main React application component
        ├── index.css               # Tailwind CSS + custom animations
        ├── components/
        │   ├── Actions/
        │   │   └── OptimizeButton.tsx
        │   ├── InputPanel/
        │   │   ├── UserInfoPanel.tsx
        │   │   └── CurrentTeamPanel.tsx
        │   ├── Layout/
        │   │   └── Header.tsx
        │   └── Results/
        │       ├── OptimizedSquadPanel.tsx
        │       └── TransferRecommendationPanel.tsx
        └── types/
            └── index.ts            # TypeScript interfaces
```

### .gitignore Rules

The following are excluded from version control:
- `/data/` and `/FPL model/data/` — Generated CSV datasets
- `/Fantasy-Premier-League/` and `/FPL model/Fantasy-Premier-League/` — External data repo (cloned locally)
- `/FPL model/predictions.csv` — Generated predictions
- `/fromCOLAB/` — Legacy Colab notebook
- `__pycache__/`, `*.py[cod]`, `*.egg-info/` — Python artifacts
- `.env`, `.venv/`, `venv/` — Environment files
- `.ipynb_checkpoints` — Jupyter artifacts
- `.DS_Store` — macOS artifacts
- `*.log`, `*.so`, `Pipfile.lock` — Misc artifacts

---

## 5. Local Workspace Layout

The local workspace at `/Users/anmoldeshmukh/FPL model/` has additional directories not on GitHub:

```
/Users/anmoldeshmukh/FPL model/
├── .git/                               # Git repository root
├── .gitignore
├── FPL_Project_portable.ipynb          # Main notebook (portable version)
├── README.md                           # Project README
├── data/                               # Top-level data (mirrors FPL model/data/)
│   ├── training_dataset.csv            # Master training dataset (~139,469 rows)
│   └── current_season/
│       ├── players_raw.csv             # Live player data from FPL API
│       └── gameweeks.csv               # Gameweek schedule/deadlines
├── Fantasy-Premier-League/             # Vaastav's historical data repo (cloned)
│   ├── data/
│   │   ├── 2016-17/ through 2025-26/  # 10 seasons of data
│   │   ├── cleaned_merged_seasons.csv
│   │   ├── cleaned_merged_seasons_team_aggregated.csv
│   │   └── master_team_list.csv
│   ├── DATA_DICTIONARY.md             # Comprehensive column definitions
│   ├── cleaners.py, collector.py ...  # Repo's own data processing scripts
│   └── README.md
├── FPL model/                          # Python working directory
│   ├── fetch_live_data.py
│   ├── merge_data.py
│   ├── scrape_defense_stealth.py
│   ├── scrape_defensive_data.py
│   ├── fpl_model.pkl                  # XGBoost model V1
│   ├── fpl_model_v2.pkl               # XGBoost model V2
│   ├── predictions.csv                # Latest predictions output
│   ├── data/
│   │   ├── training_dataset.csv
│   │   └── current_season/
│   └── Fantasy-Premier-League/        # Another clone of external repo
├── fromCOLAB/
│   └── FPL_Project.ipynb              # Original Google Colab version
└── fromgithub/                        # Empty directory (placeholder)
```

### Note on Duplicate Directories

The workspace contains some duplication:
- `data/` exists both at the root level and inside `FPL model/data/`
- `Fantasy-Premier-League/` exists both at the root level and inside `FPL model/Fantasy-Premier-League/`
- This is because the notebook `cd`s into `FPL model/` as its working directory, so scripts reference paths relative to that location
- The root-level copies may be from manual runs or earlier development

---

## 6. Detailed File Reference

### 6.1 `FPL_Project_portable.ipynb` (Main Notebook)

The primary entry point for the entire ML pipeline. Contains **8 code cells** that should be run in order. This is the "portable" version that works both locally and on Google Colab.

| Cell | Title | Lines | Purpose |
|------|-------|-------|---------|
| **1** | Setup | 2–39 | Sets `PROJECT_PATH` (defaults to `./FPL model`), installs missing Python packages, changes working directory |
| **2A** | Create Fetch Script | 42–66 | Writes `fetch_live_data.py` to disk using `%%writefile` magic |
| **2B** | Create Merge Script (V2) | 69–110 | Writes `merge_data.py` to disk using `%%writefile` magic |
| **3** | Weekly Update | 113–138 | Runs `git pull` on Vaastav's repo (or clones it), then executes `fetch_live_data.py` and `merge_data.py` |
| **4** | Train XGBoost Model (V2) | 141–198 | Loads `training_dataset.csv`, engineers lag/rolling features, trains XGBoost, reports MAE, saves `fpl_model_v2.pkl` |
| **5** | Generate Predictions (V2.1) | 201–299 | Loads model + live API data + fixtures, computes per-player features including opponent history, saves `predictions.csv` |
| **6** | Optimize Squad (Wildcard Solver) | 302–386 | Uses PuLP to solve optimal 15-player squad from `predictions.csv` |
| **7** | Transfer Recommender (V5) | 389–493 | Takes user's current team list, finds the best 1-for-1 swap with threshold logic |

**Path Configuration (Cell 1):**
- `FPL_PROJECT_PATH` env var → defaults to `./FPL model` relative to notebook
- `FPL_HISTORY_REPO` env var → defaults to `Fantasy-Premier-League` (inside project path)

**Cell 2A and 2B use `%%writefile`** — They don't execute the scripts directly; they write the Python files to disk so Cell 3 can call them via `!python fetch_live_data.py`.

### 6.2 `fromCOLAB/FPL_Project.ipynb` (Original Colab Version)

The original Google Colab notebook (**20 cells**, some with cached outputs). Key differences from the portable version:
- Cell 1 mounts Google Drive: `drive.mount('/content/drive')`
- Uses hardcoded path: `PROJECT_PATH = '/content/drive/MyDrive/FPL model'`
- Contains extra empty/debug cells (cells 9–20)
- Cells 16 has an error output (likely from a failed Colab run)
- Otherwise identical logic for data fetching, merging, training, prediction, optimization, and transfers

This file is **gitignored** and serves as the historical reference for the Colab-based development.

### 6.3 `FPL model/fetch_live_data.py`

**Purpose:** Fetches real-time player data from the official FPL API.

**What it does:**
1. Calls `https://fantasy.premierleague.com/api/bootstrap-static/`
2. Extracts three DataFrames: `elements` (players), `teams`, `events` (gameweeks)
3. Keeps 12 key columns: `id`, `web_name`, `first_name`, `second_name`, `element_type`, `team`, `now_cost`, `total_points`, `form`, `ep_next`, `status`, `news`
4. Maps team IDs to team names using a lookup dictionary
5. Saves to:
   - `data/current_season/players_raw.csv` — Player roster with prices, form, injury status
   - `data/current_season/gameweeks.csv` — Gameweek deadlines and status

**Key Columns Extracted:**
- `now_cost`: Price in £0.1m units (e.g., 100 = £10.0m)
- `status`: `a` = available, `d` = doubtful, `i` = injured, `s` = suspended, `u` = unavailable
- `ep_next`: FPL's own "expected points next GW" estimate
- `news`: Injury/availability text (e.g., "Knee injury - Expected back 15 Mar")

### 6.4 `FPL model/merge_data.py`

**Purpose:** Merges multiple seasons of historical gameweek data into a single training dataset and engineers the "opponent history" feature.

**What it does:**
1. Reads `data/current_season/players_raw.csv` (sanity check that live data exists)
2. Globs all `merged_gw.csv` files from `Fantasy-Premier-League/data/202*-2*/gws/` — captures seasons from 2020-21 onward (the `202*` glob pattern)
3. Adds a `season` column extracted from the directory path
4. Concatenates all seasons, sorts by player ID and kickoff time
5. **V2 Feature — `avg_points_vs_opponent`:**
   - Groups by `(element, opponent_team)` — i.e., each unique player-opponent pair
   - Computes an expanding mean of `total_points`, shifted by 1 to prevent data leakage
   - For first encounters (NaN), falls back to the player's global average across all opponents
6. Saves the merged result as `data/training_dataset.csv`

**Output:** A single CSV with ~139,469 rows and 50+ columns spanning 5+ seasons.

### 6.5 `FPL model/scrape_defensive_data.py`

**Purpose:** Scrapes per-player, per-match defensive action data from FBref using the `soccerdata` library.

**What it does:**
1. Uses `soccerdata.FBref` to fetch "defense" stat type for Premier League seasons 2023-24, 2024-25, 2025-26
2. Flattens multi-index columns
3. Extracts: `Tackles_Tkl`, `Interceptions_Int`, `Clearances_Clr`
4. Creates `total_def_actions` = Tackles + Interceptions + Clearances
5. Saves to `data/external/fbref_defensive_history.csv`

**Context:** This script was created in anticipation of a new FPL rule where players earn 2 bonus points for hitting a defensive actions threshold (10 for defenders, 12 for midfielders/forwards). The data is not yet integrated into the main model.

**Dependencies:** `soccerdata` (which wraps FBref with rate limiting)

### 6.6 `FPL model/scrape_defense_stealth.py`

**Purpose:** Alternative defensive data scraper using raw `requests` + `pandas.read_html()` instead of `soccerdata`.

**What it does:**
1. Fetches HTML pages from FBref for 2023-24 and 2024-25 seasons
2. Uses a Chrome User-Agent header to avoid being blocked
3. Parses the `stats_squads_defense_for` HTML table using `pd.read_html()`
4. Flattens multi-level column headers
5. Waits 10 seconds between requests (rate limiting)
6. Saves to `data/external/fbref_defense_season_totals.csv`

**Key Difference from `scrape_defensive_data.py`:** This scrapes **team-level season totals** rather than per-player per-match data. It's a fallback approach when `soccerdata` is unavailable or blocked.

### 6.7 `FPL model/predictions.csv`

**Generated output** from Cell 5 of the notebook. Contains one row per available player with:

| Column | Description |
|---|---|
| `element` | FPL player ID |
| `full_name` | Full player name |
| `web_name` | Display name on FPL |
| `position` | GKP, DEF, MID, FWD |
| `team_name` | Club name |
| `next_opponent` | Next GW opponent name |
| `now_cost` | Price in £0.1m units |
| `element_type` | Position code (1–4) |
| `team` | Team ID (1–20) |
| `value` | Same as `now_cost` (used as feature) |
| `was_home` | Boolean: is next match at home? |
| `opponent_difficulty` | FDR 1–5 rating of next opponent |
| `last_points` | Points scored in last match |
| `form_last_3` | Avg points over last 3 games |
| `minutes_last_3` | Avg minutes over last 3 games |
| `avg_points_vs_opponent` | Historical average vs. that specific opponent |
| `predicted_points` | **Model output**: predicted GW points |

Players with `status == 'u'` (unavailable) are excluded.

### 6.8 `FPL model/fpl_model_v2.pkl`

Serialized XGBoost model saved via `joblib.dump()`. This is the V2 model that includes the `avg_points_vs_opponent` feature.

**Model Hyperparameters:**
- `objective`: `reg:squarederror`
- `n_estimators`: 150
- `learning_rate`: 0.05
- `max_depth`: 5
- `n_jobs`: -1 (all CPU cores)

**Reported MAE:** ~0.6 points (on the 15% holdout test set)

### 6.9 `FPL model/fpl_model.pkl`

The V1 model (without opponent history feature). Kept for reference/comparison.

### 6.10 `README.md`

The project's main documentation file, covering:
- Project overview and two-stage architecture
- Key features (smart forecasting, memory logic, optimization, transfer recommender)
- Project structure diagram
- Installation & setup instructions
- Step-by-step usage guide
- Technical approach (feature engineering, optimization math)
- Future roadmap
- Credits

---

## 7. Data Pipeline

### 7.1 Data Flow Diagram

```
                   ┌──────────────────────┐
                   │  FPL API (Live)       │
                   │  bootstrap-static/    │
                   │  fixtures/?future=1   │
                   └──────────┬───────────┘
                              │
                   fetch_live_data.py
                              │
                              ▼
                   ┌──────────────────────┐
                   │  data/current_season/ │
                   │  ├── players_raw.csv  │
                   │  └── gameweeks.csv    │
                   └──────────┬───────────┘
                              │
    ┌─────────────────────────┤
    │                         │
    ▼                         ▼
┌───────────────────┐   merge_data.py
│ Fantasy-Premier-  │         │
│ League/data/      │         │
│ 202X-YY/gws/     │─────────┘
│ merged_gw.csv     │
└───────────────────┘         │
                              ▼
                   ┌──────────────────────┐
                   │ data/                 │
                   │ training_dataset.csv  │
                   │ (~139,469 rows)       │
                   └──────────┬───────────┘
                              │
                    Cell 4: Train XGBoost
                              │
                              ▼
                   ┌──────────────────────┐
                   │ fpl_model_v2.pkl      │
                   └──────────┬───────────┘
                              │
                    Cell 5: Predict
                    (+ live API call)
                              │
                              ▼
                   ┌──────────────────────┐
                   │ predictions.csv       │
                   └──────────┬───────────┘
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
              Cell 6: Solver    Cell 7: Transfer
              (Wildcard)        (Recommender)
```

### 7.2 Historical Data (Vaastav's Repo)

The project depends on [vaastav/Fantasy-Premier-League](https://github.com/vaastav/Fantasy-Premier-League), a community-maintained dataset of FPL statistics. It is cloned into `Fantasy-Premier-League/` and updated via `git pull`.

**Available seasons in the local clone:** 2016-17 through 2025-26 (10 seasons)

**The merge script uses seasons matching `202*-2*`** — so it captures:
- 2020-21, 2021-22, 2022-23, 2023-24, 2024-25, 2025-26

**Per-season data structure:**
```
season/
├── cleaned_players.csv      # Season overview stats
├── fixtures.csv             # Match schedule and results
├── player_idlist.csv        # Player ID mappings
├── players_raw.csv          # Full API dump for that season
├── teams.csv                # Team metadata
├── gws/
│   ├── gw1.csv ... gw38.csv    # Per-gameweek player stats
│   ├── merged_gw.csv           # ← THIS IS WHAT THE MODEL USES
│   └── xP1.csv ... xP38.csv   # Expected points data
├── players/
│   └── <player_name>/
│       ├── gws.csv             # That player's GW-by-GW history
│       └── history.csv         # That player's prior seasons
└── understat/                   # (Some seasons) Understat xG data
```

**Key file: `merged_gw.csv`** — Contains one row per player per gameweek with all stats (points, minutes, goals, assists, bonus, xG, etc.). This is concatenated across seasons to create the training dataset.

**Important Note (from Vaastav's README, March 2026):** Weekly updates have been stopped after the 2024-25 season. The repo will only receive 3 major updates per season going forward (start, January window, end).

### 7.3 Training Dataset Schema

The file `data/training_dataset.csv` has **~139,469 rows** and the following columns:

**Identity / Match Context:**
- `name`, `position`, `team`, `element`, `fixture`, `round`, `GW`, `season`
- `kickoff_time`, `was_home`, `opponent_team`

**Performance Stats (per-match):**
- `total_points` ← **TARGET VARIABLE**
- `minutes`, `goals_scored`, `assists`, `own_goals`, `penalties_missed`, `penalties_saved`
- `clean_sheets`, `goals_conceded`, `saves`
- `bonus`, `bps` (Bonus Points System)
- `yellow_cards`, `red_cards`
- `influence`, `creativity`, `threat`, `ict_index`
- `xP` (expected points)

**Expected Stats (xG family):**
- `expected_goals`, `expected_assists`, `expected_goal_involvements`, `expected_goals_conceded`

**Pricing:**
- `value` (player price at that GW)

**Transfer Stats:**
- `selected`, `transfers_balance`, `transfers_in`, `transfers_out`

**Match Score:**
- `team_a_score`, `team_h_score`

**Defensive Stats (newer seasons):**
- `clearances_blocks_interceptions`, `defensive_contribution`, `recoveries`, `tackles`

**Manager Stats (from Vaastav's repo):**
- `mng_clean_sheets`, `mng_draw`, `mng_goals_scored`, `mng_loss`, `mng_underdog_draw`, `mng_underdog_win`, `mng_win`

**Engineered Features (added by `merge_data.py`):**
- `avg_points_vs_opponent` — Player's historical average points against this specific opponent (expanding mean, shifted by 1)

**Engineered Features (added during training in Cell 4):**
- `last_points` — Points in the previous match (lag-1)
- `form_last_3` — Rolling 3-game average of points (shifted by 1)
- `minutes_last_3` — Rolling 3-game average of minutes (shifted by 1)
- `was_home_last` — Whether the previous match was at home

---

## 8. Machine Learning Model

### 8.1 Model Type

**XGBoost Regressor** (`xgb.XGBRegressor`) — a gradient-boosted decision tree ensemble.

### 8.2 Feature Set (V2)

The model uses **7 features** for prediction:

| Feature | Type | Description |
|---|---|---|
| `value` | int | Player's current price in £0.1m |
| `was_home` | bool | Whether the next match is at home |
| `opponent_difficulty` | int (1–5) | FPL's Fixture Difficulty Rating for the opponent |
| `last_points` | float | Points scored in the most recent game |
| `form_last_3` | float | Average points over the last 3 games |
| `minutes_last_3` | float | Average minutes over the last 3 games |
| `avg_points_vs_opponent` | float | Historical average points vs. this specific opponent |

### 8.3 Target Variable

`total_points` — The actual FPL points scored in that gameweek.

### 8.4 Train/Test Split

- **85% / 15% split** done chronologically (not randomly) — the first 85% of rows (sorted by time) are for training, the last 15% for testing.
- This mimics real-world usage: we train on the past and predict the future.

### 8.5 Hyperparameters

```python
xgb.XGBRegressor(
    objective='reg:squarederror',
    n_estimators=150,
    learning_rate=0.05,
    max_depth=5,
    n_jobs=-1
)
```

### 8.6 Evaluation Metric

- **Mean Absolute Error (MAE):** ~0.6 points
- This means the model is, on average, within 0.6 FPL points of the actual score per player per gameweek.

### 8.7 Model Versioning

- **V1** (`fpl_model.pkl`): Original model without opponent history feature
- **V2** (`fpl_model_v2.pkl`): Adds `avg_points_vs_opponent` — the player's historical average against the specific team they are about to play. This helps identify players who consistently overperform in certain fixtures (e.g., "Salah vs. Man City").

### 8.8 Feature Importance Insights

The most predictive features are typically:
1. `form_last_3` — Recent form is the strongest predictor
2. `minutes_last_3` — Minutes filter removes rotation risks
3. `last_points` — Momentum/confidence effect
4. `avg_points_vs_opponent` — The V2 "memory" feature
5. `value` — Higher-priced players tend to score more
6. `opponent_difficulty` — Harder fixtures → fewer points
7. `was_home` — Home advantage exists but is minor

---

## 9. Optimization Engine

### 9.1 Problem Formulation

The Wildcard Solver (Cell 6) is a **Binary Integer Linear Program** that maximizes predicted points subject to FPL constraints.

### 9.2 Mathematical Formulation

**Objective Function:**

$$\max \sum_{i=1}^{N} x_i \cdot \text{PredictedPoints}_i$$

Where $x_i \in \{0, 1\}$ is a binary decision variable (1 = select player $i$, 0 = don't).

**Subject to:**

1. **Budget Constraint:**
$$\sum_{i=1}^{N} x_i \cdot \text{Cost}_i \leq 1000 \quad (\text{i.e., £100.0m})$$

2. **Squad Size:**
$$\sum_{i=1}^{N} x_i = 15$$

3. **Position Constraints:**
$$\sum_{i: \text{pos}_i = \text{GK}} x_i = 2$$
$$\sum_{i: \text{pos}_i = \text{DEF}} x_i = 5$$
$$\sum_{i: \text{pos}_i = \text{MID}} x_i = 5$$
$$\sum_{i: \text{pos}_i = \text{FWD}} x_i = 3$$

4. **Team Constraint (per team $t$):**
$$\sum_{i: \text{team}_i = t} x_i \leq 3$$

### 9.3 Solver

Uses **PuLP** with the **CBC (Coin-or Branch and Cut)** solver backend. CBC is a free, open-source mixed-integer programming solver. The problem is solved silently (`msg=0`).

### 9.4 Configuration

- `BUDGET = 1000` (£100.0m in £0.1m units)
- Budget can be adjusted for "chip" scenarios (e.g., Free Hit with different budget)

### 9.5 Output

A formatted table showing the optimal 15-player squad, sorted by position then predicted points:
```
Pos   Player                    Team            Opponent         Price    Pts
GK    ...                       ...             ...              ...      ...
DEF   ...                       ...             ...              ...      ...
MID   ...                       ...             ...              ...      ...
FWD   ...                       ...             ...              ...      ...
```

Plus total cost and total projected points.

---

## 10. Transfer Recommender

### 10.1 Purpose

Cell 7 of the notebook implements a **conservative transfer strategy** for weekly use. Instead of optimizing from scratch, it analyzes the user's existing team and recommends the single best transfer.

### 10.2 User Inputs

```python
my_current_team = ['Raya', 'Donnarumma', 'Gabriel', ...]  # 15 player names
BANK = 3.1           # Money in bank (£ millions)
FREE_TRANSFERS = 1   # 1 or 2 free transfers available
TRANSFER_THRESHOLD = 3.0  # Minimum predicted point gain to recommend a transfer
```

### 10.3 Algorithm

1. **Identity Verification:** For each name in `my_current_team`, match against `predictions.csv` using `web_name` first, then `full_name`. Handles ambiguous names by preferring exact full-name matches.

2. **For each player on the current team:**
   - Calculate the budget available if this player is sold: `sell_price + bank_balance`
   - Find all replacement options of the same position within budget that aren't already on the team
   - Sort replacements by predicted points (descending)
   - Calculate the gain = best replacement's predicted points − current player's predicted points

3. **Best Transfer:** The swap with the highest gain across all positions.

4. **Decision Engine:**
   - If `gain >= TRANSFER_THRESHOLD` → **TRANSFER RECOMMENDED** (print sell/buy details)
   - If `0 < gain < TRANSFER_THRESHOLD` → **HOLD RECOMMENDED** (roll the transfer for next week)
   - If no upgrade found → **ROLL transfer**

### 10.4 Conservative Strategy Logic

The threshold of +3.0 points prevents:
- "Sideways" moves that gain only 0.5–1.0 points
- Wasting a free transfer on marginal gains
- "Rolling" the transfer gives 2 FTs next week, enabling bigger moves

---

## 11. React UI (Frontend)

The React UI is a work-in-progress located in `ui/src/` on GitHub. It provides a visual interface for the FPL AI Assistant.

### 11.1 Tech Stack

- **React 17.0.2** with functional components and hooks
- **TypeScript 4.4.4** for type safety
- **Tailwind CSS 2.2.19** for utility-first styling
- **react-scripts 4.0.3** (Create React App)

### 11.2 Component Architecture

```
ui/src/
├── App.tsx              # Root component, state management, layout grid
├── index.css            # Tailwind directives + custom CSS classes + animations
├── types/
│   └── index.ts         # TypeScript interfaces (Player, Squad, UserSettings, etc.)
└── components/
    ├── Layout/
    │   └── Header.tsx   # Top navigation bar with menu toggle
    ├── InputPanel/
    │   ├── UserInfoPanel.tsx       # Budget, gameweek, mode (wildcard/transfer) settings
    │   └── CurrentTeamPanel.tsx    # Input current team for transfer mode
    ├── Actions/
    │   └── OptimizeButton.tsx      # Triggers optimization, shows loading state
    └── Results/
        ├── OptimizedSquadPanel.tsx        # Displays optimal 15-player squad
        └── TransferRecommendationPanel.tsx # Displays transfer sell/buy recommendation
```

### 11.3 TypeScript Interfaces

**`Player`**
```typescript
{
  id: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  team: string;
  price: number;
  predictedPoints: number;
  form: number;
  minutes_last_3: number;
  opponent: string;
  difficulty: number;
  imageUrl?: string;
}
```

**`Squad`**
```typescript
{
  id: string;
  players: Player[];
  totalCost: number;
  totalPoints: number;
  formation: { gk: number; def: number; mid: number; fwd: number };
  teamDistribution: Record<string, number>;
}
```

**`UserSettings`**
```typescript
{
  budget: number;
  currentTeam: Player[];
  gameweek: number;
  mode: 'wildcard' | 'transfer';
  bankBalance: number;
  riskProfile: 'conservative' | 'balanced' | 'aggressive';
}
```

**`OptimizationResult`**
```typescript
{
  squad: Squad;
  recommendations: Player[];
  transferSuggestion?: { sell: Player; buy: Player; pointsGain: number };
  analysis: string;
}
```

**`ApiResponse<T>`** — Generic API response wrapper with `success`, `data`, `error`, `message`.

### 11.4 UI Design

- **Dark theme** with gradient background (`from-slate-900 via-slate-800 to-slate-900`)
- **Glass morphism** elements (`.glass` class with backdrop blur)
- **Cards** with gradient backgrounds and border styling
- **Orange accent color** for primary buttons
- **Custom animations:** `slideIn`, `fadeIn`, `scaleIn`
- **Responsive layout:** 3-column grid on large screens (1 col input, 2 col results), stacks on mobile
- **Two modes:**
  - **Wildcard Mode**: Shows `OptimizedSquadPanel` with full squad
  - **Transfer Mode**: Shows `TransferRecommendationPanel` with sell/buy suggestion

### 11.5 Current State

The UI currently uses **mock data** for the optimization result. The `handleOptimize` function in `App.tsx` simulates a 2-second API call with `setTimeout` and returns hardcoded mock data. **The actual backend API integration has not been implemented yet.**

---

## 12. External Data Sources

### 12.1 Official FPL API

**Base URL:** `https://fantasy.premierleague.com/api/`

**Endpoints Used:**

| Endpoint | Purpose | Frequency |
|---|---|---|
| `bootstrap-static/` | Full player roster, teams, gameweek schedule | Weekly (before each GW) |
| `fixtures/?future=1` | Upcoming fixtures with difficulty ratings | Weekly (for predictions) |

**`bootstrap-static/` response structure (JSON):**
- `elements`: Array of ~800 player objects
- `teams`: Array of 20 team objects
- `events`: Array of 38 gameweek objects
- `element_types`: Position definitions (GK, DEF, MID, FWD)

**No authentication required** — the API is public and rate-limited but does not require an API key.

### 12.2 Vaastav/Fantasy-Premier-League (GitHub Repo)

- **URL:** `https://github.com/vaastav/Fantasy-Premier-League`
- **Contains:** Complete historical FPL data from 2016-17 to 2025-26
- **Key file per season:** `data/{season}/gws/merged_gw.csv`
- **Rows per season:** Approximately 15,000–25,000 (all players × all GWs played)
- **Updated via:** `git pull` in Cell 3 of the notebook
- **Citation:** Vaastav Anand (2022)

### 12.3 FBref (Defensive Stats)

- **URL:** `https://fbref.com/en/comps/9/` (Premier League)
- **Two scraping approaches implemented:**
  1. `scrape_defensive_data.py` — Uses `soccerdata` Python library
  2. `scrape_defense_stealth.py` — Uses raw `requests` with Chrome User-Agent
- **Data extracted:** Tackles (`Tkl`), Interceptions (`Int`), Clearances (`Clr`)
- **Purpose:** Anticipating new FPL rule for defensive action bonus points
- **Status:** Data scraped but **not yet integrated** into the main XGBoost model

---

## 13. Data Schema Reference

### 13.1 `data/current_season/players_raw.csv`

Columns: `id`, `web_name`, `element_type`, `team`, `now_cost`, `total_points`, `form`, `ep_next`, `team_name`

(Note: The notebook's fetch script also includes `first_name`, `second_name`, `status`, `news` — but the saved version in the workspace appears to have a subset.)

### 13.2 `data/current_season/gameweeks.csv`

Full gameweek event data from the FPL API including deadlines, completion status, most-captained/transferred players, chip usage stats, etc.

### 13.3 `data/training_dataset.csv`

~139,469 rows × 50+ columns. See Section 7.3 for full schema.

### 13.4 `predictions.csv`

~700-800 rows (one per available player). See Section 6.7 for full schema.

### 13.5 Position Codes

| Code | FPL Name | Abbreviation |
|---|---|---|
| 1 | Goalkeeper | GKP / GK |
| 2 | Defender | DEF |
| 3 | Midfielder | MID |
| 4 | Forward | FWD |

### 13.6 Teams (2025-26 Season)

Teams are numbered 1–20. The mapping changes each season as teams are promoted/relegated. Use `teams_df` from the API to get current mappings.

---

## 14. Setup & Installation

### 14.1 Prerequisites

- **Python 3.10+**
- **Git** (for cloning repos)
- **Node.js 14.x+** and **npm 6.x+** (only for the UI)
- **Jupyter Notebook** or **VS Code with Jupyter extension**

### 14.2 Python Setup

```bash
# Clone the project
git clone https://github.com/AnmolDeshmukh/FPL-AI-Assistant.git
cd FPL-AI-Assistant

# Install Python dependencies
pip install pandas xgboost scikit-learn joblib requests pulp soccerdata

# Clone the historical data repo (inside the project)
cd "FPL model"
git clone https://github.com/vaastav/Fantasy-Premier-League.git
```

### 14.3 UI Setup (React)

```bash
# From the repo root
npm install
npm start
# App runs at http://localhost:3000
```

### 14.4 Running the Pipeline

1. Open `FPL_Project_portable.ipynb` in VS Code or Jupyter
2. Run cells 1–7 in order
3. Cell 1: Sets up the environment and installs packages
4. Cell 3: Fetches/updates all data (run weekly)
5. Cell 4: Trains the model (run after significant data updates)
6. Cell 5: Generates predictions (run weekly before deadline)
7. Cell 6: Shows optimal squad (Wildcard mode)
8. Cell 7: Shows transfer recommendation (weekly mode)

---

## 15. Weekly Workflow

The intended usage cycle for each FPL gameweek:

```
Monday–Thursday (after previous GW finishes):
  1. Run Cell 3 (Weekly Update)
     ├── git pull on Vaastav's repo (gets latest results)
     ├── fetch_live_data.py (gets updated prices, injuries)
     └── merge_data.py (rebuilds training_dataset.csv)

  2. Run Cell 4 (Train Model) — optional, only if significant new data
     └── Retrains XGBoost on all available data

Friday (before GW deadline):
  3. Run Cell 5 (Generate Predictions)
     └── Uses live API + model to predict next GW points

  4. Run Cell 6 or 7 (Optimize)
     ├── Cell 6: Wildcard/Free Hit squad (if using chip)
     └── Cell 7: Best transfer for your team (normal weeks)

  5. Make transfers on the FPL website/app before the deadline
```

---

## 16. Configuration & Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `FPL_PROJECT_PATH` | `./FPL model` (relative to notebook) | Working directory for all scripts |
| `FPL_HISTORY_REPO` | `Fantasy-Premier-League` (inside project path) | Path to Vaastav's data repo clone |

### Notebook Cell 7 User Settings

| Variable | Default | Purpose |
|---|---|---|
| `my_current_team` | List of 15 player names | Your FPL team roster |
| `BANK` | `3.1` | Money in bank (£ millions) |
| `FREE_TRANSFERS` | `1` | How many FTs you have (1 or 2) |
| `TRANSFER_THRESHOLD` | `3.0` | Min point gain to justify a transfer |

### Notebook Cell 6 Configuration

| Variable | Default | Purpose |
|---|---|---|
| `BUDGET` | `1000` | Squad budget in £0.1m units (1000 = £100.0m) |

---

## 17. Known Limitations & Future Roadmap

### Current Limitations

1. **No double gameweek handling:** The model predicts a single gameweek. For DGW players (playing twice), predictions would need to be doubled manually.
2. **Defensive stats not integrated:** FBref defensive data has been scraped but not yet merged into the training/prediction pipeline.
3. **Static opponent difficulty:** Uses FPL's own FDR (1–5) which is fixed at the start of the season and may not reflect current form.
4. **No captain optimization:** The Solver picks 15 players but doesn't recommend a captain (double points).
5. **Training on all positions together:** GK, DEF, MID, FWD all share one model. Position-specific models might improve accuracy.
6. **UI uses mock data:** The React frontend is not yet connected to the Python backend.
7. **No chip strategy:** Bench Boost, Triple Captain, and Free Hit chip usage is not optimized.
8. **Single-GW optimization only:** The transfer recommender maximizes for 1 week, not multi-week horizons.

### Future Roadmap

- [ ] **Injury NLP:** Scrape press conference text to flag "75% chance" players more accurately
- [ ] **Multi-GW Optimization:** Optimize transfers for a 3–5 week horizon instead of just the next game
- [ ] **Automated Reports:** GitHub Actions to email the Friday report automatically
- [ ] **Captain Recommendation:** Add captain pick as a feature of the solver
- [ ] **DGW Awareness:** Automatically detect and weight double gameweek players
- [ ] **Defensive Feature Integration:** Merge FBref defensive actions into the training pipeline
- [ ] **Backend API:** Build a Python/FastAPI backend to serve predictions to the React UI
- [ ] **Position-Specific Models:** Train separate XGBoost models for each position

---

## 18. Credits & Licenses

### Data Sources

| Source | Credit |
|---|---|
| Historical FPL Data | [Vaastav Anand — Fantasy-Premier-League](https://github.com/vaastav/Fantasy-Premier-League) |
| Live Player Data | [Official Fantasy Premier League API](https://fantasy.premierleague.com/api/) |
| Defensive Stats | [FBref / Sports Reference](https://fbref.com/) |

### Project

- **Author:** Anmol Deshmukh
- **Repository:** [github.com/AnmolDeshmukh/FPL-AI-Assistant](https://github.com/AnmolDeshmukh/FPL-AI-Assistant)
- **Languages:** Python (9.8%), Jupyter Notebook (39.9%), TypeScript (47.7%), CSS (2.6%)
- **License:** Not explicitly specified in the repository

### Key Python Libraries

| Library | License | Purpose |
|---|---|---|
| pandas | BSD-3 | Data manipulation |
| XGBoost | Apache-2.0 | ML model |
| scikit-learn | BSD-3 | Evaluation metrics |
| PuLP | BSD | Linear programming |
| requests | Apache-2.0 | HTTP client |
| joblib | BSD-3 | Model serialization |
| soccerdata | Apache-2.0 | FBref scraping |

---

*This document was generated by analyzing the complete local workspace and the GitHub repository. It should be used as a reference for understanding, maintaining, and extending the FPL AI Assistant project.*
