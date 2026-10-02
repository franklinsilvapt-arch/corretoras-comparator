# Verificação dos comparadores de corretoras - 2026-10-02

Verificação quinzenal do dia 1, corrida a 2 de outubro de 2026.

Dois ficheiros neste repo:

- `data/corretoras.json`, comparador português, `verificado: 23 de setembro de 2026`, 15 corretoras
- `eu/data/brokers.json`, broker comparator do eupersonalfinance.eu, `verified: 28 September 2026`,
  13 corretoras

**Nada foi alterado.** Nem os JSON, nem os ficheiros de i18n, nem o Webflow. Este ficheiro é só
o relatório.

## Taxa de referência

Taxa de facilidade de depósito do BCE: **2,50% desde 16 de setembro de 2026**, subida de 2,25%
(BCE, quadro das taxas diretoras). É o que move os juros sobre dinheiro não investido, e é aí
que estão as mudanças deste ciclo.

## Mudou

### data/corretoras.json

- **Interactive Brokers, juros em euros**: guardado 1,858% acima de 10.000€. A tabela de taxas do
  próprio IBKR mostra hoje 0% até 10.000€ e **1,273%**, apresentado como BM menos 0,5 pontos
  percentuais, com a tabela datada de 18 de setembro de 2026. A regra de pro rata para patrimónios
  abaixo de 100.000$ mantém-se (interactivebrokers.ie, página de taxas e juros, 2026-10-02)
- **Lightyear, nota de juros**: o campo diz "Não paga juros a clientes em Portugal" e isso deixou
  de ser verdade. A página portuguesa da Lightyear mostra hoje **2,44% TAA em euros** através do
  Savings, e a página da UE anuncia 2,47% TAA. É um fundo monetário à parte e não remuneração
  automática do saldo, por isso pode fazer sentido manter `interest` a 0% e reescrever a nota ao
  estilo da nota da Revolut, mas a formulação atual está errada (lightyear.com/en-pt/vaults e
  lightyear.com/en-eu/pricing, 2026-10-02)
- **Interactive Brokers, comissão em ações portuguesas**: guardado Fixed 0,15% com mínimo de 6€.
  A página de comissões de ações europeias mostra em Lisboa mínimo de 1,25€ e máximo de 29€. A
  leitura pode ter juntado as colunas Fixed e Tiered, por isso confirmar na tabela antes de mexer
  (interactivebrokers.ie, comissões de ações na Europa, 2026-10-02)

Confirmadas sem alteração: ActivoBank, Banco BiG, Banco Carregosa, Banco Invest, DEGIRO, eToro,
Revolut, Trade Republic e XTB na parte promocional.

### eu/data/brokers.json

- **Interactive Brokers, `interest`**: guardado 1,93%. A fonte mostra hoje **1,273%** em saldos
  acima de 10.000€, com a fórmula "1.273% (BM - 0.5%)" e a tabela datada de 18 de setembro de
  2026. A nota do benchmark menos 0,5 pontos, o limiar de 10.000€ e a regra abaixo de 100.000$ de
  património continuam certos (interactivebrokers.ie, página de taxas e juros, 2026-10-02)
- **BUX, comissão por ordem**: guardado 0,99€ para ETF e para ações dos EUA, descrito como ordem
  de mercado no plano Basic. A fonte mostra hoje Basic **3,99€** por ordem, Plus **1,99€** e Prime
  **0,99€**. Os 0,99€ passaram a corresponder ao Prime e não ao Basic. A subnota de 0€ nos planos
  de investimento continua certa (bux.com/pricing e bux.com/fees, 2026-10-02)
- **BUX, nota de juros**: a nota omite a faixa acima de 100.000€. A fonte mostra Prime a pagar
  1,65% acima de 100.000€ e Plus a cair para 0% (bux.com/pricing, 2026-10-02)
- **Lightyear, taxa do fundo monetário do Savings**: guardado "2,42% a 2,43% ao ano, líquido de
  custos". A fonte mostra hoje **até 2,47% APY** em euros, com custos de 0,15% ou menos. O "sem
  juros em euros não investidos" e a exclusão da Bélgica mantêm-se (lightyear.com/en-eu/pricing,
  2026-10-02)
