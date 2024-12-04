from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Banda(BaseModel):
    _id: Optional[str] = None
    id_usuario: str
    delta: List[float]
    theta: List[float]
    lowAlpha: List[float]
    highAlpha: List[float]
    lowBeta: List[float]
    highBeta: List[float]
    lowGamma: List[float]
    highGamma: List[float]
    times: List[datetime]
    status: Optional[bool] = None