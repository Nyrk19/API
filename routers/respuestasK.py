from fastapi import APIRouter
from fastapi import Request
from db.models.answersK import AnswersK
from db.schemas.answersK import answersK_schema
from db.models.questionsK import QuestionsK
from db.schemas.questionsK import questionsK_schema
from db.client import db_client
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/answersK")

def search_answers(field: str, key):
    try:
        answer = db_client.answersK.find_one({field: key})
        return AnswersK(**answersK_schema(answer))
    except:
        return False
    
def get_questions():
    try:
        question = db_client.questionsK.find_one({"_id": ObjectId("66f321f9d80edfe51c15906d")})
        return QuestionsK(**questionsK_schema(question))
    except:
        return False

@router.post("/")
async def createDBans(answer: AnswersK):
    try:
        answer_dict = dict(answer)
        answer_dict.pop("id", None)
        answer_dict["formularioK"] = False
        
        id = db_client.answersK.insert_one(answer_dict).inserted_id
        new_answers = answersK_schema(db_client.answersK.find_one({"_id": id}))
        return {"exito": "Datos guardados"}
    except Exception as e:
        print("Error creating answers:", str(e))
        return {"error": f"Error creating answers: {str(e)}", "validation_error": answer.errors()}

@router.patch("/")
async def updateDBans(correo:str, parametro:str, valor):
    answer = search_answers("user_email",correo)
    answer_dict = dict(answer)
    answer_dict[parametro] = valor
    if parametro != "formularioK":
        time = datetime.now(timezone.utc).isoformat()
        answer_dict[f"{parametro}_time"] = time
    answer_id = ObjectId(answer.id)
    try:
        db_client.answersK.update_one({"_id": answer_id}, {"$set": answer_dict})
    except Exception as e:
        return {"error": f"No se han actualizado las respuestas. Detalles del error: {str(e)}"}
    return {"exito": "Respuestas actualizadas exitosamente"}

@router.get("/")
async def answers(correo:str, formulario:bool):
    answer_dict = dict(search_answers("user_email", correo))
    if formulario:
        usaurio = db_client.users.find_one({"correo": correo})
        id = str(usaurio.get("_id"))
        db_client.banda.update_one({"id_usuario": id}, {"$set": {"status": True}})
    return answer_dict

@router.get("/preguntas")
async def questions():
    question_dict = dict(get_questions())
    return question_dict

@router.post("/updateCorreo")
async def update(request: Request):
    req_data = await request.json()
    userCorreo = req_data.get("userCorreo")
    newCorreo = req_data.get("newCorreo")
        
    answer = search_answers("user_email", userCorreo)
    answer_dict = dict(answer)
    answer_dict["user_email"] = newCorreo
    answer_id = ObjectId(answer.id)
    try:
        db_client.answersH.update_one({"_id": answer_id}, {"$set": answer_dict})
    except:
        return {"error": "No se ha actualizado"}
    return {"exito": "Datos actualizados"}