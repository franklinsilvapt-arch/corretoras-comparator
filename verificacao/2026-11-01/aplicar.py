#!/usr/bin/env python3
"""Aplica as alteracoes da verificacao de 2026-11-01 aos dois ficheiros de dados.

Faz substituicao de texto, nao reescreve o JSON, para o diff ficar pequeno e a
formatacao de cada ficheiro ficar exatamente como esta.

Cada troca tem um guarda: se o texto antigo nao estiver la exatamente uma vez,
o script para e nao grava nada. Isso impede que um patch escrito a partir de
dados velhos sobreponha em silencio uma alteracao mais recente.

Fontes e raciocinio em verificacao/2026-11-01/relatorio.md e adenda.md.

  IBKR    1,985% / 1.968%  ->  2,049%   tabela da IBKR Irlanda, EUR acima de
                                        10.000, BM menos 0,5 pp, lida 2026-11-01
  XTB PT  2,60% ate 100.000 ->  4,50% ate 20.000, contas abertas entre
                                        14/10/2026 e 31/12/2026, xtb.com/pt/juros

Uso:  python3 verificacao/2026-11-01/aplicar.py
      python3 verificacao/2026-11-01/aplicar.py --dry-run
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DRY = "--dry-run" in sys.argv

TROCAS = {
    "data/corretoras.json": [
        ('"v": "1,985%",\n     "s": "Nada nos primeiros 10.000€ e 1,985% acima disso (taxa de referência menos 0,5 p.p.). Proporcional se o património for inferior a 100.000$. Taxa de 18/09/2026"',
         '"v": "2,049%",\n     "s": "Nada nos primeiros 10.000€ e 2,049% acima disso (taxa de referência menos 0,5 p.p.). Proporcional se o património for inferior a 100.000$. Taxa de 01/11/2026"'),

        ('"v": "2,60% nos primeiros 90 dias",\n     "s": "Até 100.000€. Depois: 1,10% (taxas de 05/10/2026)"',
         '"v": "4,50% nos primeiros 90 dias",\n     "s": "Até 20.000€, para contas abertas entre 14/10/2026 e 31/12/2026, com pelo menos uma ordem de ações ou ETFs por mês civil. Quem abriu conta antes de 14/10/2026 tem taxa preferencial até 100.000€ nos primeiros 90 dias. Depois aplica-se a taxa padrão, que a XTB não imprime no site. Taxas de 01/11/2026"'),

        ('"verificado": "16 de outubro de 2026"',
         '"verificado": "1 de novembro de 2026"'),
    ],
    "eu/data/brokers.json": [
        ('"interest": {"v": "1.968%", "s": "Nothing on the first €10,000, then 1.968% above that (benchmark minus 0.5 pp). Pro-rated if your account is under $100,000. Rate as of 20 October 2026"}',
         '"interest": {"v": "2.049%", "s": "Nothing on the first €10,000, then 2.049% above that (benchmark minus 0.5 pp). Pro-rated if your account is under $100,000. Rate as of 1 November 2026"}'),

        ('"verified": "16 October 2026"',
         '"verified": "1 November 2026"'),
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
