from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
##from db.models.user import User
##from db.schemas.user import user_schema

router = APIRouter(prefix="/Skillmap")

@router.get("/")
async def read_login():
    return FileResponse("static/LOGIN/index.html")

@router.get("/Registro")
async def read_registro():
    return FileResponse("static/Registro/register.html")

@router.get("/Inicio")
async def read_inicio():
    return FileResponse("static/Inicio/index.html")

@router.get("/Dashboard")
async def read_dashboard():
    return FileResponse("static/Dashboard/dash.html")

@router.get("/RecuperarContraseña")
async def read_recuperarContraseña():
    return FileResponse("static/Contraseña/contraseña.html")

@router.get("/Contacto")
async def read_contacto():
    return FileResponse("static/Contacto/contact.html")

@router.get("/Autenticar")
async def read_autenticar():
    return FileResponse("static/Autenticacion/Auth.html")

@router.get("/AboutUs")
async def read_aboutUs():
    return FileResponse("static/AboutUs/index.html")

@router.get("/Empezar")
async def read_Empezar():
    return FileResponse("static/Empezar/index.html")

@router.get("/Empezar/Evaluaciones")
async def read_Evaluaciones():
    return FileResponse("static/Evaluaciones/index.html")

@router.get("/Empezar/Evaluaciones/Chaside")
async def read_FormC():
    return FileResponse("static/Formulario_Chaside/index.html")

@router.get("/Empezar/Evaluaciones/Kuder")
async def read_FormK():
    return FileResponse("static/Formulario_Kuder/index.html")

@router.get("/Empezar/Evaluaciones/Holland")
async def read_FormH():
    return FileResponse("static/Formulario_Holland/index.html")

@router.get("/Empezar/Activity")
async def read_Activity():
    return FileResponse("static/Actividades/index.html")

@router.get("/Edit")
async def read_edit():
    return FileResponse("static/Actualizar/index.html")

@router.get("/Empezar/Resultados")
async def read_Results():
    return FileResponse("static/Resultados/index.html")

###################
@router.get("/Admin")
async def read_login_admin():
    return FileResponse("static/admin_LOGIN/index.html")

@router.get("/Admin/Autenticar")
async def read_login_admin():
    return FileResponse("static/admin_Autenticacion/Auth.html")

@router.get("/Admin/Inicio")
async def read_inicio_admin():
    return FileResponse("static/admin_Inicio/index.html")

@router.get("/Admin/Dashboard")
async def read_dashboard_admin():
    return FileResponse("static/admin_Dashboard/dash.html")

@router.get("/Admin/RecuperarContraseña")
async def read_recuperarContraseña_admin():
    return FileResponse("static/admin_Contraseña/contraseña.html")

@router.get("/Admin/Edit")
async def read_edit_admin():
    return FileResponse("static/admin_Actualizar/index.html")

@router.get("/Admin/Crear")
async def read_crear_usuario_admin():
    return FileResponse("static/admin_Crear/index.html")

@router.get("/Admin/Modificar")
async def read_editar_usuario_admin():
    return FileResponse("static/admin_Modificar/index.html")