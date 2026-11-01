# Adenda ao relatório de 2026-11-01

Segunda passagem, depois de o Franklin confirmar coisas à mão e pedir nova tentativa ao que tinha
falhado. Corrige dois pontos do `relatorio.md` e fecha um terceiro. Continua sem alterações a
ficheiros de dados e sem nada tocado no Webflow.

## Correção 1: a Trading 212 está certa, a urgência cai

O relatório dizia que o valor de 4,20% podia estar errado em produção e que isso era o item mais
urgente. Não está errado. O Franklin abriu `trading212.com/pt/interest-on-cash` hoje e a página
mostra, no cartão do euro, **4,2%**, com o texto "Ganhe 4,2% sobre o seu capital EUR", "Pagos
diariamente. Sem mínimos ou limites" e a nota "4,2% é uma taxa promocional variável durante 4 meses
a partir da ativação apenas para novos clientes Invest".

O `eu/data/brokers.json` e o `data/corretoras.json` estão portanto corretos no valor que mostram.
Não há nada a corrigir à pressa.

A mesma página dá a tabela de moedas, que vale a pena guardar: EUR 4,2%, USD 3,3%, GBP 3,55%,
HUF 3%, **PLN 2,25%**, CZK 3%, RON 3,5%, DKK 0,25% e NOK 0,25%. O PLN a 2,25% confirma o override
polaco do `trading212-cy` no savings comparator.

O que continua por confirmar é só a letra pequena, e nenhuma destas coisas está visível no
comparador:

- a **taxa padrão** que se aplica depois dos 4 meses. A nossa nota diz 3,50% a descer para 2,80% a
  1 de novembro. A página não a imprime, só mostra a promocional
- as **datas da janela promocional**, que temos como 16 de setembro a 2 de novembro de 2026. A
  página diz só "4 meses a partir da ativação" e "apenas para novos clientes Invest"
- a taxa em euros da **Trading 212 Markets Ltd**, a entidade cipriota, que temos a 2,50%

Nota técnica para a próxima verificação: o endereço que funciona é o que tem locale,
`trading212.com/pt/interest-on-cash`. O `src` guardado no `eu/data/brokers.json` é
`trading212.com/terms/invest`, que bloqueia leitura automática. Vale trocar o `src` para a página
de juros com locale, que é onde os números estão mesmo impressos. Tentei sete variantes do endereço
com `/pt/` a partir desta sessão e todas devolveram erro de cliente, por isso o bloqueio parece ser
da ferramenta de leitura e não do site: num browser normal a página abre, como a tua captura mostra.

## Correção 2: o `/visit/trading212` funciona

O relatório pôs `eupersonalfinance.eu/visit/trading212` na lista de links a investigar, por ter
devolvido erro de cliente. O Franklin confirmou que abre bem. Era falso alarme meu: o erro veio da
ferramenta de leitura, não do link. **Riscar esse ponto.**

O link que continua por testar é outro e não tem `/visit/`: é o link de afiliado direto da
Freedom24 no `eu/data/brokers.json`,
`lp.freedom24.com/en/begin?utm_source=3025&utm_medium=affiliates&utm_campaign=mc_inaff_1106&utm_term=3025&s_id=GAds`.
Esse devolveu erro de cliente e não consegui distinguir um 404 de proteção anti-bot. É o único link
das duas listas que continua sem resposta e vale um clique.

## Fecha-se: DEGIRO, os 0% de juros

Continua sem fonte própria. O PDF do preçário irlandês, `degiro.ie/data/pdf/ie/IE_Feeschedule.pdf`,
está bloqueado por robots.txt a esta sessão. O campo mantém-se como está, a 0%, que é quase de
certeza verdade, mas sustentado apenas pelo nosso próprio review.

## O que continua igual ao relatório

Tudo o resto: a IBKR a 2,049%, a campanha da XTB mal registada no ficheiro português, o link de
afiliado da XTB a aterrar em `xtb.com/int` sem oferta nenhuma, e as desadequações entre as ofertas
da eToro, da Freedom24 e da XTB e os artigos para onde apontam.

Um acrescento sobre o Banco Best, vindo da verificação dos depósitos: o campo `src` da entrada do
Best no `data/corretoras.json` aponta para
`bancobest.pt/ptg/bestsite/best_docs/PRE_PRF_titulos.pdf`. Convinha confirmar a data desse
documento, porque dois outros PDFs de preçário do Best que aparecem bem nas pesquisas estão em
vigor desde 2021 e 2023 e continuam online.
