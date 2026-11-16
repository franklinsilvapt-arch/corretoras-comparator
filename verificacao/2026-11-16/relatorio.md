# Verificação dos comparadores de corretoras - 2026-11-16

Verificação quinzenal. Dois ficheiros neste repo:

- `data/corretoras.json`, comparador português, `verificado` a "1 de novembro de 2026", 15 corretoras.
- `eu/data/brokers.json`, broker comparator do eupersonalfinance.eu, `verified` a "1 November 2026", 13 corretoras.

Nada foi alterado nos dados e nada foi tocado no Webflow. Isto é só o relatório.

## Taxa de facilidade de depósito do BCE

Em vigor a 2,50%, com efeito a 16 de setembro de 2026, vinda de 2,25% com efeito a 17 de junho de 2026. A última
conferência de imprensa de política monetária foi a 29 de outubro de 2026 e a tabela do BCE não regista nenhuma
alteração posterior a 16 de setembro. O calendário não tem reunião de política monetária entre 29 de outubro e
16 de dezembro de 2026.

Não houve movimento do BCE desde a última verificação, por isso não era de esperar mexida nos juros sobre dinheiro
não investido, e de facto os que se conseguiram ler estão iguais.

## Build: produção e staging estão iguais

Verificado pelo SHA do blob no repo:

- `eu/broker-comparator.js` e `eu/broker-comparator-staging.js`: SHA `24e696d7eb8d3d983625c2ab5c2dd0fffeb0b279`, 44.854 bytes, os dois.
- `eu/broker-comparator.css` e `eu/broker-comparator-staging.css`: SHA `d4c548729809693f885582031817351656ebc8f1`, 13.264 bytes, os dois.

Os pares são byte a byte idênticos. Não há divergência entre produção e staging.

## Mudou

Nada confirmado com fonte primária nos juros ou nas comissões, nem no ficheiro português nem no inglês.

## Afiliados e ofertas

### Códigos promocionais que não batem certo com o artigo

Dois casos em `eu/data/brokers.json`, os dois no sentido de o comparador não mostrar um código que o artigo diz ser
necessário:

- eToro: o objeto `offer` não tem campo `c`, logo o comparador não mostra código nenhum. O artigo
  eupersonalfinance.eu/articles/etoro-promo, datado de 14 de novembro de 2026, tem no seu quadro de código promocional
  o valor `4mCuruK`. O valor da oferta bate certo ("Free asset bonus: Up to $500"), com escalões de $40 a $500 por
  primeiro depósito ($500-$999 dá $40, $1,000-$4,999 dá $100, $5,000-$9,999 dá $300, $10,000+ dá $500). Decidir se o
  código entra no comparador ou se sai do artigo.
- Freedom24: o objeto `offer` diz "promo code required" mas não tem campo `c`. O artigo
  eupersonalfinance.eu/articles/freedom24-promo-codes-and-bonuses, datado de 14 de novembro de 2026, lista quatro
  códigos por escalão: WELCOME1 para €1,000-€4,999 (1 ação), WELCOME1 mais WELCOME5 para €5,000-€19,999 (4 ações),
  mais WELCOME20 para €20,000-€49,999 (10 ações), mais WELCOME50 para €50,000 ou mais (20 ações). Mínimo de €1,000.
  São quatro códigos para um único campo, por isso isto é mais uma decisão de desenho do que uma correção.

### Códigos que continuam certos

- Trading 212: IITW, confirmado no artigo de 3 de novembro de 2026. A oferta "Free fractional share worth up to €100"
  bate certo, com a nota de que a ação é atribuída ao acaso entre €8 e €100.
- XTB: IITW, confirmado no artigo de 14 de novembro de 2026. O texto do comparador, "Free share in some countries,
  depending on the local campaign", é fiel ao artigo, que explica que o IITW é uma etiqueta de atribuição e não
  desbloqueia por si uma ação grátis. Campanhas locais no artigo: Portugal 1 ação da Galp até 31 de dezembro de 2026,
  Alemanha 1 ação da Porsche AG até 30 de novembro de 2026, Itália 1 ação da Enel até 30 de novembro de 2026.
  Eslováquia e República Checa precisam de código local em vez do IITW. França, Polónia e Roménia sem campanha ativa.
- Lightyear: INVESTINGINTHEWEB, confirmado no artigo de 14 de novembro de 2026, oferta até €100.
- Revolut: sem código, "€10 to €30 in welcome rewards", confirmado no artigo de 14 de novembro de 2026. O artigo
  acrescenta que as ofertas de Espanha e Portugal têm de ser usadas antes de 31/12/2026.

### Ofertas com data marcada

