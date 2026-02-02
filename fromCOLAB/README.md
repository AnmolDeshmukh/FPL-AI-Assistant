# 🦁 FPL AI Assistant (2025/26 Season)

**A Machine Learning pipeline that predicts Fantasy Premier League (FPL) points and mathematically optimizes squad selection.**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![XGBoost](https://img.shields.io/badge/Model-XGBoost-orange)
![PuLP](https://img.shields.io/badge/Optimization-Linear%20Programming-green)
![Status](https://img.shields.io/badge/Status-Active-success)

## 📖 Overview

This project is an end-to-end AI system designed to solve the Fantasy Premier League game. Unlike simple "form-based" predictors, this model uses a **Two-Stage Architecture**:

1.  **The Oracle (Prediction Engine):** A trained **XGBoost Regressor** that predicts how many points every player will score in the next Gameweek. It learns from historical data, including player form, recent minutes, and specific history against opponents (e.g., "Salah vs. Man City").
2.  **The Solver (Optimization Engine):** A **Linear Programming** model (using `PuLP`) that takes those predictions and finds the mathematically optimal 15-player squad or transfer combination while respecting budget (£100m) and team constraints.

## 🚀 Key Features

* **🤖 Smart Forecasting:** Uses lag features (last 3 games) and rolling averages to detect form.
* **🧠 "Memory" Logic:** V2 Update includes specific "Player vs. Opponent" history to identify players who overperform in big games.
* **💰 Squad Optimization:** Solves the "Knapsack Problem" to build the perfect Wildcard team.
* **🔄 Transfer Recommender:** Analyzes your specific team to recommend the single best 1-for-1 transfer, considering your bank balance and avoiding "sideways" moves (Threshold logic).
* **⚡ Automated Pipeline:** Scripts to fetch live data from the FPL API and merge it with historical datasets instantly.

## 📂 Project Structure

```text
fromCOLAB/
├── FPL_Project_portable.ipynb   # 🧠 Main notebook (cells 1–7) with relative paths
├── README.md
├── FPL model/                   # Working directory used by the notebook
│   ├── fetch_live_data.py       # Script: Scrapes live prices/injuries from FPL API
│   ├── merge_data.py            # Script: Merges history + live data for training
│   ├── data/                    # Generated CSVs (training + predictions) [ignored]
│   ├── Fantasy-Premier-League/  # (External) Vaastav Anand's historical data repo [ignored]
│   ├── fpl_model_v2.pkl         # Saved XGBoost model (generated after training)
│   └── predictions.csv          # Latest output predictions for next GW
```

🛠️ **Installation & Setup**

1. **Clone the Repository**

```bash
git clone [https://github.com/AnmolDeshmukh/FPL-AI-Assistant.git](https://github.com/AnmolDeshmukh/FPL-AI-Assistant.git)
cd FPL-AI-Assistant
```

2. **Install Dependencies**

You will need Python installed. Install the required libraries:

```bash
pip install pandas xgboost scikit-learn joblib requests pulp soccerdata
```

3. **Initialize Data**

The project relies on historical data from the FPL community. You need to clone the external data repository into your project folder:

```bash
git clone [https://github.com/vaastav/Fantasy-Premier-League.git](https://github.com/vaastav/Fantasy-Premier-League.git)
```

🖥️ **How to Use**

The pipeline is controlled via the Jupyter Notebook `FPL_Project_portable.ipynb` (kept to cells 1–7).

**Notebook path variables**

- `FPL_PROJECT_PATH` (optional): where the notebook should `cd` before running scripts. Defaults to `./FPL model` relative to the notebook.
- `FPL_HISTORY_REPO` (optional): path or folder name of Vaastav's data clone. Defaults to `Fantasy-Premier-League` inside `FPL_PROJECT_PATH`.

**Step 1: Update Data**

- Run the Weekly Update cell. This executes `fetch_live_data.py` and `merge_data.py` to:
  - Pull the latest match results from the external repo.
  - Fetch real-time prices and injury news from the Official FPL API.
  - Regenerate the master `training_dataset.csv`.

**Step 2: Train the Model**

- Run the Training cell. This trains the XGBoost model on 5+ seasons of data (approx. 100k+ rows).
- Metric: Mean Absolute Error (MAE) ~0.6 pts.
- Output: Saves `fpl_model_v2.pkl`.

**Step 3: Generate Predictions**

- Run the Prediction cell. It fetches next week's fixtures (difficulty ratings) and feeds them into the model to generate `predictions.csv`.

**Step 4: Optimize**

- Wildcard Mode: Run the Solver cell to see the best possible 15-player squad from scratch.
- Transfer Mode: Input your current team list (e.g., ['Haaland', 'Saka', ...]) and your bank balance. The AI will calculate the mathematically best transfer (Sell X -> Buy Y) to maximize projected points.
📊 **Technical Approach**

### Feature Engineering

The model does not just look at "total points." It constructs complex features for every player-match instance:

- `form_last_3`: Rolling average of points in the last 3 games.
- `minutes_last_3`: Crucial for filtering out rotation risks.
- `avg_points_vs_opponent`: (V2 Feature) The player's historical average against the specific team they are about to play.
- `opponent_difficulty`: 1-5 rating of the opposing defense.

### Optimization Logic

The "Solver" uses Linear Programming to maximize:

$$ \sum (\text{Player}_i \times \text{Predicted Points}_i) $$

Subject to:

- $$\sum \text{Cost}_i \le \text{Budget}$$
- $$\sum \text{Players} = 15$$
- Positions: 2 GK, 5 DEF, 5 MID, 3 FWD
- Max 3 players per team.

🔮 **Future Roadmap**

- [ ] Injury NLP: Scrape press conference text to flag "75% chance" players more accurately.
- [ ] Multi-GW Optimization: Optimize transfers for a 3-5 week horizon instead of just the next game.
- [ ] Automated Reports: Set up GitHub Actions to email the Friday report automatically.

🤝 **Credits**

- Historical Data: [Vaastav Anand's FPL Repository](https://github.com/vaastav/Fantasy-Premier-League)
- Live Data: Official Fantasy Premier League API
