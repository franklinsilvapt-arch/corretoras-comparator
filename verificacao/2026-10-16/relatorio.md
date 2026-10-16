# Verificação dos comparadores de corretoras - 2026-10-16

Verificação quinzenal do dia 16. Cobre `data/corretoras.json` (verificado a 2 de outubro de
2026, 15 corretoras) e `eu/data/brokers.json` (verificado a 28 de setembro de 2026,
13 corretoras).

**Nada foi alterado.** Nem os ficheiros de dados, nem o JS, nem o CSS, nem o Webflow.
Este ficheiro é só o relatório.

Três pontos que a sessão automática não conseguiu fechar foram resolvidos com capturas de ecrã
e com informação do Franklin, a 2026-10-16: Trading 212, Freedom24 e Trade Republic. Estão
marcados abaixo.

## Taxa de referência

Taxa de facilidade de depósito do BCE: **2,50%, inalterada desde 16 de setembro de 2026**
(quadro das taxas diretoras do BCE, 2026-10-16). As mudanças abaixo são decisões das próprias
corretoras.

## Mudou

### Juros sobre dinheiro não investido

- **Trading 212**, confirmado por captura, e é a mudança maior desta ronda. A página portuguesa
  publica hoje **4,2% em euros**, em título ("Ganhe 4,2% sobre o seu capital EUR"), com
  "Pagos diariamente. Sem mínimos ou limites." O comparador tem `interest.v` a
  **"2.50% to 3.50%"**, que já não é o que a corretora anuncia.

  A nota guardada também está errada em dois pontos concretos. O rodapé da página diz:
  "4,2% é uma taxa promocional variável durante 4 meses a partir da ativação apenas para novos
  clientes Invest." Ou seja:
  - os 4 meses contam **a partir da ativação de cada cliente**, não de uma janela fixa. A nossa
    nota diz "accounts opened by 2 Nov 2026", e **essa data não aparece em lado nenhum na página**
  - **os 2,80% a partir de 1 de novembro de 2026 também não aparecem**. Não consigo nem
    confirmar nem desmentir esse degrau: a página não o menciona e o resto do site não publica
    taxas em HTML

  A página traz ainda a tabela completa por moeda, que o comparador não usa mas vale registar:
  USD 3,3%, GBP 3,55%, HUF 3%, PLN 2,25%, CZK 3%, RON 3,5%, DKK 0,25%, NOK 0,25%, SEK 0,5%
  (trading212.com/pt/interest-on-cash, 2026-10-16)

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

- **Trade Republic**: **3% para novos clientes e 2,50% para clientes atuais**, confirmado pelo
  Franklin. É exatamente a forma que o `brokers.json` tem no campo e na nota, por isso a ficha
  fica como está. Continua a valer a pena saber que a taxa é por país e que a página portuguesa
  se contradiz a si própria, com o título a dizer 2,5% e a descrição 3% até 50.000€, mas isso é
  um problema do site da Trade Republic, não do nosso ficheiro
- Scalable Capital 2,60% na conta Overnight, BUX 0% no Basic e 2,00% no Prime, eToro 0% em
  euros com 3% e 3,80% só sobre saldos em dólares, Revolut 0% na conta de investimento

### Detalhe em falta nas fichas, não é erro mas fica curto

- **BUX**: temos "Plus: 1,75% e Prime: 2,00% até 100.000€" mas falta o que acontece acima de
  100.000€, que a página de comissões publica: **Plus cai para 0% e Prime para 1,65%**
  (bux.com/fees/, 2026-10-16)
- **Scalable Capital**: os 2,60% são só da conta Overnight. A mesma página lista
  **"Broker cash: 0% p.a."**, o que a ficha não diz (de.scalable.capital/en/trading-costs, 2026-10-16)

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
- **Freedom24: está bom.** O erro de cliente que apanhei em
  `lp.freedom24.com/en/begin?utm_source=3025&utm_medium=affiliates&utm_campaign=mc_inaff_1106&utm_term=3025&s_id=GAds`
  **era bloqueio ao robot, não link partido**: o Franklin confirmou que os links de afiliado da
  Freedom24 estão a funcionar, por exemplo no artigo
  `literaciafinanceira.pt/artigos/analise-freedom24-portugal`. Retiro o alerta. Fica só a nota
  de que o `cta.href` do `brokers.json` não é o mesmo endereço que o artigo português usa, por
  isso se quiseres certeza absoluta sobre este em concreto é um clique, mas não há sinal de
  problema