- **XTB, nota de câmbio**: guardado 0,5% sem subnota. O preçário acrescenta 0,8% do valor da
  transferência em fins de semana e feriados (tabela de taxas e comissões do XTB,
  versão de 14-03-2026, 2026-10-02)
- **DEGIRO, prazo da oferta**: ver o bloco de afiliados e ofertas. A campanha foi prolongada, não
  retirada

Confirmadas sem alteração: Trade Republic, DEGIRO nas comissões, eToro, Revolut, Scalable Capital,
Bitpanda nas comissões, e o XTB nas comissões e na custódia.

## Novo

Nada a acrescentar nos dois ficheiros. Nenhuma corretora da lista lançou produto, plano ou
patamar de taxa que o comparador ainda não tenha, dentro do que as fontes serviram hoje.

## Desapareceu

Nada. Nenhuma fonte mostrou produto retirado nem mercado fechado.

## Afiliados e ofertas

### Links de afiliado que abrem e aterram no sítio certo

- `visit/trade-republic`, 302 para `traderepublic.com/en-ie` com tracking da Impact Radius. Aterra
  na Trade Republic, mas o redirecionamento fixa `countryCode=IE` e as páginas alemã, holandesa e
  irlandesa anunciam taxas diferentes. Num comparador pan-europeu vale a pena olhar para isto
- `visit/degiro`, 302 para `degiro.com` com parâmetros de tracking. É a raiz do site e não a
  landing page da campanha dos 100€ reembolsados
- `visit/etoro`, 302 para `go.etoro.com/en/deposit/tiered-bonus`. Destino certo para o bónus
  faseado por depósito
- IBKR, `interactivebrokers.ie/mkt/?src=iitww1&url=%2Fen%2Fwhyib%2Foverview.php`, abre a página
  "Why Trade Globally with IBKR". Certo
- XTB, `link-pso.xtb.com/pso/EHB4E`, 302 para `xtb.com/int` com os parâmetros de parceria. A
  página abre mas é a homepage internacional e não mostra nenhuma ação grátis, só a comissão de
  0% até 100.000€ de volume mensal

### Ofertas contra o artigo a que apontam

- **Trading 212**, "Free fractional share worth up to €100", código **IITW**. O artigo confirma o
  código e a ação entre 8€ e 100€. Oferta bate certo
  (eupersonalfinance.eu/articles/trading-212-promo-code)
- **XTB**, "Free share in some countries, depending on the local campaign", código **IITW**. O
  artigo confirma o código e explica que é uma etiqueta de atribuição e não um desbloqueio de
  ação grátis, com campanha ativa em Portugal e códigos locais próprios em DE, FR, CZ, SK e no
  Reino Unido, e sem campanha na PL nem na RO. Oferta bate certo
  (eupersonalfinance.eu/articles/xtb-referral-code)
- **Lightyear**, "Free fractional share worth up to €100", código **INVESTINGINTHEWEB**. O artigo
  confirma os dois, com 100€ de depósito mínimo em 30 dias. Oferta bate certo
  (eupersonalfinance.eu/articles/lightyear-promo-code)
- **eToro**, "Free asset worth up to $500, tiered by your first deposit". O artigo confirma os
  patamares, 40$ de 500$ a 999$, 100$ de 1.000$ a 4.999$, 300$ de 5.000$ a 9.999$ e 500$ a partir
  de 10.000$, com 90 dias de permanência. Oferta bate certo. O artigo mostra um código "4mCuruK"
  que a entrada do comparador não tem, vale a pena decidir se entra
  (eupersonalfinance.eu/articles/etoro-promo)
- **Freedom24**, "Up to 20 free stocks when you sign up and fund the account, promo code required".
  O artigo confirma até 20 ações grátis por patamares a partir de 1.000€ e lista os códigos
  WELCOME1, WELCOME5, WELCOME20 e WELCOME50. Oferta bate certo
  (eupersonalfinance.eu/articles/freedom24-promo-codes-and-bonuses)
- **Revolut**, "€10 to €30 in welcome rewards". O artigo confirma o intervalo e que não há código,
  o registo tem de começar pelo link. Oferta bate certo
  (eupersonalfinance.eu/articles/revolut-welcome-promo-bonus)

### Ofertas com data

