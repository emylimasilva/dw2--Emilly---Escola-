# app.py
# FastAPI principal para Gestão Escolar


from fastapi import FastAPI
from .database import engine
from .models import Base

app = FastAPI()

# Cria as tabelas no banco de dados na inicialização
Base.metadata.create_all(bind=engine)


from fastapi import Depends
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Aluno, Turma

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok"}


from fastapi import HTTPException
from pydantic import BaseModel
from datetime import date

# Schemas Pydantic
class TurmaCreate(BaseModel):
    nome: str
    capacidade: int

class AlunoCreate(BaseModel):
    nome: str
    data_nascimento: date
    email: str = None
    status: str = "inativo"
    turma_id: int = None

class MatriculaCreate(BaseModel):
    aluno_id: int
    turma_id: int

# Endpoints Turma
@app.post("/turmas")
def criar_turma(turma: TurmaCreate, db: Session = Depends(get_db)):
    nova_turma = Turma(**turma.dict())
    db.add(nova_turma)
    db.commit()
    db.refresh(nova_turma)
    return nova_turma

@app.put("/turmas/{id}")
def editar_turma(id: int, turma: TurmaCreate, db: Session = Depends(get_db)):
    t = db.query(Turma).filter(Turma.id == id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    t.nome = turma.nome
    t.capacidade = turma.capacidade
    db.commit()
    db.refresh(t)
    return t

@app.delete("/turmas/{id}")
def deletar_turma(id: int, db: Session = Depends(get_db)):
    t = db.query(Turma).filter(Turma.id == id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    db.delete(t)
    db.commit()
    return {"ok": True}

# Endpoints Aluno

@app.post("/alunos")
def criar_aluno(aluno: AlunoCreate, db: Session = Depends(get_db)):
    # Validação faixa etária mínima (5 anos)
    hoje = date.today()
    idade = hoje.year - aluno.data_nascimento.year - ((hoje.month, hoje.day) < (aluno.data_nascimento.month, aluno.data_nascimento.day))
    if idade < 5:
        raise HTTPException(status_code=422, detail="O aluno deve ter pelo menos 5 anos de idade.")
    # Validação de email (se preenchido)
    if aluno.email and ("@" not in aluno.email or "." not in aluno.email):
        raise HTTPException(status_code=422, detail="Email inválido.")
    # Validação de status
    if aluno.status not in ["ativo", "inativo"]:
        raise HTTPException(status_code=422, detail="Status inválido.")
    novo_aluno = Aluno(**aluno.dict())
    db.add(novo_aluno)
    db.commit()
    db.refresh(novo_aluno)
    return novo_aluno


@app.put("/alunos/{id}")
def editar_aluno(id: int, aluno: AlunoCreate, db: Session = Depends(get_db)):
    a = db.query(Aluno).filter(Aluno.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    # Validação faixa etária mínima (5 anos)
    hoje = date.today()
    idade = hoje.year - aluno.data_nascimento.year - ((hoje.month, hoje.day) < (aluno.data_nascimento.month, aluno.data_nascimento.day))
    if idade < 5:
        raise HTTPException(status_code=422, detail="O aluno deve ter pelo menos 5 anos de idade.")
    # Validação de email (se preenchido)
    if aluno.email and ("@" not in aluno.email or "." not in aluno.email):
        raise HTTPException(status_code=422, detail="Email inválido.")
    # Validação de status
    if aluno.status not in ["ativo", "inativo"]:
        raise HTTPException(status_code=422, detail="Status inválido.")
    a.nome = aluno.nome
    a.data_nascimento = aluno.data_nascimento
    a.email = aluno.email
    a.status = aluno.status
    a.turma_id = aluno.turma_id
    db.commit()
    db.refresh(a)
    return a

@app.delete("/alunos/{id}")
def deletar_aluno(id: int, db: Session = Depends(get_db)):
    a = db.query(Aluno).filter(Aluno.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    db.delete(a)
    db.commit()
    return {"ok": True}

# Endpoint de matrícula
@app.post("/matriculas")
def matricular_aluno(matricula: MatriculaCreate, db: Session = Depends(get_db)):
    aluno = db.query(Aluno).filter(Aluno.id == matricula.aluno_id).first()
    turma = db.query(Turma).filter(Turma.id == matricula.turma_id).first()
    if not aluno or not turma:
        raise HTTPException(status_code=404, detail="Aluno ou turma não encontrados")
    # Verifica capacidade da turma
    total_alunos = db.query(Aluno).filter(Aluno.turma_id == turma.id).count()
    if total_alunos >= turma.capacidade:
        raise HTTPException(status_code=400, detail="Turma lotada")
    aluno.status = "ativo"
    aluno.turma_id = turma.id
    db.commit()
    db.refresh(aluno)
    return aluno
