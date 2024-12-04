from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[str] = None
    name: str
    surname: str
    correo: str
    password: Optional[str] = None
    autenticado: Optional[bool] = None