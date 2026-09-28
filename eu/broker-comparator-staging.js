/* Broker comparator - EU Personal Finance (eupersonalfinance.eu)
   Data in eu/data/brokers.json (edit values there). Cost formulas in CALC, below. Logos from ../logos.js */
(function () {
  'use strict';
  var scriptEl = document.currentScript;
  var BASE = scriptEl ? scriptEl.src.replace(/[^/]*$/, '') : 'https://franklinsilvapt-arch.github.io/corretoras-comparator/eu/';
  var EU = 'https://www.eupersonalfinance.eu';
  var CONF = 'To be confirmed';
  var VERIFIED, USD_EUR, ETF_PRICE, US_PRICE_USD, B, PAIRS, LOGOS = window.LF_CC_LOGOS || {};
  /* IBKR Tiered on Xetra: commission 0.05% (min. €1.25, max. €29) + clearing €0.02 + 0.0008% (max. €4.02) + regulatory €0.01.
     Exchange fee waived for retail orders routed through SmartRouting (IBKR Ireland Xetra IBIS table). */
  function ibXetra(a){ return Math.min(29,Math.max(1.25,a*0.0005))+Math.min(4.02,0.02+a*0.000008)+0.01; }
  var TOP = ['traderepublic','trading212','ibkr'];
  var CALC = {
    'bitpanda': {
      etf: function(a){ return {v:1, s:'€1 per order. Spreads may apply'}; },
      us: function(a){ return {v:1, s:'€1 per order. Traded in euros, no published FX fee'}; },
      plan: function(m){ return {v:0, s:'Free for many ETFs under a current promotion (otherwise €1 per order)'}; },
      custody: function(p){ return {v:0}; }
    },
    'bux': {
      etf: function(a){ return {v:0.99, s:'€0.99 market order on the Basic plan'}; },
      us: function(a){ return {v:0.99+a*0.0075, s:'€0.99 + 0.75% FX (Basic plan)'}; },
      plan: function(m){ return {v:0, s:'Free buys in investment plans'}; },
      custody: function(p){ return {v:p*0.002, s:'0.20% a year on invested assets (Basic plan). Plus: €2.99 a month'}; }
    },
    'degiro': {
      etf: function(a){ return {v:1, s:'ETF Core Selection on Tradegate: €0 commission + €1 handling fee'}; },
      us: function(a){ return {v:2+a*0.0025, s:'€1 + €1 handling fee + 0.25% AutoFX'}; },
      plan: function(m){ return {v:12, s:'12 orders of €1 in the ETF Core Selection'}; },
      custody: function(p){ return {v:2.5, s:'One non-home exchange. €0 if you only hold ETF Core Selection'}; }
    },
    'etoro': {
      etf: function(a){ return {v:0, s:'No commission on ETFs, euro account'}; },
      us: function(a){ return {v:1*USD_EUR+a*0.0075, s:'$1 commission + 0.75% EUR/USD conversion'}; },
      plan: function(m){ return {v:0, s:'Recurring investments with no commission'}; },
      custody: function(p){ return {v:0}; }
    },
    'freedom24': {
      etf: function(a){ var u=Math.ceil(a/ETF_PRICE); return {v:2+0.02*u, s:'Smart plan: €2 per order + €0.02 per unit'}; },
      us: function(a){ var sh=Math.ceil(a/USD_EUR/US_PRICE_USD); return {v:(2+0.02*sh)*USD_EUR, s:'Smart plan: $2 + $0.02 per share. No published FX fee', extra:'+ FX'}; },
      plan: function(m){ return {v:0, s:'0% only within the recurring ETF investment plan'}; },
      custody: function(p){ return {v:0}; }
    },
    'ibkr': {
      etf: function(a,plan){
          if(plan==='tiered'){ return {v:ibXetra(a), s:'Tiered on Xetra: 0.05% (min. €1.25, max. €29) + clearing and regulatory fees'}; }
          return {v:Math.max(3,a*0.0005), s:'Fixed on Xetra: 0.05% (min. €3), fees included'}; },
      us: function(a,plan){ var sh=Math.ceil(a/USD_EUR/US_PRICE_USD);
          if(plan==='tiered'){ var com=Math.max(0.35,0.0035*sh); return {v:(com+0.003*sh+0.0002*sh+0.000003*sh+0.000735*com)*USD_EUR+a*0.0003, s:'Tiered: $0.0035/share (min. $0.35) + exchange, clearing and regulatory fees (market order) + 0.03% FX'}; }
          return {v:Math.max(1,0.005*sh)*USD_EUR+a*0.0003, s:'Fixed: $0.005/share (min. $1) + 0.03% FX'}; },
      plan: function(m,plan){
          if(plan==='tiered'){ return {v:12*ibXetra(m), s:'12 orders on Xetra, with clearing and regulatory fees'}; }
          return {v:12*3, s:'12 orders at €3'}; },
      custody: function(p){ return {v:0}; }
    },
    'lightyear': {
      etf: function(a){ return {v:0, s:'No commission on ETFs'}; },
      us: function(a){ var usd=a/USD_EUR; return {v:Math.min(1,usd*0.001)*USD_EUR+a*0.0035, s:'0.1% (max. $1) + 0.35% FX'}; },
      plan: function(m){ return {v:0, s:'Plans with no commission on ETFs'}; },
      custody: function(p){ return {v:0}; }
    },
    'revolut': {
      etf: function(a){ return {v:1, s:'€1 per order on the Standard plan (commission varies by country)'}; },
      us: function(a){ var fx=Math.max(0,a-1000)*0.01; return {v:1+fx, s:'€1 + free FX up to €1,000 a month (1% above), on weekdays'}; },
      plan: function(m){ return {v:0, s:'Investment plans in selected ETFs with no commission'}; },
      custody: function(p){ return {v:0}; }
    },
    'saxo': {
      etf: function(a){ return {v:Math.max(2,a*0.0008), s:'Classic tier on Euronext: 0.08% (min. €2)'}; },
      us: function(a){ var usd=a/USD_EUR; return {v:Math.max(1,usd*0.0008)*USD_EUR+a*0.0025, s:'Classic tier: 0.08% (min. $1) + 0.25% FX'}; },
      plan: function(m){ return {v:12*Math.max(2,m*0.0008), s:'No savings plans: 12 manual orders at min. €2'}; },
      custody: function(p){ return {v:p*0.0015*1.25, s:'0.15% a year + 25% VAT (Classic tier). 0% in BE, FR, IT, NL, DK and PL'}; }
    },
    'scalable': {
      etf: function(a){ return a>=250 ? {v:0, s:'PRIME ETF from €250 on the European Investor Exchange (Free Broker)'} : {v:0.99, s:'€0.99 per order under €250 (Free Broker)'}; },
      us: function(a){ return {v:0.99, s:'€0.99 on the European Investor Exchange. Traded in euros'}; },
      plan: function(m){ return {v:0, s:'Free savings plans'}; },
      custody: function(p){ return {v:0, s:'Free Broker. PRIME+ costs €4.99 a month'}; }
    },
    'traderepublic': {
      etf: function(a){ return {v:1, s:'€1 per order'}; },
      us: function(a){ return {v:1, s:'€1 per order. US stocks are traded in euros'}; },
      plan: function(m){ return {v:0, s:'Free savings plans'}; },
      custody: function(p){ return {v:0}; }
    },
    'trading212': {
      etf: function(a){ return {v:0, s:'No commissions. Other fees may apply'}; },
      us: function(a){ return {v:a*0.0015, s:'No commissions + 0.15% FX'}; },
      plan: function(m){ return {v:0, s:'AutoInvest with no commissions'}; },
      custody: function(p){ return {v:0}; }
    },
    'xtb': {
      etf: function(a){ return {v:a<=100000?0:Math.max(10,(a-100000)*0.002), s:'0% up to €100,000 monthly volume'}; },
      us: function(a){ return {v:a*0.005, s:'0% commission + 0.5% FX'}; },
      plan: function(m){ return {v:0, s:'Investment plans with no commission'}; },
      custody: function(p){ return {v:Math.max(0,p-250000)*0.0002, s:'€0 up to €250,000 (0.02% a year above)'}; }
    }
  };

  function boot(){
    var root0 = document.getElementById('eu-bc'); if(!root0) return;
    fetch(BASE + 'data/brokers.json?v=' + Date.now().toString().slice(0,-5), {cache:'no-cache'})
      .then(function(r){ return r.json(); })
      .then(function(d){
        VERIFIED = d.verified; USD_EUR = d.assumptions.USD_EUR; ETF_PRICE = d.assumptions.ETF_PRICE; US_PRICE_USD = d.assumptions.US_PRICE_USD;
        PAIRS = d.pairs;
        B = d.brokers.filter(function(b){ return CALC[b.id]; }).map(function(b){ b.calc = CALC[b.id]; return b; });
        /* Pre-selected brokers first in the picker, the rest in alphabetical order */
        B = TOP.map(function(id){ for(var i=0;i<B.length;i++){ if(B[i].id===id) return B[i]; } return null; }).filter(Boolean)
          .concat(B.filter(function(b){ return TOP.indexOf(b.id)<0; }).sort(function(x,y){ return x.name.localeCompare(y.name); }));
        start();
      })
      .catch(function(e){ root0.innerHTML = '<p style="text-align:center;color:#697386">The comparator could not be loaded. Please reload the page.</p>'; console.error(e); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  function start(){
  /* ---------- Rows ---------- */
    var SECTIONS = [
      { id:'custos', title:'What you pay', sub:'Calculated with the values above', open:true, rows:[
        {k:'etf', calc:true, label:'Buy a European ETF', note:function(){ return '€'+fmtInt(S.amount)+' order, cheapest route'; }},
        {k:'us', calc:true, label:'Buy US stocks', note:function(){ return '€'+fmtInt(S.amount)+' order, FX included'; }},
        {k:'plan', calc:true, label:'Monthly ETF plan', note:function(){ return '€'+fmtInt(S.monthly)+' a month, cost over a year'; }},
        {k:'custody', calc:true, label:'Keep your portfolio', note:function(){ return '€'+fmtInt(S.portfolio)+' portfolio, cost over a year'; }}
      ]},
      { id:'comissoes', title:'Fees in detail', open:true, rows:[
        {k:'etfFee', label:'European ETFs'},
        {k:'usFee', label:'US stocks'},
        {k:'fx', label:'Currency conversion'},
        {k:'custodyTxt', label:'Custody'},
        {k:'inact', label:'Inactivity'},
        {k:'transfer', label:'Transfer securities out'}
      ]},
      { id:'juros', title:'Interest on uninvested cash', open:true, rows:[
        {k:'interest', label:'Rate on euros', high:true}
      ]},
      { id:'seguranca', title:'Safety and regulation', open:true, rows:[
        {k:'entity', label:'Entity serving EU clients'},
        {k:'regulator', label:'Regulator'},
        {k:'protInv', label:'Investor protection'},
        {k:'protCash', label:'Cash protection'},
        {k:'available', label:'Available in'}
      ]},
      { id:'produtos', title:'Products and account', open:true, rows:[
        {k:'fractions', label:'Fractional shares and ETFs'},
        {k:'plans', label:'Automatic investment plans'},
        {k:'bonds', label:'Bonds'},
        {k:'options', label:'Options'}
      ]}
    ];

    /* ---------- State ---------- */
    var S = { sel:TOP.slice(0), amount:1000, monthly:100, portfolio:10000, ibkr:'fixed', diff:false, more:false, open:{} };
    SECTIONS.forEach(function(s){ S.open[s.id]=s.open; });

    function isMobile(){ return window.matchMedia('(max-width:767px)').matches; }
    function maxSel(){ return isMobile()?2:3; }
    function byId(id){ for(var i=0;i<B.length;i++){ if(B[i].id===id) return B[i]; } return null; }

    /* ---------- English number format ---------- */
    function fmtInt(n){ return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,','); }
    function fmtEur(n){ var p=(Math.round(n*100)/100).toFixed(2).split('.'); return '€'+p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',')+'.'+p[1]; }
    function parseNum(v){ var n=parseFloat(String(v).replace(/[\s,€]/g,'')); return isFinite(n)&&n>0?n:0; }
    function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

    /* ---------- Render ---------- */
    var root = document.getElementById('eu-bc');
    function ico(p){ return '<svg class="cc-sec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'; }
    var CHEV = '<svg class="cc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>';
    /* Lucide-style icons: calculator, percent, piggy bank, shield, layers */
    var ICONS = {
      custos: ico('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01M8 10h.01M12 10h.01M16 10h.01"/>'),
      comissoes: ico('<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'),
      juros: ico('<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/>'),
      seguranca: ico('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.720a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'),
      produtos: ico('<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>')
    };
    /* Some affiliate links go through domains that ad blockers (EasyList) block, like Impact's sjv.io and ngih.net.
       If the broker's probe domain is blocked in this browser, the button points to the broker's own site. */
    var BLOCKED={}, probed={};
    function ctaHref(b){ return (b.cta.probe && BLOCKED[b.cta.probe] && b.cta.fallback) ? b.cta.fallback : b.cta.href; }
    function probeBlock(sel){
      if(typeof fetch!=='function') return;
      sel.forEach(function(b){
        var u=b.cta.probe; if(!u || probed[u]) return; probed[u]=true;
        fetch(u, {mode:'no-cors', credentials:'omit', cache:'no-store'})
          .then(function(){}, function(){ BLOCKED[u]=true; renderTable(); });
      });
    }
    function ctaLabel(b){ return 'Go to '+b.name; }
    function ctaRel(b){ return b.cta.plain ? 'noopener' : 'noopener sponsored'; }
    function ctaHtml(b){ return '<a class="cc-btn" href="'+ctaHref(b)+'" target="_blank" rel="'+ctaRel(b)+'"><span>'+esc(ctaLabel(b))+'</span>'+ARROW+'</a><span class="cc-risk">'+esc(b.risk)+'</span>'; }

    function logo(b,size){
      var st=(size?'width:'+size+'px;height:'+size+'px;':'');
      var src=LOGOS[b.id]||b.logo;
      if(src) return '<span class="cc-logo has-img" style="'+st+'" aria-hidden="true"><img src="'+src+'" alt=""></span>';
      return '<span class="cc-logo" style="background:'+b.color+';'+st+'" aria-hidden="true">'+esc(b.short)+'</span>'; }

    function shell(){
      root.innerHTML =
        '<div class="cc-meta">'+
          '<a class="cc-author" href="'+EU+'/authors/pedro-braz"><span class="cc-av"><img src="https://cdn.prod.website-files.com/67b3586be7527f75ff1f0179/6899fe27339d0478018a43f6_pedro-braz.jpg" alt="" onerror="this.parentNode.textContent=\'PB\'"></span><span><span class="cc-al">Author</span><span class="cc-an">Pedro Braz</span></span></a>'+
          '<a class="cc-author" href="'+EU+'/authors/franklin-silva"><span class="cc-av"><img src="https://cdn.prod.website-files.com/67b3586be7527f75ff1f0179/6899fe1f4b3e6c03cba5a6e2_franklin-silva.jpg" alt="" onerror="this.parentNode.textContent=\'FS\'"></span><span><span class="cc-al">Reviewer</span><span class="cc-an">Franklin Silva</span></span></a>'+
          '<span class="cc-author"><span class="cc-av">'+'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'+'</span><span><span class="cc-al">Last checked</span><span class="cc-an">'+VERIFIED+'</span></span></span>'+
        '</div>'+
        '<div class="cc-panel">'+
          '<p class="cc-step">Choose up to <span id="cc-max">3</span> to compare</p>'+
          '<p class="cc-hint">Most searched first, then A to Z. When you reach the maximum, a new pick replaces the oldest one.</p>'+
          '<div class="cc-picker" id="cc-picker"></div>'+
          '<button type="button" class="cc-more" id="cc-more" aria-expanded="false"></button>'+
          '<div class="cc-divider"></div>'+
          '<div class="cc-scen-wrap" id="cc-scen-wrap">'+
          '<button type="button" class="cc-scen-toggle" id="cc-scen-toggle" aria-expanded="false"><span id="cc-scen-sum"></span><span id="cc-scen-act">Change</span></button>'+
          '<div class="cc-scen-body">'+
          '<p class="cc-step">Set your scenario</p>'+
          '<p class="cc-hint">The costs in the first section are recalculated with these values.</p>'+
          '<div class="cc-scen">'+
            field('cc-amount','Amount per purchase',S.amount,'Assumes it is the only order that month')+
            field('cc-monthly','Monthly investment',S.monthly,'For the automatic ETF plan')+
            field('cc-portfolio','Your portfolio value',S.portfolio,'For the yearly custody cost')+
          '</div>'+
          '</div></div>'+
        '</div>'+
        '<div class="cc-bar"><span class="cc-count" id="cc-count"></span>'+
          '<button type="button" class="cc-switch" id="cc-diff" aria-pressed="false"><i></i>Show differences only</button></div>'+
        '<div class="cc-table" id="cc-table"></div>'+
        '<div class="cc-pairs" id="cc-pairs"></div>'+
        notesHtml()+
        '<div class="cc-mini" id="cc-mini"></div>';
    }

    function field(id,label,val,note){
      return '<div><label class="cc-label" for="'+id+'">'+label+'</label><div class="cc-iw"><span class="cc-unit">€</span><input class="cc-input" id="'+id+'" inputmode="decimal" value="'+fmtInt(val)+'"></div><div class="cc-inote">'+note+'</div></div>';
    }

    /* On mobile only the first 6 brokers (plus any selected one) show until the reader opens the full list */
    var SHORT=6;
    function renderPicker(){
      var max=maxSel(); document.getElementById('cc-max').textContent=max;
      var pk=document.getElementById('cc-picker');
      pk.classList.toggle('is-open',S.more);
      pk.innerHTML = B.map(function(b,i){
        var on=S.sel.indexOf(b.id)>-1;
        return '<button type="button" class="cc-pick'+(on?' is-on':'')+(i>=SHORT&&!on?' is-extra':'')+'" data-id="'+b.id+'" aria-pressed="'+on+'"'+'>'+logo(b)+'<span>'+esc(b.name)+'</span><span class="cc-pick-t">'+esc(b.type)+'</span></button>';
      }).join('');
      var mb=document.getElementById('cc-more');
      mb.textContent=S.more?'Show fewer brokers':'Show all '+B.length+' brokers';
      mb.setAttribute('aria-expanded',S.more);
    }

    function calcFor(b,k){
      var plan=b.hasPlan?S.ibkr:null;
      if(k==='etf') return b.calc.etf(S.amount,plan);
      if(k==='us') return b.calc.us(S.amount,plan);
      if(k==='plan') return b.calc.plan(S.monthly,plan);
      return b.calc.custody(S.portfolio,plan);
    }

    /* Highest percentage in a text value, e.g. "2.50% to 3.50%" gives 3.5 */
    function pctMax(d){ var m=String(d&&d.v||'').match(/\d+(?:\.\d+)?(?=%)/g); return m?Math.max.apply(null,m.map(Number)):0; }

    function planData(b,d){ return (d && b.hasPlan && d.plans && d.plans[S.ibkr]) ? d.plans[S.ibkr] : d; }

    function cellHtml(b,row,best){
      var d, html;
      if(row.calc){
        d=calcFor(b,row.k);
        html='<span class="cc-v is-big">'+fmtEur(d.v)+(d.extra?' <span style="font-size:13px;font-weight:500;color:#697386">'+(typeof d.extra==='string'?d.extra:'+ fees')+'</span>':'')+'</span>';
        if(d.s) html+='<span class="cc-s">'+esc(d.s)+'</span>';
        if(best!==null && !d.extra && Math.abs(d.v-best)<0.005) html+='<span class="cc-tag is-best">Cheapest</span>';
        if(d.c) html+='<span class="cc-tag is-conf">'+CONF+'</span>';
      } else {
        d=planData(b,b.t[row.k])||{v:CONF,c:true};
        var isConf=d.v===CONF;
        html=isConf?'':'<span class="cc-v">'+esc(d.v)+'</span>';
        if(d.s) html+='<span class="cc-s">'+esc(d.s)+'</span>';
        if(row.high && best!==null && Math.abs(pctMax(d)-best)<0.005) html+='<span class="cc-tag is-best">Highest rate</span>';
        if(d.c) html+='<span class="cc-tag is-conf">'+CONF+'</span>';
      }
      return '<div class="cc-cell">'+html+'</div>';
    }

    function sameValues(sel,row){
      if(sel.length<2) return false;
      var vals=sel.map(function(b){ if(row.calc){ return fmtEur(calcFor(b,row.k).v); } var d=planData(b,b.t[row.k])||{}; return (d.v||'')+'|'+(d.s||''); });
      return vals.every(function(v){ return v===vals[0]; });
    }

    function renderTable(){
      var sel=S.sel.map(byId).filter(Boolean);
      var t=document.getElementById('cc-table');
      document.getElementById('cc-count').textContent = sel.length? (sel.length===1?'1 broker selected':sel.length+' brokers selected') : '';
      if(!sel.length){ t.innerHTML='<div class="cc-empty">Choose at least one broker in the list above to see the comparison.</div>'; document.getElementById('cc-pairs').innerHTML=''; renderMini(sel); return; }
      root.style.setProperty('--cc-cols','minmax(180px,1.1fr) repeat('+sel.length+',minmax(0,1fr))');
      root.style.setProperty('--cc-n',sel.length);
      root.classList.toggle('show-all',!S.diff);

      var head='<div class="cc-row cc-head"><div class="cc-hcell"></div>'+sel.map(function(b){
        var h='<div class="cc-hcell"><div class="cc-hname">'+logo(b,32)+'<span><b>'+esc(b.name)+'</b><small>'+esc(b.type)+'</small></span></div>';
        h+='<div class="cc-hextra">'+(b.hasPlan?'<div class="cc-pills" role="group" aria-label="Pricing plan"><button type="button" class="cc-pill'+(S.ibkr==='fixed'?' is-on':'')+'" data-plan="fixed">Fixed</button><button type="button" class="cc-pill'+(S.ibkr==='tiered'?' is-on':'')+'" data-plan="tiered">Tiered</button></div>':'')+'</div>';
        h+=ctaHtml(b);
        if(b.review) h+='<a class="cc-review" href="'+b.review+'" target="_blank" rel="noopener">Read the full review</a>';
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
          if(row.high && sel.length>1){
            var hv=sel.map(function(b){ return pctMax(planData(b,b.t[row.k])); });
            var hmx=Math.max.apply(null,hv), hmn=Math.min.apply(null,hv);
            if(hmx>0 && hmx-hmn>0.004) best=hmx;
          }
          var note=typeof row.note==='function'?row.note():row.note;
          var same=sameValues(sel,row);
          return '<div class="cc-row'+(same?' is-same':'')+'"><div class="cc-lab">'+esc(row.label)+(note?'<small>'+esc(note)+'</small>':'')+'</div>'+sel.map(function(b){ return cellHtml(b,row,best); }).join('')+'</div>';
        }).join('');
        var closed=!S.open[sec.id];
        return '<div class="cc-sec'+(closed?' is-closed':'')+'"><button type="button" class="cc-sec-h" data-sec="'+sec.id+'" aria-expanded="'+(!closed)+'"><span class="cc-sec-t">'+(ICONS[sec.id]||'')+'<span>'+esc(sec.title)+(sec.sub?'<small>'+esc(sec.sub)+'</small>':'')+'</span></span>'+CHEV+'</button><div class="cc-sec-b">'+rows+'</div></div>';
      }).join('');

      var srcRow='<div class="cc-row" style="border-top:1px solid #e9ecf1"><div class="cc-lab">Sources<small>Fee schedules and official pages</small></div>'+sel.map(function(b){ return '<div class="cc-cell"><a class="cc-src" style="margin-left:0" href="'+b.src+'" target="_blank" rel="noopener">'+esc(b.name)+' fees</a></div>'; }).join('')+'</div>';

      t.innerHTML=head+body+srcRow;
      probeBlock(sel);
      updateSum();
      renderMini(sel);
      alignHead();
      onScroll();
      renderPairs(sel);
    }

    function updateSum(){
      var el=document.getElementById('cc-scen-sum'); if(!el) return;
      el.innerHTML='Purchase of <b>€'+fmtInt(S.amount)+'</b> · <b>€'+fmtInt(S.monthly)+'</b>/month<span class="cc-sum-2">Portfolio of <b>€'+fmtInt(S.portfolio)+'</b></span>';
    }

    function renderMini(sel){
      var m=document.getElementById('cc-mini'); if(!m) return;
      if(!sel.length){ m.innerHTML=''; m.classList.remove('has-cta'); return; }
      /* On desktop the bar follows the table columns (empty label column on the left) */
      var desk=!isMobile();
      /* With 2 or 3 brokers compared, each column also gets the button and the risk warning */
      var cta=sel.length>1;
      m.classList.toggle('has-cta',cta);
      m.innerHTML='<div class="cc-mini-in" style="grid-template-columns:'+(desk?'var(--cc-cols)':'repeat('+sel.length+',minmax(0,1fr))')+'">'+(desk?'<div class="cc-mini-lab"></div>':'')+sel.map(function(b){
        var c='<div class="cc-mini-c"><div class="cc-mini-n">'+logo(b,24)+'<b>'+esc(b.name)+'</b></div>';
        if(cta) c+=ctaHtml(b);
        return c+'</div>'; }).join('')+'</div>';
    }

    function navBottom(){
      var n=document.querySelector('.nav_fixed')||document.querySelector('.navbar_component')||document.querySelector('nav');
      if(!n) return 0;
      var cs=window.getComputedStyle(n); if(cs.position!=='fixed' && cs.position!=='sticky') return 0;
      var r=n.getBoundingClientRect(); return r.bottom>0?Math.round(r.bottom):0;
    }

    var ticking=false;
    function onScroll(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        ticking=false;
        var top=navBottom();
        root.style.setProperty('--cc-top',top+'px');
        var t=document.getElementById('cc-table'), h=root.querySelector('.cc-head'), m=document.getElementById('cc-mini');
        if(!t||!h||!m) { if(m) m.classList.remove('is-on'); return; }
        var tr=t.getBoundingClientRect(), hr=h.getBoundingClientRect();
        var show=hr.bottom<top && tr.bottom>top+(m.classList.contains('has-cta')?160:80);
        if(isMobile()){ m.style.left=''; m.style.width=''; m.style.right=''; }
        else { m.style.left=Math.round(tr.left)+'px'; m.style.width=Math.round(tr.width)+'px'; m.style.right='auto'; }
        m.classList.toggle('is-on',show);
      });
    }
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);

    function alignHead(){
      var els=root.querySelectorAll('.cc-head .cc-hname, .cc-head .cc-hextra, .cc-head .cc-btn, .cc-head .cc-risk'), groups={};
      Array.prototype.forEach.call(els,function(el){ el.style.minHeight=''; var k=el.className; (groups[k]=groups[k]||[]).push(el); });
      Object.keys(groups).forEach(function(k){ var mx=0; groups[k].forEach(function(el){ mx=Math.max(mx,el.offsetHeight); }); groups[k].forEach(function(el){ el.style.minHeight=mx+'px'; }); });
    }
    window.addEventListener('resize',function(){ alignHead(); });

    function renderPairs(sel){
      var out=[];
      for(var i=0;i<sel.length;i++){ for(var j=i+1;j<sel.length;j++){
        var key=[sel[i].id,sel[j].id].sort().join('|');
        if(PAIRS[key]) out.push('<a class="cc-pair" href="'+EU+'/articles/'+PAIRS[key]+'" target="_blank" rel="noopener"><span>Full comparison: <b>'+esc(sel[i].name)+' vs '+esc(sel[j].name)+'</b></span><span>Read article</span></a>');
      }}
      document.getElementById('cc-pairs').innerHTML=out.join('');
    }

    function notesHtml(){
      return '<div class="cc-notes">'+
        '<p><b>How we calculate costs:</b> each scenario uses the cheapest route the broker offers for that product, with the commission, fixed fees and currency conversion cost. Dollar fees are converted at $1 = €0.85. For per-unit fees we assume an ETF at €100 and a US share at $200. Market spreads and the ETFs\' own costs (TER) are not included. Fees and conditions can vary by country of residence: the table shows the offer for most EU clients.</p>'+
        '<p><b>Taxes:</b> the comparison does not include taxes, because withholding and reporting rules depend on your country.</p>'+
        '<p><b>Interactive Brokers:</b> use the Fixed/Tiered selector at the top of the column. For Tiered we add the clearing and regulatory fees from the Interactive Brokers table. On Xetra the exchange fee is waived for retail orders routed through SmartRouting. For US stocks we assume a market order, which pays the exchange fee.</p>'+
        '<p><b>Trading 212:</b> sponsored link. When investing, your capital is at risk and you may get back less than invested. Past performance doesn\'t guarantee future results. Other fees may apply, see the <a href="https://www.trading212.com/terms/invest" target="_blank" rel="noopener">terms and fees</a>. If you enable interest, Trading 212 will hold your cash in qualifying money market funds and banks. Otherwise, your cash will be held only in banks. Interest applies on cash in an investment account. Terms apply. The rates shown may no longer be current: check the terms and fees page for the live rates.</p>'+
        '<p><b>Freedom24:</b> the 0% commission on the ETF investment plan applies exclusively to the recurring investment function. Other operations follow the Freedom24 fee schedule.</p>'+
      '</div>';
    }

    /* ---------- Events ---------- */
    function bind(){
      root.addEventListener('click',function(e){
        var p=e.target.closest('.cc-pick');
        if(p){ var id=p.getAttribute('data-id'), i=S.sel.indexOf(id);
          if(i>-1) S.sel.splice(i,1); else { if(S.sel.length>=maxSel()) S.sel.shift(); S.sel.push(id); }
          renderPicker(); renderTable(); return; }
        if(e.target.closest('#cc-more')){ S.more=!S.more; renderPicker(); return; }
        var h=e.target.closest('.cc-sec-h');
        if(h){ var sid=h.getAttribute('data-sec'); S.open[sid]=!S.open[sid]; renderTable(); return; }
        var pl=e.target.closest('.cc-pill');
        if(pl){ S.ibkr=pl.getAttribute('data-plan'); renderTable(); return; }
        if(e.target.closest('#cc-scen-toggle')){ var w=document.getElementById('cc-scen-wrap'), open=!w.classList.contains('is-open'); w.classList.toggle('is-open',open); document.getElementById('cc-scen-toggle').setAttribute('aria-expanded',open); document.getElementById('cc-scen-act').textContent=open?'Close':'Change'; return; }
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
