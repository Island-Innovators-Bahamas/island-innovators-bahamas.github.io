/* Clarity: IIB's website assistant. Floating launcher + chat panel.
   Talks to the Cloudflare Worker (system prompt lives there). */
(function () {
  if (window.__iibClarity) return;
  window.__iibClarity = true;

  var WORKER_URL = 'https://iib-assistant.islandinnovatorsbahamas.workers.dev';
  var OPENING = "Hi, I'm Clarity. Ask me about Island Innovators Bahamas, our past programs, or how to get involved.";
  var CHIPS = [
    { label: 'What is IIB?', q: 'What is Island Innovators Bahamas?' },
    { label: 'Get involved', q: 'How can I get involved with Island Innovators Bahamas?' },
    { label: 'Future programs', q: 'Will there be another program, and how do I hear about it?' }
  ];

  var css = '' +
  '.iibc-launch{position:fixed;right:16px;bottom:16px;z-index:60;background:#0A1628;color:#F5F0E8;border:1px solid rgba(245,240,232,.25);font-family:var(--iib-font,"Space Mono","Courier New",monospace);font-size:11px;letter-spacing:.18em;text-transform:uppercase;padding:12px 18px;border-radius:999px;cursor:pointer;box-shadow:0 6px 20px rgba(10,22,40,.28);transition:background .2s,transform .2s}' +
  '.iibc-launch:hover{background:#1A3A6C}' +
  '.iibc-launch:focus-visible,.iibc-send:focus-visible,.iibc-close:focus-visible,.iibc-input:focus-visible{outline:2px solid #C06628;outline-offset:2px}' +
  '.iibc-panel{position:fixed;right:16px;bottom:72px;z-index:61;width:min(380px,calc(100vw - 32px));max-height:min(560px,calc(100vh - 100px));display:none;flex-direction:column;background:#fff;color:#0A1628;border:1px solid rgba(10,22,40,.1);border-radius:14px;box-shadow:0 18px 50px rgba(10,22,40,.3);overflow:hidden;font-family:"DM Sans",system-ui,sans-serif}' +
  '.iibc-panel.iibc-open{display:flex}' +
  '.iibc-head{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to bottom,#1A3A6C,#0A1628);color:#F5F0E8;padding:12px 16px}' +
  '.iibc-title{font-family:var(--iib-font,"Space Mono","Courier New",monospace);font-size:11px;letter-spacing:.2em;text-transform:uppercase}' +
  '.iibc-close{background:none;border:none;color:rgba(245,240,232,.8);font-size:20px;line-height:1;cursor:pointer;padding:2px 6px}' +
  '.iibc-thread{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;min-height:120px;scroll-behavior:smooth}' +
  '.iibc-msg{display:flex;flex-direction:column;gap:3px}' +
  '.iibc-role{font-family:var(--iib-font,"Space Mono","Courier New",monospace);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(10,22,40,.4)}' +
  '.iibc-msg.iibc-a .iibc-role{color:#C06628}' +
  '.iibc-text{font-size:13.5px;line-height:1.65}' +
  '.iibc-msg.iibc-u .iibc-text{color:rgba(10,22,40,.6)}' +
  '.iibc-text a{color:#C06628;text-decoration:none}.iibc-text a:hover{text-decoration:underline}' +
  '.iibc-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 12px}' +
  '.iibc-chip{background:none;border:1px solid rgba(10,22,40,.15);color:rgba(10,22,40,.6);font-size:12px;padding:6px 12px;border-radius:999px;cursor:pointer}' +
  '.iibc-chip:hover{border-color:#C06628;color:#C06628}' +
  '.iibc-row{display:flex;gap:8px;border-top:1px solid rgba(10,22,40,.08);padding:12px 16px}' +
  '.iibc-input{flex:1;font-size:16px;font-family:inherit;color:#0A1628;background:transparent;border:none;border-bottom:1px solid rgba(10,22,40,.2);padding:6px 0;outline-offset:4px;min-width:0}' +
  '.iibc-send{background:#0A1628;color:#F5F0E8;border:none;font-family:var(--iib-font,"Space Mono","Courier New",monospace);font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:9px 14px;border-radius:3px;cursor:pointer}' +
  '.iibc-send:hover{background:#C06628}.iibc-send:disabled{opacity:.4;cursor:not-allowed}' +
  '.iibc-foot{padding:0 16px 12px;font-size:11px;color:rgba(10,22,40,.45);line-height:1.5}' +
  '.iibc-foot a{color:#C06628;text-decoration:none}' +
  '.iibc-reset{background:none;border:none;color:rgba(10,22,40,.4);font-size:11px;text-decoration:underline;cursor:pointer;padding:0}' +
  '.iibc-esc{display:flex;flex-direction:column;gap:8px;margin-top:10px}' +
  '.iibc-esc a{display:block;text-align:center;font-family:var(--iib-font,"Space Mono","Courier New",monospace);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(10,22,40,.75);border:1px solid rgba(10,22,40,.18);padding:9px 12px;border-radius:3px}' +
  '.iibc-esc a:hover{border-color:#C06628;color:#C06628;text-decoration:none}' +
  '.iibc-note{margin-top:8px;font-size:11px;font-style:italic;color:rgba(10,22,40,.4)}' +
  '.iibc-typing{display:flex;gap:4px;padding:4px 0}.iibc-typing i{width:5px;height:5px;border-radius:50%;background:#C06628;animation:iibcb 1.2s infinite}.iibc-typing i:nth-child(2){animation-delay:.2s}.iibc-typing i:nth-child(3){animation-delay:.4s}' +
  '@keyframes iibcb{0%,80%,100%{opacity:.2}40%{opacity:1}}' +
  '@media (max-width:480px){.iibc-panel{right:8px;left:8px;width:auto;bottom:68px}.iibc-launch{right:12px;bottom:12px}}' +
  '@media (prefers-reduced-motion:reduce){.iibc-typing i{animation:none}}';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Render a model answer safely: escape HTML, keep line breaks and hyphen lists,
  // and turn emails and islandinnovatorsbahamas.com links into real links.
  function fmt(text) {
    var h = esc(text).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\r/g, '');
    h = h.replace(/^\s*[-*] /gm, '\u2022 ');
    h = h.replace(/([A-Za-z0-9._%+-]+@islandinnovatorsbahamas\.com)/g, '<a href="mailto:$1">$1</a>');
    h = h.replace(/(^|[\s(])((?:https?:\/\/)?(?:www\.)?islandinnovatorsbahamas\.com(?:\/[A-Za-z0-9._\/-]*)?)/g, function (m, pre, url) {
      var clean = url.replace(/[.,;:!?)]+$/, ''), tail = url.slice(clean.length);
      var href = /^https?:/.test(clean) ? clean : 'https://' + clean;
      return pre + '<a href="' + href + '">' + clean + '</a>' + tail;
    });
    return h.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
  }

  function fallback(q) {
    var body = encodeURIComponent('Hello,\n\nI had a question from your website:\n\n' + (q || '') + '\n\nThank you.');
    var adm = 'mailto:admissions@islandinnovatorsbahamas.com?subject=' + encodeURIComponent('Island Innovators Bahamas - Question') + '&body=' + body;
    var hello = 'mailto:hello@islandinnovatorsbahamas.com?subject=' + encodeURIComponent('Island Innovators Bahamas - General Inquiry') + '&body=' + body;
    return 'I can’t answer that right now. You can reach the team directly. Clicking below opens your email app:' +
      '<div class="iibc-esc"><a href="' + adm + '">Programs &amp; Admissions</a><a href="' + hello + '">General &amp; Partnerships</a></div>' +
      '<p class="iibc-note">Nothing is sent automatically.</p>';
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var launch = document.createElement('button');
    launch.className = 'iibc-launch';
    launch.type = 'button';
    launch.setAttribute('aria-expanded', 'false');
    launch.setAttribute('aria-controls', 'iibc-panel');
    launch.textContent = 'Ask Clarity';

    var panel = document.createElement('div');
    panel.className = 'iibc-panel';
    panel.id = 'iibc-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Clarity, Island Innovators Bahamas assistant');
    panel.innerHTML =
      '<div class="iibc-head"><span class="iibc-title">Clarity</span><button type="button" class="iibc-close" aria-label="Close Clarity">&times;</button></div>' +
      '<div class="iibc-thread" aria-live="polite"></div>' +
      '<div class="iibc-chips"></div>' +
      '<div class="iibc-row"><input class="iibc-input" type="text" autocomplete="off" aria-label="Ask a question" placeholder="Ask a question" /><button type="button" class="iibc-send">Ask</button></div>' +
      '<p class="iibc-foot">AI assistant, so double-check anything important. Or email <a href="mailto:hello@islandinnovatorsbahamas.com">hello@islandinnovatorsbahamas.com</a> &nbsp;&middot;&nbsp; <button type="button" class="iibc-reset">Start over</button></p>';

    document.body.appendChild(panel);
    document.body.appendChild(launch);

    var thread = panel.querySelector('.iibc-thread');
    var chips = panel.querySelector('.iibc-chips');
    var input = panel.querySelector('.iibc-input');
    var send = panel.querySelector('.iibc-send');
    var history = [];

    function add(role, html) {
      var d = document.createElement('div');
      d.className = 'iibc-msg ' + (role === 'assistant' ? 'iibc-a' : 'iibc-u');
      d.innerHTML = '<span class="iibc-role">' + (role === 'assistant' ? 'Clarity' : 'You') + '</span><p class="iibc-text">' + html + '</p>';
      thread.appendChild(d);
      thread.scrollTop = thread.scrollHeight;
      return d;
    }

    function greet() {
      thread.innerHTML = '';
      add('assistant', esc(OPENING));
      chips.style.display = '';
    }

    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'iibc-chip';
      b.textContent = c.label;
      b.addEventListener('click', function () { ask(c.q); });
      chips.appendChild(b);
    });

    function ask(q) {
      if (send.disabled || !q) return;
      send.disabled = true;
      chips.style.display = 'none';
      add('user', esc(q));
      var typing = document.createElement('div');
      typing.className = 'iibc-msg iibc-a';
      typing.innerHTML = '<span class="iibc-role">Clarity</span><div class="iibc-typing"><i></i><i></i><i></i></div>';
      thread.appendChild(typing);
      thread.scrollTop = thread.scrollHeight;

      var messages = history.concat([{ role: 'user', content: q }]);
      fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages }) })
        .then(function (r) { if (!r.ok) throw new Error('Worker ' + r.status); return r.json(); })
        .then(function (data) {
          if (data.error || !data.answer) throw new Error('Bad response');
          typing.remove();
          add('assistant', fmt(data.answer));
          history.push({ role: 'user', content: q }, { role: 'assistant', content: data.answer });
          if (history.length > 12) history.splice(0, 2);
          if (typeof gtag === 'function') gtag('event', 'clarity_question', { event_category: 'engagement' });
        })
        .catch(function () { typing.remove(); add('assistant', fallback(q)); })
        .then(function () { send.disabled = false; input.focus(); });
    }

    function submit() { var v = input.value.trim(); if (!v) return; input.value = ''; ask(v); }
    send.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    panel.querySelector('.iibc-reset').addEventListener('click', function () { history.length = 0; send.disabled = false; greet(); });

    function setOpen(open) {
      panel.classList.toggle('iibc-open', open);
      launch.setAttribute('aria-expanded', String(open));
      launch.textContent = open ? 'Close Clarity' : 'Ask Clarity';
      if (open) { if (typeof gtag === 'function') gtag('event', 'clarity_open', { event_category: 'engagement' }); setTimeout(function () { input.focus(); }, 50); }
    }
    launch.addEventListener('click', function () { setOpen(!panel.classList.contains('iibc-open')); });
    panel.querySelector('.iibc-close').addEventListener('click', function () { setOpen(false); launch.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('iibc-open')) { setOpen(false); launch.focus(); } });

    greet();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
