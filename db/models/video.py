from pydantic import BaseModel
from typing import Optional

class Banda(BaseModel):
    _id: Optional[str] = None
    id_usuario: str
    video1: Optional[float] = None
    video2: Optional[float] = None
    video3: Optional[float] = None
    video4: Optional[float] = None
    video5: Optional[float] = None