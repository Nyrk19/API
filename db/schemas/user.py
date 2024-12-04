def user_schema(user) -> dict:
    return{"id": str(user["_id"]),
           "name": user["name"],
           "surname": user["surname"],
           "correo": user["correo"],
           "password": user["password"],
           "autenticado": user["autenticado"]}

def users_schema(users) -> list:
    return [user_schema(user) for user in users]