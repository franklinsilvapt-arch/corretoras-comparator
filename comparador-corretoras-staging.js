/* Comparador de corretoras - LiteraciaFinanceira.pt
   Dados em data/corretoras.json (editar ali os valores). Fórmulas de custo em CALC, abaixo. */
(function () {
  'use strict';
  var scriptEl = document.currentScript;
  var BASE = scriptEl ? scriptEl.src.replace(/[^/]*$/, '') : 'https://franklinsilvapt-arch.github.io/corretoras-comparator/';
  var LF = 'https://www.literaciafinanceira.pt';
  var RISK = 'Investir envolve risco de perda de capital.';
  var CONF = 'A confirmar';
  var VERIFIED, USD_EUR, ETF_PRICE, US_PRICE_USD, B, PAIRS, LOGOS = window.LF_CC_LOGOS || {};
  var CALC = {
    'activobank': {
      etf: function(a){ return {v:0, s:'1.ª ordem do mês grátis (seguintes: 5€)'}; },
      us: function(a){ return {v:0, s:'1.ª ordem do mês grátis (seguintes: 5$ + selo). Câmbio à taxa interna do banco, não incluído', extra:'+ câmbio'}; },
      plan: function(m){ return {v:0, s:'Uma compra por mês cabe na ordem grátis mensal'}; },
      custody: function(p){ return {v:44.28, s:'Comissão de serviço de bolsa: 3€ + IVA por mês'}; }
    },
    'best': {
      etf: function(a){ var c=Math.max(10,a*0.0008)*1.04; return {v:c, s:'Best Trading Pro: 0,08% (mín. 10€) + 4% de Imposto do Selo'}; },
      us: function(a){ var sh=Math.ceil(a/USD_EUR/US_PRICE_USD); var c=Math.max(14,0.05*sh)*USD_EUR*1.04+a*0.005; return {v:c, s:'Best Trading Pro: 0,05$/ação (mín. 14$) + selo + câmbio de 0,5%'}; },
      plan: function(m){ var c=Math.max(10,m*0.0008)*1.04*12; return {v:c, s:'12 ordens por ano no Best Trading Pro'}; },
      custody: function(p){ return {v:0, s:'Não se aplica no Best Trading Pro'}; }
    },
    'big': {
      etf: function(a){ var c=(a<=12000?11.95:a*0.001)*1.04; return {v:c, s:'Euronext Amesterdão: 11,95€ + 4% de Imposto do Selo'}; },
      us: function(a){ var usd=a/USD_EUR; var c=(usd<=12500?14.95*USD_EUR:usd*0.0012*USD_EUR)*1.04+a*0.005; return {v:c, s:'14,95$ + selo + câmbio indicativo de 0,5%'}; },
      plan: function(m){ return {v:11.95*1.04*12, s:'12 ordens por ano'}; },
      custody: function(p){ return {v:29.52, s:'6€ + IVA por trimestre no MyBolsa, site e app'}; }
    },
    'carregosa': {
      etf: function(a){ var c=(a<20000?7:Math.max(10,a*0.0008))*1.04; return {v:c, s:'GoBulling Investor, campanha até 31/12/2026: 7€ + 4% de selo'}; },
      us: function(a){ var usd=a/USD_EUR; var c=(usd<20000?7:Math.max(12.5,usd/US_PRICE_USD*0.05)*USD_EUR)*1.04+a*0.005; return {v:c, s:'Campanha até 31/12/2026: 7€ por ordem + selo + câmbio de 0,5%'}; },
      plan: function(m){ return {v:7*1.04*12, s:'12 ordens por ano (preço de campanha)'}; },
      custody: function(p){ return {v:0, s:'Sem custódia na GoBulling Investor e Pro'}; }
    },
    'degiro': {
      etf: function(a){ return {v:1, s:'ETF Core Selection (Tradegate): 0€ de comissão + 1€ de manuseamento'}; },
      us: function(a){ return {v:2+a*0.0025, s:'1€ + 1€ de manuseamento + câmbio de 0,25%'}; },
      plan: function(m){ return {v:12, s:'12 ordens de 1€ na ETF Core Selection'}; },
      custody: function(p){ return {v:0, s:'Conectividade de 2,50€/ano por bolsa, exceto Lisboa e Tradegate'}; }
    },
    'etoro': {
      etf: function(a){ return {v:0, s:'ETFs sem comissão, com conta em euros'}; },
      us: function(a){ return {v:1*USD_EUR+a*0.0075, s:'1$ de comissão + conversão EUR/USD de 0,75%'}; },
      plan: function(m){ return {v:0, s:'Investimento recorrente sem comissão em ETFs'}; },
      custody: function(p){ return {v:0}; }
    },
    'freedom24': {
      etf: function(a){ var u=Math.ceil(a/ETF_PRICE); return {v:2+0.02*u, s:'Plano Smart: 2€ por ordem + 0,02€ por unidade'}; },
      us: function(a){ var sh=Math.ceil(a/USD_EUR/US_PRICE_USD); return {v:(2+0.02*sh)*USD_EUR, s:'Plano Smart: 2$ + 0,02$ por ação. Sem comissão de câmbio publicada', extra:'+ câmbio'}; },
      plan: function(m){ return {v:0, s:'0% dentro do plano de investimento recorrente em ETFs selecionados'}; },
      custody: function(p){ return {v:0}; }
    },
    'ibkr': {
      etf: function(a,plan){
          if(plan==='tiered'){ var c=Math.min(29,Math.max(1.25,a*0.0005)); return {v:c, s:'Tiered: 0,05% (mín. 1,25€, máx. 29€ na Xetra) + taxas de bolsa', extra:true}; }
          return {v:Math.max(3,a*0.0005), s:'Fixed na Xetra: 0,05% (mín. 3€), taxas incluídas'}; },
      us: function(a,plan){ var sh=Math.ceil(a/USD_EUR/US_PRICE_USD);
          if(plan==='tiered'){ return {v:Math.max(0.35,0.0035*sh)*USD_EUR+a*0.0003, s:'Tiered: 0,0035$/ação (mín. 0,35$) + taxas + câmbio de 0,03%', extra:true}; }
          return {v:Math.max(1,0.005*sh)*USD_EUR+a*0.0003, s:'Fixed: 0,005$/ação (mín. 1$) + câmbio de 0,03%'}; },
      plan: function(m,plan){
          if(plan==='tiered'){ return {v:12*Math.max(1.25,m*0.0005), s:'12 ordens a 1,25€ + taxas de bolsa', extra:true}; }
          return {v:12*3, s:'12 ordens a 3€'}; },
      custody: function(p){ return {v:0}; }
    },
    'lightyear': {
      etf: function(a){ return {v:0, s:'ETFs sem comissão de execução'}; },
      us: function(a){ var usd=a/USD_EUR; return {v:Math.min(1,usd*0.001)*USD_EUR+a*0.0035, s:'0,1% (máx. 1$) + câmbio de 0,35%'}; },
      plan: function(m){ return {v:0, s:'Plans sem comissão em ETFs'}; },
      custody: function(p){ return {v:0}; }
    },
    'openbank': {
      etf: function(a){ return {v:1, s:'1€ por compra ou venda, em qualquer mercado'}; },
      us: function(a){ return {v:1+a*0.007, s:'1€ + câmbio de 0,70% (1% a partir de 8/11/2026)'}; },
      plan: function(m){ return {v:12, s:'12 ordens de 1€'}; },
      custody: function(p){ return {v:0, s:'0€ a partir de 1 de outubro de 2026'}; }
    },
    'revolut': {
      etf: function(a){ return {v:1, s:'1€ por ordem no plano Standard (0€ dentro do plano de investimento)'}; },
      us: function(a){ var fx=Math.max(0,a-1000)*0.01; return {v:1+fx, s:'1€ + câmbio grátis até 1.000€/mês (1% acima), em dias úteis'}; },
      plan: function(m){ return {v:0, s:'Planos de investimento em ETFs selecionados sem comissão'}; },
      custody: function(p){ return {v:0}; }
    },
    'traderepublic': {
      etf: function(a){ return {v:1, s:'1€ de taxa de liquidação por ordem'}; },
      us: function(a){ return {v:1, s:'1€ por ordem. Ações dos EUA negociadas em euros'}; },
      plan: function(m){ return {v:0, s:'Planos de poupança sem custo de compra'}; },
      custody: function(p){ return {v:0}; }
    },
    'trading212': {
      etf: function(a){ return {v:0, s:'Sem comissões. Podem aplicar-se outras comissões'}; },
      us: function(a){ return {v:a*0.0015, s:'Sem comissões + câmbio de 0,15%'}; },
      plan: function(m){ return {v:0, s:'AutoInvest sem comissões'}; },
      custody: function(p){ return {v:0}; }
    },
    'xtb': {
      etf: function(a){ return {v:a<=100000?0:Math.max(10,(a-100000)*0.002), s:'0% até 100.000€ de volume mensal'}; },
      us: function(a){ return {v:a*0.005, s:'0% de comissão + câmbio de 0,5%'}; },
      plan: function(m){ return {v:0, s:'Planos de investimento sem comissão'}; },
      custody: function(p){ return {v:Math.max(0,p-250000)*0.0002, s:'0€ até 250.000€ (0,02%/ano acima)'}; }
    }
  };

  function boot(){
    var root0 = document.getElementById('lf-cc'); if(!root0) return;
    fetch(BASE + 'data/corretoras.json?v=' + Date.now().toString().slice(0,-5), {cache:'no-cache'})
      .then(function(r){ return r.json(); })
      .then(function(d){
        VERIFIED = d.verificado; USD_EUR = d.pressupostos.USD_EUR; ETF_PRICE = d.pressupostos.ETF_PRICE; US_PRICE_USD = d.pressupostos.US_PRICE_USD;
        PAIRS = d.pares;
        B = d.corretoras.filter(function(b){ return CALC[b.id]; }).map(function(b){ b.calc = CALC[b.id]; return b; });
        start();
      })
      .catch(function(e){ root0.innerHTML = '<p style="text-align:center;color:#697386">Não foi possível carregar o comparador. Tenta recarregar a página.</p>'; console.error(e); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  function start(){
  /* ---------- Linhas ---------- */
    var SECTIONS = [
      { id:'custos', title:'Quanto pagas', sub:'Calculado com os valores acima', open:true, rows:[
        {k:'etf', calc:true, label:'Comprar um ETF europeu', note:function(){ return 'Ordem de '+fmtInt(S.amount)+'€, pelo percurso mais barato'; }},
        {k:'us', calc:true, label:'Comprar ações dos EUA', note:function(){ return 'Ordem de '+fmtInt(S.amount)+'€, com câmbio incluído'; }},
        {k:'plan', calc:true, label:'Plano mensal em ETFs', note:function(){ return fmtInt(S.monthly)+'€ por mês, custo num ano'; }},
        {k:'custody', calc:true, label:'Manter a carteira', note:function(){ return 'Carteira de '+fmtInt(S.portfolio)+'€, custo num ano'; }}
      ]},
      { id:'comissoes', title:'Comissões em detalhe', open:true, rows:[
        {k:'etfFee', label:'ETFs europeus'},
        {k:'pt', label:'Ações portuguesas', note:'Euronext Lisboa'},
        {k:'usFee', label:'Ações dos EUA'},
        {k:'fx', label:'Câmbio'},
        {k:'custodyTxt', label:'Custódia'},
        {k:'inact', label:'Inatividade'},
        {k:'transfer', label:'Transferir títulos para outra corretora'}
      ]},
      { id:'juros', title:'Juros sobre o dinheiro não investido', open:true, rows:[
        {k:'interest', label:'Taxa em euros'}
      ]},
      { id:'seguranca', title:'Segurança e regulação', open:true, rows:[
        {k:'entity', label:'Entidade que serve clientes em Portugal'},
        {k:'regulator', label:'Regulador'},
        {k:'presence', label:'Presença em Portugal'},
        {k:'protInv', label:'Proteção dos investimentos'},
        {k:'protCash', label:'Proteção do dinheiro'}
      ]},
      { id:'impostos', title:'Impostos', open:true, rows:[
        {k:'tax', label:'Retém IRS em Portugal'},
        {k:'annex', label:'Onde declaras no IRS'}
      ]},
      { id:'produtos', title:'Produtos e conta', open:false, rows:[
        {k:'ptStocks', label:'Ações da Euronext Lisboa'},
        {k:'fractions', label:'Frações de ações e ETFs'},
        {k:'plans', label:'Planos de investimento automático'},
        {k:'bonds', label:'Obrigações'},
        {k:'options', label:'Opções'},
        {k:'iban', label:'IBAN português'}
      ]}
    ];
    var NCRIT = SECTIONS.reduce(function(n,s){ return n+s.rows.length; },0);
  
    /* ---------- Estado ---------- */
    var S = { sel:['xtb','trading212','traderepublic'], amount:1000, monthly:100, portfolio:10000, ibkr:'fixed', diff:false, open:{} };
    SECTIONS.forEach(function(s){ S.open[s.id]=s.open; });
  
    function isMobile(){ return window.matchMedia('(max-width:767px)').matches; }
    function maxSel(){ return isMobile()?2:3; }
    function byId(id){ for(var i=0;i<B.length;i++){ if(B[i].id===id) return B[i]; } return null; }
  
    /* ---------- Formatação pt-PT ---------- */
    function fmtInt(n){ return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
    function fmtEur(n){ var p=(Math.round(n*100)/100).toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.')+','+p[1]+'€'; }
    function parseNum(v){ var n=parseFloat(String(v).replace(/\s/g,'').replace(/\./g,'').replace(',','.')); return isFinite(n)&&n>0?n:0; }
    function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  
    /* ---------- Render ---------- */
    var root = document.getElementById('lf-cc');
    var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  
    function logo(b,size){
      var st=(size?'width:'+size+'px;height:'+size+'px;':'');
      if(LOGOS[b.id]) return '<span class="cc-logo has-img" style="'+st+'" aria-hidden="true"><img src="'+LOGOS[b.id]+'" alt=""></span>';
      return '<span class="cc-logo" style="background:'+b.color+';'+st+'" aria-hidden="true">'+esc(b.short)+'</span>'; }
  
    function shell(){
      root.innerHTML =
        '<p class="cc-lead">Compara custos, juros, segurança e impostos de '+B.length+' corretoras e bancos disponíveis em Portugal. Todos os valores foram verificados nos sites e preçários de cada entidade.</p>'+
        '<div class="cc-meta">'+
          '<a class="cc-author" href="'+LF+'/autores/franklin-silva"><span class="cc-av"><img src="https://cdn.prod.website-files.com/67922c46c9da6bf5d9bfdf20/683ee0ae5bc67fe0ef48466e_franklin-silva.avif" alt="" onerror="this.parentNode.textContent=\'FS\'"></span><span><span class="cc-al">Autor</span><span class="cc-an">Franklin Silva</span></span></a>'+
          '<a class="cc-author" href="'+LF+'/autores/pedro-braz"><span class="cc-av"><img src="https://cdn.prod.website-files.com/67922c46c9da6bf5d9bfdf20/683ee0f9b80a20ec1767fab5_Pedro-Braz.avif" alt="" onerror="this.parentNode.textContent=\'PB\'"></span><span><span class="cc-al">Revisor</span><span class="cc-an">Pedro Braz</span></span></a>'+
          '<span class="cc-author"><span class="cc-av">'+'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'+'</span><span><span class="cc-al">Última verificação</span><span class="cc-an">'+VERIFIED+'</span></span></span>'+
        '</div>'+
        '<div class="cc-stats"><span class="cc-stat"><b>'+B.length+'</b> corretoras e bancos</span><span class="cc-stat"><b>'+NCRIT+'</b> critérios</span><span class="cc-stat">Dados de <b>setembro de 2026</b></span></div>'+
        '<div class="cc-panel">'+
          '<p class="cc-step">Escolhe até <span id="cc-max">3</span> para comparar</p>'+
          '<p class="cc-hint">Por ordem alfabética. Se já tiveres o máximo escolhido, a mais antiga sai. A seleção inicial são as três corretoras mais pesquisadas em Portugal.</p>'+
          '<div class="cc-picker" id="cc-picker"></div>'+
          '<div class="cc-divider"></div>'+
          '<p class="cc-step">Ajusta o teu cenário</p>'+
          '<p class="cc-hint">Os custos da primeira secção são recalculados com estes valores.</p>'+
          '<div class="cc-scen">'+
            field('cc-amount','Valor de cada compra',S.amount,'Assume que é a única ordem do mês')+
            field('cc-monthly','Investimento mensal',S.monthly,'Para o plano automático em ETFs')+
            field('cc-portfolio','Valor da carteira',S.portfolio,'Para a custódia anual')+
          '</div>'+
        '</div>'+
        '<div class="cc-bar"><span class="cc-count" id="cc-count"></span>'+
          '<button type="button" class="cc-switch" id="cc-diff" aria-pressed="false"><i></i>Mostrar só diferenças</button></div>'+
        '<div class="cc-table" id="cc-table"></div>'+
        '<div class="cc-pairs" id="cc-pairs"></div>'+
        notesHtml()+
        faqHtml();
    }
  
    function field(id,label,val,note){
      return '<div><label class="cc-label" for="'+id+'">'+label+'</label><div class="cc-iw"><input class="cc-input" id="'+id+'" inputmode="decimal" value="'+fmtInt(val)+'"><span class="cc-unit">€</span></div><div class="cc-inote">'+note+'</div></div>';
    }
  
    function renderPicker(){
      var max=maxSel(); document.getElementById('cc-max').textContent=max;
      var full=S.sel.length>=max;
      document.getElementById('cc-picker').innerHTML = B.map(function(b){
        var on=S.sel.indexOf(b.id)>-1;
        return '<button type="button" class="cc-pick'+(on?' is-on':'')+'" data-id="'+b.id+'" aria-pressed="'+on+'"'+'>'+logo(b)+'<span>'+esc(b.name)+'</span><span class="cc-pick-t">'+esc(b.type)+'</span></button>';
      }).join('');
    }
  
    function calcFor(b,k){
      var plan=b.hasPlan?S.ibkr:null;
      if(k==='etf') return b.calc.etf(S.amount,plan);
      if(k==='us') return b.calc.us(S.amount,plan);
      if(k==='plan') return b.calc.plan(S.monthly,plan);
      return b.calc.custody(S.portfolio,plan);
    }
  
    function cellHtml(b,row,best){
      var d, html;
      if(row.calc){
        d=calcFor(b,row.k);
        html='<span class="cc-v is-big">'+fmtEur(d.v)+(d.extra?' <span style="font-size:13px;font-weight:500;color:#697386">'+(typeof d.extra==='string'?d.extra:'+ taxas')+'</span>':'')+'</span>';
        if(d.s) html+='<span class="cc-s">'+esc(d.s)+'</span>';
        if(best!==null && !d.extra && Math.abs(d.v-best)<0.005) html+='<span class="cc-tag is-best">Mais barato</span>';
        if(d.c) html+='<span class="cc-tag is-conf">'+CONF+'</span>';
      } else {
        d=b.t[row.k]||{v:CONF,c:true};
        var isConf=d.v===CONF;
        html=isConf?'':'<span class="cc-v">'+esc(d.v)+'</span>';
        if(d.s) html+='<span class="cc-s">'+esc(d.s)+'</span>';
        if(d.c) html+='<span class="cc-tag is-conf">'+CONF+'</span>';
      }
      return '<div class="cc-cell">'+html+'</div>';
    }
  
    function sameValues(sel,row){
      if(sel.length<2) return false;
      var vals=sel.map(function(b){ if(row.calc){ return fmtEur(calcFor(b,row.k).v); } var d=b.t[row.k]||{}; return (d.v||'')+'|'+(d.s||''); });
      return vals.every(function(v){ return v===vals[0]; });
    }
  
    function renderTable(){
      var sel=S.sel.map(byId).filter(Boolean);
      var t=document.getElementById('cc-table');
      document.getElementById('cc-count').textContent = sel.length? (sel.length===1?'1 corretora selecionada':sel.length+' corretoras selecionadas') : '';
      if(!sel.length){ t.innerHTML='<div class="cc-empty">Escolhe pelo menos uma corretora na lista acima para veres a comparação.</div>'; document.getElementById('cc-pairs').innerHTML=''; return; }
      root.style.setProperty('--cc-cols','minmax(180px,1.1fr) repeat('+sel.length+',minmax(0,1fr))');
      root.style.setProperty('--cc-n',sel.length);
      root.classList.toggle('show-all',!S.diff);
  
      var head='<div class="cc-row cc-head"><div class="cc-hcell"></div>'+sel.map(function(b){
        var h='<div class="cc-hcell"><div class="cc-hname">'+logo(b,32)+'<span><b>'+esc(b.name)+'</b><small>'+esc(b.type)+'</small></span></div>';
        h+='<div class="cc-hextra">'+(b.hasPlan?'<div class="cc-pills" role="group" aria-label="Plano de comissões"><button type="button" class="cc-pill'+(S.ibkr==='fixed'?' is-on':'')+'" data-plan="fixed">Fixed</button><button type="button" class="cc-pill'+(S.ibkr==='tiered'?' is-on':'')+'" data-plan="tiered">Tiered</button></div>':'')+'</div>';
        h+='<a class="cc-btn" href="'+b.cta.href+'" target="_blank" rel="noopener sponsored">'+esc(b.cta.label)+'</a><span class="cc-risk">'+esc(b.risk)+'</span>';
        if(b.review) h+='<a class="cc-review" href="'+b.review+'" target="_blank" rel="noopener">Ler a análise</a>';
        return h+'</div>';
      }).join('')+'</div>';
  
      var body=SECTIONS.map(function(sec){
        var rows=sec.rows.map(function(row){
          var best=null;
          if(row.calc && sel.length>1){
            var vals=sel.map(function(b){ var d=calcFor(b,row.k); return d.extra?null:d.v; }).filter(function(v){ return v!==null; });
            var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals);
            if(vals.length && mx-mn>0.004) best=mn;
          }
          var note=typeof row.note==='function'?row.note():row.note;
          var same=sameValues(sel,row);
          return '<div class="cc-row'+(same?' is-same':'')+'"><div class="cc-lab">'+esc(row.label)+(note?'<small>'+esc(note)+'</small>':'')+'</div>'+sel.map(function(b){ return cellHtml(b,row,best); }).join('')+'</div>';
        }).join('');
        var closed=!S.open[sec.id];
        return '<div class="cc-sec'+(closed?' is-closed':'')+'"><button type="button" class="cc-sec-h" data-sec="'+sec.id+'" aria-expanded="'+(!closed)+'"><span>'+esc(sec.title)+(sec.sub?'<small>'+esc(sec.sub)+'</small>':'')+'</span>'+CHEV+'</button><div class="cc-sec-b">'+rows+'</div></div>';
      }).join('');
  
      var srcRow='<div class="cc-row" style="border-top:1px solid #e9ecf1"><div class="cc-lab">Fontes<small>Preçários e páginas oficiais</small></div>'+sel.map(function(b){ return '<div class="cc-cell"><a class="cc-src" style="margin-left:0" href="'+b.src+'" target="_blank" rel="noopener">Preçário de '+esc(b.name)+'</a></div>'; }).join('')+'</div>';
  
      t.innerHTML=head+body+srcRow;
      alignHead();
      renderPairs(sel);
    }
  
    function alignHead(){
      var els=root.querySelectorAll('.cc-head .cc-hname, .cc-head .cc-hextra'), groups={};
      Array.prototype.forEach.call(els,function(el){ el.style.minHeight=''; var k=el.className; (groups[k]=groups[k]||[]).push(el); });
      Object.keys(groups).forEach(function(k){ var mx=0; groups[k].forEach(function(el){ mx=Math.max(mx,el.offsetHeight); }); groups[k].forEach(function(el){ el.style.minHeight=mx+'px'; }); });
    }
    window.addEventListener('resize',function(){ alignHead(); });
  
    function renderPairs(sel){
      var out=[];
      for(var i=0;i<sel.length;i++){ for(var j=i+1;j<sel.length;j++){
        var key=[sel[i].id,sel[j].id].sort().join('|');
        if(PAIRS[key]) out.push('<a class="cc-pair" href="'+LF+'/artigos/'+PAIRS[key]+'" target="_blank" rel="noopener"><span>Comparação completa: <b>'+esc(sel[i].name)+' vs '+esc(sel[j].name)+'</b></span><span>Ler artigo</span></a>');
      }}
      document.getElementById('cc-pairs').innerHTML=out.join('');
    }
  
    function notesHtml(){
      return '<div class="cc-notes">'+
        '<p><b>Como calculamos os custos:</b> cada cenário usa o percurso mais barato que a corretora oferece para esse produto, com a comissão, as taxas fixas e o custo de câmbio. Comissões em dólares convertidas a 1$ = 0,85€. Para comissões por unidade assumimos um ETF a 100€ e uma ação americana a 200$. Os bancos portugueses incluem 4% de Imposto do Selo sobre a comissão. Spreads de mercado e custos dos próprios ETFs (TER) não estão incluídos.</p>'+
        '<p><b>Interactive Brokers:</b> usa o seletor Fixed/Tiered no topo da coluna. No Tiered os valores aparecem com "+ taxas" porque as taxas de bolsa, compensação e regulatórias variam com a bolsa e não entram no cálculo. O glossário tem exemplos de quando cada plano compensa.</p>'+
        '<p><b>Trading 212:</b> link patrocinado. Para obter ações fracionadas gratuitas no valor de até 100€, podes abrir conta na Trading 212 através deste link ou com o código "LF". Aplicam-se termos e condições. Ao investir, o teu capital está em risco e poderás receber menos do que o montante investido. Rendibilidades passadas não garantem resultados futuros. Se ativares os juros, a Trading 212 manterá o teu dinheiro em fundos do mercado monetário elegíveis e em bancos; caso contrário, o teu dinheiro será mantido apenas em bancos. Os juros aplicam-se ao dinheiro numa conta de investimento. As taxas apresentadas podem já não estar em vigor: consulta a página de <a href="https://www.trading212.com/terms/invest" target="_blank" rel="noopener">Termos e Taxas</a>. Termos da taxa promocional: <a href="https://www.trading212.com/legal-documentation/t212-de/Promotional-Terms_PT.pdf" target="_blank" rel="noopener">documento da Trading 212</a>.</p>'+
        '<p><b>Freedom24:</b> a comissão de 0% no plano de investimento em ETFs aplica-se exclusivamente à função de investimento recorrente. As restantes operações seguem a tabela de comissões da Freedom24.</p>'+
      '</div>';
    }
  
    function faqHtml(){
      function q(t,a){ return '<h3>'+t+'</h3><p>'+a+'</p>'; }
      return '<section class="cc-faq"><h2>Glossário</h2>'+
        q('Como é que este comparador calcula os custos?','Em vez de juntar comissões com regras diferentes (por ação, em percentagem ou fixas), simulamos o que pagas em quatro situações comuns: comprar um ETF europeu, comprar ações dos EUA, investir todos os meses num ETF e manter a carteira durante um ano. Podes mudar os valores no teu cenário e os custos são recalculados.')+
        q('Fixed ou Tiered: que plano escolher na Interactive Brokers?','No plano Fixed pagas um valor fechado que já inclui as taxas da bolsa. No Tiered a comissão é mais baixa, mas as taxas de bolsa, de compensação e regulatórias são cobradas à parte. Alguns exemplos com os preços da Interactive Brokers Ireland:<br>&zwj;<br><strong>ETF de 500€ na Xetra:</strong> 3€ no Fixed contra 1,25€ + taxas no Tiered. O Tiered só compensa se as taxas ficarem abaixo de 1,75€.<br><strong>ETF de 10.000€ na Xetra:</strong> 5€ nos dois planos (0,05%), mas o Tiered soma as taxas, por isso o Fixed sai mais barato.<br><strong>ETF de 100.000€ na Xetra:</strong> 50€ no Fixed contra o máximo de 29€ + taxas no Tiered. Aqui o Tiered compensa.<br><strong>Ações portuguesas, ordem de 1.000€:</strong> 6€ no Fixed (0,15%, mín. 6€) contra 1,25€ + taxas no Tiered, que tende a compensar na Euronext Lisboa.<br><strong>1.000 ações americanas a 25$:</strong> 5$ no Fixed contra 3,50$ + taxas no Tiered.<br>&zwj;<br>Na prática, o Fixed é mais previsível para ordens pequenas e médias em ETFs europeus. O Tiered ganha em ordens muito grandes e em mercados onde o Fixed tem mínimos altos, como Lisboa.')+
        q('Porque é que o câmbio pesa tanto nas ações dos EUA?','Quando compras uma ação cotada em dólares com euros, a corretora converte o dinheiro e cobra uma margem sobre a taxa de câmbio. Numa ordem de 1.000€, uma margem de 0,5% custa 5€, mais do que a comissão de muitas corretoras. Na venda voltas a pagar a conversão.')+
        q('Sucursal em Portugal ou livre prestação de serviços: o que muda?','Uma corretora com sucursal em Portugal tem presença física e responde também perante os supervisores portugueses. Em livre prestação de serviços, a corretora está autorizada noutro país da União Europeia e presta serviços em Portugal sob a supervisão do regulador de origem. Explicamos as diferenças no artigo sobre as <a href="'+LF+'/artigos/melhores-corretoras-em-portugal">melhores corretoras em Portugal</a>.')+
        q('Como declaro os investimentos de uma corretora estrangeira no IRS?','Se a corretora não retém imposto em Portugal, declaras os dividendos, os juros e as mais-valias no anexo J da declaração de IRS. Nos bancos portugueses, os dividendos e juros de títulos já têm retenção na fonte de 28% e as mais-valias vão para o anexo G.')+
        q('O que acontece ao meu dinheiro se a corretora falir?','Os títulos ficam segregados do património da corretora. Se não forem devolvidos, os sistemas de indemnização aos investidores cobrem até um limite, que varia com o país da entidade. Lê como funciona o <a href="'+LF+'/artigos/como-funciona-o-sistema-de-indemnizacao-aos-investidores">sistema de indemnização aos investidores</a>.')+
        q('Porque não aparecem CFDs?','Este comparador foca-se em investir em ações, ETFs e obrigações reais. Os CFDs são instrumentos alavancados com uma lógica de custos diferente, e compará-los lado a lado com a compra de ações distorcia os resultados.')+
        '<div class="cc-disc">Este comparador tem fins meramente informativos e não constitui aconselhamento financeiro nem recomendação de investimento. Os preçários mudam com frequência: confirma sempre as condições no site da corretora antes de abrir conta. Investir envolve risco de perda de capital.</div>'+
      '</section>';
    }
  
    /* ---------- Eventos ---------- */
    function bind(){
      root.addEventListener('click',function(e){
        var p=e.target.closest('.cc-pick');
        if(p){ var id=p.getAttribute('data-id'), i=S.sel.indexOf(id);
          if(i>-1) S.sel.splice(i,1); else { if(S.sel.length>=maxSel()) S.sel.shift(); S.sel.push(id); }
          renderPicker(); renderTable(); return; }
        var h=e.target.closest('.cc-sec-h');
        if(h){ var sid=h.getAttribute('data-sec'); S.open[sid]=!S.open[sid]; renderTable(); return; }
        var pl=e.target.closest('.cc-pill');
        if(pl){ S.ibkr=pl.getAttribute('data-plan'); renderTable(); return; }
        if(e.target.closest('#cc-diff')){ S.diff=!S.diff; document.getElementById('cc-diff').setAttribute('aria-pressed',S.diff); renderTable(); }
      });
      [['cc-amount','amount'],['cc-monthly','monthly'],['cc-portfolio','portfolio']].forEach(function(f){
        var el=document.getElementById(f[0]);
        el.addEventListener('input',function(){ var n=parseNum(el.value); if(n>0){ S[f[1]]=n; renderTable(); } });
        el.addEventListener('blur',function(){ el.value=fmtInt(S[f[1]]); });
      });
      var mq=window.matchMedia('(max-width:767px)');
      var onMq=function(){ while(S.sel.length>maxSel()) S.sel.pop(); renderPicker(); renderTable(); };
      if(mq.addEventListener) mq.addEventListener('change',onMq); else if(mq.addListener) mq.addListener(onMq);
    }
  
    shell();
    if(isMobile()) S.sel=S.sel.slice(0,2);
    renderPicker(); renderTable(); bind();
  
  }
})();