- **DEGIRO**: a entrada diz "until 30 September 2026" e o artigo também diz "Valid until and
  including 30 September 2026". O site do DEGIRO mostra hoje **31 de outubro de 2026**, com custos
  reembolsados até 30 de novembro de 2026 e crédito no início de dezembro de 2026. A campanha foi
  prolongada um mês e não retirada, por isso a decisão do Franklin de manter a oferta no
  comparador está confirmada pelos factos. O que está desatualizado é a data, nos dois lados, na
  entrada e no artigo (degiro.ie, 2026-10-02)
- **Revolut**: o artigo diz que as ofertas espanhola e portuguesa são válidas até 31 de dezembro
  de 2026. Falta rever antes do fim do ano
  (eupersonalfinance.eu/articles/revolut-welcome-promo-bonus)
- **Trading 212, janela da taxa promocional**: o campo `interest` do `brokers.json` diz que a
  promoção é para contas abertas até **2 de novembro de 2026**, e o artigo do eupersonalfinance.eu
  diz **15 de setembro de 2026**, data já passada. As duas versões não podem estar certas e
  nenhuma fonte primária confirma qualquer delas, porque o Trading 212 só publica as taxas dentro
  da aplicação. É o ponto mais urgente deste bloco
- **Banco Carregosa**, no ficheiro português: campanha de 7€ por ordem até 31 de dezembro de 2026,
  confirmada no preçário em vigor a 1 de outubro de 2026. Expira dentro de três meses
- **Openbank**, no ficheiro português: a nota diz que o câmbio sobe de 0,70% para 1% a 8 de
  novembro de 2026, e que a custódia passa a 0€ a partir de 1 de outubro de 2026. A segunda já
  está em vigor e a formulação pode passar ao presente. A subida de câmbio não foi confirmada

### Códigos promocionais

IITW confirmado no artigo do Trading 212 e no do XTB. INVESTINGINTHEWEB confirmado no artigo da
Lightyear. Nenhum código fora de sítio.

As entradas com `cta.plain` a `true`, Saxo, BUX e Bitpanda, continuam propositadamente sem
afiliado e estão corretas assim.

## Divergência entre produção e staging

- **`eu/broker-comparator.css` e `eu/broker-comparator-staging.css`: idênticos.** Sem problema
- **`eu/broker-comparator.js` e `eu/broker-comparator-staging.js`: divergem numa linha.** Linha
  222, dentro da classe de caracteres da expressão regular que limpa os números:
  - produção: `String(v).replace(/[\s €]/g,'')`, com `\s`, um espaço normal e o símbolo de euro
  - staging: `String(v).replace(/[\s €]/g,'')`, com `\s`, um espaço inquebrável e o euro

  Em JavaScript o `\s` já cobre o espaço normal e o espaço inquebrável, por isso as duas versões
  fazem exatamente o mesmo e não há bug visível para o utilizador. Mas os ficheiros não são
  iguais, o que quebra a regra de manter o par sincronizado, e a próxima pessoa a comparar os dois
  vai perder tempo com isto. Vale um commit de alinhamento, ao critério do Franklin, sobre qual
  das duas formas fica
- **`comparador-corretoras.js` e `comparador-corretoras-staging.js` divergem de propósito**: o de
  staging aplica por cima o `data/corretoras-staging-patch.json`. Está documentado no comentário
  de topo do ficheiro de staging. Não é defeito
- **`comparador-corretoras.css` e `comparador-corretoras-staging.css`: idênticos**

## Disponibilidade por país e contagens

**Nenhuma lista `countries` muda.** Logo nenhuma contagem das páginas por país do
eupersonalfinance.eu muda, e as descrições SEO da coleção Broker Countries continuam certas.

Confirmado por fonte primária:

- **Lightyear**, 25 códigos, exato. A página de elegibilidade da Lightyear lista AT, BE, BG, CY,
  DE, DK, EE, ES, FI, FR, GR, HR, HU, IE, IT, LT, LU, LV, MT, NL, NO, PT, SE, SI e SK, mais o
  Reino Unido, e CZ, PL e RO estão ausentes, como a nota do ficheiro já diz
- **xtb, freedom24, saxo e bitpanda** continuam com `countries` a `null`, correto. Nenhum dos
  quatro publica lista. Nenhuma lista foi inventada

