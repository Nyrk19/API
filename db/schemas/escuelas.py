def escuela_schema(escuelas) -> dict:
    return{
           "id": str(escuelas["id"]),
           "CCT": escuelas("CCT"),
           "nombre": escuelas("nombre"),
           "mision": escuelas("mision"),
           "vision": escuelas("vision"),
           "direccion": escuelas("direccion")}