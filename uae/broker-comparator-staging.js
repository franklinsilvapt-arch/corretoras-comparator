/* Broker comparator - BrokerMatch UAE (brokermatch.ae)
   Data in uae/data/brokers.json (edit values there). Costs are computed from the `calc` numbers of each broker:
   - US stocks: commission (fixed + % + per share, min/max) + the broker's AED to USD conversion
   - UAE stocks: commission on ADX or DFM (+ fixed AED amount, + 5% VAT where it applies)
   - Forex: 1 standard lot of EUR/USD round trip, cheapest account (spread x $10 + commission)
   - Portfolio: yearly custody/account fees
   Same structure as the Literacia Financeira and EU Personal Finance comparators. */
(function () {
  'use strict';
  var scriptEl = document.currentScript;
  var BASE = scriptEl ? scriptEl.src.replace(/[^/]*$/, '') : 'https://franklinsilvapt-arch.github.io/corretoras-comparator/uae/';
  var BM = 'https://www.brokermatch.ae';
  var ROOT_ID = 'bm-bc';

  var T = {
    conf: 'To be confirmed', loadFail: 'The comparator could not be loaded. Please reload the page.',
    author: 'Author', reviewer: 'Reviewer', lastChecked: 'Last checked',
    chooseUpTo: 'Choose up to', toCompare: 'brokers to compare',
    pickerHint: 'Featured brokers first, then A to Z. When you reach the maximum, a new pick replaces the oldest one.',
    search: 'Search a broker', searchShort: 'Search', licOnly: 'UAE licence only', noMatch: 'No broker matches these filters.',
    cats: [['all', 'All'], ['stocks', 'US stocks and ETFs'], ['uae', 'UAE stocks'], ['cfd', 'CFDs and forex'], ['options', 'Options'], ['crypto', 'Crypto'], ['property', 'Real estate']],
    showFewer: 'Show fewer brokers', showAll1: 'Show all ', showAll2: ' brokers',
    change: 'Change', close: 'Close', setScenario: 'Set your scenario',
    scenarioHint: 'The costs in the first section are recalculated with these values.',
    fUs: 'US stock order', fUsNote: 'Paid in dirhams, converted to dollars',
    fUae: 'UAE stock order', fUaeNote: 'On the exchange chosen below',
    fPort: 'Portfolio value', fPortNote: 'For the yearly custody cost',
    exchange: 'UAE exchange',
    diffOnly: 'Show differences only',
    secCosts: 'What you pay', secCostsSub: 'Calculated with the values above',
    rUs: 'Buy US stocks', rUae: 'Buy UAE stocks', rFx: 'Trade forex', rCust: 'Keep your portfolio',
    secFees: 'Fees in detail',
    rUsFee: 'US stocks and ETFs', rUaeFee: 'UAE stocks (ADX, DFM)', rOpt: 'Options', rForex: 'Forex (EUR/USD)',
    rCrypto: 'Crypto', rConv: 'AED to USD conversion', rDep: 'Deposits', rWd: 'Withdrawals', rInact: 'Inactivity',
    rCustTxt: 'Custody and account fees',
    secInterest: 'Interest on cash', rInterest: 'Interest on uninvested cash',
    secSafety: 'Safety and regulation', rEntity: 'Company that opens your account', rReg: 'Regulator',
    rProt: 'Investor protection', rMin: 'Minimum deposit',
    secProducts: 'Products and account', rAssets: 'What you can trade', rOwn: 'Real shares or CFDs',
    rFrac: 'Fractional shares', rIsl: 'Islamic account', rAed: 'AED account', rPlat: 'Platforms',
    cheapest: 'Cheapest', uaeLic: 'UAE licence', noUaeLic: 'No UAE licence', minSpread: 'Minimum spread',
    plusMarket: '+ market fees', plusBank: '+ bank FX', plusFx: '+ FX',
    notApplicable: 'Not applicable', cfdOnlyCust: 'CFDs only: no custody, overnight financing applies',
    notPublished: 'Not published', notOnExch: 'Not on ',
    goTo: 'Visit ', readReview: 'Read the full review', score: 'Broker score',
    pricingPlan: 'Pricing plan', planFixed: 'Fixed', planTiered: 'Tiered',
    sources: 'Sources', sourcesSub: 'Official pages we checked', srcFees: 'Fees', srcReg: 'Licence',
    emptyPick: 'Choose at least one broker in the list above to see the comparison.',
    sumUs: 'US order', sumUae: 'UAE order', sumPort: 'Portfolio',
    notes: '<p><b>How we calculate costs:</b> amounts are in dirhams at the peg of $1 = AED 3.6725. <b>US stocks:</b> the broker\'s commission plus its fee to convert your dirhams to dollars. When a broker only takes dollars, your bank does the conversion and we mark it "+ bank FX", because we cannot price your bank. For per share fees we assume a share at $200. <b>UAE stocks:</b> all in cost of one order with the broker\'s commission, the exchange, clearing and CMA fees and 5% VAT, when the broker publishes it. Brokers that only publish their own commission are marked "+ market fees". <b>Forex:</b> one standard lot of EUR/USD (100,000 euros) opened and closed, at $10 a pip, on the broker\'s cheapest account. We use the average spread the broker publishes and, when it only publishes a minimum, we tag it "Minimum spread": those costs are lower than what you will usually pay. <b>Portfolio:</b> yearly custody, account or platform fees. CFD accounts hold no investments, so there is no custody fee, but open positions pay overnight financing.</p>'
      + '<p><b>Regulation:</b> "UAE licence" means the company that opens accounts for UAE residents is licensed by the CMA (onshore), the DFSA (DIFC), the FSRA (ADGM) or VARA. Many groups have a UAE office that only introduces clients, while your account sits with a company abroad. The row "Company that opens your account" shows which one you sign with.</p>'
      + '<p><b>Taxes:</b> the comparison does not include taxes. Fees and conditions change often: confirm them on the broker\'s website before you open an account. Values marked "To be confirmed" could not be checked on an official page.</p>'
  };

  var VERIFIED, PEG, US_PRICE, VAT, PIP, B;
  var TOP = ['sarwa', 'etoro', 'ibkr'];

  function boot() {
    var root0 = document.getElementById(ROOT_ID); if (!root0) return;
    var bust = '?v=' + Date.now().toString().slice(0, -5);
    fetch(BASE + 'data/brokers.json' + bust, { cache: 'no-cache' }).then(function (r) { return r.json(); })
      .then(function (d) {
        VERIFIED = d.verified; PEG = d.assumptions.PEG; US_PRICE = d.assumptions.US_PRICE_USD;
        VAT = d.assumptions.VAT; PIP = d.assumptions.PIP_USD;
        B = d.brokers.filter(function (b) { return !b.hidden; });
        B.sort(function (x, y) { return (x.order || 100) - (y.order || 100) || x.name.localeCompare(y.name); });
        /* pre-selected brokers first */
        B = TOP.map(function (id) { for (var i = 0; i < B.length; i++) { if (B[i].id === id) return B[i]; } return null; }).filter(Boolean)
          .concat(B.filter(function (b) { return TOP.indexOf(b.id) < 0; }));
        start();
      })
      .catch(function (e) { root0.innerHTML = '<p style="text-align:center;color:#697386">' + T.loadFail + '</p>'; console.error(e); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  function start() {
    var SECTIONS = [
      { id: 'costs', title: T.secCosts, sub: T.secCostsSub, rows: [
        { k: 'us', calc: true, label: T.rUs, note: function () { return 'AED ' + fmtInt(S.usAmt) + ' order, conversion included'; } },
        { k: 'uae', calc: true, label: T.rUae, note: function () { return 'AED ' + fmtInt(S.uaeAmt) + ' order on ' + S.exch.toUpperCase(); } },
        { k: 'fxlot', calc: true, label: T.rFx, note: function () { return '1 lot of EUR/USD, opened and closed'; } },
        { k: 'custody', calc: true, label: T.rCust, note: function () { return 'AED ' + fmtInt(S.port) + ' for a year'; } }
      ]},
      { id: 'fees', title: T.secFees, rows: [
        { k: 'us', label: T.rUsFee }, { k: 'uaeFee', label: T.rUaeFee }, { k: 'options', label: T.rOpt },
        { k: 'forex', label: T.rForex }, { k: 'crypto', label: T.rCrypto }, { k: 'fx', label: T.rConv },
        { k: 'deposit', label: T.rDep }, { k: 'withdraw', label: T.rWd }, { k: 'inact', label: T.rInact },
        { k: 'custody', label: T.rCustTxt }
      ]},
      { id: 'interest', title: T.secInterest, rows: [{ k: 'interest', label: T.rInterest }] },
      { id: 'safety', title: T.secSafety, rows: [
        { k: 'entity', label: T.rEntity }, { k: 'regulator', label: T.rReg, lic: true },
        { k: 'protection', label: T.rProt }, { k: 'minDep', label: T.rMin }
      ]},
      { id: 'products', title: T.secProducts, rows: [
        { k: 'assets', label: T.rAssets }, { k: 'ownership', label: T.rOwn }, { k: 'fractions', label: T.rFrac },
        { k: 'islamic', label: T.rIsl }, { k: 'aed', label: T.rAed }, { k: 'platforms', label: T.rPlat }
      ]}
    ];

    var S = { sel: TOP.slice(0), usAmt: 5000, uaeAmt: 5000, port: 50000, exch: 'dfm', ibkr: 'fixed', diff: false, more: false, cat: 'all', lic: false, q: '', open: {} };
    SECTIONS.forEach(function (s) { S.open[s.id] = true; });

    function isMobile() { return window.matchMedia('(max-width:767px)').matches; }
    function maxSel() { return isMobile() ? 2 : 3; }
    function byId(id) { for (var i = 0; i < B.length; i++) { if (B[i].id === id) return B[i]; } return null; }

    function fmtInt(n) { return Math.round(n).toLocaleString('en-US'); }
    function fmt2(n) { return (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function fmtAed(n) { return 'AED ' + fmt2(n); }
    function fmtUsd(n) { return '$' + fmt2(n); }
    function parseNum(v) {
      var t = String(v).replace(/[\s,]|AED/gi, '');
      var n = parseFloat(t); return isFinite(n) && n > 0 ? n : 0;
    }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    /* ---------- Cost engine ---------- */
    function usCost(b) {
      var c0 = b.calc || {};
      var p = (b.hasPlan && S.ibkr === 'tiered' && c0.usTiered) ? c0.usTiered : c0.us;
      if (!p) return null;
      var c = p.comm || {};
      if (c.fixed == null && c.pct == null && c.perShare == null) return { na: true, c: true };
      var usd = S.usAmt / PEG, sh = Math.ceil(usd / US_PRICE);
      var comm = (c.fixed || 0) + (c.pct || 0) * usd + (c.perShare || 0) * sh;
      if (c.min != null) comm = Math.max(c.min, comm);
      if (c.max != null) comm = Math.min(c.max, comm);
      if (c.maxPct != null) comm = Math.min(c.maxPct * usd, comm);
      comm += (c.perShareExtra || 0) * sh;
      if (p.vat) comm *= (1 + VAT);
      var fx = p.fx || {}, fxUsd = 0, extra = null;
      if (fx.aed === false) extra = 'bank';
      else if (fx.pct == null) extra = 'fx';
      else fxUsd = Math.max(fx.minUsd || 0, (fx.pct || 0) * usd) + (fx.fixedUsd || 0);
      var s = 'Commission ' + fmtUsd(comm) + (p.vat ? ' incl. VAT' : '');
      if (extra === 'bank') s += '. Send dollars: your bank converts AED';
      else if (extra === 'fx') s += '. AED conversion cost not published';
      else s += fxUsd > 0.004 ? ' + ' + fmtAed(fxUsd * PEG) + ' to convert AED' : '. No fee to convert AED';
      return { v: (comm + fxUsd) * PEG, s: s, extra: extra, c: p.c };
    }

    function uaeCost(b) {
      var u = (b.calc || {}).uae; if (!u) return null;
      var p = u[S.exch]; if (!p) return { off: true };
      if (p.pct == null && p.fixed == null) return { na: true, c: true };
      var amt = S.uaeAmt;
      var comm = Math.max(p.min || 0, (p.pct || 0) * amt) + (p.fixed || 0);
      var vat = p.vat ? VAT * Math.max(0, comm - (p.vatExemptPct || 0) * amt) : 0;
      var s = p.allIn ? 'All in: commission, exchange, clearing and CMA fees' + (p.vat ? ' + 5% VAT' : '') : 'Only the fees the broker publishes. Other market fees may apply';
      return { v: comm + vat, s: s, extra: p.allIn ? null : 'market', c: p.c || u.c };
    }

    function fxLot(b) {
      var f = (b.calc || {}).fxlot; if (!f) return null;
      var opts = [f].concat(f.alt ? [f.alt] : []).filter(function (o) { return o.spread != null; });
      if (!opts.length) return { na: true, c: true };
      var best = opts.map(function (o) { return { o: o, usd: o.spread * PIP + (o.commRt || 0) }; }).sort(function (x, y) { return x.usd - y.usd; })[0];
      var o = best.o, kind = o.spreadKind === 'minimum' ? 'minimum' : 'average';
      var s = o.account + ': ' + o.spread + (o.spread === 1 ? ' pip ' : ' pips ') + (kind === 'minimum' ? 'minimum spread' : 'average spread')
        + (o.commRt ? ' + ' + fmtUsd(o.commRt) + ' commission' : ', no commission') + ' (' + fmtUsd(best.usd) + ')';
      return { v: best.usd * PEG, s: s, kind: kind, c: f.c };
    }

    function custCost(b) {
      var c = (b.calc || {}).custody;
      if (c == null) return null;
      if (c.pctYear == null && c.fixedYearUsd == null) return { na: true, c: true };
      var v = Math.max((c.minYearUsd || 0) * PEG, (c.pctYear || 0) * S.port) + (c.fixedYearUsd || 0) * PEG;
      return { v: v, s: (b.t && b.t.custody && b.t.custody.v) || '', c: c.c };
    }

    function calcFor(b, k) {
      if (k === 'us') return usCost(b);
      if (k === 'uae') return uaeCost(b);
      if (k === 'fxlot') return fxLot(b);
      return custCost(b);
    }

    /* ---------- Render helpers ---------- */
    var root = document.getElementById(ROOT_ID);
    function ico(p) { return '<svg class="cc-sec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
    var CHEV = '<svg class="cc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>';
    var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';
    var ICONS = {
      costs: ico('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01M8 10h.01M12 10h.01M16 10h.01"/>'),
      fees: ico('<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'),
      interest: ico('<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/>'),
      safety: ico('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'),
      products: ico('<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>')
    };

    function logo(b, size) {
      var st = size ? 'width:' + size + 'px;height:' + size + 'px;' : '';
      if (b.logo) return '<span class="cc-logo has-img" style="' + st + '" aria-hidden="true"><img src="' + esc(b.logo) + '" alt="" loading="lazy" onerror="var s=this.parentNode;s.className=\'cc-logo\';s.style.background=\'' + esc(b.color) + '\';s.textContent=\'' + esc(b.short).replace(/'/g, '') + '\'"></span>';
      return '<span class="cc-logo" style="background:' + esc(b.color) + ';' + st + '" aria-hidden="true">' + esc(b.short) + '</span>';
    }
    function ctaHtml(b) {
      return '<a class="cc-btn" href="' + esc(b.cta.href) + '" target="_blank" rel="' + (b.cta.plain ? 'noopener' : 'noopener sponsored') + '"><span>' + esc(T.goTo + b.name) + '</span>' + ARROW + '</a>'
        + (b.risk ? '<span class="cc-risk">' + esc(b.risk) + '</span>' : '');
    }
    function tag(cls, txt) { return '<span class="cc-tag ' + cls + '">' + txt + '</span>'; }

    function shell() {
      var CDN = 'https://cdn.prod.website-files.com/685135bbeecd35e04c48602f/';
      root.innerHTML =
        '<div class="cc-meta">' +
          '<a class="cc-author" href="' + BM + '/authors/pedro-braz"><span class="cc-av"><img src="' + CDN + '685ea761625d5813acfbcbcd_pedro-braz.avif" alt="" onerror="this.parentNode.textContent=\'PB\'"></span><span><span class="cc-al">' + T.author + '</span><span class="cc-an">Pedro Braz</span></span></a>' +
          '<a class="cc-author" href="' + BM + '/authors/franklin-silva"><span class="cc-av"><img src="' + CDN + '685ea7ab9b98a648337af86f_franklin-silva.avif" alt="" onerror="this.parentNode.textContent=\'FS\'"></span><span><span class="cc-al">' + T.reviewer + '</span><span class="cc-an">Franklin Silva</span></span></a>' +
          '<span class="cc-author"><span class="cc-av"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span><span><span class="cc-al">' + T.lastChecked + '</span><span class="cc-an">' + esc(VERIFIED) + '</span></span></span>' +
        '</div>' +
        '<div class="cc-panel">' +
          '<p class="cc-step">' + T.chooseUpTo + ' <span id="cc-max">3</span> ' + T.toCompare + '</p>' +
          '<p class="cc-hint">' + T.pickerHint + '</p>' +
          '<div class="cc-filters">' +
            '<div class="cc-chips" id="cc-chips" role="group" aria-label="Filter brokers"></div>' +
            '<div class="cc-filters-r">' +
              '<button type="button" class="cc-switch" id="cc-lic" aria-pressed="false"><i></i>' + T.licOnly + '</button>' +
              '<div class="cc-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" id="cc-q" placeholder="' + (isMobile() ? T.searchShort : T.search) + '" aria-label="' + T.search + '" autocomplete="off"></div>' +
            '</div>' +
          '</div>' +
          '<div class="cc-picker" id="cc-picker"></div>' +
          '<button type="button" class="cc-more" id="cc-more" aria-expanded="false"></button>' +
          '<div class="cc-divider"></div>' +
          '<div class="cc-scen-wrap" id="cc-scen-wrap">' +
            '<button type="button" class="cc-scen-toggle" id="cc-scen-toggle" aria-expanded="false"><span id="cc-scen-sum"></span><span id="cc-scen-act">' + T.change + '</span></button>' +
            '<div class="cc-scen-body">' +
              '<p class="cc-step">' + T.setScenario + '</p>' +
              '<p class="cc-hint">' + T.scenarioHint + '</p>' +
              '<div class="cc-scen">' +
                field('cc-us', T.fUs, S.usAmt, T.fUsNote) +
                '<div>' + fieldInner('cc-uae', T.fUae, S.uaeAmt) +
                  '<div class="cc-seg" role="group" aria-label="' + T.exchange + '"><button type="button" class="cc-seg-b" data-exch="adx">ADX</button><button type="button" class="cc-seg-b" data-exch="dfm">DFM</button></div>' +
                '</div>' +
                field('cc-port', T.fPort, S.port, T.fPortNote) +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="cc-bar"><span class="cc-count" id="cc-count"></span>' +
          '<button type="button" class="cc-switch" id="cc-diff" aria-pressed="false"><i></i>' + T.diffOnly + '</button></div>' +
        '<div class="cc-table" id="cc-table"></div>' +
        '<div class="cc-notes">' + T.notes + '</div>' +
        '<div class="cc-mini" id="cc-mini"></div>';
    }
    function fieldInner(id, label, val) {
      return '<label class="cc-label" for="' + id + '">' + label + '</label><div class="cc-iw"><input class="cc-input" id="' + id + '" inputmode="decimal" value="' + fmtInt(val) + '"><span class="cc-unit">AED</span></div>';
    }
    function field(id, label, val, note) {
      return '<div>' + fieldInner(id, label, val) + '<div class="cc-inote">' + note + '</div></div>';
    }

    /* ---------- Picker ---------- */
    /* two rows of brokers before "Show all": 7 per row on desktop, 4 on tablet, 3 on mobile */
    function shortN() { return isMobile() ? 6 : window.matchMedia('(max-width:1000px)').matches ? 8 : 14; }
    function matches(b) {
      if (S.cat !== 'all' && (b.cats || []).indexOf(S.cat) < 0) return false;
      if (S.lic && !b.uaeLic) return false;
      if (S.q) { var q = S.q.toLowerCase(); if ((b.name + ' ' + (b.type || '')).toLowerCase().indexOf(q) < 0) return false; }
      return true;
    }
    function renderChips() {
      var el = document.getElementById('cc-chips');
      el.innerHTML = T.cats.map(function (c) {
        var n = c[0] === 'all' ? B.length : B.filter(function (b) { return (b.cats || []).indexOf(c[0]) > -1; }).length;
        if (!n) return '';
        return '<button type="button" class="cc-chip' + (S.cat === c[0] ? ' is-on' : '') + '" data-cat="' + c[0] + '" aria-pressed="' + (S.cat === c[0]) + '">' + c[1] + ' <span>' + n + '</span></button>';
      }).join('');
      var l = document.getElementById('cc-lic'); l.setAttribute('aria-pressed', S.lic);
    }
    function renderPicker() {
      var max = maxSel(); document.getElementById('cc-max').textContent = max;
      var pk = document.getElementById('cc-picker');
      var list = B.filter(matches), short = shortN();
      pk.classList.toggle('is-open', S.more);
      pk.innerHTML = list.length ? list.map(function (b, i) {
        var on = S.sel.indexOf(b.id) > -1;
        return '<button type="button" class="cc-pick' + (on ? ' is-on' : '') + (i >= short && !on ? ' is-extra' : '') + '" data-id="' + b.id + '" aria-pressed="' + on + '">' + logo(b) + '<span>' + esc(b.name) + '</span><span class="cc-pick-t">' + esc(b.type) + '</span></button>';
      }).join('') : '<p class="cc-nomatch">' + T.noMatch + '</p>';
      var mb = document.getElementById('cc-more');
      mb.style.display = list.length > short ? '' : 'none';
      mb.textContent = S.more ? T.showFewer : T.showAll1 + list.length + T.showAll2;
      mb.setAttribute('aria-expanded', S.more);
    }

    /* ---------- Table ---------- */
    function cellHtml(b, row, best) {
      var html = '';
      if (row.calc) {
        var d = calcFor(b, row.k);
        if (d === null) {
          var txt = row.k === 'us' ? b.t.us : row.k === 'uae' ? b.t.uaeFee : row.k === 'fxlot' ? b.t.forex : null;
          if (txt) { html = '<span class="cc-v">' + esc(txt.v) + '</span>'; if (txt.c) html += tag('is-conf', T.conf); }
          else html = '<span class="cc-v">' + T.notApplicable + '</span><span class="cc-s">' + T.cfdOnlyCust + '</span>';
        } else if (d.off) {
          html = '<span class="cc-v">' + T.notOnExch + S.exch.toUpperCase() + '</span>';
        } else if (d.na) {
          html = '<span class="cc-v">' + T.notPublished + '</span>' + tag('is-conf', T.conf);
        } else {
          var ex = d.extra === 'market' ? T.plusMarket : d.extra === 'bank' ? T.plusBank : d.extra === 'fx' ? T.plusFx : '';
          html = '<span class="cc-v is-big">' + fmtAed(d.v) + (ex ? ' <span class="cc-extra">' + ex + '</span>' : '') + '</span>';
          if (d.s) html += '<span class="cc-s">' + esc(d.s) + '</span>';
          if (best !== null && !d.extra && Math.abs(d.v - best) < 0.005) html += tag('is-best', T.cheapest);
          if (d.kind === 'minimum') html += tag('is-info', T.minSpread);
          if (d.c) html += tag('is-conf', T.conf);
        }
      } else {
        var o = (b.t && b.t[row.k]) || { v: T.notPublished, c: true };
        html = '<span class="cc-v">' + esc(o.v) + '</span>';
        if (o.s) html += '<span class="cc-s">' + esc(o.s) + '</span>';
        if (row.lic) html += b.uaeLic ? tag('is-best', T.uaeLic) : tag('is-warn', T.noUaeLic);
        if (o.c) html += tag('is-conf', T.conf);
      }
      return '<div class="cc-cell">' + html + '</div>';
    }

    function cellKey(b, row) {
      if (row.calc) { var d = calcFor(b, row.k); return d === null ? 'null' : d.na ? 'na' : d.off ? 'off' : fmt2(d.v) + (d.extra || ''); }
      var o = (b.t && b.t[row.k]) || {}; return (o.v || '') + '|' + (o.s || '') + (row.lic ? '|' + b.uaeLic : '');
    }
    function sameValues(sel, row) {
      if (sel.length < 2) return false;
      var vals = sel.map(function (b) { return cellKey(b, row); });
      return vals.every(function (v) { return v === vals[0]; });
    }

    function bestFor(sel, row) {
      if (!row.calc || sel.length < 2) return null;
      var ds = sel.map(function (b) { return calcFor(b, row.k); }).filter(function (d) { return d && !d.na && !d.off && !d.extra; });
      if (ds.length < 2) return null;
      if (row.k === 'fxlot') { var kinds = ds.map(function (d) { return d.kind; }); if (kinds.some(function (k) { return k !== kinds[0]; })) return null; }
      var vals = ds.map(function (d) { return d.v; });
      var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
      return mx - mn > 0.004 ? mn : null;
    }

    function headCell(b) {
      var h = '<div class="cc-hcell"><div class="cc-hname">' + logo(b, 32) + '<span><b>' + esc(b.name) + '</b><small>' + esc(b.type) + '</small>'
        + (b.score ? '<small class="cc-score">' + STAR + T.score + ' ' + b.score.toFixed(1) + '/5</small>' : '') + '</span></div>';
      h += '<div class="cc-hextra">' + (b.hasPlan ? '<div class="cc-pills" role="group" aria-label="' + T.pricingPlan + '"><button type="button" class="cc-pill' + (S.ibkr === 'fixed' ? ' is-on' : '') + '" data-plan="fixed">' + T.planFixed + '</button><button type="button" class="cc-pill' + (S.ibkr === 'tiered' ? ' is-on' : '') + '" data-plan="tiered">' + T.planTiered + '</button></div>' : '') + '</div>';
      h += ctaHtml(b);
      if (b.review) h += '<a class="cc-review" href="' + esc(b.review) + '" target="_blank" rel="noopener">' + T.readReview + '</a>';
      return h + '</div>';
    }

    function renderTable() {
      var sel = S.sel.map(byId).filter(Boolean);
      var t = document.getElementById('cc-table');
      document.getElementById('cc-count').textContent = sel.length ? (sel.length === 1 ? '1 broker selected' : sel.length + ' brokers selected') : '';
      updateSum();
      if (!sel.length) { t.innerHTML = '<div class="cc-empty">' + T.emptyPick + '</div>'; renderMini(sel); return; }
      root.style.setProperty('--cc-cols', 'minmax(180px,1.1fr) repeat(' + sel.length + ',minmax(0,1fr))');
      root.style.setProperty('--cc-n', sel.length);
      root.classList.toggle('show-all', !S.diff);

      var head = '<div class="cc-row cc-head"><div class="cc-hcell"></div>' + sel.map(headCell).join('') + '</div>';
      var body = SECTIONS.map(function (sec) {
        var rows = sec.rows.map(function (row) {
          var best = bestFor(sel, row);
          var note = typeof row.note === 'function' ? row.note() : row.note;
          return '<div class="cc-row' + (sameValues(sel, row) ? ' is-same' : '') + '"><div class="cc-lab">' + esc(row.label) + (note ? '<small>' + esc(note) + '</small>' : '') + '</div>' + sel.map(function (b) { return cellHtml(b, row, best); }).join('') + '</div>';
        }).join('');
        var closed = !S.open[sec.id];
        return '<div class="cc-sec' + (closed ? ' is-closed' : '') + '"><button type="button" class="cc-sec-h" data-sec="' + sec.id + '" aria-expanded="' + (!closed) + '"><span class="cc-sec-t">' + (ICONS[sec.id] || '') + '<span>' + esc(sec.title) + (sec.sub ? '<small>' + esc(sec.sub) + '</small>' : '') + '</span></span>' + CHEV + '</button><div class="cc-sec-b">' + rows + '</div></div>';
      }).join('');
      var srcRow = '<div class="cc-row cc-srcrow"><div class="cc-lab">' + T.sources + '<small>' + T.sourcesSub + '</small></div>' + sel.map(function (b) {
        var s = b.src || {};
        return '<div class="cc-cell">' + (s.fees ? '<a class="cc-src" href="' + esc(s.fees) + '" target="_blank" rel="noopener">' + esc(b.name) + ' ' + T.srcFees.toLowerCase() + '</a>' : '')
          + (s.reg ? '<a class="cc-src" href="' + esc(s.reg) + '" target="_blank" rel="noopener">' + esc(b.name) + ' ' + T.srcReg.toLowerCase() + '</a>' : '') + '</div>';
      }).join('') + '</div>';

      t.innerHTML = head + body + srcRow;
      renderMini(sel);
      alignHead();
      onScroll();
    }

    function updateSum() {
      var el = document.getElementById('cc-scen-sum'); if (!el) return;
      el.innerHTML = T.sumUs + ' <b>AED ' + fmtInt(S.usAmt) + '</b> · ' + T.sumUae + ' <b>AED ' + fmtInt(S.uaeAmt) + '</b> on <b>' + S.exch.toUpperCase() + '</b><span class="cc-sum-2">' + T.sumPort + ' <b>AED ' + fmtInt(S.port) + '</b></span>';
      Array.prototype.forEach.call(root.querySelectorAll('.cc-seg-b'), function (x) { var on = x.getAttribute('data-exch') === S.exch; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    }

    function renderMini(sel) {
      var m = document.getElementById('cc-mini'); if (!m) return;
      if (!sel.length) { m.innerHTML = ''; m.classList.remove('has-cta'); return; }
      var desk = !isMobile(), cta = sel.length > 1;
      m.classList.toggle('has-cta', cta);
      m.innerHTML = '<div class="cc-mini-in" style="grid-template-columns:' + (desk ? 'var(--cc-cols)' : 'repeat(' + sel.length + ',minmax(0,1fr))') + '">' + (desk ? '<div class="cc-mini-lab"></div>' : '') + sel.map(function (b) {
        var c = '<div class="cc-mini-c"><div class="cc-mini-n">' + logo(b, 24) + '<b>' + esc(b.name) + '</b></div>';
        if (cta) c += '<a class="cc-btn" href="' + esc(b.cta.href) + '" target="_blank" rel="' + (b.cta.plain ? 'noopener' : 'noopener sponsored') + '"><span>' + esc(T.goTo + b.name) + '</span>' + ARROW + '</a>';
        return c + '</div>';
      }).join('') + '</div>';
    }

    function navBottom() {
      var n = document.querySelector('.nav_fixed') || document.querySelector('.navbar_component') || document.querySelector('nav');
      if (!n) return 0;
      var cs = window.getComputedStyle(n); if (cs.position !== 'fixed' && cs.position !== 'sticky') return 0;
      var r = n.getBoundingClientRect(); return r.bottom > 0 ? Math.round(r.bottom) : 0;
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var top = navBottom();
        root.style.setProperty('--cc-top', top + 'px');
        var t = document.getElementById('cc-table'), h = root.querySelector('.cc-head'), m = document.getElementById('cc-mini');
        if (!t || !h || !m) { if (m) m.classList.remove('is-on'); return; }
        var tr = t.getBoundingClientRect(), hr = h.getBoundingClientRect();
        var show = hr.bottom < top && tr.bottom > top + (m.classList.contains('has-cta') ? 140 : 80);
        if (isMobile()) { m.style.left = ''; m.style.width = ''; m.style.right = ''; }
        else { m.style.left = Math.round(tr.left) + 'px'; m.style.width = Math.round(tr.width) + 'px'; m.style.right = 'auto'; }
        m.classList.toggle('is-on', show);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    function alignHead() {
      var els = root.querySelectorAll('.cc-head .cc-hname, .cc-head .cc-hextra, .cc-head .cc-btn, .cc-head .cc-risk'), groups = {};
      Array.prototype.forEach.call(els, function (el) { el.style.minHeight = ''; var k = el.className; (groups[k] = groups[k] || []).push(el); });
      Object.keys(groups).forEach(function (k) { var mx = 0; groups[k].forEach(function (el) { mx = Math.max(mx, el.offsetHeight); }); groups[k].forEach(function (el) { el.style.minHeight = mx + 'px'; }); });
    }
    window.addEventListener('resize', function () { alignHead(); });

    /* ---------- Events ---------- */
    function bind() {
      root.addEventListener('click', function (e) {
        var p = e.target.closest('.cc-pick');
        if (p) {
          var id = p.getAttribute('data-id'), i = S.sel.indexOf(id);
          if (i > -1) S.sel.splice(i, 1); else { if (S.sel.length >= maxSel()) S.sel.shift(); S.sel.push(id); }
          renderPicker(); renderTable(); return;
        }
        var ch = e.target.closest('.cc-chip');
        if (ch) { S.cat = ch.getAttribute('data-cat'); renderChips(); renderPicker(); return; }
        if (e.target.closest('#cc-lic')) { S.lic = !S.lic; renderChips(); renderPicker(); return; }
        if (e.target.closest('#cc-more')) { S.more = !S.more; renderPicker(); return; }
        var h = e.target.closest('.cc-sec-h');
        if (h) { var sid = h.getAttribute('data-sec'); S.open[sid] = !S.open[sid]; renderTable(); return; }
        var pl = e.target.closest('.cc-pill');
        if (pl) { S.ibkr = pl.getAttribute('data-plan'); renderTable(); return; }
        var sg = e.target.closest('.cc-seg-b');
        if (sg) { S.exch = sg.getAttribute('data-exch'); renderTable(); return; }
        if (e.target.closest('#cc-scen-toggle')) {
          var w = document.getElementById('cc-scen-wrap'), open = !w.classList.contains('is-open');
          w.classList.toggle('is-open', open); document.getElementById('cc-scen-toggle').setAttribute('aria-expanded', open);
          document.getElementById('cc-scen-act').textContent = open ? T.close : T.change; return;
        }
        if (e.target.closest('#cc-diff')) { S.diff = !S.diff; document.getElementById('cc-diff').setAttribute('aria-pressed', S.diff); renderTable(); }
      });
      var q = document.getElementById('cc-q');
      q.addEventListener('input', function () { S.q = q.value.trim(); renderPicker(); });
      [['cc-us', 'usAmt'], ['cc-uae', 'uaeAmt'], ['cc-port', 'port']].forEach(function (f) {
        var el = document.getElementById(f[0]);
        el.addEventListener('input', function () { var n = parseNum(el.value); if (n > 0) { S[f[1]] = n; renderTable(); } });
        el.addEventListener('blur', function () { el.value = fmtInt(S[f[1]]); });
      });
      var mq = window.matchMedia('(max-width:767px)'), mqT = window.matchMedia('(max-width:1000px)');
      var onMq = function () { while (S.sel.length > maxSel()) S.sel.pop(); renderPicker(); renderTable(); };
      if (mq.addEventListener) { mq.addEventListener('change', onMq); mqT.addEventListener('change', renderPicker); }
      else if (mq.addListener) { mq.addListener(onMq); mqT.addListener(renderPicker); }
    }

    shell();
    if (isMobile()) S.sel = S.sel.slice(0, 2);
    renderChips(); renderPicker(); renderTable(); bind();
  }
})();
