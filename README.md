# Reajuste Salarial (App)

Aplicativo simples em Node.js que calcula o reajuste salarial de um funcionário a partir de parâmetros informados pela URL.

Como funciona
- A URL espera os parâmetros: `idade`, `sexo`, `salario_base`, `anoContratacao`, `matricula`.
- Exemplo:

  https://seu-dominio/?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345

Conteúdo adicionado para deploy no Vercel
- `api/index.js` — função serverless que processa os parâmetros e retorna a página HTML com o resultado.
- `vercel.json` — rota que reescreve `/` para a função `/api`.

Rodando localmente

1. Instale dependências:

```powershell
npm install
```

2. Rode localmente (usa `reajuste/index.js` como servidor de desenvolvimento):

```powershell
npm start
```

3. Teste no navegador:

http://localhost:3000/

ou exemplo com parâmetros:

http://localhost:3000/?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345

Preparar e publicar no GitHub

1. Commit local (PowerShell):

```powershell
git add . ; git commit -m "Reajuste salarial app"
```

2. Criar repositório no GitHub (web) e depois:

```powershell
git branch -M main
git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
git push -u origin main
```

Deploy no Vercel (integração com GitHub — recomendado)

1. No vercel.com conecte sua conta ao GitHub e crie um novo projeto a partir do repositório.
2. O Vercel irá detectar a função em `api/` e publicar automaticamente.

Deploy via Vercel CLI (alternativa)

```powershell
npm i -g vercel
vercel login
vercel --prod
```

Observações
- Se preferir manter o servidor Node com `app.listen`, use serviços como Railway ou Render que suportam processos Node persistentes.
