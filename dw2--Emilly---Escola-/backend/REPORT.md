
# Relatório Técnico - Gestão Escolar

## Arquitetura do Sistema
![Diagrama simples](./arquitetura.png)

Fluxo: Front-end (HTML/CSS/JS) → API FastAPI (Python) → SQLAlchemy ORM → SQLite (app.db) → Resposta JSON

## Tecnologias e Versões
- Python 3.x
- FastAPI
- SQLAlchemy
- SQLite
- HTML5, CSS3, JavaScript ES6+
- Extensões VSCode: REST Client, Thunder Client
- Copilot (sugestões e ajustes)

## Prompts do Copilot (exemplos)
- "Implemente validação de faixa etária mínima de 5 anos no cadastro de aluno."
- "Adicione exportação CSV/JSON da lista de alunos filtrada."
- "Crie tela de login com nome e email."
- "Aplique acessibilidade: foco visível, aria-label, aria-live."
- "Implemente filtro avançado e ordenação persistida."
- "Gere seed com turmas e alunos realistas."

## Peculiaridades implementadas
- Validações customizadas (faixa etária, email, status)
- Filtro avançado e ordenação persistida (localStorage)
- Exportação CSV/JSON
- Acessibilidade real (foco, aria, feedbacks)

## Validações
- Front-end: nome, data, email, status, faixa etária
- Back-end: faixa etária, email, status

## Acessibilidade
- Foco visível, aria-labels, aria-live, navegação por teclado

## Como rodar o sistema
1. Instale dependências Python: `pip install -r requirements.txt`
2. Execute o seed: `python seed.py`
3. Inicie a API: `uvicorn app:app --reload`
4. Abra o index.html no navegador

## Prints/GIFs
Adicione aqui prints das telas principais e funcionalidades.

## Limitações e melhorias futuras
- Não há autenticação real (login é apenas visual)
- Não há upload de fotos de alunos
- Melhorias possíveis: dashboard, relatórios avançados, permissões
