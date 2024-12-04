import random
from fastapi import APIRouter, Depends
from fastapi import Request
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from db.models.user import User
from db.schemas.user import user_schema
from db.models.codes import Codes
from db.schemas.codes import codes_schema
from db.client import db_client
from bson import ObjectId
from datetime import datetime, timedelta
from mailjet_rest import Client

router = APIRouter(prefix="/user")

oauth2 = OAuth2PasswordBearer(tokenUrl="login")
crypt = CryptContext(schemes=["bcrypt"])
code_time = 10 
alogorithm = "HS256"
secret = "koq3hf4njhbthyu30o9t87b9jj99ij69bkbj9bk6b89be93w32s5vh3268ju99i84"

def search_user(field: str, key):
    try:
        user = db_client.users.find_one({field: key})
        return User(**user_schema(user))
    except:
        return False
    

def remove_password_field(user_dict):
    user_dict_copy = user_dict.copy()
    user_dict_copy.pop("password", None)
    return user_dict_copy

def send_mail(correo, subject, body):
    api_key = "afc76f2c3e5ed7398bbb8c9f73827c20"
    api_secret = "280a6ce7e88638f7cd0f91dc3e8b858c"
    mailjet = Client(auth=(api_key, api_secret), version='v3.1')

    data = {
        'Messages': [
            {
                "From": {
                    "Email": "skillmap2024@outlook.com", 
                    "Name": "SkillMap"
                },
                "To": [
                    {
                        "Email": correo,
                        "Name": ""
                    }
                ],
                "Subject": subject,
                "TextPart": body,
                "HTMLPart": f"<h3>{body}</h3>"
            }
        ]
    }
    result = mailjet.send.create(data=data)
    if result.status_code == 200:
        print("Correo enviado exitosamente.")
    else:
        print(f"Error al enviar el correo: {result.status_code}, {result.text}")

async def auth_user(token: str = Depends(oauth2)):
    try:
        username = jwt.decode(token, secret, algorithms=[alogorithm]).get("sub")
        if username == None:
            return {"error": "Credenciales invalidas"}
    except JWTError:
        return {"error": "Credenciales invalidas"}
    return search_user("correo", username)

async def current_user(user: User = Depends(auth_user)):
    if not user:
        return {"error": "Usuario inactivo"}
    return user  

@router.get("/", response_model=list[User])
async def users():
    users_list = db_client.users.find()
    return [remove_password_field(user_schema(user)) for user in users_list]

@router.get("/id")
async def user(id: str):
    user_dict = dict(search_user("_id", ObjectId(id)))
    return remove_password_field(user_dict)

@router.post("/")
async def create_user(user: User):
    if type(search_user("correo", user.correo)) == User:
        return {"error": "El correo ya está registrado"}
    hashed_password = crypt.hash(user.password)
    user_dict = dict(user)
    user_dict["password"] = hashed_password
    user_dict.pop("id", None)
    user_dict["autenticado"] = False

    id = db_client.users.insert_one(user_dict).inserted_id

    new_user = user_schema(db_client.users.find_one({"_id": id}))
    
    return remove_password_field(new_user)

@router.post("/correo")
async def mail(correo: str):
    user = search_user("correo", correo)
    code = str(random.randint(10000, 99999))
    code_expiration = datetime.utcnow() + timedelta(minutes=code_time)

    new_code = Codes(user_id=user.id, code=code, expiration_time=code_expiration)
    code_dict = dict(new_code)
    code_dict.pop('id', None)
    id = db_client.codes.insert_one(code_dict).inserted_id
    new_code = codes_schema(db_client.codes.find_one({"_id": id}))
    
    subject = "Bienvenido"
    body = f" Hola {user.name} gracias por registrarte en SkillMap\n\nEste es tu código de verificación: {code}"
    send_mail(user.correo, subject, body)
    return {"Correo enviado"}

