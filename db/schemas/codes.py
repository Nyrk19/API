def codes_schema(codes) -> dict:
    return{"id": str(codes["_id"]),
           "user_id": codes["user_id"],
           "code": codes["code"],
           "expiration_time": codes["expiration_time"]}