#!/usr/bin/env python3
"""Aplica as alteracoes da verificacao de 2026-11-16 aos dois ficheiros de dados.

Aprovado pelo Franklin a 2026-11-16. Substituicao de texto com guarda: se o
texto antigo nao estiver la exatamente uma vez, o script para e nao grava nada.

Fontes e raciocinio em verificacao/2026-11-16/relatorio.md.

  IBKR       2,049% / 2.049%  ->  1,985% / 1.985%   tabela de EUR da IBKR, tier
                                  acima de 10.000, "1.985% (BM - 0.5%)", IBKR Pro
  Lightyear  2.46% APY        ->  2.48% APY          lightyear.com/en-eu/vaults

Uso:  python3 verificacao/2026-11-16/aplicar.py
      python3 verificacao/2026-11-16/aplicar.py --dry-run
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DRY = "--dry-run" in sys.argv

TROCAS = {
    "data/corretoras.json": [
        ('"v": "2,049%",\n     "s": "Nada nos primeiros 10.000€ e 2,049% acima disso (taxa de referência menos 0,5 p.p.). Proporcional se o património for inferior a 100.000$. Taxa de 01/11/2026"',
         '"v": "1,985%",\n     "s": "Nada nos primeiros 10.000€ e 1,985% acima disso (taxa de referência menos 0,5 p.p.). Proporcional se o património for inferior a 100.000$. Taxa de 16/11/2026"'),

        ('"verificado": "1 de novembro de 2026"',
         '"verificado": "16 de novembro de 2026"'),
    ],
    "eu/data/brokers.json": [
        ('"interest": {"v": "2.049%", "s": "Nothing on the first €10,000, then 2.049% above that (benchmark minus 0.5 pp). Pro-rated if your account is under $100,000. Rate as of 1 November 2026"}',
         '"interest": {"v": "1.985%", "s": "Nothing on the first €10,000, then 1.985% above that (benchmark minus 0.5 pp). Pro-rated if your account is under $100,000. Rate as of 16 November 2026"}'),

        ('The Savings money market fund pays 2.46% APY in euros',
         'The Savings money market fund pays 2.48% APY in euros'),

        ('"verified": "1 November 2026"',
         '"verified": "16 November 2026"'),
    ],
}

falhas, feito, novos = [], [], {}

for rel, pares in TROCAS.items():
    p = ROOT / rel
    txt = p.read_text(encoding="utf-8")
    for antigo, novo in pares:
        n = txt.count(antigo)
        if n != 1:
            falhas.append("%s: encontrei %d ocorrencias de %r, esperava 1" % (rel, n, antigo[:70]))
            continue
        txt = txt.replace(antigo, novo)
        feito.append("%-22s %s" % (rel, novo.replace("\n", " ")[:80]))
    novos[p] = txt

for f in feito:
    print("  ", f)
print("\n%d trocas." % len(feito))

if falhas:
    print("\nNADA FOI GRAVADO. %d problemas:" % len(falhas))
    for f in falhas:
        print("  ", f)
    sys.exit(1)

if DRY:
    print("\n--dry-run: nada gravado.")
    sys.exit(0)

for p, txt in novos.items():
    json.loads(txt)          # nao gravar JSON partido
    p.write_text(txt, encoding="utf-8")
    print("gravado:", p.relative_to(ROOT))