Abrem mas levam a uma homepage genérica, sem a oferta:

- **`/visit/degiro`** redireciona para `degiro.com` global, que não menciona a campanha dos
  €100. Enquanto a campanha está viva na Irlanda, o clique vai parar a uma página que não a
  mostra
- **`link-pso.xtb.com/pso/EHB4E`** cai no `xtb.com/int`, que não tem oferta de ação grátis
  nenhuma, enquanto o artigo promete uma

Nenhum 404 em nenhum dos links.

### Não consegui testar

`trading212.com/join/IITW`, `/visit/lightyear`, `/visit/trading212`, `revolut.ngih.net/mOAZg7`
e `partner.scalable-capital.de/go.cgi?...`: ROBOTS_DISALLOWED, três tentativas cada. Pelo que
se viu com a Freedom24, o mais provável é que estejam todos bons e o bloqueio seja ao robot.
Não são 404.

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

Verifiquei os **três** pares do repositório, não só o do EU. O resultado muda a conclusão que
tinha escrito na primeira versão deste relatório: **só um deles é que divergiu por engano.**

### 1. Par EU, `eu/broker-comparator.*` — divergiu por engano

O CSS está bem, mesmo SHA nos dois (`d4c548729809693f885582031817351656ebc8f1`). O JS não:

```
linha 222, produção:  var t=String(v).replace(/[\s €]/g,'');      <- \s, espaço normal, €
linha 222, staging:   var t=String(v).replace(/[\s<U+00A0>€]/g,''); <- \s, espaço inquebrável, €
```

Repara que não é "o staging tem um carácter a mais": o staging **trocou** o espaço normal por um
espaço inquebrável (U+00A0, bytes C2 A0). É dentro do `parseNum`, a função que aceita 1.234,56 e
1,234.56.

**Na prática não muda nada**, porque o `\s` do JavaScript já cobre tanto o espaço normal como o
U+00A0. As duas versões fazem exatamente o mesmo. Mas os ficheiros deixaram de ser cópia um do
outro, que é o que interessa não deixar passar.

De onde veio: a produção foi criada a 2026-09-29 no commit fc0aa44, descrito como "cópia exata
do build atual (-staging)", e o U+00A0 tinha entrado no staging nesse mesmo dia, no commit
0dd3b49 das traduções. A cópia perdeu o carácter.

**Não corrigi este ficheiro, e foi uma decisão deliberada.** O `git push` está bloqueado pelo
proxy desta sessão e a API só escreve ficheiros inteiros, o que me obrigava a reescrever 44.634
bytes à mão. O ficheiro tem uma linha de 13.162 caracteres (a tabela `STR` com a interface toda
em inglês, neerlandês e polaco) e 540 caracteres não-ASCII, incluindo o próprio U+00A0, que é
invisível. Reescrever isso à mão para corrigir uma diferença que não tem efeito nenhum é trocar
um problema cosmético por um risco real de partir o comparador em três línguas, em produção.
Fica para um comando local, que está no fim deste ficheiro.

### 2. Par PT, `comparador-corretoras.*` — diverge de propósito, está certo assim

O CSS é igual nos dois. O JS difere em 42 linhas, **e tem de ser assim**:

- o staging faz `Promise.all` de `corretoras.json` **e** `corretoras-staging-patch.json` e
  aplica o patch por cima dos dados (`cta`, `t` e `add`). A produção lê só o `corretoras.json`
- a produção tem um `lfGet` com nova tentativa e chave de cache horária, que o staging não tem,
  para o comparador não ficar em branco num soluço do GitHub Pages

Ou seja, a regra "qualquer alteração tem de ir aos dois ficheiros" vale para o par EU e **não**
vale literalmente para o par PT, onde há diferenças estruturais que existem de propósito. Vale
a pena ter isto escrito, para não aparecer alguém (eu, numa próxima ronda) a "corrigir" o par
PT e a partir o staging.

### 3. Par UAE, `uae/broker-comparator.*` — diferença só de comentário

O JS é igual. O CSS difere numa linha, a primeira:

```
produção: /* Broker comparator - BrokerMatch UAE (production: copy of the staging file, 12 Oct 2026) */
staging:  /* Broker comparator - BrokerMatch UAE */
```

