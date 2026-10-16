# Verificação dos comparadores de corretoras - 2026-10-16

Verificação quinzenal do dia 16. Cobre `data/corretoras.json` (verificado a 2 de outubro de
2026, 15 corretoras) e `eu/data/brokers.json` (verificado a 28 de setembro de 2026,
13 corretoras).

**Nada foi alterado.** Nem os ficheiros de dados, nem o JS, nem o CSS, nem o Webflow.
Este ficheiro é só o relatório.

## Taxa de referência

Taxa de facilidade de depósito do BCE: **2,50%, inalterada desde 16 de setembro de 2026**
(quadro das taxas diretoras do BCE, 2026-10-16). As mudanças abaixo são decisões das próprias
corretoras.

## Mudou

### Juros sobre dinheiro não investido

- **Interactive Brokers**: a tabela de taxas por moeda publica hoje, em euros e na conta Pro,
  **0% até 10.000€ e 1,985% acima** (benchmark menos 0,5 pp). O `brokers.json` tem 1,93% e o
  `corretoras.json` tem 1,273%. Os dois estão errados e, pior, discordam entre si. O escalão
  de 0% nos primeiros 10.000€ não está em nenhum dos dois ficheiros, embora a nota do
  `brokers.json` já diga "on balances above €10,000". A página diz "Rates as of September 18,
  2026" (interactivebrokers.ie/en/accounts/fees/pricing-interest-rates.php, 2026-10-16)
- **XTB**: mudou a estrutura da campanha, não a taxa base. A base mantém-se em **1,10%**, mas a
  página alemã de juros publica agora um **Willkommenszins de 4,50% até 20.000€ nos primeiros
  90 dias, para contas abertas entre 14/10/2026 e 31/12/2026**, com a condição de pelo menos
  uma ordem de ações ou ETF por mês de calendário. Os 3,50% até 100.000€ que temos na nota
  passaram a ser o **Vorzugszins**, ou seja, a taxa de quem abriu conta **antes de 14/10/2026**.
  A nota do `brokers.json` descreve a campanha antiga como se fosse a atual. A campanha nova
  arrancou há dois dias (xtb.com/de/zinsen, 2026-10-16)
- **Lightyear**: o Savings passa de 2,42% a 2,43% para **2,45% APY** em euros. A página de
  preços diz "Up to 2.45% APY on your Euros" e, na linha dos fundos monetários, "Interest rates
  shown are what you get after fees", ou seja já é líquido. A exclusão da Bélgica mantém-se,
  confirmada em "Together they cover all markets we're available in, except Belgium"
  (lightyear.com/en-eu/vaults e /pricing, 2026-10-16)

### Confirmado sem alteração

Trade Republic 2,50% (ver ressalva abaixo), Scalable Capital 2,60% na conta Overnight,
BUX 0% no Basic e 2,00% no Prime, eToro 0% em euros com 3% e 3,80% só sobre saldos em dólares,
Revolut 0% na conta de investimento.

### Detalhe em falta nas fichas, não é erro mas fica curto

- **BUX**: temos "Plus: 1,75% e Prime: 2,00% até 100.000€" mas falta o que acontece acima de
  100.000€, que a página de comissões publica: **Plus cai para 0% e Prime para 1,65%**
  (bux.com/fees/, 2026-10-16)
- **Scalable Capital**: os 2,60% são só da conta Overnight. A mesma página lista
  **"Broker cash: 0% p.a."**, o que a ficha não diz (de.scalable.capital/en/trading-costs, 2026-10-16)
- **Trade Republic**: a taxa é por país e varia muito mais do que o campo deixa ver. A página
  alemã diz 2,5% sobre saldo ilimitado, a italiana 3% para novos clientes até 50.000€, e a
  **portuguesa contradiz-se a si própria**, com o título a dizer 2,5% e a descrição 3% até
  50.000€. Em todas as páginas a taxa aparece só no título e nos metadados, nunca no corpo
  renderizado (traderepublic.com/en-de/interest, /en-it/interest, /en-pt/interest, 2026-10-16)

## Afiliados e ofertas

### Oferta com data de fim, o caso do DEGIRO

A campanha **não acabou, foi prolongada**. A homepage irlandesa do DEGIRO publica hoje
"For a limited time, your first transaction fees and handling costs up to €100 are on us" e
**"The offer is valid until (including) 31 October 2026"**, com as comissões elegíveis a correr
até **30 de novembro de 2026** e reembolso no início de dezembro. O comparador tem
"until 30 September 2026", que é uma data já passada (degiro.ie, 2026-10-16).

Ressalva honesta: isto foi lido **só no degiro.ie**. O texto do comparador fala em "new clients"
sem país e o artigo fala em "Europe and the UK". Não confirmei a data noutros domínios do DEGIRO,
por isso não sei se o 31 de outubro vale fora da Irlanda.