Não contrariado, mas também não reconfirmado nesta ronda, por falta de lista pública acessível:
Trade Republic (18 códigos), DEGIRO (22), Trading 212, Interactive Brokers, eToro, Revolut,
Scalable Capital e BUX. Nada nas páginas destes sugeriu mudança. A página do centro de ajuda do
DEGIRO com a lista de residências devolve 404 e a do Trading 212 também.

Contagem atual por país, para referência, com os quatro sem lista sempre incluídos: DE, ES, FR,
IT e NL com 13, AT e IE com 12, BE, EE, FI, GR, LT, LU, LV, PT, SI e SK com 11, BG, DK, PL e SE
com 10, CY, CZ, HR, HU, MT, NO e RO com 9, IS e LI com 8.

## Resumos estáticos por país

O campo Summary de cada item da coleção Broker Countries traz a lista de corretoras, a proteção e
as contagens. Como nenhuma disponibilidade muda, **nenhuma lista nem contagem de nenhum país fica
errada**.

Fica errada a data de verificação. Se o `verified` do `brokers.json` passar de 28 de setembro de
2026 para a data desta ronda, **todos os 30 itens da coleção Broker Countries** ficam com a data
antiga no Summary, mais as versões em neerlandês do item Netherlands e em polaco do item Poland.
A regeneração fica para depois da aprovação. Nada foi escrito no Webflow.

## Traduções

Linhas que ficam desatualizadas em `eu/data/i18n.nl.json` e `eu/data/i18n.pl.json`, com a mesma
numeração nos dois ficheiros.

Confirmadas:

- linha 275, IBKR `interest.v`, "1,93%"
- linha 276, IBKR `interest.s`, se a nota do benchmark for reescrita
- linha 689, BUX `etfFee.v`, "€0,99"
- linha 690, BUX `etfFee.s`, "Marktorder op het Basic-plan" e "za zlecenie rynkowe w planie Basic",
  porque o plano a que os 0,99€ pertencem muda
- linha 693, BUX `usFee.v`, "€0,99"
- linha 709, BUX `interest.s`, se forem acrescentadas as faixas acima de 100.000€
- linha 10, a chave `cost` "€0.99 market order on the Basic plan". A chave inglesa muda, por isso
  move-se a chave e a tradução
- linha 11, a chave `cost` "€0.99 + 0.75% FX (Basic plan)", pela mesma razão
- linha 312, DEGIRO `offer.t`, que traz "30 september 2026" e "30 września 2026"
- linha 485, Lightyear `interest.s`, que traz "2,42% tot 2,43%" e "2,42% do 2,43%"
- linha 199, XTB `interest.s`, e a zona da linha 203 do `fx`, se a nota dos fins de semana e
  feriados entrar

Condicionais, só se o Franklin decidir corrigir o inglês:

- linha 132, Trading 212 `interest.s`, que traz o prazo "2 nov 2026" e "2 lis 2026" que o artigo
  contradiz
- linha 198, XTB `interest.v`, "1,10%", se a taxa padrão for revista quando houver fonte legível
- linha 760, Bitpanda `transfer.v`, "€30 per positie" e "€30 za pozycję", se os 30€ se confirmarem
  errados

Ficam também desatualizados o `translated_from` da linha 3 e o `verified` da linha 5 dos dois
ficheiros, mais o `verified` da linha 2 do `brokers.json`.

Nada foi traduzido nem corrigido.

## Não consegui confirmar

### data/corretoras.json

- **Banco Best**, ficha inteira. O PDF do preçário de títulos está bloqueado por robots.txt
- **Openbank**, câmbio de 0,70% e a subida para 1%, dividendos 0,25% e transferência 0,30%. PDF
  de tarifas bloqueado por robots.txt. Pela página pública confirmam-se 1€ por ordem em qualquer
  mercado e 0€ de custódia desde 1 de outubro de 2026
- **Freedom24**, ficha inteira, incluindo os 0% de juros. O `src` é `freedom24.com` e devolve 403.
  Além disso é a homepage genérica e não um preçário, por isso não serve de fonte para nenhum
  valor da ficha
- **XTB**, taxa padrão de 1,10%. A página de juros depende de JavaScript e as leituras devolveram
  resultados incoerentes. Atenção a um detalhe: a landing page da própria XTB em
  `acoes.xtb.com/juros-sobre-fundos-nao-investidos` mostra 2,30% e 0,90% com data de 22-10-2025,
  ou seja é uma página da corretora que contradiz o site principal. Não serve de fonte
