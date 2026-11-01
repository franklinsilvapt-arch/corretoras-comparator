# Verificação dos comparadores de corretoras - 2026-11-01

Verificação quinzenal feita por sessão agendada na cloud. Cobre `data/corretoras.json`
(comparador PT, `verificado: 16 de outubro de 2026`) e `eu/data/brokers.json`
(broker comparator EU, `verified: 16 October 2026`). Nada foi alterado em nenhum ficheiro de dados
e nada foi tocado no Webflow.

## Build de produção e staging

Sem divergência. `eu/broker-comparator.js` e `eu/broker-comparator-staging.js` têm o mesmo SHA
(`24e696d7`), e o mesmo acontece com os dois CSS (`d4c54872`). Os dois pares estão sincronizados.

## Contexto: taxa do BCE

Taxa de facilidade de depósito nos 2,50%, inalterada na reunião de 29 de outubro de 2026. Não mudou
desde a última verificação, por isso as taxas que a seguem (Trade Republic, Trading 212 Markets Ltd,
Lightyear) deviam estar estáveis, e estão. O que mexeu foi campanha e benchmark de corretora.

## Mudou

- **Interactive Brokers, juros sobre dinheiro não investido.** A tabela "Global Interest Rates by
  Currency" da IBKR Irlanda publica hoje, em EUR, 0% até 10.000€ e **2,049% (BM - 0,5%)** acima.
  Temos 1.968% no `eu/data/brokers.json` (com a nota "Rate as of 20 October 2026") e 1,985% no
  `data/corretoras.json` (nota "Taxa de 18/09/2026"). Os dois estão desatualizados e para valores
  diferentes entre si. Em PLN a mesma tabela dá 0% até 400.000 PLN e **1,904% (BM - 2%)** acima,
  onde temos 1,795%
  (interactivebrokers.ie/en/accounts/fees/pricing-interest-rates.php, 2026-11-01).
  A página não datou a tabela. A única data por perto, "Rates as of September 18, 2026", pertence às
  tabelas de comparação com outras corretoras, não à taxa da IBKR, por isso é essa data que
  provavelmente entrou no ficheiro PT por engano.
- **XTB, campanha de juros no comparador PT.** O `data/corretoras.json` diz "2,60% nos primeiros
  90 dias, até 100.000€, depois 1,10% (taxas de 05/10/2026)". Isto já não corresponde a nada do que
  a XTB publica. A campanha em vigor é **4,5% nos primeiros 90 dias sobre fundos não investidos até
  20.000€**, para contas abertas **entre 14.10.2026 e 31.12.2026**, com a condição de pelo menos uma
  ordem de compra ou venda de ações ou ETFs por mês civil, sob pena de passar à taxa padrão
  (xtb.com/pt e xtb.com/pt/juros, 2026-11-01). O limite de 100.000€ que temos guardado pertence
  agora a outro degrau, a taxa preferencial de quem abriu conta **antes** de 14.10.2026, também nos
  primeiros 90 dias. O `eu/data/brokers.json` já tem esta campanha certa, 4.50% até 20.000€ entre
  14 de outubro e 31 de dezembro. É só o ficheiro português que está atrasado.

## Novo

Nenhuma corretora nova a propor. Sem alterações confirmadas de comissões em nenhum dos dois
ficheiros.

## Desapareceu

Nada. Todas as corretoras das duas listas continuam a operar e a publicar preçário.

## Afiliados e ofertas

### Links que vale a pena olhar

- **XTB, `link-pso.xtb.com/pso/EHB4E`**: responde 302 para
  `xtb.com/int?campaignId=122&label=Eupf&partnerId=38654&refType=1`, que carrega bem e leva os
  parâmetros de afiliado, mas é a **página inicial genérica do site internacional em inglês**, sem
  qualquer oferta, bónus ou código à vista. O rodapé legal dessa página identifica a XTB
  International Limited (Belize, FSC) ao lado da XTB S.A. Não é a sucursal portuguesa nem a página
  da campanha. Com a oferta que temos no comparador a prometer "Free share in some countries", um
  destino sem oferta nenhuma é uma desadequação a corrigir, nem que seja apontando o link para
  `xtb.com/pt/juros` ou para a landing da campanha local (2026-11-01).
- **`eupersonalfinance.eu/visit/trade-republic`**: 302 a funcionar, mas aterra em
  `traderepublic.com/en-ie`, a página inicial da Trade Republic Irlanda. É homepage de país, não
  página de produto. Funciona, só não é específica (2026-11-01).