- XTB: as campanhas locais da Alemanha e da Itália acabam a 30 de novembro de 2026, dentro de duas semanas. A de
  Portugal vai até 31 de dezembro de 2026. O texto da oferta no comparador é genérico e não precisa de mexer, mas
  passado o fim do mês o artigo fica a prometer ações que já não existem em dois mercados.
- Trading 212: a taxa promocional de 4,20% está condicionada a abrir conta até 30 de novembro de 2026, também a duas
  semanas. A nota de juros no comparador diz exatamente isso. Depois dessa data a nota deixa de estar certa e o campo
  `interest` passa a ter de ser 2.50%.
- eToro: a promoção de transferência de cripto acabou a 30 de setembro de 2026, segundo o próprio artigo. Não consta
  do comparador, por isso não há nada a corrigir. O bónus por escalões não tem data de fim.
- DEGIRO: ver a secção seguinte.

### DEGIRO: a oferta não está no ficheiro

A entrada do DEGIRO em `eu/data/brokers.json` não tem objeto `offer` nenhum. A oferta com fim marcado a 30 de setembro
de 2026, que pela instrução da tarefa ficaria no comparador por decisão do Franklin, não está lá. Ou já foi retirada
numa ronda anterior, ou nunca chegou a entrar.

Do lado do DEGIRO, nem degiro.ie/fees nem degiro.pt/precario anunciam hoje qualquer campanha de inscrição ou crédito
de negociação. As duas páginas dizem apenas "Open an account for free" e "Abra uma conta gratuitamente", e a data
30 de setembro de 2026 não aparece em nenhuma delas. Não foi prolongada nem substituída nessas páginas.

Decisão para o Franklin: confirmar que a ausência do `offer` é intencional. Se a campanha devia continuar visível,
falta no ficheiro. Se foi retirada de propósito, não há nada a fazer e esta linha pode sair das próximas rondas.

### Links de afiliado

O que se conseguiu verificar:

- `https://www.eupersonalfinance.eu/visit/degiro`: 302, destino `degiro.com/?tap_a=56340-8d2ff5&tap_s=636409-a2bfc8`.
  Funciona, mas cai na página inicial genérica do DEGIRO e não numa página de abertura de conta.
- `https://www.eupersonalfinance.eu/visit/etoro`: 302, destino `go.etoro.com/en/deposit/tiered-bonus?utm_serial=HelpMeChoose`.
  Funciona e cai na página da própria oferta por escalões, o que é coerente com o texto da oferta.
- `https://link-pso.xtb.com/pso/EHB4E`: 302, destino `xtb.com/int?campaignId=122&label=Eupf&partnerId=38654&refType=1`.
  Funciona, mas cai na página internacional genérica. Com as campanhas por país que o artigo descreve, valia a pena
  ver se há um destino por mercado.
- `https://www.interactivebrokers.ie/mkt/?src=iitww1&url=%2Fen%2Fwhyib%2Foverview.php`: 200, cai na página certa da
  IBKR Irlanda. Funciona. Mostra um aviso de jurisdição a pedir que o visitante escolha entre o site dos EUA e o da
  Irlanda, o que é normal mas acrescenta um passo.

Nenhum link devolveu 404 nem página de erro. Os que não se conseguiram verificar estão na secção final. Importante:
nenhum destes é motivo para mexer em nada, só o `/visit/degiro` e o do XTB merecem a nota de caírem em páginas
genéricas, e isso é uma escolha de otimização, não um erro.

As entradas com `cta.plain` a true continuam sem afiliado de propósito: Saxo, BUX e Bitpanda. Confirmado no ficheiro.

## Juros sobre dinheiro não investido

### Confirmado

- XTB, promoção: confirmada na página portuguesa de juros do XTB, lida a 2026-11-16. Texto da página: "A promoção
  aplica-se a novos clientes que abrirem uma conta entre 14.10.2026 e 31.12.2026", "A taxa de juro de boas-vindas é
  válida durante os primeiros 90 dias a contar da celebração do contrato e abrange fundos não investidos até um total
  de 20.000 EUR em todas as contas do cliente", e a condição de "pelo menos, uma transação em ações ou ETFs por mês
  civil". Os 4,50%, os 20.000€, os 90 dias, a condição de uma ordem por mês e a janela de 14.10.2026 a 31.12.2026
  estão todos certos, nos dois ficheiros.

### Por confirmar

