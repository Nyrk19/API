from fastapi import APIRouter
from fastapi import Request
from db.models.answersC import AnswersC
from db.schemas.answersC import answersC_schema
from db.models.questionsC import QuestionsC
from db.schemas.questionsC import questionsC_schema
from db.client import db_client
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/answersC")

def search_answers(field: str, key):
    try:
        answer = db_client.answersC.find_one({field: key})
        return AnswersC(**answersC_schema(answer))
    except Exception as e:
        print(e)
        return False
    
def get_questions():
    try:
        question = db_client.questionsC.find_one({"_id": ObjectId("66e8e962e23a281b089a2ef8")})
        return QuestionsC(**questionsC_schema(question))
    except:
        return False

@router.post("/")
async def createDBans(answer: AnswersC):
    try:
        answer_dict = dict(answer)
        answer_dict.pop("id", None)
        answer_dict["formularioC"] = False
        
        id = db_client.answersC.insert_one(answer_dict).inserted_id
        new_answers = answersC_schema(db_client.answersC.find_one({"_id": id}))
        return {"exito": "Datos guardados"}
    except Exception as e:
        print("Error creating answers:", str(e))
        return {"error": f"Error creating answers: {str(e)}", "validation_error": answer.errors()}

@router.patch("/")
async def updateDBans(correo:str, parametro:str, valor):
    valorf = False
    if valor == "true":
        valorf = True
    elif valor != "false":
        valorf = valor
    answer = search_answers("user_email",correo)
    answer_dict = dict(answer)
    answer_dict[parametro] = valorf
    if parametro != "formularioC":
        time = datetime.now(timezone.utc).isoformat()
        answer_dict[f"{parametro}_time"] = time
    answer_id = ObjectId(answer.id)
    try:
        db_client.answersC.update_one({"_id": answer_id}, {"$set": answer_dict})
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
        db_client.answersC.update_one({"_id": answer_id}, {"$set": answer_dict})
    except:
        return {"error": "No se ha actualizado"}
    return {"exito": "Datos actualizados"}