- **`eupersonalfinance.eu/visit/degiro`**: 302 a funcionar para
  `degiro.com/?tap_a=56340-8d2ff5&tap_s=636409-a2bfc8`, a homepage genérica da DEGIRO. O tracking
  está lá. Mesma observação, funciona mas é homepage (2026-11-01).

### Links confirmados bons

- `eupersonalfinance.eu/visit/etoro`: 302 para `go.etoro.com/en/deposit/tiered-bonus`, que é
  exatamente a página da oferta escalonada que o comparador anuncia. Este está certo.
- `interactivebrokers.ie/mkt/?src=iitww1&...`: carrega a 200 na página "Why IBKR" da IBKR Irlanda,
  como esperado.

### Links que não consegui testar

Não são links partidos, é a ferramenta de leitura desta sessão que não passa. Ficam para um clique
teu ou para o verificador que corre no teu computador:

- `eupersonalfinance.eu/visit/trading212` e
  `lp.freedom24.com/en/begin?utm_source=3025&...`: erro de cliente, sem conteúdo. Não dá para
  distinguir um 404 de uma proteção anti-bot, por isso estes dois são os que eu olharia primeiro.
- Bloqueados por robots.txt, o que é política de leitura e não falha do site:
  `eupersonalfinance.eu/visit/lightyear`, `eupersonalfinance.eu/visit/wise`,
  `revolut.ngih.net/mOAZg7`, `n26-eu.c2nwa3.net/jRBRGb`, `partner.scalable-capital.de/go.cgi?...`,
  e todos os `literaciafinanceira.pt/visita/`, ou seja degiro, ib, lightyear, revolut, xtb e
  trade-republic.

### Ofertas que já não batem certo com o artigo

A regra é que a oferta no comparador tem de corresponder ao artigo para onde o campo `a` aponta.
Estas três não correspondem:

- **eToro**: o comparador mostra "Free asset worth up to $500, tiered by your first deposit" sem
  código. O artigo `eupersonalfinance.eu/articles/etoro-promo` (datado de 22 de outubro de 2026)
  tem na caixa de código promocional o código **4mCuruK**. Os degraus do artigo confirmam o resto,
  500$ a 999$ dão 40$, 1.000$ a 4.999$ dão 100$, 5.000$ a 9.999$ dão 300$ e 10.000$ ou mais dão
  500$, com os fundos a ter de ficar 90 dias. Falta o código no comparador, ou então o artigo tem
  um código que não devia estar lá.
- **Freedom24**: o comparador diz "promo code required" mas não guarda código nenhum. O artigo
  `eupersonalfinance.eu/articles/freedom24-promo-codes-and-bonuses` lista quatro códigos,
  **WELCOME1, WELCOME5, WELCOME20 e WELCOME50**, usados de forma cumulativa por degrau, e exige um
  mínimo de 1.000€ para a primeira ação gratuita. Um leitor que clique a partir do comparador não
  tem como saber qual o código.
- **XTB**: o comparador mostra o código IITW, e o artigo
  `eupersonalfinance.eu/articles/xtb-referral-code` confirma esse código, mas diz também que o IITW
  é "an attribution tag, not a universal free-share unlock" e que no Reino Unido, Alemanha, França,
  Chéquia e Eslováquia não desbloqueia a ação sozinho, porque esses mercados usam códigos locais.
  Acrescenta que a Polónia e a Roménia não têm campanha ativa. O texto que temos, "Free share in
  some countries, depending on the local campaign", aponta na direção certa mas o código IITW
  aparece ao lado como se funcionasse em todos. Junto com o problema do link acima, a entrada da XTB
  é a que precisa de mais atenção nesta quinzena.

### Ofertas confirmadas

- **Trading 212**: "Free fractional share worth up to €100" e código **IITW** batem certo com o
  artigo (datado de 20 de outubro de 2026). O artigo detalha que a ação é aleatória entre 8€ e 100€,
  com depósito mínimo de 10€ em 10 dias, e que 80% dos utilizadores recebem entre 8€ e 25€. Sem data
  de fim para a oferta de ação.
- **Lightyear**: "Free fractional share worth up to €100" e código **INVESTINGINTHEWEB** batem certo.
  O artigo acrescenta uma janela por utilizador de 30 dias para financiar a conta e um mínimo de
  100€, mais a nota de que os levantamentos só são possíveis depois de 6 meses.
- **Revolut**: "€10 to €30 in welcome rewards" bate certo e a ausência de código é correta. O artigo
  (29 de outubro de 2026) acrescenta uma data que não temos, as ofertas de Espanha e Portugal valem
  até **31/12/2026**. Vale guardar isso para não passar em branco em janeiro.