Segunda coisa: o **artigo `/articles/degiro-bonus` deixou de ter data nenhuma**. Foi reescrito
para o passado, com "has run welcome offers where new clients ... could get up to €/£100 in
transaction fees reimbursed" e, na tabela, "Promotion period: Set for each campaign. Check the
current offer and terms on DEGIRO's website". O valor de €/£100 continua a bater certo com o
comparador, mas o artigo já não serve para confirmar data nenhuma. Tens duas decisões: a data a
pôr no comparador, e se o artigo deve voltar a ter data.

Nenhuma outra oferta do `brokers.json` tem data de fim marcada.

### Códigos promocionais

- **Trading 212, código IITW**: bate certo. O artigo diz "Free fractional share worth up to €100"
  e confirma o IITW. Nota lateral: o artigo diz que os termos foram "checked on 7 August 2026",
  ou seja tem dois meses (/articles/trading-212-promo-code, 2026-10-16)
- **XTB, código IITW**: bate certo. "IITW is the EU Personal Finance referral code"
  (/articles/xtb-referral-code, 2026-10-16)
- **Lightyear, código INVESTINGINTHEWEB**: bate certo (/articles/lightyear-promo-code, 2026-10-16)

### Ofertas que já não batem certo com o artigo

- **eToro**: o comparador tem a oferta sem código, mas o artigo publica hoje o código
  **4mCuruK** sob o cabeçalho "Promo code". O valor bate certo, "up to $500" com os escalões
  $40, $100, $300 e $500 (/articles/etoro-promo, 2026-10-16)
- **Freedom24**: o comparador diz "promo code required" sem dizer qual. O artigo lista quatro
  códigos acumuláveis por escalão, **WELCOME1, WELCOME5, WELCOME20 e WELCOME50**, com mínimo de
  1.000€ (/articles/freedom24-promo-codes-and-bonuses, 2026-10-16)
- **Revolut**: o valor "€10 to €30" bate certo com o artigo, mas o artigo tem um problema
  próprio: o campo "Promo code" tem botão de copiar e **nenhum código renderizado**, e o botão
  está rotulado "Copiar", em português, num site inglês
  (/articles/revolut-welcome-promo-bonus, 2026-10-16)

### Links de afiliado

Abrem e levam ao sítio certo:

- `/visit/trade-republic` redireciona para traderepublic.com/en-ie com os parâmetros de
  tracking. Ressalva: o redirecionamento leva `ad_name=pedrofintech_`, que não é um tag do
  eupersonalfinance. Vale confirmar se a atribuição está correta
- `/visit/etoro` redireciona para `go.etoro.com/en/deposit/tiered-bonus`, que mostra exatamente
  a oferta que o comparador promete, "GET UP TO $500 WORTH IN FREE ASSETS" com os quatro
  escalões. É o único link cuja página de destino mostra a oferta
- `link-pso.xtb.com/pso/EHB4E` redireciona para `xtb.com/int` com `partnerId=38654&label=Eupf`
- `interactivebrokers.ie/mkt/?src=iitww1...` abre direto, sem redirecionamento

Abrem mas levam a uma homepage genérica, sem a oferta:

- **`/visit/degiro`** redireciona para `degiro.com` global, que não menciona a campanha dos
  €100. Enquanto a campanha está viva na Irlanda, o clique vai parar a uma página que não a
  mostra
- **`link-pso.xtb.com/pso/EHB4E`** cai no `xtb.com/int`, que não tem oferta de ação grátis
  nenhuma, enquanto o artigo promete uma

Nenhum 404 entre os que foi possível ler.

### Não consegui testar

- **`lp.freedom24.com/en/begin?utm_source=3025...`**: devolveu erro de cliente nas duas
  tentativas. Pode ser bloqueio a robots ou pode ser um link morto, e não dá para distinguir.
  **É o candidato mais provável a estar genuinamente partido.** Vale um clique teu
- **`trading212.com/join/IITW`**, **`/visit/lightyear`**, **`/visit/trading212`**,
  **`revolut.ngih.net/mOAZg7`** e **`partner.scalable-capital.de/go.cgi?...`**: ROBOTS_DISALLOWED,
  três tentativas cada. O `robots.txt` do eupersonalfinance.eu não tem regras de Disallow e
  outros três `/visit/` do mesmo host responderam bem na mesma ronda, por isso o bloqueio vem
  dos hosts de destino. Não são 404, são simplesmente ilegíveis por esta via

As entradas com `cta.plain` a true, Saxo, BUX e Bitpanda, continuam propositadamente sem
afiliado e não foram tocadas.

## Disponibilidade por país no eu/data/brokers.json

**Nenhuma lista mudou.** Cruzei o campo `countries` de cada corretora com o que a própria
publica hoje e bate tudo certo. O caso que valia a pena olhar é a Trading 212: a lista oficial
por entidade dá EU GmbH em DE, AT, DK, FI, FR, IS, IE, LI, LU, NL, NO, PT, ES, SE e CH, e
Markets Ltd em BG, HR, CZ, EE, GR, HU, IT, LV, LT, MT, PL, CY, RO, SK e SI. A união são os 29
países do EEE menos a Bélgica, que é exatamente o que lá está. A Suíça aparece na lista oficial
mas está fora do EEE e por isso fora do comparador, e bem
(helpcentre.trading212.com, 2026-10-16).

