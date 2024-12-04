from pydantic import BaseModel
from typing import Optional

class Admin(BaseModel):
    id: Optional[str] = None
    name: str
    surname: str
    correo: str
    password: Optional[str] = None
    autenticado: Optional[bool] = False
