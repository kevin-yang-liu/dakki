from pathlib import Path
from typing import Any, Dict, List

from fastapi import FastAPI
from pydantic import BaseModel

try:
    import lightgbm as lgb
except ImportError:
    lgb = None


MODEL_PATH = Path("models/prediction_model.txt")

app = FastAPI()


class PredictionRequest(BaseModel):
    fields: Dict[str, Any]
    relationships: List[Dict[str, Any]]


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _vectorize(payload: PredictionRequest) -> List[float]:
    fields = payload.fields or {}
    relationship_status = 1.0 if fields.get("relationshipStatus") == "yes" else 0.0
    interested = str(fields.get("interestedIn", "")).lower()
    interested_score = 0.0
    if "women" in interested or "woman" in interested:
        interested_score = 1.0
    elif "men" in interested or "man" in interested:
        interested_score = 2.0
    elif "nonbinary" in interested:
        interested_score = 3.0

    role_count = sum(len(rel.get("roles", [])) for rel in payload.relationships)
    rel_count = len(payload.relationships)

    partner_freq_len = len(str(fields.get("partnerFrequency", "")).strip())
    partner_goals_len = len(str(fields.get("partnerGoals", "")).strip())
    partner_low_len = len(str(fields.get("partnerLowEffort", "")).strip())

    return [
        _safe_float(fields.get("age")),
        _safe_float(fields.get("experienceYears")),
        _safe_float(fields.get("distance")),
        relationship_status,
        interested_score,
        float(rel_count),
        float(role_count),
        float(partner_freq_len),
        float(partner_goals_len),
        float(partner_low_len),
    ]


def _fallback_prediction(payload: PredictionRequest) -> str:
    interested = str(payload.fields.get("interestedIn", "")).lower()
    if "women" in interested or "woman" in interested:
        label = "a new woman"
    elif "men" in interested or "man" in interested:
        label = "a new man"
    elif "nonbinary" in interested:
        label = "a new nonbinary person"
    else:
        label = "a new partner"
    return (
        "Soft launch forecast: By the start of 2027, you're meeting "
        f"{label} who matches your energy and keeps things steady 🎉"
    )


@app.post("/predict")
def predict(request: PredictionRequest) -> Dict[str, str]:
    if lgb is None or not MODEL_PATH.exists():
        return {"prediction": _fallback_prediction(request)}

    vector = _vectorize(request)
    model = lgb.Booster(model_file=str(MODEL_PATH))
    prediction = model.predict([vector])[0]
    outcomes = [
        "rekindling with a past partner and going official",
        "meeting a new partner and taking it slow",
        "starting a serious relationship that feels effortless",
        "getting engaged after a low-key year",
        "keeping it casual but joyful",
    ]
    outcome = outcomes[int(prediction) % len(outcomes)]
    text = f"Big energy forecast: By the start of 2027, you're {outcome} 🎉"
    return {"prediction": text}
