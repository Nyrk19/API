def banda_schema(banda) -> dict:
    return{
        "_id": str(banda["_id"]),
        "id_usuario": banda["id_usuario"],
        "delta": banda["delta"],
        "theta": banda["theta"],
        "lowAlpha": banda["lowAlpha"],
        "highAlpha": banda["highAlpha"],
        "lowBeta": banda["lowBeta"],
        "highBeta": banda["highBeta"],
        "lowGamma": banda["lowGamma"],
        "highGamma": banda["highGamma"],
        "times": banda["times"],
        "status": banda["status"]}