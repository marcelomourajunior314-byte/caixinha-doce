# Caixinha Doce
App (PWA, HTML puro em index.html) de controle de vendas de doces por Pix do Marcelo.
- Publicação: Cloudflare Pages ligado a este repositório → https://caixinha-doce.pages.dev (commit em main = deploy em ~1 min)
- Dados: GitHub Gist privado do usuário (arquivo caixinha-doce.json), token fica só no aparelho
- Ao mudar o app: subir APP_V em index.html e a versão do cache em sw.js
- Antes de todo commit: `node testes/rodar.mjs` (hook .githooks/pre-commit bloqueia se falhar; ativar com `git config core.hooksPath .githooks`).
- Commits: user.name "Marcelo", email marcelomourajunior314@gmail.com; responder sempre em português do Brasil
