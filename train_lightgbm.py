import csv
from pathlib import Path
from typing import List

import lightgbm as lgb


MODEL_PATH = Path("models/prediction_model.txt")


def load_csv(path: Path) -> List[List[float]]:
    with path.open(newline="") as file:
        reader = csv.reader(file)
        header = next(reader)
        rows = []
        for row in reader:
            rows.append([float(value) for value in row])
        return rows, header


def main() -> None:
    data_path = Path("training_data.csv")
    if not data_path.exists():
        raise SystemExit("training_data.csv not found.")

    rows, header = load_csv(data_path)
    features = [row[:-1] for row in rows]
    labels = [row[-1] for row in rows]

    dataset = lgb.Dataset(features, label=labels)
    params = {
        "objective": "multiclass",
        "num_class": 5,
        "learning_rate": 0.1,
        "num_leaves": 31,
        "min_data_in_leaf": 10,
    }
    model = lgb.train(params, dataset, num_boost_round=100)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    model.save_model(str(MODEL_PATH))
    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    main()
