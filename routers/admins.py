import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, Depends
from fastapi import Request
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from db.models.admin import Admin
from db.schemas.admin import admin_schema
from db.models.user import User
from db.schemas.user import user_schema
from db.models.codes import Codes
from db.schemas.codes import codes_schema
from db.client import db_client
from bson import ObjectId
from datetime import datetime, timedelta
from mailjet_rest import Client

router = APIRouter(prefix="/admin")

oauth2 = OAuth2PasswordBearer(tokenUrl="login")
crypt = CryptContext(schemes=["bcrypt"])
code_time = 10
algorithm = "HS256"
secret = "koq3hf4njhbthyu30o9t87b9jj99ij69bkbj9bk6b89be93w32s5vh3268ju99i84"

def search_user(field: str, key):
    try:
        user = db_client.users.find_one({field: key})
        return User(**user_schema(user))
    except:
        return False

def search_admin(field: str, key):
    try:
        admin = db_client.admins.find_one({field: key})
        return Admin(**admin_schema(admin))
    except:
        return False

def remove_password_field(admin_dict):
    admin_dict_copy = admin_dict.copy()
    admin_dict_copy.pop("password", None)
    return admin_dict_copy

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

async def auth_admin(token: str = Depends(oauth2)):
    try:
        username = jwt.decode(token, secret, algorithms=[algorithm]).get("sub")
        if username is None:
            return {"error": "Credenciales inválidas"}
    except JWTError:
        return {"error": "Credenciales inválidas"}
    return search_admin("correo", username)

async def current_admin(admin: Admin = Depends(auth_admin)):
    if not admin:
        return {"error": "Usuario inactivo"}
    return admin  

@router.get("/", response_model=list[Admin])
async def admins():
    admins_list = db_client.admins.find()
    return [remove_password_field(admin_schema(admin)) for admin in admins_list]

@router.get("/id")
async def admin(id: str):
    admin_dict = dict(search_admin("_id", ObjectId(id)))
    return remove_password_field(admin_dict)

@router.put("/contraseña")
async def update_pass(correo: str):
    admin = search_admin("correo", correo)
    if admin:
        password = "SkillMap." + str(random.randint(1000000, 9999999))
        hashed_password = crypt.hash(password)
        db_client.admins.update_one({"_id": ObjectId(admin.id)}, {"$set": {"password": hashed_password}})
        
        subject = "Recuperación de contraseña"
        body = f"Hola {admin.name} \n\nEsta es tu nueva contraseña {password}, te recomendamos cambiarla tras ingresar en el apartado de Mi cuenta"
        send_mail(admin.correo, subject, body)
    else:
        return {"error": "Correo no registrado"}
    return {"éxito": "Contraseña restaurada"}

@router.put("/")
async def update_admin(admin: Admin):
    admin_dict = dict(admin)
    admin_dict.pop("id", None)

    try:
        db_client.admins.find_one_and_replace({"_id": ObjectId(admin.id)}, admin_dict)
    except:
        return {"error": "No se ha actualizado el usuario"}
    
    return search_admin("_id", ObjectId(admin.id))

@router.delete("/")
async def delete_admin(id: str):
    found = db_client.admins.find_one_and_delete({"_id": ObjectId(id)})
    if not found:
        return {"error": "No se ha eliminado el usuario"}
    
    return {"éxito": "Se ha eliminado el usuario"}

