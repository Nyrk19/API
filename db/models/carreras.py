from pydantic import BaseModel
from typing import List, Optional

class Carrera(BaseModel):
    id: Optional[str] = None
    nombre: str
    video: str
    C: List[str]
    K: List[str]
    H: List[str]
    CCTs: List[str]