- **Trading 212**, 4,20% promocional, prazo de 2 de novembro de 2026 e 2,50% das contas antigas.
  As taxas só aparecem na aplicação e os termos não renderizam
- **Trade Republic**, a condição de novos clientes e a remuneração acima de 50.000€ à taxa do BCE.
  Não constam da página de juros. A versão inglesa para Portugal traz 2,5% no título e 3% no
  corpo, contradição dentro do próprio site que convém esclarecer
- **Banco BiG**, custódia de 6€ mais IVA por trimestre, dividendos 2% e transferência 0,25%
- **Banco Invest**, câmbio 0,20%, inatividade 7,50€ por trimestre, dividendos 2% e transferência
  0,20%
- **eToro**, margem cambial de 0,75%. A página de comissões remete para outra de FX que devolve 404
- **Revolut**, plafond cambial de 1.000€ por mês e 1% acima
- **XTB**, custódia 0€ até 250.000€ e 0,02% ao ano acima
- **ActivoBank**, taxa interna de câmbio, como o ficheiro já assinala

### eu/data/brokers.json

- **Trading 212**, `interest` e câmbio. O `src` serve só a moldura da página, a página pública de
  juros diz para ver as taxas na aplicação, e o artigo do centro de ajuda só descreve a estrutura,
  taxa do BCE mais uma margem fixa, sem percentagem, sem limite e sem prazo. Dado que o BCE subiu
  a 16 de setembro de 2026 e a taxa é indexada, o "2,50% a 3,50%" guardado e a nota dos 2,80% a
  partir de 1 de novembro de 2026 precisam os dois de uma leitura dentro da aplicação ou do
  documento de termos da taxa promocional
- **XTB**, taxa padrão de 1,10%. O preçário só dá um intervalo de 0,0% a 6,5%. A página alemã
  confirma a estrutura dos 90 dias e do limite de 100.000€ e só renderizou 3,50%, que corresponde
  à nota promocional de DE, FR e ES e não à taxa padrão. `xtb.com/en/interest` mostra 2,30% mas é
  a conta do Reino Unido, com data de 13-01-2026, e `xtb.com/en/interest-rates` e
  `xtb.com/es/intereses` devolvem 404
- **Freedom24**, tudo. `freedom24.com` e `freedom24.com/tariffs` devolvem 403, e a landing page de
  afiliado também. Nenhum valor desta ficha foi verificado nesta ronda
- **Saxo**, comissões. O `src` abre mas as três tabelas regionais falham e imprimem "An error
  occurred. Please contact us if the problem persists". Só se confirmaram a custódia de 0,15% no
  nível Classic e a transferência de saída de 50€ por ISIN com máximo de 160€. Os juros para
  clientes não VIP também não foram confirmados
- **Bitpanda**, transferência de saída de 30€ por posição. A camada de texto do PDF lê
  "EUR 307 per ISIN", que é quase certamente 30€ seguido do marcador de nota de pé 7, mas os
  expoentes tornam a extração pouco fiável. Precisa de uma leitura humana da página do PDF
  (documento de transparência de custos, versão 1.0.0 de 28-01-2026)
- **Links de afiliado bloqueados por robots.txt**, nem confirmados nem dados como partidos:
  `eupersonalfinance.eu/visit/lightyear`, `trading212.com/join/IITW`, `revolut.ngih.net/mOAZg7` e
  `partner.scalable-capital.de/go.cgi`. Três outros caminhos `/visit/` no mesmo domínio
  resolveram, por isso o bloqueio da Lightyear é uma regra de robots e não um redirecionamento em
  falta. Ficam para um clique à mão. Também com 403 e por isso não confirmado:
  `lp.freedom24.com/en/begin`
- **XTB, endereço da fonte**: o `src` faz 302 para o CDN,
  `xas-new-cdn.xtb.com/file/0104/54/...`. É o mesmo documento, ainda a versão de 14-03-2026. Vale
  a pena guardar o endereço do CDN

## Próximo passo

Rever este relatório. Só depois do ok do Franklin é que se editam `data/corretoras.json` e
`eu/data/brokers.json`, se mexe nos ficheiros de i18n e se regeneram os resumos estáticos e as
descrições SEO no Webflow.