@router.post("/createUser")
async def create_user(request: Request):
    req_data = await request.json()
    editor_pass = req_data.get("editorPass")
    editor_correo = req_data.get("editorCorreo")
    user = User(**req_data)
    
    editor = search_admin("correo", editor_correo)
    if not crypt.verify(editor_pass, editor.password):
        return {"error": "Contraseña incorrecta"}
    if type(search_user("correo", user.correo)) == User:
        return {"error": "El correo ya está registrado"}
    if type(search_admin("correo", user.correo)) == Admin:
        return {"error": "El correo ya está registrado"}
    
    password = "SkillMap." + str(random.randint(1000000, 9999999))
    hashed_password = crypt.hash(password)
    user_dict = dict(user)
    user_dict["password"] = hashed_password
    user_dict.pop("id", None)
    user_dict["autenticado"] = False
    id = db_client.users.insert_one(user_dict).inserted_id
    
    user = search_user("correo", user.correo)
    code = str(random.randint(10000, 99999))
    code_expiration = datetime.utcnow() + timedelta(minutes=code_time)

    new_code = Codes(user_id=user.id, code=code, expiration_time=code_expiration)
    code_dict = dict(new_code)
    code_dict.pop('id', None)
    id = db_client.codes.insert_one(code_dict).inserted_id
    new_code = codes_schema(db_client.codes.find_one({"_id": id}))
    
    subject = "Bienvenido"
    body = f"Hola {user.name}, gracias por registrarte en SkillMap\n\nEste es tu código de verificación: {code}\n\nY esta es tu contraseña {password}, te recomendamos cambiarla tras ingresar en el apartado de Mi cuenta"
    send_mail(user.correo, subject, body)
    
    return "Usuario creado"

@router.post("/createAdmin")     
async def create_admin(request: Request):
    req_data = await request.json()
    editor_pass = req_data.get("editorPass")
    editor_correo = req_data.get("editorCorreo")
    admin = Admin(**req_data)
    
    editor = search_admin("correo", editor_correo)
    if not crypt.verify(editor_pass, editor.password):
        return {"error": "Contraseña incorrecta"}
    if type(search_user("correo", admin.correo)) == User:
        return {"error": "El correo ya está registrado"}
    if type(search_admin("correo", admin.correo)) == Admin:
        return {"error": "El correo ya está registrado"}
    
    password = "SkillMap." + str(random.randint(1000000, 9999999))
    hashed_password = crypt.hash(password)
    admin_dict = dict(admin)
    admin_dict["password"] = hashed_password
    admin_dict.pop("id", None)
    admin_dict["autenticado"] = False   
    id = db_client.admins.insert_one(admin_dict).inserted_id
    
    code = str(random.randint(10000, 99999))
    code_expiration = datetime.utcnow() + timedelta(minutes=code_time)

    new_code = Codes(user_id=str(id), code=code, expiration_time=code_expiration)
    code_dict = dict(new_code)
    code_dict.pop('id', None)
    id = db_client.codes.insert_one(code_dict).inserted_id
    new_code = codes_schema(db_client.codes.find_one({"_id": id}))
    
    subject = "Bienvenido"
    body = f"Hola {admin.name}, gracias por registrarte en SkillMap\n\nEste es tu código de verificación: {code}\n\nY esta es tu contraseña {password}, te recomendamos cambiarla tras ingresar en el apartado de Mi cuenta"
    send_mail(admin.correo, subject, body)
    
    return "Usuario creado"

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    admin = search_admin("correo", form.username)
    if not admin:
        return {"error": "Usuario o contraseña incorrecta"}
    if not crypt.verify(form.password, admin.password):
        return {"error": "Usuario o contraseña incorrecta"}
    if not admin.autenticado:
        return {"error": "Usuario no autenticado"}
    expire = datetime.utcnow() + timedelta(minutes=720)
    access_token = {"sub": admin.correo, "exp": expire}
    return {"access_token": jwt.encode(access_token, secret, algorithm=algorithm), "token_type": "bearer"}

@router.delete("/validar")
async def validar_usuario(code:int):
    code_data = db_client.codes.find_one_and_delete({"code": code})
    if code_data and code_data.get("expiration_time") > datetime.utcnow():
            db_client.admins.update_one({"_id": ObjectId(code_data.get("user_id"))},{"$set": {"autenticado": True}})
            return {"exito": "Codigo validado"}
    else:
        return {"error":"Codigo invalido"}
   
