def carrera_schema(carreras) -> dict:
    return{
           "id": str(carreras["id"]),
           "nombre": carreras("nombre"),
           "video": carreras("video"),
           "C": carreras("C"),
           "K": carreras("K"),
           "H": carreras("H"),
           "CCTs": carreras("CCTs")}