- XTB, taxa padrão de 1,10%: a tabela de taxas não veio na leitura da página portuguesa. A página britânica, que serve
  clientes da XTB Limited e não da sucursal portuguesa, mostra EUR 2,30%, mas não é a fonte certa para este campo.
  Também não se confirmou os 3,50% até 100.000€ para contas abertas antes de 14 de outubro de 2026: a página fala em
  "taxas de juro preferenciais" e em fundos até ao equivalente a 100.000 EUR nos primeiros 90 dias, sem dar o número.
  Confirmar em xtb.com/pt/juros, na tabela, ou no histórico de taxas.
- Trading 212, 4,20% promocional e 2,50% padrão: nem trading212.com/terms/invest nem trading212.com/interest-on-cash
  abriram. A nota do ficheiro diz que as condições foram confirmadas a 2026-11-03 nos Invest Promo Rate Terms do
  próprio Trading 212, com a fórmula "taxa de facilidade de depósito do BCE mais 1,70 pontos percentuais". Com o BCE
  a 2,50%, dá 4,20%, e o BCE não mexeu, por isso a aritmética continua a fechar. Mesmo assim é uma confirmação de há
  treze dias e não de hoje.
- Trade Republic, 2,50% para clientes atuais e 4% até 20.000€ para novos clientes até 1 de março de 2027:
  traderepublic.com/en-de/interest devolveu erro de cliente e a página de apoio redirecionou para o suporte genérico.
  A página portuguesa abriu mas só traz "Recebe 4 % TANB sobre o seu dinheiro" na meta-descrição, sem limite, sem data
  e sem dizer a quem se aplica. A nota do ficheiro diz "Rates checked on 13 November 2026", o que é recente, e o
  commit do anúncio da campanha é de 2026-11-13. Fica por confirmar hoje, mas não há sinal de ter mudado.
- Interactive Brokers, 2.049%: a página de taxas da IBKR Irlanda que abriu diz "Rates as of March 20, 2024" e mostra
  na linha do EUR "3.423% (BM - 0.5%)". Não é a taxa de hoje, é um retrato antigo, por isso não serve nem para
  confirmar nem para contrariar os nossos 2.049%. As páginas de benchmark e de saldos em dinheiro não abriram.
  Confirmar à mão. Nota: 2.049% é coerente com um benchmark pouco acima de 2,50%, os 3.423% não são.

### Sem juros, sem alteração

DEGIRO 0%, eToro 0% em euros com 3% até $50,000 e 3.80% acima em dólares, Freedom24 0%, Lightyear 0% em euros,
Revolut 0% na conta de investimento, Saxo 0% exceto VIP, Bitpanda 0%. Nada disto mudou nas páginas que abriram.
As corretoras portuguesas com 0% em `data/corretoras.json` (ActivoBank, Best, BiG, Carregosa, Invest, DEGIRO, eToro,
Freedom24, Lightyear, Openbank, Revolut) não foram relidas uma a uma, porque nenhuma delas paga juros e o BCE não mexeu.

### Um valor a corrigir fora destes dois ficheiros

- Lightyear: o campo `interest.s` em `eu/data/brokers.json` diz "The Savings money market fund pays 2.46% APY".
  A página lightyear.com/en-eu/vaults mostra hoje 2.48% APY. É a mesma correção que o comparador de poupanças precisa,
  e está tratada no relatório desse repo.

## Disponibilidade por país

Nenhuma lista `countries` muda nesta ronda. As quatro corretoras com `countries` a null continuam a não publicar lista
e continuam a null de propósito: XTB, Freedom24, Saxo e Bitpanda. Não lhes foi inventada lista nenhuma.

Uma observação, sem alteração proposta: a página de países suportados do Trading 212, lida a 2026-11-16, lista por
entidade jurídica. Trading 212 EU GmbH em Germany, Austria, Denmark, Finland, France, Iceland, Ireland, Liechtenstein,
Luxembourg, Netherlands, Norway, Portugal, Spain, Sweden e Switzerland. Trading 212 Markets Ltd em Bulgaria, Croatia,
Czech Republic, Estonia, Greece, Hungary, Italy, Latvia, Lithuania, Malta, Poland, Cyprus, Romania, Slovakia e
Slovenia. A Bélgica não consta de nenhuma lista e o aviso do site diz que a informação "is not directed at residents
of the United States, Canada and Belgium", o que confirma o nosso "EEA except Belgium" e a lista de 29 códigos sem BE.
Já o campo `entity.s` do nosso ficheiro diz "EU GmbH in DE, AT, DK, FI, FR, IE, LU, NL, PT, ES and SE" e deixa de fora
a Islândia, o Listenstaine e a Noruega, que a página põe sob a EU GmbH. É texto de nota, não afeta filtragem nem
contagens, mas está incompleto.

## Contagens das páginas por país

