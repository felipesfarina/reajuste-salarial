const express = require("express");
const path = require("path");
const app = express();


app.use("/img", express.static(path.join(__dirname, "img")));


function formatBRL(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

app.get("/", (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  
  if (!idade && !sexo && !salario_base && !anoContratacao && !matricula) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Reajuste Salarial - Instruções</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 2rem; background:#f4f4f4 }
          .card{ background:white; padding:1.25rem; border-radius:8px; max-width:900px; margin:0 auto}
          pre{ background:#eee; padding:10px }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Reajuste Salarial</h1>
          <p>Informe os parâmetros pela URL conforme o exemplo abaixo. Exemplo:</p>
          <pre>http://localhost:3000/?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345</pre>
          <h3>Parâmetros</h3>
          <ul>
            <li><strong>idade</strong> — inteiro, maior que 16</li>
            <li><strong>sexo</strong> — "M" ou "F" (case-insensitive)</li>
            <li><strong>salario_base</strong> — número real (ex: 1700, 1700.50)</li>
            <li><strong>anoContratacao</strong> — inteiro (ano) maior que 1960</li>
            <li><strong>matricula</strong> — inteiro maior que 0</li>
          </ul>
          <p>Ao enviar dados válidos a página retornará os dados informados e o novo salário em destaque.</p>
        </div>
      </body>
      </html>
    `);
  }

 
  const idadeNum = parseInt(idade, 10);
  const salario = parseFloat(salario_base);
  const ano = parseInt(anoContratacao, 10);
  const mat = parseInt(matricula, 10);
  const sexoUp = typeof sexo === 'string' ? sexo.toUpperCase() : sexo;
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - ano;

  const erros = [];
  if (isNaN(idadeNum) || idadeNum <= 16) erros.push("Idade inválida. Deve ser um inteiro maior que 16.");
  if (isNaN(salario) || salario <= 0) erros.push("Salário base inválido. Deve ser um número real maior que 0.");
  if (isNaN(ano) || ano <= 1960) erros.push("Ano de contratação inválido. Deve ser um inteiro maior que 1960.");
  if (isNaN(mat) || mat <= 0) erros.push("Matrícula inválida. Deve ser um inteiro maior que 0.");
  if (sexoUp !== 'M' && sexoUp !== 'F') erros.push("Sexo inválido. Use 'M' ou 'F'.");

  if (erros.length > 0) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head><meta charset="utf-8"><title>Erro - Reajuste</title></head>
      <body style="font-family:Arial;padding:2rem;background:#fff6f6;color:#600">
        <h2>Impossível realizar o cálculo — dados inválidos</h2>
        <ul>${erros.map(e => `<li>${e}</li>`).join('')}</ul>
        <p>Verifique os parâmetros e tente novamente.</p>
      </body>
      </html>
    `);
  }

  
  let reajustePct = 0;
  let adicional = 0;

  if (idadeNum >= 18 && idadeNum <= 39) {
    reajustePct = sexoUp === 'M' ? 0.10 : 0.08;
    adicional = tempoEmpresa > 10 ? (sexoUp === 'M' ? 17 : 16) : (sexoUp === 'M' ? -10 : -11);
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    reajustePct = sexoUp === 'M' ? 0.08 : 0.10;
    adicional = tempoEmpresa > 10 ? (sexoUp === 'M' ? 15 : 14) : (sexoUp === 'M' ? -5 : -7);
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    reajustePct = sexoUp === 'M' ? 0.15 : 0.17;
    adicional = tempoEmpresa > 10 ? (sexoUp === 'M' ? 13 : 12) : (sexoUp === 'M' ? -15 : -17);
  } else {
    
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head><meta charset="utf-8"><title>Erro - Reajuste</title></head>
      <body style="font-family:Arial;padding:2rem;background:#fff6f6;color:#600">
        <h2>Não foi possível calcular o reajuste</h2>
        <p>A tabela de reajustes cobre as faixas 18-39, 40-69 e 70-99 anos. Informe uma idade dentro dessas faixas.</p>
      </body>
      </html>
    `);
  }

  const novoSalario = salario + (salario * reajustePct) + adicional;

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Reajuste Salarial - Resultado</title>
      <style>
        body{ font-family: Arial, Helvetica, sans-serif; background:#f5f7fb; padding:2rem }
        .card{ max-width:800px;margin:0 auto;background:#fff;padding:1.25rem;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.08)}
        .destaque{ background:#e6ffed;border-left:4px solid #2ecc71;padding:12px;margin-top:1rem;font-size:1.2rem }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Resultado do Reajuste</h1>
        <p><strong>Matrícula:</strong> ${mat}</p>
        <p><strong>Idade:</strong> ${idadeNum} anos</p>
        <p><strong>Sexo:</strong> ${sexoUp === 'M' ? 'Masculino' : 'Feminino'}</p>
        <p><strong>Salário Base:</strong> ${formatBRL(salario)}</p>
        <p><strong>Ano de Contratação:</strong> ${ano}</p>
        <p><strong>Tempo de Empresa:</strong> ${tempoEmpresa} anos</p>
        <p><strong>Reajuste (%):</strong> ${(reajustePct*100).toFixed(0)}%</p>
        <p><strong>Adicional/Desconto (R$):</strong> ${formatBRL(adicional)}</p>

        <div class="destaque">
          Novo Salário: <strong>${formatBRL(novoSalario)}</strong>
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