As quatro corretoras com `countries` a null, xtb, freedom24, saxo e bitpanda, continuam sem
lista publicada. Não há nada a inventar.

## Build de produção e de staging

**Divergiram.** `eu/broker-comparator.js` e `eu/broker-comparator-staging.js` não são iguais,
numa linha:

```
linha 222, produção:  var t=String(v).replace(/[\s €]/g,'');
linha 222, staging:   var t=String(v).replace(/[\s €]/g,'');
```

O staging tem um espaço não separável (U+00A0, bytes C2 A0) dentro da classe de caracteres e a
produção tem só um espaço normal. É dentro do `parseNum`, a função que aceita 1.234,56 e
1,234.56.

**Na prática não muda nada**, porque o `\s` do JavaScript já inclui o U+00A0, por isso as duas
versões fazem o mesmo. Mas os ficheiros deixaram de ser cópia um do outro, que é o que
interessa não deixar passar.

De onde veio: a produção foi criada a 2026-09-29 no commit fc0aa44, descrito como "cópia exata
do build atual (-staging)", e o U+00A0 tinha entrado no staging nesse mesmo dia, no commit
0dd3b49 das traduções. A cópia perdeu o carácter. Desde aí os dois ficheiros só receberam a
pré-seleção da XTB, a 2026-09-30, em commits separados mas equivalentes.

`eu/broker-comparator.css` e `eu/broker-comparator-staging.css` têm o mesmo SHA
(d4c548729809693f885582031817351656ebc8f1). O CSS está bem.

## Traduções desatualizadas

Se aprovares as mudanças acima, estas linhas do `eu/data/i18n.nl.json` e do
`eu/data/i18n.pl.json` ficam desatualizadas. Os dois ficheiros têm a mesma estrutura, por isso
são as mesmas chaves nos dois. Não traduzi nem corrigi nada.

- `brokers.ibkr.t.interest.v`, hoje "1,93%" em NL
- `brokers.ibkr.t.interest.s`, que descreve o spread mas não o escalão de 0%
- `brokers.xtb.t.interest.s`, hoje "Tot €100.000. In sommige landen een hogere rente de eerste
  90 dagen, bijvoorbeeld 3,50% in DE, FR en ES..." em NL, que descreve a campanha antiga
- `brokers.lightyear.t.interest.s`, hoje "...2,42% tot 2,43% per jaar..." em NL
- `brokers.degiro.offer.t`, hoje "Tot €/£100 aan transactiekosten vergoed voor nieuwe klanten,
  tot 30 september 2026" em NL
- `brokers.trading212.t.interest.v` e `.s`, se e quando a Trading 212 se confirmar

O campo `translated_from` dos dois ficheiros diz "2026-09-28" e também fica a precisar de
atualização.

## Páginas por país e contagens

**As contagens não mudam.** Nenhuma disponibilidade por país mudou, por isso o número de
corretoras abertas a residentes de cada país continua igual e as descrições SEO dos itens da
coleção Broker Countries continuam certas.

## Resumos estáticos por país

O campo Summary dos itens da coleção **Broker Countries** é gerado a partir do `brokers.json` e
leva a lista de corretoras, a proteção e as contagens. Como nada disso mudou, o conteúdo
mantém-se válido.

O que fica desatualizado, se aprovares as mudanças, é a **data de verificação**, hoje
"28 September 2026" no campo `verified`, que o resumo também mostra. Isso afeta **todos os
países** da coleção, incluindo os itens Netherlands e Poland nos respetivos locales.

Se decidires pôr os juros da IBKR, da XTB ou da Lightyear no resumo, ou a oferta do DEGIRO, aí
sim o texto muda de conteúdo. Não escrevi nada no Webflow.

## Comparador português, data/corretoras.json

Além da IBKR, acima, há uma data a confirmar na ficha da XTB. O campo diz "2,60% nos primeiros
90 dias ... Depois: 1,10% (taxas de 05/10/2026)". A campanha que a XTB publica hoje é diferente
da que estava em vigor a 5 de outubro, e a taxa portuguesa de boas-vindas não foi verificada
nesta ronda, só a alemã. Fica por confirmar na página portuguesa da XTB.

A Trade Republic tem "3% até 50.000€" para novos clientes, coerente com o que a página italiana
publica, mas a página portuguesa contradiz-se, como fica dito acima.

Nenhuma corretora portuguesa tem campo `offer`, por isso não há ofertas de inscrição a verificar
deste lado.

## Próximo passo

Rever este relatório. Só depois do teu ok é que se editam `data/corretoras.json` e
`eu/data/brokers.json`, se alinham os dois ficheiros de build, se regeneram os resumos por país
e se atualizam as traduções.