@router.get("/codigoValido")
async def existencia_codigo(correo:str):
    admin = search_admin("correo", correo)
    try:
        code = db_client.codes.find_one({"user_id": admin.id})
    except:
        return {"error":"Usuario no encontrado"}
    if code:
        if code.get("expiration_time") > datetime.utcnow():
            return {"exito": "Codigo activo"}
        else:
            code = db_client.codes.find_one_and_delete({"user_id": admin.id})
            print("codigo inactivo")
            return {"error":"Codigo inactivo"}
    return {"error": "Codigo inactivo"} 

@router.get("/me")
async def me(admin: Admin = Depends(current_admin)):
    return admin

@router.post("/correo")
async def mail(correo: str):
    admin = search_admin("correo", correo)
    code = str(random.randint(10000, 99999))
    code_expiration = datetime.utcnow() + timedelta(minutes=code_time)

    new_code = Codes(user_id=admin.id, code=code, expiration_time=code_expiration)
    code_dict = dict(new_code)
    code_dict.pop('id', None)
    id = db_client.codes.insert_one(code_dict).inserted_id
    new_code = codes_schema(db_client.codes.find_one({"_id": id}))
    
    subject = "Bienvenido"
    body = f" Hola {admin.name} gracias por registrarte en SkillMap\n\nEste es tu código de verificación: {code}"
    send_mail(admin.correo, subject, body)
    return {"Correo enviado"}

@router.post("/update")
async def update_admin(request: Request):
    req_data = await request.json()
    admin_correo = req_data.get("correo")
    new_pass = req_data.get("newPass")
    new_admin = Admin(**req_data)
    
    admin = search_admin("correo", new_admin.correo)
    if new_admin.correo != admin_correo:
        if type(search_admin("correo", admin_correo)) == Admin:
            print("Correo ya registrado")
            return {"error": "El correo ya está registrado"}
    if not crypt.verify(new_admin.password, admin.password):
        return {"error": "Contraseña incorrecta"}
    admin_dict = dict(admin)
    if new_admin.correo != admin_correo:
        admin_dict["correo"] = admin_correo
    if new_pass:
        admin_dict["password"] = crypt.hash(new_pass)
    admin_dict["name"] = new_admin.name
    admin_dict["surname"] = new_admin.surname
    admin_dict["correo"] = new_admin.correo
    admin_dict.pop("id", None)
    try:
        db_client.admins.find_one_and_replace({"_id": ObjectId(admin.id)}, admin_dict)
    except:
        return {"error": "No se ha actualizado el usuario"}
    return {"exito": "Usuario actualizado"}

@router.get("/findUsers")
async def find_users(tipo: str, nombre: str = "", apellido: str = "", correo: str = ""):
    def add_user_type(users, user_type):
        for user in users:
            user["tipo"] = user_type
        return users

    if tipo == "Administrador":
        query = {}
        if nombre:
            query["name"] = {"$regex": nombre, "$options": "i"}
        if apellido:
            query["surname"] = {"$regex": apellido, "$options": "i"}
        if correo:
            query["correo"] = {"$regex": correo, "$options": "i"}
        admins_list = db_client.admins.find(query)
        admins_with_type = add_user_type([remove_password_field(admin_schema(admin)) for admin in admins_list], "Administrador")
        return admins_with_type

    elif tipo == "Usuario Común":
        query = {}
        if nombre:
            query["name"] = {"$regex": nombre, "$options": "i"}
        if apellido:
            query["surname"] = {"$regex": apellido, "$options": "i"}
        if correo:
            query["correo"] = {"$regex": correo, "$options": "i"}
        users_list = db_client.users.find(query)
        users_with_type = add_user_type([remove_password_field(user_schema(user)) for user in users_list], "Usuario Común")
        return users_with_type

    else:  # Todos
        admin_query = {}
        user_query = {}
        if nombre:
            admin_query["name"] = {"$regex": nombre, "$options": "i"}
            user_query["name"] = {"$regex": nombre, "$options": "i"}
        if apellido:
            admin_query["surname"] = {"$regex": apellido, "$options": "i"}
            user_query["surname"] = {"$regex": apellido, "$options": "i"}
        if correo:
            admin_query["correo"] = {"$regex": correo, "$options": "i"}
            user_query["correo"] = {"$regex": correo, "$options": "i"}
        admins_list = db_client.admins.find(admin_query)
        users_list = db_client.users.find(user_query)
        admins_with_type = add_user_type([remove_password_field(admin_schema(admin)) for admin in admins_list], "Administrador")
        users_with_type = add_user_type([remove_password_field(user_schema(user)) for user in users_list], "Usuario Común")
        all_users = admins_with_type + users_with_type
        return all_users

