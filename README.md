# Comparador de corretoras (LiteraciaFinanceira.pt)

Ficheiros servidos pelo GitHub Pages em https://franklinsilvapt-arch.github.io/corretoras-comparator/

- `data/corretoras.json`: todos os dados mostrados nas tabelas (comissões, juros, segurança, impostos, produtos, links e avisos de risco), a data de verificação, os pressupostos de câmbio e preço e os pares de comparações "X vs Y". Alterações de dados vão direto para produção.
- `comparador-corretoras-staging.js`: lógica do comparador e fórmulas dos quatro cenários de custo (objeto `CALC`). Se uma comissão mudar, atualiza o texto no JSON e a fórmula no `CALC`.
- `comparador-corretoras-staging.css`: estilos (namespace `#lf-cc`).
- `logos.js`: logos das 14 corretoras em data URI.
- `*-staging.js` / `*-staging.css`: versões usadas pela página no webflow.io. Mudanças de design e código entram primeiro aqui. Os ficheiros de produção (`comparador-corretoras.js` e `.css`) só são criados ou atualizados, a partir dos de staging, com ok do Franklin.
- `webflow-custom-code.html`: código a colar na página do Webflow (antes do `</body>`).

Regra de verificação: cada valor é confirmado no site ou preçário oficial da corretora.
