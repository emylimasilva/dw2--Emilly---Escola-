
# Backend - Gestão Escolar

API desenvolvida com FastAPI, SQLAlchemy e SQLite.

## Como rodar o projeto
1. Instale as dependências:
	```
	pip install -r requirements.txt
	```
2. Popule o banco de dados:
	```
	python seed.py
	```
3. Inicie a API:
	```
	uvicorn app:app --reload
	```
4. Abra o arquivo `frontend/index.html` no navegador.

## Tecnologias utilizadas
- Python 3.x
- FastAPI
- SQLAlchemy
- SQLite
- HTML5, CSS3, JavaScript ES6+

## Estrutura do projeto
- backend/
  - app.py
  - models.py
  - database.py
  - seed.py
  - requirements.txt
  - api-tests.http
- frontend/
  - index.html
  - style.css
  - script.js

## Prints das telas principais
Adicione aqui prints do sistema rodando (login, listagem, cadastro, filtros, exportação, etc):

![Tela de Login](../frontend/print-login.png)
![Listagem de Alunos](../frontend/print-lista.png)
![Cadastro de Aluno](../frontend/print-cadastro.png)

## Observações
- Para testar a API, utilize o arquivo `api-tests.http` ou Thunder Client/Insomnia.
- Para dúvidas, consulte o arquivo REPORT.md.