@router.put("/contraseña")
async def update_pass(correo: str):
    user = search_user("correo", correo)
    if user:
        password = "SkillMap." + str(random.randint(1000000, 9999999))
        hashed_password = crypt.hash(password)
        db_client.users.update_one({"_id": ObjectId(user.id)},{"$set": {"password": hashed_password}})
        
        subject = "Recuperacion de contraseña"
        body = f" Hola {user.name} \n\nEste es tu nueva contraseña {password}, te recomendamos cambiarla tras ingresar en el apartado de Mi cuenta"
        send_mail(user.correo, subject, body)
    else:
        return {"error":"Correo no registrado"}
    return {"exito":"Contraseña restaurada"}

@router.put("/")
async def update_user(user: User):
    user_dict = dict(user)
    user_dict.pop("id", None)

    try:
        db_client.users.find_one_and_replace({"_id": ObjectId(user.id)}, user_dict)
    except:
        return {"error": "No se ha actualizado el usuario"}
    
    return search_user("_id", ObjectId(user.id))

@router.delete("/validar")
async def validar_usuario(code:int):
    code_data = db_client.codes.find_one_and_delete({"code": code})
    if code_data and code_data.get("expiration_time") > datetime.utcnow():
            db_client.users.update_one({"_id": ObjectId(code_data.get("user_id"))},{"$set": {"autenticado": True}})
            return {"exito": "Codigo validado"}
    else:
        return {"error":"Codigo invalido"}

@router.get("/codigoValido")
async def existencia_codigo(correo:str):
    user = search_user("correo", correo)
    try:
        code = db_client.codes.find_one({"user_id": user.id})
    except:
        print("Usuario no encontrado")
    if code:
        if code.get("expiration_time") > datetime.utcnow():
            print("codigo activo")
            return {"exito": "Codigo activo"}
        else:
            code = db_client.codes.find_one_and_delete({"user_id": user.id})
            print("codigo inactivo")
            return {"error":"Codigo inactivo"}
    return {"error": "Codigo inactivo"}

@router.delete("/")
async def delete_user(id: str):
    found = db_client.users.find_one_and_delete({"_id": ObjectId(id)})
    if not found:
        return {"error": "No se ha eliminado el usuario"}
    
    return {"Se ha eliminado el usuario"}

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = search_user("correo", form.username)
    if not user:
        return {"error": "Usuario o contraseña incorrecta"}
    if not crypt.verify(form.password, user.password):
        return {"error": "Usuario o contraseña incorrecta"}
    if not user.autenticado:
        return {"error": "Usuario no autenticado"}
    expire = datetime.utcnow() + timedelta(minutes = 720)
    accessToken = {"sub":user.correo,"exp":expire}
    return {"access_token": jwt.encode(accessToken, secret, algorithm=alogorithm), "token_type": "bearer"}

@router.get("/me")
async def me(user: User = Depends(current_user)):
    return user

@router.post("/update")
async def updateUser(request: Request):
    req_data = await request.json()
    userCorreo = req_data.get("correo")
    newPass = req_data.get("newPass")
    newUser = User(**req_data)
    
    user = search_user("correo", newUser.correo)
    
    if not crypt.verify(newUser.password, user.password):
        return {"error": "Contraseña incorrecta"}
    
    if newUser.correo != userCorreo:
        if type(search_user("correo", userCorreo)) == User:
            print("Correo ya registrado")
            return {"error": "El correo ya está registrado"}
    user_dict = dict(user)
    if newPass != "":
        user_dict["password"] = crypt.hash(newPass)
    user_dict["name"] = newUser.name
    user_dict["surname"] = newUser.surname
    user_dict["correo"] = newUser.correo
    user_dict.pop("id", None)
    try:
        db_client.users.find_one_and_replace({"_id": ObjectId(user.id)}, user_dict)
    except:
        return {"error": "No se ha actualizado el usuario"}
    return {"exito": "Datos actualizados"}