def admin_schema(admin) -> dict:
    return {
        "id": str(admin["_id"]),
        "name": admin["name"],
        "surname": admin["surname"],
        "correo": admin["correo"],
        "password": admin["password"],
        "autenticado": admin.get("autenticado", False)
    }

def admins_schema(admins) -> list:
    return [admin_schema(admin) for admin in admins]
