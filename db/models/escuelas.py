from pydantic import BaseModel
from typing import Optional

class Escuela(BaseModel):
    id: Optional[str] = None
    CCT: str
    nombre: str
    mision: str
    vision: str
    direccion: str