### Ofertas com data marcada

- **DEGIRO**: a premissa da tarefa é que existe uma oferta da DEGIRO marcada para 30 de setembro de
  2026 que fica no comparador por tua decisão. No `eu/data/brokers.json` de hoje a entrada da DEGIRO
  **não tem objeto `offer` nenhum**, só `cta.href` para `eupersonalfinance.eu/visit/degiro`. Ou já
  foi retirada numa passagem anterior, ou vive noutro sítio que não este ficheiro. Não há portanto
  nada a expirar aqui. O que encontrei em volta: a página de promoções da DEGIRO
  (`degiro.ie/promotions`) não abriu, erro de cliente, e o nosso próprio review
  (`eupersonalfinance.eu/articles/degiro-review`, de 15 de outubro de 2026) fala de "£100/€100 in
  transaction fee credit" com link para `articles/degiro-bonus`. Nenhuma página da própria DEGIRO
  que eu tenha conseguido ler menciona oferta alguma nem a data de 30 de setembro. Fica sem
  resposta: não sei dizer se foi prolongada, substituída ou acabou.
- **Trading 212**: há aqui uma data a expirar amanhã, mas é de taxa de juro e não de oferta de
  inscrição. Está na secção seguinte.
- Nenhuma outra oferta dos dois ficheiros tem data de fim registada.

## Trading 212, o item urgente

O `eu/data/brokers.json` tem `interest.v` em **4.20%** com a nota de que é promocional para contas
abertas entre 16 de setembro e 2 de novembro de 2026, e de que a taxa padrão da EU GmbH é 3,50% e
**desce para 2,80% a 1 de novembro de 2026**, que é hoje. As duas coisas estão a acontecer ao mesmo
tempo: a taxa padrão muda hoje e a janela promocional fecha amanhã.

Não consegui confirmar nenhuma das duas. Todas as páginas de taxas da Trading 212 devolveram erro de
cliente a esta sessão: `trading212.com/terms/invest`, `trading212.com/interest-on-cash`,
`trading212.com/legal/interest`, o artigo do help centre sobre juros e a secção "Interest on cash".
A homepage abriu mas só mostra a taxa em libras, "Earn 4.9% AER on GBP", e tem a tabela de taxas em
euros dentro de uma imagem, que não dá para ler. A página de proteção de ativos da Markets Ltd abriu
e não traz taxa nenhuma.

Ou seja, o número que o comparador mostra em produção hoje pode já estar errado e eu não tenho fonte
primária para o corrigir nem para o confirmar. Isto é o que mais precisa do teu clique, hoje de
preferência, na app ou na página de taxas com sessão aberta.

A mesma nota existe no `data/corretoras.json`, em "4,20% promocional", onde está escrito que a
Trading 212 não publica no site a taxa que se aplica depois e só a mostra na app. Essa observação
continua a ser verdade e é a razão pela qual este item não se resolve por leitura automática.

## Outros números que não consegui confirmar

- **XTB, taxa padrão de 1,10%**: a tabela "Atualmente, aplicam-se as seguintes taxas" em
  `xtb.com/pt/juros` renderiza vazia, e a página de histórico de taxas também não mostra valores.
  A página diz apenas que as taxas preferencial e padrão são variáveis e atualizadas uma vez por
  semana. O 1,10% fica sem confirmação nos dois ficheiros. A página inglesa
  `xtb.com/en/interest-on-free-funds` devolveu erro de cliente. Haveria ainda o PDF de termos e
  condições (`xas-new-cdn.xtb.com/file/0104/83/...pt-welcome-interest-rates-termos-e-condicoes.pdf`)
  como caminho alternativo.
- **Trade Republic, o limite de 50.000€**: a taxa padrão de 2,50% confirma-se na página alemã, com
  saldo ilimitado, e os 6% sobre até 200.000 PLN confirmam-se na página polaca. Mas a página
  portuguesa anuncia só "Recebe 3% ao ano sobre o seu dinheiro", **sem publicar o limite de 50.000€
  nem a duração**. A nota que temos, "New clients in most countries get 3% on up to €50,000", pode
  continuar certa nos termos, mas já não está na página que serve de fonte. Vale confirmar onde está
  escrito, para a nota não ficar sem suporte.
- **DEGIRO, 0% de juros**: nenhuma página da DEGIRO que eu tenha lido afirma isto. O preçário em
  `degiro.ie/fees` não fala de juros sobre saldo, e está marcado como "last updated 01.10.2025". A
  afirmação de 0% vem do nosso próprio review, que não serve de fonte primária. Na prática é quase
  certo que continue 0%, mas o campo não tem hoje fonte própria. O PDF do preçário
  (`degiro.ie/data/pdf/ie/IE_Feeschedule.pdf`) seria o sítio onde confirmar.
