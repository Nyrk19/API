import os
import matplotlib.pyplot as plt
import math
from fastapi import APIRouter, BackgroundTasks, Request
from db.models.results import Result
from db.schemas.results import result_schema
from db.models.user import User
from db.schemas.user import user_schema
from db.client import db_client
from bson import ObjectId
from moviepy.editor import VideoFileClip, concatenate_videoclips

router = APIRouter(prefix="/resultados")

def procesar_video(correo: str, directorio: str, db_client):
    try:
        # Buscar usuario y resultados
        user = search_user("correo", correo)
        idUsuario = user.id
        resultados = calculated_result("id_usuario", idUsuario)

        if not resultados:
            raise Exception("No se encontraron resultados para este usuario")

        # Verificar si ya existe el video
        video_path = os.path.join(directorio, f"{idUsuario}.mp4")
        if os.path.exists(video_path):
            return {"exito": f"{idUsuario}.mp4", "estado": resultados.Actividad}

        # Recopilar los videos de las carreras
        videos = []
        for i in range(1, 6):
            id_key = f"id_carrera{i}"
            carrera_id = getattr(resultados, id_key, None)
            if carrera_id:
                carrera = db_client.carreras.find_one({"_id": ObjectId(carrera_id)})
                video = carrera.get("video", " ")
                video += '.mp4'
                num = str(i) + ".mp4"
                videos.append(num)
                videos.append(video)

        clips = []
        videos_tiempo = [] 
        db_client.banda.update_one({"id_usuario": idUsuario}, {"$set": {"status": True}})
        
        for i, video in enumerate(videos):
            video_path = os.path.join(directorio, video)
            if not os.path.exists(video_path):
                raise Exception(f"El archivo de video {video} no se encuentra.")
            clip = VideoFileClip(video_path)
            if i % 2 == 1:
                segundos = clip.duration + 3
                videos_tiempo.append(segundos)
            clips.append(clip)

        # Almacenar la información de los videos
        videos_data = {
            "id_usuario": idUsuario,
            "video1": videos_tiempo[0],
            "video2": videos_tiempo[1],
            "video3": videos_tiempo[2],
            "video4": videos_tiempo[3],
            "video5": videos_tiempo[4]
        }

        db_client.video.insert_one(videos_data)

        # Concatenar los videos
        final_video = concatenate_videoclips(clips)
        output_path = os.path.join(directorio, f"{idUsuario}.mp4")
        final_video.write_videofile(output_path, codec="libx264", threads=4, preset='ultrafast')

        return {"exito": f"{idUsuario}.mp4"}

    except Exception as e:
        return {"error": f"Ocurrió un error: {str(e)}"}

def search_user(field: str, key):
    try:
        user = db_client.users.find_one({field: key})
        return User(**user_schema(user))
    except:
        return False
    
def search_result(field: str, key):
    try:
        result = db_client.results.find_one({field: key})
        if(result == None):
            return False
        return True
    except:
        return False
    
def calculated_result(field: str, key):
    try:
        result = db_client.results.find_one({field: key})
        return Result(**result_schema(result))
    except:
        return False

@router.get("/calculos")
async def validate_results(correo: str):
    user = search_user("correo", correo)
    idUsuario = user.id
    consultaResult = search_result("id_usuario", idUsuario)
    if consultaResult:
        return {"exito": "El usuario ya tiene base de resultados"}
    return {"error": "El usuario aun no cuenta con resultados"}

@router.get("/")
async def get_results(correo: str):
    user = search_user("correo", correo)
    idUsuario = user.id
    result = calculated_result("id_usuario", idUsuario)
    if not result:
        return {"error": "No se encontro el usuario"}
    return {"exito": result}

@router.get("/info")
async def get_info(correo: str):
    user = search_user("correo", correo)
    idUsuario = user.id
    result = calculated_result("id_usuario", idUsuario)
    if not result:
        return {"error": "No se encontro el usuario"}
    carrera_ids = [
        result.id_carrera1,
        result.id_carrera2,
        result.id_carrera3,
        result.id_carrera4,
        result.id_carrera5,
        result.id_carrera6,
        result.id_carrera7,
        result.id_carrera8
    ]
    carreras_info = []
    for carrera_id in carrera_ids:
        carrera = db_client.carreras.find_one({"_id": ObjectId(carrera_id)})
        if carrera:
            escuela_info = []
            for cct in carrera.get("CCTs", []):
                escuela = db_client.escuelas.find_one({"CCT": cct})
                if escuela:
                    escuela_info.append({
                        "nombre": escuela.get("nombre"),
                        "mision": escuela.get("mision"),
                        "vision": escuela.get("vision"),
                        "direccion": escuela.get("direccion"),
                    })
            carreras_info.append({
                "nombre": carrera.get("nombre"),
                "objetivo": carrera.get("objetivo"),
                "perfilIngreso": carrera.get("perfilIngreso"),
                "perfilEgreso": carrera.get("perfilEgreso"),
                "escuelas": escuela_info
            })
        
    res_test = [
        result.In1,
        result.Ha1,
        result.D1,
        result.D2,
        result.EI1,
        result.EI2,
    ]
    descripciones = []
    i = 1
    valor = ""
    for resT in res_test:
        if resT[1] in ['I', 'A']:
            info = db_client.descripciones.find_one({"valor": resT[0]})
        else:
            info = db_client.descripciones.find_one({"valor": resT})
        des = info.get("Descripcion")
        if valor != des:
            descripciones.append({
                "test": info.get("test")+str(i),
                "descripcion": info.get("Descripcion"),
            })
            valor = des
        if i == 2:
            i = 1
        else:
            i = 2
    return {"exito": carreras_info, "descripciones": descripciones}
    