É uma marca de proveniência, não tem efeito nenhum. Fica ao teu critério se queres alinhar.

### Comando para alinhar o par EU

A partir da raiz do repositório, com o repositório atualizado:

```sh
cp eu/broker-comparator-staging.js eu/broker-comparator.js
git commit -am "EU: produção volta a ser cópia exata do staging"
git push
```

Se preferires o contrário, que é defensável porque tira do código um carácter invisível que foi
precisamente a causa desta confusão, o comando é este, e não mexe em nenhum outro byte:

```sh
python3 - <<'EOF'
import io
p = 'eu/broker-comparator-staging.js'
s = io.open(p, encoding='utf-8').read()
old = "var t=String(v).replace(/[\\s €]/g,'');"
new = "var t=String(v).replace(/[\\s €]/g,'');"
assert s.count(old) == 1, s.count(old)
io.open(p, 'w', encoding='utf-8').write(s.replace(old, new))
EOF
cmp eu/broker-comparator.js eu/broker-comparator-staging.js && echo "iguais"
```

### Guarda para não voltar a acontecer

Tentei acrescentar um GitHub Action que falha quando o par EU diverge, mas a app do GitHub que
esta sessão usa não tem permissão para escrever em `.github/workflows/`. Deixo o ficheiro
pronto em `verificacao/2026-10-16/build-par-eu.yml`: se o copiares para
`.github/workflows/build-par-eu.yml`, qualquer push que desalinhe o par EU passa a falhar, com
o diff e com o `cat -A` ao lado para apanhar espaços invisíveis como este. Só verifica o par
EU, pelas razões dos pontos 2 e 3.

## Traduções desatualizadas

Se aprovares as mudanças acima, estas linhas do `eu/data/i18n.nl.json` e do
`eu/data/i18n.pl.json` ficam desatualizadas. Os dois ficheiros têm a mesma estrutura, por isso
são as mesmas chaves nos dois. Não traduzi nem corrigi nada.

- `brokers.trading212.t.interest.v`, hoje "2,50% tot 3,50%" em NL, e `.s`, que tem a data de
  2 de novembro e os 2,80% que a página não suporta. Esta é agora a linha mais errada das seis
- `brokers.ibkr.t.interest.v`, hoje "1,93%" em NL
- `brokers.ibkr.t.interest.s`, que descreve o spread mas não o escalão de 0%
- `brokers.xtb.t.interest.s`, hoje "Tot €100.000. In sommige landen een hogere rente de eerste
  90 dagen, bijvoorbeeld 3,50% in DE, FR en ES..." em NL, que descreve a campanha antiga
- `brokers.lightyear.t.interest.s`, hoje "...2,42% tot 2,43% per jaar..." em NL
- `brokers.degiro.offer.t`, hoje "Tot €/£100 aan transactiekosten vergoed voor nieuwe klanten,
  tot 30 september 2026" em NL

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

Se decidires pôr os juros da IBKR, da XTB, da Lightyear ou da Trading 212 no resumo, ou a oferta
do DEGIRO, aí sim o texto muda de conteúdo. Não escrevi nada no Webflow.

## Comparador português, data/corretoras.json

Três pontos deste lado:

- **Interactive Brokers**, como acima: 1,273% está errado
- **XTB**: o campo diz "2,60% nos primeiros 90 dias ... Depois: 1,10% (taxas de 05/10/2026)".
  A campanha que a XTB publica hoje é diferente da que estava em vigor a 5 de outubro. A taxa
  portuguesa de boas-vindas não foi verificada nesta ronda, só a alemã, por isso fica por
  confirmar na página portuguesa da XTB
- **Trading 212**: o campo diz "4,20% promocional" com a nota "Contas novas abertas até
  2/11/2026, durante 4 meses. Contas antigas: 2,50%." Os 4,20% estão **certos** e confirmados na
  página portuguesa. A data de 2/11/2026 é que não aparece na página, que fala em 4 meses a
  partir da ativação. Vale rever a nota

A Trade Republic está certa, confirmada acima. Nenhuma corretora portuguesa tem campo `offer`,
por isso não há ofertas de inscrição a verificar deste lado.

## Próximo passo

Rever este relatório. Só depois do teu ok é que se editam `data/corretoras.json` e
`eu/data/brokers.json`, se alinha o par EU, se regeneram os resumos por país e se atualizam as
traduções.