- **DEGIRO, lista de países**: temos 22 países, "todos os da UE exceto Áustria, Croácia, Chipre,
  Hungria e Malta, com os novos clientes austríacos a ir para a flatex". Nenhuma página publica uma
  lista de aceitação. O seletor de país do `degiro.ie` inclui Áustria e Hungria, e o do `degiro.com`
  não inclui nenhuma das duas, e nem um nem outro mostra BE, BG, EE, LV, LT, LU, RO, SK ou SI, que
  nós temos na lista. Um seletor de site não é uma lista de residentes aceites, por isso **não
  proponho mexer no campo `countries`**. Fica como ponto a confirmar junto da DEGIRO, porque se a
  lista mudar afeta as contagens das páginas por país.

## Comissões confirmadas

Da DEGIRO, no preçário do próprio site (`degiro.ie/fees`, 2026-11-01): ETF Core Selection a
0€ de comissão mais 1€ de handling, outros ETFs a 2€ mais 1€, ações americanas a 1€ de comissão mais
1€ de handling. Os três batem certo com o que temos. Conversão de moeda a 0,25%, manual a 10€ mais
0,25%, e taxa de conectividade de 0,25% do valor da conta com máximo de 2,50€ por bolsa por ano
civil, também de acordo. Uma nota de rodapé do preçário diz que o handling de 1€ se aplica a todos
os produtos exceto Tradegate em ações, produtos alavancados e warrants do BNP e da SocGen, opções e
futuros fora das OMX Nordics, e cripto. A nossa nota diz que o Core Selection a 1€ é na Tradegate,
o que é consistente com isso, mas a página em si não liga as duas coisas.

## Traduções

Se aprovares as alterações da IBKR e da XTB, estas linhas ficam desatualizadas e precisam de
retradução em `eu/data/i18n.nl.json` e `eu/data/i18n.pl.json`:

- `ibkr`, campo `interest`, o valor e a nota (muda o número e muda a data de referência).
- `xtb`, campo `interest`, só se decidires alinhar o texto inglês com algum detalhe novo. A campanha
  já está certa no ficheiro inglês, por isso em princípio as traduções da XTB ficam boas.

Se acrescentares código ou texto às ofertas da eToro, da Freedom24 ou da XTB, as linhas
correspondentes em `offers` nos dois ficheiros de i18n também ficam por traduzir. Não traduzi nem
corrigi nada.

## Contagens das páginas por país

Nenhuma alteração confirmada de disponibilidade de corretoras nesta passagem. As quatro entradas com
`countries` a `null` de propósito continuam assim e corretamente: xtb, freedom24, saxo e bitpanda,
nenhuma das quais publica lista. As contagens da coleção **Broker Countries** do Webflow mantêm-se
como estão. Para referência, é o que o ficheiro dá hoje por país: AT 8, BE 7, BG 6, CY 5, CZ 5,
DE 9, DK 6, EE 7, ES 9, FI 7, FR 9, GR 7, HR 5, HU 5, IE 8, IS 4, IT 9, LI 4, LT 7, LU 7, LV 7,
MT 5, NL 9, NO 5, PL 6, PT 7, RO 5, SE 6, SI 7, SK 7.

A ressalva é a DEGIRO. Se a lista de países dela mudar depois de confirmares junto do banco, mexe em
muitos países de uma vez.

## Resumos estáticos por país

As alterações da IBKR e da XTB não mudam disponibilidade nem contagens, mas mudam números que entram
no texto. O campo **Summary** de cada item da coleção Broker Countries fica desatualizado em todos os
países onde a corretora aparece:

- **IBKR** está nos 30 países do EEE da lista, ou seja o resumo de todos eles passa a ter a taxa de
  juro errada se lá estiver mencionada.
- **XTB** tem `countries` a `null`, por isso não entra nas páginas por país e não afeta resumo nenhum.

Os itens Netherlands e Poland têm também versão em neerlandês e em polaco nos respetivos locais, que
precisam do mesmo tratamento. Nada foi escrito no Webflow. A regeneração fica para depois da tua
aprovação.

## Próximo passo

Nada a alterar sem o teu ok. Por ordem de urgência: confirmar a taxa da Trading 212 hoje, decidir o
destino do link de afiliado da XTB, corrigir a campanha da XTB no ficheiro português, atualizar a
IBKR nos dois ficheiros, e decidir o que fazer com os códigos da eToro e da Freedom24.
