from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Codes(BaseModel):
    id: Optional[str] = None
    user_id: str
    code: int
    expiration_time: Optional[datetime] = None