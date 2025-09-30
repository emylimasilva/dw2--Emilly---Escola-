
# seed.py
# Script para popular o banco com dados iniciais

from datetime import date
from .database import SessionLocal, engine
from .models import Base, Turma, Aluno

Base.metadata.create_all(bind=engine)
db = SessionLocal()


# Turmas do Ensino Médio
turmas = [
	Turma(nome="1º Ano do Ensino Médio", capacidade=10),
	Turma(nome="2º Ano do Ensino Médio", capacidade=10),
	Turma(nome="3º Ano do Ensino Médio", capacidade=10)
]
for t in turmas:
	db.add(t)
db.commit()

# Alunos realistas para cada turma
alunos = [
	# 1º Ano
	Aluno(nome="Lucas Andrade", data_nascimento=date(2009, 3, 15), email="lucas.andrade@email.com", status="ativo", turma_id=1),
	Aluno(nome="Mariana Souza", data_nascimento=date(2009, 7, 22), email="mariana.souza@email.com", status="ativo", turma_id=1),
	Aluno(nome="Pedro Henrique", data_nascimento=date(2009, 11, 5), email="pedro.henrique@email.com", status="ativo", turma_id=1),
	# 2º Ano
	Aluno(nome="Ana Clara Lima", data_nascimento=date(2008, 2, 10), email="ana.clara@email.com", status="ativo", turma_id=2),
	Aluno(nome="Rafael Martins", data_nascimento=date(2008, 6, 18), email="rafael.martins@email.com", status="ativo", turma_id=2),
	Aluno(nome="Beatriz Silva", data_nascimento=date(2008, 9, 30), email="beatriz.silva@email.com", status="ativo", turma_id=2),
	# 3º Ano
	Aluno(nome="Gabriel Oliveira", data_nascimento=date(2007, 1, 25), email="gabriel.oliveira@email.com", status="ativo", turma_id=3),
	Aluno(nome="Juliana Costa", data_nascimento=date(2007, 4, 12), email="juliana.costa@email.com", status="ativo", turma_id=3),
	Aluno(nome="Vinícius Ramos", data_nascimento=date(2007, 8, 3), email="vinicius.ramos@email.com", status="ativo", turma_id=3),
	# Alunos sem turma ou inativos
	Aluno(nome="Carla Mendes", data_nascimento=date(2009, 5, 20), email="carla.mendes@email.com", status="inativo", turma_id=None),
	Aluno(nome="Felipe Santos", data_nascimento=date(2008, 10, 14), email="felipe.santos@email.com", status="inativo", turma_id=None),
	Aluno(nome="Isabela Rocha", data_nascimento=date(2007, 12, 8), email="isabela.rocha@email.com", status="inativo", turma_id=None)
]
for a in alunos:
	db.add(a)
db.commit()
db.close()
