from fastapi import APIRouter
from fastapi import Request
from db.models.banda import Banda
from db.schemas.banda import banda_schema
from db.models.user import User
from db.schemas.user import user_schema
from db.client import db_client
from datetime import datetime, timedelta
from sklearn.svm import SVC

router = APIRouter(prefix="/banda")

def search_banda(field: str, key):
    try:
        banda = db_client.banda.find_one({field: key})
        return Banda(**banda_schema(banda))
    except:
        return False

@router.post("/")
async def create_banda(banda: Banda):
    if type(search_banda("id_usuario", banda.id_usuario)) == Banda:
        return {"error": "El usuario tiene base de banda registrada"}
    
    banda_dict = dict(banda)
    banda_dict.pop("id", None)
    db_client.banda.insert_one(banda_dict).inserted_id
    
    return {"exito": "Base de banda registrada"}

@router.get("/")
async def get_status(request: Request):
    req_data = await request.json()
    usuario = req_data.get("user")
    result = search_banda("id_usuario", usuario)
    if type(result) == Banda:
        return {"exito": result.status}
    return{"error": "No se encontro el registro"}
        
@router.put("/")
async def submit_data(request: Request):
    req_data = await request.json()
    usuario = req_data.get("user")
    result = search_banda("id_usuario", usuario)
    if type(result) == Banda:
        result.delta = req_data.get("delta", [])
        result.theta = req_data.get("theta", [])
        result.lowAlpha = req_data.get("lowAlpha", [])
        result.highAlpha = req_data.get("highAlpha", [])
        result.lowBeta = req_data.get("lowBeta", [])
        result.highBeta = req_data.get("highBeta", [])
        result.lowGamma = req_data.get("lowGamma", [])
        result.highGamma = req_data.get("highGamma", [])
        result.times = req_data.get("times", [])
        
        db_client.banda.update_one(
            {"id_usuario": usuario},
            {"$set": {
                "delta": result.delta,
                "theta": result.theta,
                "lowAlpha": result.lowAlpha,
                "highAlpha": result.highAlpha,
                "lowBeta": result.lowBeta,
                "highBeta": result.highBeta,
                "lowGamma": result.lowGamma,
                "highGamma": result.highGamma,
                "times": result.times,
                "status": False
            }}
        )
        
        return {"exito": "Datos de la banda actualizados"}
    return{"error": "No se encontro el registro"}

@router.put("/svmTest")
async def svm_test(request: Request):
    req_data = await request.json()
    correo = req_data.get("email")
    user = User(**user_schema(db_client.users.find_one({"correo": correo})))
    id = user.id
    result = search_banda("id_usuario", id)
    if type(result) == Banda:
        db_client.banda.update_one({"id_usuario": id}, {"$set": {"status": False}})
        tiempos_banda = result.times
        verdades = []
        
        #CHASIDE
        if req_data.get("test") == "C":
            testC = db_client.answersC.find_one({"user_email": correo})
            tiempos = [f"res{i}_time" for i in range(1, 99)]
            for tiempo in tiempos:
                tiempo_test = testC.get(tiempo)
                if type(tiempo_test) == str:
                    if '+' in tiempo_test or '-' in tiempo_test[-6:]:
                        tiempo_test = datetime.strptime(tiempo_test, "%Y-%m-%dT%H:%M:%S.%f%z")
                        tiempo_test = tiempo_test.replace(tzinfo=None)
                    else:
                        tiempo_test = datetime.strptime(tiempo_test, "%Y-%m-%dT%H:%M:%S.%f")
                for i, banda_time in enumerate(tiempos_banda):
                    if abs((tiempo_test - banda_time).total_seconds()) < 1:
                        valores_banda = {
                                "delta": result.delta[i],
                                "theta": result.theta[i],
                                "lowAlpha": result.lowAlpha[i],
                                "highAlpha": result.highAlpha[i],
                                "lowBeta": result.lowBeta[i],
                                "highBeta": result.highBeta[i],
                                "lowGamma": result.lowGamma[i],
                                "highGamma": result.highGamma[i],
                            }
                        
                        '''Aqui va el procesamieto de datos'''

                        model = SVC()
                        model.load('modelo_svm_atencion.pkl')
                        # Convertir el diccionario en un array NumPy (ajusta los nombres de las claves según tu modelo)
                        X = np.array([valores_banda['delta'], valores_banda['theta'], ...])
                        # Realizar la predicción
                        verdad = model.predict(X)  # Asegúrate de que la forma sea compatible con el modelo

                        #verdad = 0 #Resultado de la SVM
                        verdades.append(verdad)
                        break
                    else:
                        verdades.append(1)

            for i, ver in enumerate(verdades):
                campo = f"res{i + 1}"
                if ver == 0:
                    data = db_client.answersC.find_one({"user_email": correo})
                    valor = data.get(campo)
                    valor = not valor
                    db_client.answersC.update_one({"user_email": correo},{"$set": {campo: valor}})
            
        #KUDER   
        if req_data.get("test") == "K":
            testK = db_client.answersK.find_one({"user_email": correo})
            tiempos = [f"res{i}_time" for i in range(1, 99)]
            for tiempo in tiempos:
                tiempo_test = testK.get(tiempo)
                if type(tiempo_test) == str:
                    tiempo_test = datetime.strptime(tiempo_test, "%Y-%m-%dT%H:%M:%S.%fZ")
                for i, banda_time in enumerate(tiempos_banda):
                    if abs((tiempo_test - banda_time).total_seconds()) < 1:
                        valores_banda = {
                                "delta": result.delta[i],
                                "theta": result.theta[i],
                                "lowAlpha": result.lowAlpha[i],
                                "highAlpha": result.highAlpha[i],
                                "lowBeta": result.lowBeta[i],
                                "highBeta": result.highBeta[i],
                                "lowGamma": result.lowGamma[i],
                                "highGamma": result.highGamma[i],
                            }
                        '''Aqui va el procesamieto de datos'''
                        verdad = 0 #Resultado de la SVM
                        verdades.append(verdad)
                        break
                    
            j = 1
            for i, ver in enumerate(verdades):
                if ver == 0:
                    if i % 2 == 0:
                        campo = f"res{j + 1}_1"
                    else:
                        campo = f"res{j + 1}_2"
                        j += 1
                    valor = " "
                    db_client.answersK.update_one({"user_email": correo},{"$set": {campo: valor}})

        #HOLLAND
        if req_data.get("test") == "H":
            testH = db_client.answersH.find_one({"user_email": correo})
            tiempos = [f"res{i}_time" for i in range(1, 99)]
            for tiempo in tiempos:
                tiempo_test = testH.get(tiempo)
                if type(tiempo_test) == str:
                    tiempo_test = datetime.strptime(tiempo_test, "%Y-%m-%dT%H:%M:%S.%fZ")
                for i, banda_time in enumerate(tiempos_banda):
                    if abs((tiempo_test - banda_time).total_seconds()) < 1:
                        valores_banda = {
                                "delta": result.delta[i],
                                "theta": result.theta[i],
                                "lowAlpha": result.lowAlpha[i],
                                "highAlpha": result.highAlpha[i],
                                "lowBeta": result.lowBeta[i],
                                "highBeta": result.highBeta[i],
                                "lowGamma": result.lowGamma[i],
                                "highGamma": result.highGamma[i],
                            }
                        '''Aqui va el procesamieto de datos'''
                        verdad = 0 #Resultado de la SVM
                        verdades.append(verdad)
                        break
                    
            for i, ver in enumerate(verdades):
                campo = f"res{i + 1}"
                if ver == 0:
                    data = db_client.answersH.find_one({"user_email": correo})
                    if type(data) == bool:
                        valor = data.get(campo)
                        valor = not valor
                    else:
                        valor = " "
                    db_client.answersH.update_one({"user_email": correo},{"$set": {campo: valor}})
        
        return {"exito": "Respuestas procesadas"}
    return{"error": "Documento no encontrado"}
                