@router.put("/video")
async def set_video(correo: str, background_tasks: BackgroundTasks):
    directorio = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'static', 'Videos')
    directorio = os.path.normpath(directorio)
    background_tasks.add_task(procesar_video, correo, directorio, db_client)

@router.post("/")
async def create_results(result: Result):
    user = search_user("correo", result.id_usuario)
    idUsuario = user.id
    consultaResult = search_result("id_usuario", idUsuario)
    
    if consultaResult:
        return {"error": "El usuario ya tiene base de resultados"}
    
    directorio = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'static', 'Imagenes_Resultados')
    directorio = os.path.normpath(directorio)
    carreras = list(db_client.carreras.find())
    IA = [(i / 28) * 10 for i in range(7, 0, -1)]
    D = [(i / 21) * 10 for i in range(6, 0, -1)]
    EI = [(i / 55) * 10 for i in range(10, 0, -1)]
    I1, I2, I3, I4, I5, I6, I7 = IA
    A1, A2, A3, A4, A5, A6, A7 = IA
    D1, D2, D3, D4, D5, D6 = D
    EI1, EI2, EI3, EI4, EI5, EI6, EI7, EI8, EI9, EI10 = EI
    chasideI = [
        (result.In1, I1),
        (result.In2, I2),
        (result.In3, I3),
        (result.In4, I4),
        (result.In5, I5),
        (result.In6, I6),
        (result.In7, I7),
    ]
    chasideH = [
        (result.Ha1, A1),
        (result.Ha2, A2),
        (result.Ha3, A3),
        (result.Ha4, A4),
        (result.Ha5, A5),
        (result.Ha6, A6),
        (result.Ha7, A7)
    ]
    holland = [
        (result.D1, D1),
        (result.D2, D2),
        (result.D3, D3),
        (result.D4, D4),
        (result.D5, D5),
        (result.D6, D6),
    ]
    kudder = [
        (result.EI1, EI1),
        (result.EI2, EI2),
        (result.EI3, EI3),
        (result.EI4, EI4),
        (result.EI5, EI5),
        (result.EI6, EI6),
        (result.EI7, EI7),
        (result.EI8, EI8),
        (result.EI9, EI9),
        (result.EI10, EI10)
    ]
    
    #Imagen de Chaside
    chaside = []
    for c in chasideI:
        for c2 in chasideH:
            if c[0][0]== c2[0][0]:
                suma = c[1] + c2[1]
                chaside.append((c[0][0], suma))
    orden = ["C", "H", "A", "S", "I", "D", "E"]
    descripciones = {
        "C": "Área administrativa",
        "H": "Área de humanidades y ciencias sociales jurídicas",
        "A": "Área artística",
        "S": "Área de ciencias de la salud",
        "I": "Área de enseñanzas técnicas",
        "D": "Área de defensa y seguridad",
        "E": "Área de ciencias experimentales"
    }
    chaside = sorted(chaside, key=lambda x: orden.index(x[0]))
    letras = [x[0] for x in chaside]
    valores = [x[1] for x in chaside]
    categories = letras
    num_categories = len(categories)
    angles = [(2 * math.pi * i / num_categories) for i in range(num_categories)]
    valores.append(valores[0])
    angles.append(angles[0])
    fig, ax = plt.subplots(figsize=(6, 7), subplot_kw=dict(polar=True))
    ax.plot(angles, valores, linewidth=2, linestyle='solid', color='blue')
    ax.fill(angles, valores, color='blue', alpha=0.25)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)
    plt.title("Resultados Chaside", size=16)
    descripcion_texto = "\n".join([f"{letra}: {descripciones[letra]}" for letra in letras])
    plt.figtext(0.5, -0.1, descripcion_texto, wrap=True, horizontalalignment='center', fontsize=13)
    output_path = os.path.join(directorio, f"C{idUsuario}.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    
    #Imagen de Holland
    orden = ["D1", "D2", "D3", "D4", "D5", "D6"]
    descripciones = {
        "D1": "Realista",
        "D2": "Investigador",
        "D3": "Social",
        "D4": "Convencional",
        "D5": "Emprendedor",
        "D6": "Artistico"
    }
    holland = sorted(holland, key=lambda x: orden.index(x[0]))
    categories = [x[0] for x in holland]
    valores = [x[1] for x in holland]
    num_categories = len(categories)
    angles = [(2 * math.pi * i / num_categories) for i in range(num_categories)]
    valores.append(valores[0])
    angles.append(angles[0])
    fig, ax = plt.subplots(figsize=(6, 7), subplot_kw=dict(polar=True))
    ax.plot(angles, valores, linewidth=2, linestyle='solid', color='blue')
    ax.fill(angles, valores, color='blue', alpha=0.25)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)
    plt.title("Resultados Holland", size=16)
    descripcion_texto = "\n".join([f"{category}: {descripciones[category]}" for category in categories])
    plt.figtext(0.5, -0.1, descripcion_texto, wrap=True, horizontalalignment='center', fontsize=13)
    output_path = os.path.join(directorio, f"H{idUsuario}.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    
    #Imagen de Kudder
    orden = ["P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"]
    descripciones = {
        "P0": "Aire libre",
        "P1": "Mecanica",
        "P2": "Numerica - Cálculo",
        "P3": "Cientifica",
        "P4": "Persuasivo",
        "P5": "Artistico",
        "P6": "Literario",
        "P7": "Musical",
        "P8": "Social",
        "P9": "Oficina",
    }
    kudder = sorted(kudder, key=lambda x: orden.index(x[0]))
    categories = [x[0] for x in kudder]
    valores = [x[1] for x in kudder]
    num_categories = len(categories)
    angles = [(2 * math.pi * i / num_categories) for i in range(num_categories)]
    valores.append(valores[0])
    angles.append(angles[0])
    fig, ax = plt.subplots(figsize=(6, 8), subplot_kw=dict(polar=True))
    ax.plot(angles, valores, linewidth=2, linestyle='solid', color='blue')
    ax.fill(angles, valores, color='blue', alpha=0.25)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)
    plt.title("Resultados Kudder", size=16)
    descripcion_texto = "\n".join([f"{category}: {descripciones[category]}" for category in categories])
    plt.figtext(0.5, -0.1, descripcion_texto, wrap=True, horizontalalignment='center', fontsize=13)
    output_path = os.path.join(directorio, f"K{idUsuario}.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
        
    valores =[
        (result.In1, I1),
        (result.In2, I2),
        (result.In3, I3),
        (result.In4, I4),
        (result.In5, I5),
        (result.In6, I6),
        (result.In7, I7),
        (result.Ha1, A1),
        (result.Ha2, A2),
        (result.Ha3, A3),
        (result.Ha4, A4),
        (result.Ha5, A5),
        (result.Ha6, A6),
        (result.Ha7, A7),
        (result.D1, D1),
        (result.D2, D2),
        (result.D3, D3),
        (result.D4, D4),
        (result.D5, D5),
        (result.D6, D6),
        (result.EI1, EI1),
        (result.EI2, EI2),
        (result.EI3, EI3),
        (result.EI4, EI4),
        (result.EI5, EI5),
        (result.EI6, EI6),
        (result.EI7, EI7),
        (result.EI8, EI8),
        (result.EI9, EI9),
        (result.EI10, EI10)
    ]
    listCarreras = []
    for carrera in carreras:
        puntaje = 0
        id = str(carrera.get("_id", "Campo no encontrado"))
        val_C = carrera.get("C", [])
        cant_C = len(val_C)
        for elemC in val_C:
            for val in valores:
                primer = val[0]
                if primer[0] in elemC:
                    puntaje += (val[1] / cant_C)
        val_K = carrera.get("K", [])
        cant_K = len(val_K)
        for elemK in val_K:
            for val in valores:
                primer = val[0]
                if primer in elemK:
                    puntaje += (val[1] / cant_K)
        val_H = carrera.get("H", [])
        cant_H = len(val_H)
        for elemH in val_H:
            for val in valores:
                primer = val[0]
                if primer in elemH:
                    puntaje += (val[1] / cant_H)
        listCarreras.append((id, puntaje))
    
    listCarreras.sort(key=lambda x: x[1], reverse=True)
    
    result_dict = dict(result)
    
    for i in range(8):
        result_dict[f"id_carrera{i+1}"] = listCarreras[i][0]
        result_dict[f"val_carrera{i+1}"] = listCarreras[i][1]
        
    result_dict["id_usuario"] = idUsuario
    result_dict.pop("id", None)
    
    db_client.results.insert_one(result_dict)
    return {"exito": "Resultados guardados"}

@router.put("/")
async def update_resultados(correo: str):
    user = search_user("correo", correo)
    idUsuario = user.id
    resultados = calculated_result("id_usuario", idUsuario)
    if not resultados:
        return {"error": "No se encontraron resultados para este usuario"}

    try:
        db_client.results.update_one({"_id": ObjectId(resultados.id)},{"$set": {"Actividad": True}})
        db_client.banda.update_one({"id_usuario": idUsuario}, {"$set": {"status": False}})
    except:
        return {"error": "No se actualizo el estatus de actividad"}
    
    return {"exito": "Se registro la actividad"}