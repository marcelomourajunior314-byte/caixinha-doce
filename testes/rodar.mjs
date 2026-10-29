// Testes automáticos — rodar antes de cada commit:  node testes/rodar.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const raiz = fileURLToPath(new URL('..', import.meta.url));
let falhas = 0; const ok = (c, m) => { console.log((c ? '  ✔ ' : '  ✘ ') + m); if (!c) falhas++; };
const html = readFileSync(raiz + 'index.html', 'utf8'), sw = readFileSync(raiz + 'sw.js', 'utf8');
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];
let erro = null; try { new Function(js); } catch (e) { erro = e.message; }
ok(!erro, 'index.html: JavaScript compila' + (erro ? ' → ' + erro : ''));
ok(/const APP_V = '[\d.]+'/.test(html), 'versão do app definida (APP_V)');
ok(/const CACHE = 'caixinha-v\d+'/.test(sw), 'versão do cache definida (sw.js)');
ok(!/ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|\d{9,10}:AA[A-Za-z0-9_-]{30,}/.test(html), 'sem tokens no código');
// motor de cálculo: estoque inicial → fechamento → reposição
const ctx = {}; const fn = new Function('ctx', `
  const localStorage={getItem(){return null},setItem(){}}; const document={getElementById(){return null},querySelectorAll(){return[]},addEventListener(){},documentElement:{setAttribute(){},removeAttribute(){}}};
  ${js.slice(js.indexOf('const r2'), js.indexOf('/* ---------- Navegação'))}
  ctx.calc = (S0) => { S = S0; return calcular(); };`);
try { fn(ctx);
  const S0 = { produtos: [{ id: 'a', nome: 'Bala', preco: 1, custo: 0.4, ativo: true }], registros: {
    '2026-10-28T09:00': { tipo: 'inicial', contado: { a: 0 }, reposto: { a: 10 } },
    '2026-10-28T18:00': { tipo: 'fechamento', contado: { a: 3 }, reposto: {}, pix: 5 },
    '2026-10-29T08:00': { tipo: 'reposicao', contado: { a: 3 }, reposto: { a: 7 } } } };
  const r = ctx.calc(S0); const f = r.dias[1];
  ok(f.qtd === 7 && f.vendas === 7 && f.dif === -2 && f.custo === 2.8, 'fechamento: 7 vendidos, faltou R$ 2, custo R$ 2,80');
  ok(r.estoque.a === 10 && r.dias[2].qtd === 0, 'reposição: estoque volta a 10, sem venda');
} catch (e) { ok(false, 'motor de cálculo → ' + e.message); }
console.log(falhas ? `\n✘ ${falhas} falha(s)` : '\n✔ Tudo certo'); process.exit(falhas ? 1 : 0);
