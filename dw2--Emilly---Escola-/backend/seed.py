
# seed.py
# Script para popular o banco com dados iniciais

from datetime import date
from .database import SessionLocal, engine
from .models import Base, Turma, Aluno

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Turmas de exemplo
turmas = [
	Turma(nome="Turma A", capacidade=10),
	Turma(nome="Turma B", capacidade=15),
	Turma(nome="Turma C", capacidade=20)
]
for t in turmas:
	db.add(t)
db.commit()

# Alunos de exemplo
alunos = [
	Aluno(nome="Ana Silva", data_nascimento=date(2010, 5, 12), email="ana@email.com", status="ativo", turma_id=1),
	Aluno(nome="Bruno Souza", data_nascimento=date(2011, 8, 23), email="bruno@email.com", status="ativo", turma_id=1),
	Aluno(nome="Carla Lima", data_nascimento=date(2012, 3, 17), email="carla@email.com", status="inativo", turma_id=None),
	Aluno(nome="Daniel Costa", data_nascimento=date(2010, 11, 2), email="daniel@email.com", status="ativo", turma_id=2),
	Aluno(nome="Eduarda Alves", data_nascimento=date(2011, 1, 30), email="eduarda@email.com", status="ativo", turma_id=2),
	Aluno(nome="Felipe Martins", data_nascimento=date(2012, 6, 14), email="felipe@email.com", status="inativo", turma_id=None),
	Aluno(nome="Gabriela Rocha", data_nascimento=date(2010, 9, 5), email="gabriela@email.com", status="ativo", turma_id=3),
	Aluno(nome="Henrique Dias", data_nascimento=date(2011, 12, 21), email="henrique@email.com", status="ativo", turma_id=3),
	Aluno(nome="Isabela Pinto", data_nascimento=date(2012, 4, 8), email="isabela@email.com", status="inativo", turma_id=None),
	Aluno(nome="João Pedro", data_nascimento=date(2010, 7, 19), email="joao@email.com", status="ativo", turma_id=1),
	Aluno(nome="Karen Melo", data_nascimento=date(2011, 10, 3), email="karen@email.com", status="ativo", turma_id=2),
	Aluno(nome="Lucas Freitas", data_nascimento=date(2012, 2, 25), email="lucas@email.com", status="inativo", turma_id=None),
	Aluno(nome="Mariana Borges", data_nascimento=date(2010, 6, 13), email="mariana@email.com", status="ativo", turma_id=3),
	Aluno(nome="Nicolas Ramos", data_nascimento=date(2011, 9, 27), email="nicolas@email.com", status="ativo", turma_id=2),
	Aluno(nome="Olívia Castro", data_nascimento=date(2012, 5, 16), email="olivia@email.com", status="inativo", turma_id=None),
	Aluno(nome="Paulo Henrique", data_nascimento=date(2010, 8, 22), email="paulo@email.com", status="ativo", turma_id=1),
	Aluno(nome="Quésia Lopes", data_nascimento=date(2011, 11, 9), email="quesia@email.com", status="ativo", turma_id=3),
	Aluno(nome="Rafael Teixeira", data_nascimento=date(2012, 3, 29), email="rafael@email.com", status="inativo", turma_id=None),
	Aluno(nome="Sofia Almeida", data_nascimento=date(2010, 10, 6), email="sofia@email.com", status="ativo", turma_id=2),
	Aluno(nome="Thiago Farias", data_nascimento=date(2011, 2, 18), email="thiago@email.com", status="ativo", turma_id=3)
]
for a in alunos:
	db.add(a)
db.commit()
db.close()
