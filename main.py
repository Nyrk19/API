from fastapi import FastAPI
from routers import users, templates, respuestasC, respuestasK, respuestasH, admins, resultados, banda
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Routers
app.include_router(users.router)
app.include_router(templates.router)
app.include_router(respuestasC.router)
app.include_router(respuestasK.router)
app.include_router(respuestasH.router)
app.include_router(admins.router)
app.include_router(resultados.router)
app.include_router(banda.router)