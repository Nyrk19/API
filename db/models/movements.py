from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Movements(BaseModel):
    id: Optional[str] = None
    admin_id: str
    user_id: str
    movement: str
    movement_time: Optional[datetime] = None