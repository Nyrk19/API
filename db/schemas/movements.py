def movements_schema(movements) -> dict:
    return{"id": str(movements["_id"]),
           "admin_id": movements["admin_id"],
           "user_id": movements["user_id"],
           "movement": movements["code"],
           "movement_time": movements["expiration_time"]}