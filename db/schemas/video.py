def video_schema(video) -> dict:
    return{
        "_id": str(video["_id"]),
        "id_usuario": video["id_usuario"],
        "video1": video["video1"],
        "video2": video["video2"],
        "video3": video["video3"],
        "video4": video["video4"],
        "video5": video["video5"]}