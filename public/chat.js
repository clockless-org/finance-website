// Landing-page floating chat bubble — demo-only, no backend.
(function () {
  const STRINGS = {
    en: {
      title: "Maya Sterling, CFP®",
      sub: "Fee-Only Fiduciary Advisor · Usually replies within the hour",
      greeting: "Hi! I'm Maya. I help Bay Area tech families plan equity comp, taxes, retirement, and college funding — fee-only, fiduciary, and always in writing. Ask me anything — RSU windows, IPO planning, allocation, what the portal looks like.",
      placeholder: "Type a message…",
      replies: [
        "Great question — most households I work with are 6–18 months from a real planning event (IPO, vesting cliff, lifestyle change). Want to jump on a 15-minute discovery call to sanity-check your timeline?",
        "Honest answer: your tax outcome depends on RSU vest dates, ISO exercise timing, and your federal bracket. Send me a quick email at hello@finance.clockless.ai and I'll model it for you.",
        "Yes — every household gets a private portal like the one Daniel & Mira are using. You can peek at their plan at /portal.",
        "I keep two new-client slots open per quarter. Want me to save you one?",
        "ADV brochure, IPS, and 10b5-1 plan language are where 95% of advisory mistakes hide. I read every line before you sign — that’s the whole job.",
      ],
      closeLabel: "Close chat",
      openLabel: "Open chat with Maya",
    },
    zh: {
      title: "Maya Sterling, CFP®",
      sub: "纯佣金受托人顾问 · 通常一小时内回复",
      greeting: "你好！我是 Maya，专门帮湾区科技家庭做股权薪酬、税务、退休与子女教育金的规划——纯佣金、受托人、所有结论都写下来。RSU 窗口、IPO 规划、资产配置、门户长什么样——随便问。",
      placeholder: "输入消息…",
      replies: [
        "好问题——我合作的多数家庭距离真正的规划事件（IPO、解禁断崖、生活方式转变）还有 6 至 18 个月。要不要先约一个 15 分钟的初谈电话，帮你把时间线捋一遍？",
        "诚实地说，你的税务结果取决于 RSU 解禁日、ISO 行权时机以及联邦税档。写封邮件到 hello@finance.clockless.ai，我帮你建模。",
        "是——每个家庭都有一个和 Daniel、Mira 同样的私人门户。想先看看他们的方案，去 /portal 就行。",
        "我每季度只留两个新客户名额。要不要帮你预留一个？",
        "ADV 披露表、IPS、10b5-1 计划语言是 95% 顾问行业失误的藏身处。每一条我都会在你签字前读完——这就是我的全部工作。",
      ],
      closeLabel: "关闭聊天",
      openLabel: "打开与 Maya 的聊天",
    },
  };

  function currentLang() {
    const l = document.documentElement.lang;
    return l === "zh" ? "zh" : "en";
  }
  function S() {
    return STRINGS[currentLang()];
  }

  // Build DOM once, toggle visibility / language on demand.
  const host = document.createElement("div");
  host.className = "site-chat";
  host.innerHTML = `
    <button class="site-chat__bubble" type="button" aria-label="" data-role="toggle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </button>
    <div class="site-chat__panel" role="dialog" aria-hidden="true">
      <header class="site-chat__head">
        <span class="site-chat__head-avatar" aria-hidden="true"></span>
        <div class="site-chat__head-text">
          <strong data-role="title"></strong>
          <span data-role="sub"></span>
        </div>
        <button class="site-chat__close" type="button" aria-label="" data-role="close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 6-12 12M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="site-chat__scroll" data-role="scroll"></div>
      <footer class="site-chat__input">
        <textarea rows="1" data-role="input"></textarea>
        <button class="site-chat__send" type="button" aria-label="Send" data-role="send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2-7-8-3z"/></svg>
        </button>
      </footer>
    </div>
  `;
  document.body.appendChild(host);

  const $ = (sel) => host.querySelector(sel);
  const toggleBtn = $('[data-role="toggle"]');
  const closeBtn = $('[data-role="close"]');
  const panel = $(".site-chat__panel");
  const scroll = $('[data-role="scroll"]');
  const input = $('[data-role="input"]');
  const sendBtn = $('[data-role="send"]');
  const titleEl = $('[data-role="title"]');
  const subEl = $('[data-role="sub"]');

  let replyIdx = 0;
  let busy = false;
  // Track messages in both languages so we can re-render on language change
  // without losing the conversation.
  const history = []; // { role: 'agent'|'user', body: { en, zh } }

  function renderHistory() {
    const lang = currentLang();
    scroll.innerHTML = "";
    history.forEach((m) => {
      const div = document.createElement("div");
      div.className =
        "site-chat__msg site-chat__msg--" + (m.role === "user" ? "user" : "agent");
      div.textContent = typeof m.body === "string" ? m.body : m.body[lang];
      scroll.appendChild(div);
    });
    scroll.scrollTop = scroll.scrollHeight;
  }

  function refreshLanguage() {
    const s = S();
    titleEl.textContent = s.title;
    subEl.textContent = s.sub;
    input.placeholder = s.placeholder;
    toggleBtn.setAttribute(
      "aria-label",
      panel.classList.contains("is-open") ? s.closeLabel : s.openLabel,
    );
    closeBtn.setAttribute("aria-label", s.closeLabel);
    // Ensure at least the greeting is in history.
    if (history.length === 0) {
      history.push({
        role: "agent",
        body: { en: STRINGS.en.greeting, zh: STRINGS.zh.greeting },
      });
    }
    renderHistory();
  }

  function openPanel(open) {
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    toggleBtn.setAttribute(
      "aria-label",
      open ? S().closeLabel : S().openLabel,
    );
    if (open) setTimeout(() => input.focus(), 50);
  }

  toggleBtn.addEventListener("click", () =>
    openPanel(!panel.classList.contains("is-open")),
  );
  closeBtn.addEventListener("click", () => openPanel(false));

  function send() {
    const val = input.value.trim();
    if (!val || busy) return;
    busy = true;
    history.push({ role: "user", body: val });
    input.value = "";
    renderHistory();
    const typingIdx = history.push({
      role: "agent",
      body: { en: "…", zh: "…" },
    }) - 1;
    renderHistory();
    setTimeout(() => {
      const replies = STRINGS[currentLang()].replies;
      const en = STRINGS.en.replies[replyIdx % STRINGS.en.replies.length];
      const zh = STRINGS.zh.replies[replyIdx % STRINGS.zh.replies.length];
      replyIdx += 1;
      history[typingIdx] = { role: "agent", body: { en, zh } };
      // Ensure we use current lang
      void replies;
      renderHistory();
      busy = false;
    }, 900);
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  // React to language toggles triggered by site.js.
  const observer = new MutationObserver(() => refreshLanguage());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "data-lang"],
  });

  refreshLanguage();
})();
