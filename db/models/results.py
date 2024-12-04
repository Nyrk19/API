from pydantic import BaseModel
from typing import Optional

class Result(BaseModel):
    id: Optional[str] = None
    id_usuario: Optional[str] = None
    In1: str
    In2: str
    In3: str
    In4: str
    In5: str
    In6: str
    In7: str
    Ha1: str
    Ha2: str
    Ha3: str
    Ha4: str
    Ha5: str
    Ha6: str
    Ha7: str
    D1: str
    D2: str
    D3: str
    D4: str
    D5: str
    D6: str
    EI1: str
    EI2: str
    EI3: str
    EI4: str
    EI5: str
    EI6: str
    EI7: str
    EI8: str
    EI9: str
    EI10: str
    id_carrera1: str
    id_carrera2: str
    id_carrera3: str
    id_carrera4: str
    id_carrera5: str
    id_carrera6: str
    id_carrera7: str
    id_carrera8: str 
    val_carrera1: float
    val_carrera2: float
    val_carrera3: float
    val_carrera4: float
    val_carrera5: float
    val_carrera6: float
    val_carrera7: float
    val_carrera8: float
    Actividad: Optional[bool] = None