Sem alteração. Como nenhuma lista `countries` muda e nenhuma corretora entra ou sai, o número de corretoras abertas a
residentes de cada país continua igual, e as descrições SEO dos itens da coleção Broker Countries do Webflow
continuam a bater certo. Nada a mexer no Webflow.

## Resumos estáticos por país

Sem alteração pelo lado das corretoras. Se a correção do texto do Lightyear (2.46% para 2.48%) entrar, é texto de nota
dentro do campo `interest.s` e não entra na lista de corretoras do resumo nem nas contagens, por isso os campos
Summary e Summary heading da coleção Broker Countries não ficam errados por causa dela.

## Traduções

As duas traduções do broker comparator estão uma ronda atrás do inglês, e isso já se nota:

- `eu/data/i18n.nl.json`: `translated_from` a 2026-10-21 e `verified` a "16 oktober 2026", contra o `verified` de
  "1 November 2026" do `brokers.json`.
- O mesmo se aplica ao `eu/data/i18n.pl.json`.

Linhas já desatualizadas hoje, independentemente do que o Franklin decidir:

- `brokers.ibkr.t.interest` em nl: tem `v` igual a "1,968%" e a nota com "stand op 20 oktober 2026", contra 2.049% e
  "Rate as of 1 November 2026" no inglês. Está atrasada duas rondas.
- `brokers.lightyear.t.interest.s` em nl: diz "2,46% APY". Fica errada se o inglês passar a 2.48%.

Linhas que ficam desatualizadas se as alterações propostas entrarem:

- `brokers.etoro.offer` em nl e pl, se o código `4mCuruK` entrar no inglês. O objeto traduzido só tem `t`, por isso o
  código herda do inglês, mas vale a pena confirmar no build.
- `brokers.freedom24.offer` em nl e pl, pela mesma razão, se os códigos WELCOME entrarem.
- `brokers.trading212.t.interest` em nl e pl, a partir de 1 de dezembro de 2026, quando a promoção de 4,20% fechar.
- `brokers.xtb.t.interest` em nl e pl, se a taxa padrão de 1,10% for corrigida.

Não foi traduzido nem corrigido nada. Fica para o Franklin decidir.

## Não consegui confirmar

- Páginas de juros do Trading 212: trading212.com/terms/invest e trading212.com/interest-on-cash, as duas com erro de
  cliente.
- Página de juros da Trade Republic: traderepublic.com/en-de/interest com erro de cliente, e a de apoio redirecionada
  para o suporte genérico.
- Tabela de taxas do XTB em xtb.com/pt/juros: a página abriu mas a tabela não veio no texto extraído.
- Taxa atual de juros da IBKR: a única página que abriu está datada de março de 2024.
- Links de afiliado que não se conseguiram testar. Nenhum deu sinal de estar partido, simplesmente não foi possível
  obter o estado:
  - `https://www.eupersonalfinance.eu/visit/trade-republic`, erro de cliente sem código HTTP.
  - `https://www.eupersonalfinance.eu/visit/trading212`, erro de cliente sem código HTTP.
  - `https://www.eupersonalfinance.eu/visit/lightyear`, bloqueado por robots.txt.
  - `https://www.eupersonalfinance.eu/visit/wise`, bloqueado por robots.txt.
  - `https://www.trading212.com/join/IITW`, erro de cliente sem código HTTP.
  - `https://lp.freedom24.com/en/begin?...`, erro de cliente sem código HTTP.
  - `https://revolut.ngih.net/mOAZg7`, bloqueado por robots.txt.
  - `https://partner.scalable-capital.de/go.cgi?...`, bloqueado por robots.txt.
  Os dois primeiros são redirecionamentos do próprio site e são os que mais importam, porque se um deles tiver
  desaparecido o botão deixa de levar a sítio nenhum. Um `curl -sIL` a partir da máquina do Franklin resolve isto em
  segundos e dá o código de estado que esta sessão não consegue obter.
- Corretoras portuguesas em `data/corretoras.json`: os preçários em PDF do ActivoBank, Best, BiG, Carregosa, Invest e
  Openbank não foram lidos nesta ronda. As comissões mudam pouco e o BCE não mexeu, mas a confirmação formal está
  nesses documentos.

## Próximo passo

Rever e decidir. Por fonte primária, só há duas coisas prontas a entrar: o código do eToro e os códigos do Freedom24,
e as duas são decisões editoriais e não correções de dados. O resto é por confirmar ou está igual. As duas datas a ter
debaixo de olho são 30 de novembro de 2026, que fecha a promoção de 4,20% do Trading 212 e as campanhas locais do XTB
na Alemanha e na Itália, e 31 de dezembro de 2026, que fecha a promoção de 4,50% do XTB e a campanha portuguesa.