@router.put("/svmVideo")
async def svm_video(request: Request):
    req_data = await request.json()
    correo = req_data.get("email")
    hora_exacta = req_data.get("horaExacta")
    hora_exacta = datetime.fromisoformat(hora_exacta)
    hora_exacta = hora_exacta.replace(tzinfo=None)
    user = User(**user_schema(db_client.users.find_one({"correo": correo})))
    id = user.id
    result = search_banda("id_usuario", id)
    if type(result) == Banda:
        tiempos_banda = result.times
        video = db_client.video.find_one({"id_usuario": id})
        tiempos = [f"video{i}" for i in range(1, 6)]
        videos = []
        for j, tiempo in enumerate(tiempos):
            tiempo_video = video.get(tiempo)
            atencion_video = []
            hora_anterior = hora_exacta
            hora_exacta += timedelta(seconds=tiempo_video)
            for i, banda_time in enumerate(tiempos_banda):
                if ((hora_exacta - banda_time).total_seconds() >= 0) and ((hora_anterior - banda_time).total_seconds() < 0):
                    valores_banda = {
                            "delta": result.delta[i],
                            "theta": result.theta[i],
                            "lowAlpha": result.lowAlpha[i],
                            "highAlpha": result.highAlpha[i],
                            "lowBeta": result.lowBeta[i],
                            "highBeta": result.highBeta[i],
                            "lowGamma": result.lowGamma[i],
                            "highGamma": result.highGamma[i],
                        }
                    '''Aqui va el procesamieto de datos
                    en la lista videos se guardará el resultado de la SVM y el video en el que esta
                    si esta atento se guarda 1 y si no se guarda 0'''
                    
                    modelAtencion = SVC()
                    modelAtencion.load('modelo_svm_atencion.pkl')
                    
                    # Convertir el diccionario en un array NumPy (ajusta los nombres de las claves según tu modelo)
                    XA = np.array([valores_banda['delta'], valores_banda['theta'], ...])
                    # Realizar la predicción
                    atencion = model.predict(XA) 
                    
                    atencion = 0 #Resultado de la SVM
                    atencion_video.append(atencion)
            videos.append({"video_id": j, "atencion": atencion_video})
        
        for video in videos:
            video_id = video["video_id"]
            atenciones = video["atencion"]
            if len(atenciones) > 0:
                atencion_promedio = (sum(atenciones) / len(atenciones))
            else: 
                atencion_promedio = 0
            campo = f"val_carrera{video_id + 1}"
            data = db_client.results.find_one({"id_usuario": id})
            valor = data.get(campo)
            valor = valor * (1 + atencion_promedio)
            db_client.results.update_one({"id_usuario": id},{"$set": {campo: valor}})
        
        return {"exito": "Resultados actualizados"}
    return{"error": "Documento no encontrado"}

@router.delete("/")
async def delete_banda(request: Request):
    req_data = await request.json()
    usuario = req_data.get("user")
    
    if type(search_banda("id_usuario", usuario)) == Banda:
        db_client.banda.delete_one({"id_usuario": usuario})
        return {"exito": "Registros de banda eliminados"}
    
    return {"error": "No se encontró el registro"}