@router.post("/updateAdmins")
async def update_admins(request: Request):
    req_data = await request.json()
    correo = req_data.get("correo")
    editor_pass = req_data.get("editorPass")
    editor_correo = req_data.get("editorCorreo")
    new_admin = Admin(**req_data)
    
    editor = search_admin("correo", editor_correo)
    if not crypt.verify(editor_pass, editor.password):
        return {"error": "Contraseña incorrecta"}
    admin = search_admin("correo", new_admin.correo)
    if new_admin.correo != correo:
        if type(search_admin("correo", correo)) == Admin:
            print("Correo ya registrado")
            return {"error": "El correo ya está registrado"}
    admin_dict = dict(admin)
    if new_admin.correo != correo:
        admin_dict["correo"] = correo
    admin_dict["name"] = new_admin.name
    admin_dict["surname"] = new_admin.surname
    admin_dict["correo"] = new_admin.correo
    admin_dict.pop("id", None)
    try:
        db_client.admins.find_one_and_replace({"_id": ObjectId(admin.id)}, admin_dict)
    except:
        return {"error": "No se ha actualizado el usuario"}
    return {"exito": "Usuario actualizado"}

@router.post("/updateUsers")
async def update_users(request: Request):
    req_data = await request.json()
    correo = req_data.get("correo")
    editor_pass = req_data.get("editorPass")
    editor_correo = req_data.get("editorCorreo")
    new_user = User(**req_data)
    
    editor = search_admin("correo", editor_correo)
    if not crypt.verify(editor_pass, editor.password):
        return {"error": "Contraseña incorrecta"}
    user = search_user("correo", new_user.correo)
    if new_user.correo != correo:
        if type(search_user("correo", correo)) == User:
            print("Correo ya registrado")
            return {"error": "El correo ya está registrado"}
    user_dict = dict(user)
    if new_user.correo != correo:
        user_dict["correo"] = correo
    user_dict["name"] = new_user.name
    user_dict["surname"] = new_user.surname
    user_dict["correo"] = new_user.correo
    user_dict.pop("id", None)
    try:
        db_client.users.find_one_and_replace({"_id": ObjectId(user.id)}, user_dict)
    except:
        return {"error": "No se ha actualizado el usuario"}
    return {"exito": "Usuario actualizado"}

@router.delete("/deleteAdmins")
async def delete_admins(request: Request):
    req_data = await request.json()
    correo = req_data.get("correo")
    editor_pass = req_data.get("editorPass")
    editor_correo = req_data.get("editorCorreo")
    
    editor = search_admin("correo", editor_correo)
    if not crypt.verify(editor_pass, editor.password):
        return {"error": "Contraseña incorrecta"}
    try:
        db_client.admins.find_one_and_delete({"correo": correo})
    except:
        return {"error": "No se ha eliminado el usuario"}
    return {"exito": "Usuario eliminado"}

@router.delete("/deleteUsers")
async def delete_users(request: Request):
    req_data = await request.json()
    correo = req_data.get("correo")
    editor_pass = req_data.get("editorPass")
    editor_correo = req_data.get("editorCorreo")
    
    editor = search_admin("correo", editor_correo)
    if not crypt.verify(editor_pass, editor.password):
        return {"error": "Contraseña incorrecta"}
    try:
        db_client.users.find_one_and_delete({"correo": correo})
    except:
        return {"error": "No se ha eliminado el usuario"}
    return {"exito": "Usuario eliminado"}