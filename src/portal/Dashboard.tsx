import { useEffect, useRef, useState } from 'react'
import type { PortalMember, PortalTenantIdentity } from './api'
import './dashboard.css'

type Lang = 'en' | 'zh'
type TL = { en: string; zh: string }

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem('maya-lang')
  if (stored === 'zh' || stored === 'en') return stored
  if (navigator.language && navigator.language.toLowerCase().startsWith('zh')) return 'zh'
  return 'en'
}

function tl(lang: Lang, v: string | TL): string {
  return typeof v === 'string' ? v : v[lang]
}

const T = {
  'demo.pill': { en: 'Demo', zh: '演示' },
  'back.site': { en: 'Back to site', zh: '返回主站' },
  'call': { en: 'Call', zh: '通话' },
  'header.tagline': {
    en: 'A calm, technical fiduciary advisor walking you through your equity event — every recommendation tracked in this portal.',
    zh: '一位从容、技术型的受托人顾问，陪你走过股权事件的每一步——每一条建议都记录在这个门户里。',
  },
  'tab.journey': { en: 'Journey', zh: '旅程' },
  'tab.holdings': { en: 'Holdings', zh: '持仓' },
  'tab.strategy': { en: 'Strategy', zh: '策略' },
  'tab.schedule': { en: 'Schedule', zh: '日程' },
  'tab.fees': { en: 'Fees', zh: '费用' },
  'tab.documents': { en: 'Documents', zh: '文件' },
  'tab.messages': { en: 'Messages', zh: '消息' },
  'journey.eyebrow': { en: 'Your journey', zh: '你的旅程' },
  'journey.title.suffix': { en: '’s path to a written plan', zh: ' 通往一份书面方案的那段路' },
  'journey.subtitle': { en: 'From first discovery call to ongoing reviews — every step, in one place.', zh: '从首次访谈到持续回顾——每一步，集中在一处。' },
  'journey.complete': { en: '% complete', zh: '% 已完成' },
  'journey.of': { en: 'of', zh: '/' },
  'journey.stages.done': { en: 'stages done · Now:', zh: '阶段已完成 · 当前：' },
  'journey.current': { en: 'Current stage', zh: '当前阶段' },
  'holdings.title': { en: 'Holdings', zh: '持仓' },
  'holdings.subtitle': { en: 'Every position across your custodians, what role it plays, and why it lives in your plan.', zh: '所有托管账户里的每一项持仓、它在方案中扮演的角色、以及它为什么留在你的计划里。' },
  'strategy.title': { en: 'Investment Strategy', zh: '投资策略' },
  'strategy.subtitle': { en: 'Your written investment policy &mdash; the constraints, the target allocation, and the guardrails Maya put in writing so we don’t drift in a panic.', zh: '你的书面投资策略——约束条件、目标配置、Maya 写下的护栏，避免我们在恐慌时漂移。' },
  'strategy.hero.caption': { en: 'Your asset allocation, in one IPS', zh: '你的资产配置，归在一份 IPS 里' },
  'schedule.title': { en: 'Schedule', zh: '日程' },
  'schedule.subtitle': { en: 'What’s on the calendar between now and the next quarterly review.', zh: '从现在到下一次季度回顾之间，日历上有些什么。' },
  'fees.title': { en: 'Fees', zh: '费用' },
  'fees.paid': { en: 'paid', zh: '已支付' },
  'fees.pending': { en: 'pending. Every advisor invoice and custodian charge, in one view.', zh: '待支付。每一笔顾问账单与托管费用，都在一个视图里。' },
  'documents.title': { en: 'Documents', zh: '文件' },
  'documents.subtitle': { en: 'Everything signed, disclosed, or shared — always in one place.', zh: '所有已签、已披露、已分享的文件——始终集中在一处。' },
  'messages.title': { en: 'Messages', zh: '消息' },
  'messages.subtitle': { en: 'Your shared thread with Maya. Use the chat bubble for faster questions.', zh: '你和 Maya 的共享消息线。要问得更快，用右下角的聊天气泡。' },
  'addcal': { en: 'Add to calendar', zh: '加入日历' },
  'download': { en: 'Download', zh: '下载' },
  'reviewsign': { en: 'Review & sign', zh: '查看并签字' },
  'review': { en: 'Review', zh: '查看' },
  'open': { en: 'Open', zh: '打开' },
  'mayas.takeaway': { en: 'Maya’s takeaway', zh: 'Maya 的总结' },
  'why.allocation': { en: 'Why this allocation', zh: '为什么是这个配置' },
  'what.learned': { en: 'What we learned', zh: '我们学到了什么' },
  'wire.fraud': { en: 'Reminder on wire fraud', zh: '电汇诈骗提醒' },
  'message.maya': { en: 'Message Maya', zh: '发消息给 Maya' },
  'review.sign': { en: 'Review & sign', zh: '查看并签字' },
} as const

type TKey = keyof typeof T
function t(lang: Lang, key: TKey): string {
  return T[key][lang]
}

interface Props {
  member: PortalMember
  tenant: PortalTenantIdentity | null
  onSignOut: () => void
}

type TabId = 'journey' | 'holdings' | 'strategy' | 'schedule' | 'fees' | 'documents' | 'messages'

type StageContent =
  | { kind: 'info-grid'; rows: { label: TL; value: TL; emphasis?: 'success' | 'warning' | 'accent' }[] }
  | { kind: 'positions'; items: { ticker: string; account: TL; shares: string; basis: string; market: string; status?: TL; role?: TL }[] }
  | { kind: 'documents'; items: { name: TL; size: TL; action?: boolean }[] }
  | { kind: 'checklist'; items: { label: TL; done: boolean; sub?: TL }[] }
  | { kind: 'actions'; buttons: { labelKey: TKey; primary?: boolean; href?: string }[] }
  | { kind: 'note'; titleKey: TKey; body: TL }

interface Stage {
  id: string
  idx: number
  tag: TL
  title: TL
  status: 'done' | 'active' | 'upcoming'
  dateLabel: TL
  summary: TL
  content: StageContent[]
  accent?: 'allocation' | 'plan' | 'execution'
}

const STAGES: Stage[] = [
  {
    id: 'discovery', idx: 1,
    tag: { en: 'Discovery', zh: '初次访谈' },
    title: { en: 'The first honest goals conversation', zh: '第一次诚实地聊目标' },
    status: 'done',
    dateLabel: { en: 'Sep 2025', zh: '2025 年 9 月' },
    summary: { en: 'Aligned on goals. Dual-income tech couple, 18-year retirement horizon, two kids in K-3. Maya sanity-checked the lifestyle number.', zh: '对齐了目标。双收入科技夫妻，18 年退休时间窗，两个 K–3 阶段的孩子。Maya 帮你们把那个「想要的生活」数字核了一遍。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Lifestyle target', zh: '生活方式目标' }, value: { en: '$280k / yr after tax (today’s dollars)', zh: '$280k / 年（税后，今日购买力）' } },
        { label: { en: 'Retirement age', zh: '退休年龄' }, value: { en: 'Mira 52 · Daniel 56', zh: 'Mira 52 岁 · Daniel 56 岁' } },
        { label: { en: 'Kids’ education', zh: '子女教育' }, value: { en: 'Owen (5) · Emma (2) · 4-yr private college target', zh: 'Owen（5）· Emma（2）· 目标 4 年私立大学' } },
        { label: { en: 'Single-stock concentration', zh: '单只股票集中度' }, value: { en: '54% of liquid net worth in employer equity', zh: '雇主股权占流动净资产 54%' }, emphasis: 'warning' },
        { label: { en: 'Liquidity event', zh: '流动性事件' }, value: { en: 'Mira’s company IPO in Q3 2025 · 6-mo lockup ended Mar 2026', zh: 'Mira 公司 2025 Q3 IPO · 6 个月锁定期 2026 年 3 月到期' } },
      ]},
      { kind: 'note', titleKey: 'mayas.takeaway',
        body: {
          en: 'Your lifestyle number is reachable. The bottleneck is not "save more"; it’s "diversify the concentration before the next earnings cycle without lighting up an unnecessary tax bill." We’ll plan the sell-down across two tax years.',
          zh: '你们的生活方式数字是可达的。瓶颈不在「多存钱」，而在「在下一次财报季之前完成单只股票去集中，同时避免不必要的税单」。我们会把卖出节奏分到两个税务年度。',
        } },
    ],
  },
  {
    id: 'inventory', idx: 2,
    tag: { en: 'Inventory', zh: '资产盘点' },
    title: { en: 'Full balance sheet, in one view', zh: '完整资产负债表，一图看清' },
    status: 'done',
    dateLabel: { en: 'Oct 2025', zh: '2025 年 10 月' },
    summary: { en: 'Linked all six accounts across Schwab, Fidelity, Carta, and your 401(k) provider. Reconciled cost basis on the IPO shares.', zh: '把分散在 Schwab、Fidelity、Carta 与 401(k) 服务商的六个账户全部归集。把 IPO 股票的成本基础对齐了。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Liquid net worth', zh: '流动净资产' }, value: { en: '$3,180,000', zh: '$3,180,000' }, emphasis: 'success' },
        { label: { en: 'Employer single stock (NEXA)', zh: '雇主单只股票（NEXA）' }, value: { en: '$1,720,000 · 54%', zh: '$1,720,000 · 54%' }, emphasis: 'warning' },
        { label: { en: 'Diversified portfolio', zh: '已多元化投资组合' }, value: { en: '$890,000 · mostly index ETFs', zh: '$890,000 · 主要为指数 ETF' } },
        { label: { en: 'Cash + T-bills', zh: '现金 + 短期国债' }, value: { en: '$310,000 · 9-mo expense buffer', zh: '$310,000 · 9 个月开支缓冲' } },
        { label: { en: 'Retirement (combined 401k+IRA)', zh: '退休账户（401k+IRA 合并）' }, value: { en: '$260,000', zh: '$260,000' } },
      ]},
    ],
  },
  {
    id: 'risk', idx: 3,
    tag: { en: 'Risk Profile', zh: '风险画像' },
    title: { en: 'Three sessions of risk capacity work', zh: '三次风险承受能力工作坊' },
    status: 'done',
    dateLabel: { en: 'Oct 2025', zh: '2025 年 10 月' },
    summary: { en: 'Walked through behavioral surveys, drawdown scenarios, and stress-tested cash flow. Scored each goal on time horizon, criticality, and flexibility.', zh: '过了一遍行为问卷、回撤情景与现金流压力测试。按时间窗、关键程度、灵活度对每个目标分别打分。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Retirement (long-horizon)', zh: '退休（长时间窗）' }, value: { en: '70 / 30 equity-bond · top pick', zh: '70 / 30 股债 · 首选' }, emphasis: 'success' },
        { label: { en: 'Education (mid-horizon)', zh: '教育（中等时间窗）' }, value: { en: '60 / 40 with glide path', zh: '60 / 40，带降权曲线' } },
        { label: { en: 'Lifestyle reserve (3-yr)', zh: '生活方式储备（3 年）' }, value: { en: 'Treasury ladder + HYSA', zh: '国债阶梯 + 高息储蓄账户' } },
        { label: { en: 'Single-stock policy', zh: '单只股票政策' }, value: { en: 'Cap at 15% of liquid NW within 24 months', zh: '24 个月内压到流动净资产的 15% 以下' } },
      ]},
      { kind: 'note', titleKey: 'why.allocation',
        body: {
          en: 'The 70/30 anchor matches your real ability to ride out a 35% drawdown without selling — Daniel’s salary covers fixed costs, and we have a 9-month cash buffer. Mira’s nerves matter more than the textbook here, and 70/30 is where she sleeps.',
          zh: '70/30 的锚点符合你们「即便经历 35% 回撤也不必卖」的真实承受能力——Daniel 的工资覆盖固定开支，加上 9 个月的现金缓冲。在这里 Mira 的情绪比教科书更重要，70/30 是她能睡着的水平。',
        } },
    ],
  },
  {
    id: 'plan-draft', idx: 4,
    tag: { en: 'Plan Drafting', zh: '方案起草' },
    title: { en: 'Two drafts, three revisions', zh: '两稿草案、三轮修订' },
    status: 'done',
    dateLabel: { en: 'Nov 2025', zh: '2025 年 11 月' },
    summary: { en: 'First draft covered the IPS, sell-down schedule, and tax projection. You pushed back on the donor-advised fund timing. Maya re-modeled and we landed on the final.', zh: '第一稿覆盖 IPS、卖出节奏与税务预测。你们对 DAF 的时间安排提出了不同意见。Maya 重新建模后我们敲定了终稿。' },
    accent: 'plan',
    content: [
      { kind: 'positions', items: [
        { ticker: 'NEXA', account: { en: 'Schwab brokerage', zh: 'Schwab 证券账户' }, shares: '24,800 sh', basis: '$2.40 / sh', market: '$1,720,000', status: { en: 'Sell-down planned', zh: '已规划卖出' }, role: { en: 'Concentration to unwind', zh: '需去集中的单一股票' } },
        { ticker: 'VTI', account: { en: 'Schwab brokerage', zh: 'Schwab 证券账户' }, shares: '2,940 sh', basis: '$185 / sh', market: '$642,000', role: { en: 'US equity core', zh: '美股核心仓' } },
        { ticker: 'VXUS', account: { en: 'Schwab brokerage', zh: 'Schwab 证券账户' }, shares: '4,120 sh', basis: '$54 / sh', market: '$246,000', role: { en: 'International equity', zh: '国际股票' } },
      ]},
    ],
  },
  {
    id: 'first-rebal', idx: 5,
    tag: { en: 'First Window', zh: '首个交易窗口' },
    title: { en: 'Q1 sell-down hit by an earnings dip', zh: 'Q1 卖出节奏被业绩公告打乱' },
    status: 'done',
    dateLabel: { en: 'Jan 2026', zh: '2026 年 1 月' },
    summary: { en: 'Planned to sell 4,200 NEXA shares in the first open window. Earnings missed on Jan 23; the window closed early. We sold 2,800 shares before the freeze and rolled the remaining 1,400 into the next window.', zh: '原计划在首个开放窗口卖出 4,200 股 NEXA。1 月 23 日业绩不及预期，窗口提前关闭。我们在冻结前卖出 2,800 股，剩余 1,400 股顺延到下一个窗口。' },
    content: [
      { kind: 'note', titleKey: 'what.learned',
        body: {
          en: 'Trading windows are not promises. We updated the sell-down framework to assume one window every cycle goes short by 30%. Maya prefilled a 10b5-1 plan template so future sells continue automatically inside the window — no decision fatigue, no missed days.',
          zh: '交易窗口不是承诺。我们更新了卖出框架，默认每个周期会有一个窗口被压缩 30%。Maya 提前填好了一份 10b5-1 计划模板，让未来的卖出在窗口内自动执行——避免决策疲劳，避免错过日期。',
        } },
    ],
  },
  {
    id: 'plan-final', idx: 6,
    tag: { en: 'Final Plan', zh: '最终方案' },
    title: { en: 'IPS signed; 24-month sell-down locked', zh: 'IPS 签字；24 个月卖出节奏锁定' },
    status: 'done',
    dateLabel: { en: 'Feb 2026', zh: '2026 年 2 月' },
    summary: { en: 'Investment policy statement signed. Sell-down spans Q1—Q4 2026 with a 10b5-1 plan running in parallel. Tax projection covers two years.', zh: '投资策略说明书签字完成。卖出节奏跨越 2026 Q1–Q4，配合并行的 10b5-1 计划。税务预测覆盖两年。' },
    accent: 'plan',
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Initial draft date', zh: '初稿日期' }, value: { en: 'Nov 14, 2025', zh: '2025 年 11 月 14 日' } },
        { label: { en: 'Revisions', zh: '修订轮次' }, value: { en: '3 rounds · DAF timing, kids’ 529, RSU sell pace', zh: '3 轮 · DAF 时机、子女 529、RSU 卖出节奏' } },
        { label: { en: 'Final IPS', zh: '最终 IPS' }, value: { en: 'Feb 9, 2026 · signed by both', zh: '2026 年 2 月 9 日 · 双方签字' }, emphasis: 'success' },
        { label: { en: 'Target single-stock by Q4 2026', zh: '2026 Q4 目标单只股票占比' }, value: { en: '≤ 22% liquid NW (down from 54%)', zh: '≤ 流动净资产 22%（从 54% 降下来）' } },
        { label: { en: 'Tax projection horizon', zh: '税务预测周期' }, value: { en: '2026 + 2027', zh: '2026 + 2027' } },
      ]},
    ],
  },
  {
    id: 'implement', idx: 7,
    tag: { en: 'Implementation', zh: '执行中' },
    title: { en: 'One signature from the next sell window', zh: '距离下一个交易窗口只差一个签字' },
    status: 'active',
    dateLabel: { en: 'Apr 2026', zh: '2026 年 4 月' },
    summary: { en: '10b5-1 plan loaded with broker. Q2 trading window opens Apr 28. ADV brochure update ready for review.', zh: '10b5-1 计划已在券商端加载。Q2 交易窗口 4 月 28 日开放。ADV 投资顾问披露表更新版等待审阅。' },
    accent: 'execution',
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: '10b5-1 plan loaded', zh: '10b5-1 计划已加载' }, value: { en: 'Schwab · effective Apr 28', zh: 'Schwab · 4 月 28 日生效' }, emphasis: 'success' },
        { label: { en: 'Q2 sell target', zh: 'Q2 卖出目标' }, value: { en: '5,600 shares · price ladder $46–52', zh: '5,600 股 · 价格阶梯 $46–52' }, emphasis: 'success' },
        { label: { en: '529 funding', zh: '529 教育金注入' }, value: { en: '$36,000 · split 60/40 Owen/Emma', zh: '$36,000 · Owen/Emma 按 60/40 分配' }, emphasis: 'success' },
        { label: { en: 'DAF contribution', zh: 'DAF 捐赠' }, value: { en: '$84,000 · NEXA shares · Apr 22', zh: '$84,000 · 以 NEXA 股票形式 · 4 月 22 日' }, emphasis: 'success' },
        { label: { en: 'Updated ADV brochure', zh: '更新版 ADV 披露表' }, value: { en: 'Review + sign by Apr 22', zh: '4 月 22 日前审阅并签字' }, emphasis: 'warning' },
      ]},
      { kind: 'documents', items: [
        { name: { en: 'Updated ADV Part 2A brochure', zh: '更新版 ADV Part 2A 投资顾问披露表' }, size: { en: 'PDF · 38 pages', zh: 'PDF · 38 页' }, action: true },
        { name: { en: '10b5-1 trading plan (Schwab)', zh: '10b5-1 交易计划（Schwab）' }, size: { en: 'PDF · 12 pages', zh: 'PDF · 12 页' } },
        { name: { en: 'DAF contribution letter', zh: 'DAF 捐赠确认函' }, size: { en: 'PDF · 3 pages', zh: 'PDF · 3 页' } },
        { name: { en: 'Q1 portfolio review (preliminary)', zh: 'Q1 投资组合回顾（初稿）' }, size: { en: 'PDF · 14 pages', zh: 'PDF · 14 页' } },
      ]},
      { kind: 'actions', buttons: [
        { labelKey: 'review.sign', primary: true },
        { labelKey: 'message.maya' },
      ]},
    ],
  },
  {
    id: 'q2-window', idx: 8,
    tag: { en: 'Q2 Window', zh: 'Q2 窗口' },
    title: { en: 'Window opens Apr 28 — three appointments, five days', zh: '4 月 28 日窗口开启 — 五天三个日程' },
    status: 'upcoming',
    dateLabel: { en: 'Apr 28 – May 02', zh: '4 月 28 日 – 5 月 2 日' },
    summary: { en: 'Three appointments, five days. Maya joins all three; James (tax) joins the post-trade review.', zh: '五天三个日程。Maya 全程到场；James（税务）在交易后回顾时加入。' },
    accent: 'execution',
    content: [
      { kind: 'checklist', items: [
        { label: { en: 'Pre-window plan check call (Maya)', zh: '窗口前方案确认电话（Maya）' }, done: false, sub: { en: 'Mon Apr 27 · 3:30 PM · Zoom · Maya attending', zh: '4 月 27 日（一）15:30 · Zoom · Maya 到场' } },
        { label: { en: '10b5-1 plan goes live (Schwab)', zh: '10b5-1 计划在 Schwab 生效' }, done: false, sub: { en: 'Tue Apr 28 · 9:30 AM market open · auto-execute', zh: '4 月 28 日（二）09:30 开盘 · 自动执行' } },
        { label: { en: 'Post-window tax review (James + Maya)', zh: '窗口后税务回顾（James + Maya）' }, done: false, sub: { en: 'Fri May 02 · 11:00 AM · Sterling office · Maya + James attending', zh: '5 月 2 日（五）11:00 · Sterling 办公室 · Maya + James 到场' } },
      ]},
      { kind: 'note', titleKey: 'wire.fraud',
        body: {
          en: 'Wire instructions for funded accounts will come directly from your custodian (Schwab) only. Any email asking you to wire funds — even from Maya — is fraud. Call Maya or your Schwab relationship manager before sending anything.',
          zh: '已托管账户的电汇指令只会直接来自托管方（Schwab）。任何要求你们电汇的邮件——哪怕看起来是 Maya 发的——都是诈骗。汇款前务必电话联系 Maya 或你的 Schwab 客户经理确认。',
        } },
    ],
  },
  {
    id: 'ongoing', idx: 9,
    tag: { en: 'Ongoing Reviews', zh: '持续回顾' },
    title: { en: 'Quarterly reviews + the next 12 months', zh: '季度回顾 + 接下来的 12 个月' },
    status: 'upcoming',
    dateLabel: { en: 'May 2026 onwards', zh: '2026 年 5 月起' },
    summary: { en: 'Maya runs a quarterly portfolio review the third Wednesday of each quarter. Annual plan refresh and tax planning checkpoint already on the calendar.', zh: 'Maya 在每季度的第三个周三做投资组合回顾。年度方案刷新与税务规划节点也已经放进日历。' },
    content: [
      { kind: 'checklist', items: [
        { label: { en: 'Q2 portfolio review', zh: 'Q2 投资组合回顾' }, done: false, sub: { en: 'Wed May 20 · 4:00 PM · Zoom', zh: '5 月 20 日（三）16:00 · Zoom' } },
        { label: { en: 'Mid-year tax planning checkpoint', zh: '年中税务规划节点' }, done: false, sub: { en: 'Wed Jun 24 · 4:00 PM · Maya + James', zh: '6 月 24 日（三）16:00 · Maya + James' } },
        { label: { en: 'Q3 review (post-earnings cycle)', zh: 'Q3 回顾（财报季后）' }, done: false },
        { label: { en: 'Estate doc completeness review (David)', zh: '遗产文件完整性审阅（David）' }, done: false, sub: { en: 'Sep 2026 · trust funding + beneficiary check', zh: '2026 年 9 月 · 信托注资 + 受益人核对' } },
        { label: { en: 'Year-end tax-loss harvest scan', zh: '年终税损收割扫描' }, done: false },
        { label: { en: 'Annual plan refresh', zh: '年度方案刷新' }, done: false, sub: { en: 'Feb 2027 · re-baseline goals + IPS', zh: '2027 年 2 月 · 目标 + IPS 重新设定基线' } },
      ]},
    ],
  },
]

interface PositionRow { status: TL; ticker: string; account: TL; shares: string; basis: string; market: string; accent?: boolean; notes?: TL; role?: TL }

const HOLDINGS: PositionRow[] = [
  { status: { en: 'Concentration', zh: '高度集中' }, ticker: 'NEXA', account: { en: 'Schwab brokerage', zh: 'Schwab 证券账户' }, shares: '24,800 sh', basis: '$2.40 / sh', market: '$1,720,000', accent: true, notes: { en: 'Mira’s post-IPO holding. 24-month sell-down underway via 10b5-1.', zh: 'Mira IPO 后的持仓。通过 10b5-1 计划的 24 个月卖出节奏已经启动。' }, role: { en: 'Concentration to unwind', zh: '需去集中的单一股票' } },
  { status: { en: 'Core', zh: '核心仓' }, ticker: 'VTI', account: { en: 'Schwab brokerage', zh: 'Schwab 证券账户' }, shares: '2,940 sh', basis: '$185 / sh', market: '$642,000', notes: { en: 'US total-market core. Tax-loss harvest pair: ITOT.', zh: '美国全市场核心仓。税损收割对冲标的：ITOT。' }, role: { en: 'US equity core', zh: '美股核心仓' } },
  { status: { en: 'Core', zh: '核心仓' }, ticker: 'VXUS', account: { en: 'Schwab brokerage', zh: 'Schwab 证券账户' }, shares: '4,120 sh', basis: '$54 / sh', market: '$246,000', notes: { en: 'International ex-US equity. Tax-managed lots since 2024.', zh: '美国以外的国际股票。自 2024 年起按税务管理批次记录。' }, role: { en: 'International equity', zh: '国际股票' } },
  { status: { en: 'Core', zh: '核心仓' }, ticker: 'BND', account: { en: 'Joint IRA · Fidelity', zh: '联合 IRA · Fidelity' }, shares: '1,580 sh', basis: '$76 / sh', market: '$118,000', notes: { en: 'Held in tax-advantaged buckets only — no taxable bond drag.', zh: '只放在税收优惠账户里——避免应税债券损耗。' }, role: { en: 'Bond ballast', zh: '债券压舱' } },
  { status: { en: 'Reserve', zh: '储备' }, ticker: 'T-Bills · 13/26-wk', account: { en: 'Schwab brokerage', zh: 'Schwab 证券账户' }, shares: '—', basis: '—', market: '$310,000', notes: { en: '9-month household expense buffer + Q2 tax estimate.', zh: '9 个月家庭开支缓冲 + Q2 预估税款。' }, role: { en: 'Cash & lifestyle reserve', zh: '现金与生活方式储备' } },
  { status: { en: 'Education', zh: '教育金' }, ticker: '529 · Owen', account: { en: 'CA ScholarShare', zh: '加州 ScholarShare 529' }, shares: '—', basis: '—', market: '$78,000', notes: { en: 'Glide path to age-18 in 2039.', zh: '降权曲线对齐 2039 年 18 岁节点。' }, role: { en: 'College funding', zh: '大学教育金' } },
  { status: { en: 'Education', zh: '教育金' }, ticker: '529 · Emma', account: { en: 'CA ScholarShare', zh: '加州 ScholarShare 529' }, shares: '—', basis: '—', market: '$42,000', notes: { en: 'Glide path to age-18 in 2042.', zh: '降权曲线对齐 2042 年 18 岁节点。' }, role: { en: 'College funding', zh: '大学教育金' } },
]

interface AppointmentRow { when: TL; title: TL; where: TL; status: TL }
const APPOINTMENTS: AppointmentRow[] = [
  { when: { en: 'Wed · Apr 22 · 10:00 AM', zh: '4 月 22 日（三）10:00' }, title: { en: 'ADV brochure review with Maya', zh: '与 Maya 的 ADV 披露表审阅通话' }, where: { en: 'Zoom', zh: 'Zoom' }, status: { en: 'Confirmed', zh: '已确认' } },
  { when: { en: 'Mon · Apr 27 · 3:30 PM', zh: '4 月 27 日（一）15:30' }, title: { en: 'Pre-window plan check call', zh: '窗口前方案确认电话' }, where: { en: 'Zoom · Maya attending', zh: 'Zoom · Maya 到场' }, status: { en: 'Scheduled', zh: '已安排' } },
  { when: { en: 'Tue · Apr 28 · 9:30 AM', zh: '4 月 28 日（二）09:30' }, title: { en: '10b5-1 plan goes live (Schwab)', zh: '10b5-1 计划在 Schwab 生效' }, where: { en: 'Auto-execute', zh: '自动执行' }, status: { en: 'Action needed', zh: '需要处理' } },
  { when: { en: 'Fri · May 02 · 11:00 AM', zh: '5 月 2 日（五）11:00' }, title: { en: 'Post-window tax review', zh: '窗口后税务回顾' }, where: { en: 'Sterling office · Maya + James attending', zh: 'Sterling 办公室 · Maya + James 到场' }, status: { en: 'Scheduled', zh: '已安排' } },
  { when: { en: 'Wed · May 20 · 4:00 PM', zh: '5 月 20 日（三）16:00' }, title: { en: 'Q2 portfolio review', zh: 'Q2 投资组合回顾' }, where: { en: 'Zoom', zh: 'Zoom' }, status: { en: 'Scheduled', zh: '已安排' } },
  { when: { en: 'Wed · Jun 24 · 4:00 PM', zh: '6 月 24 日（三）16:00' }, title: { en: 'Mid-year tax planning checkpoint', zh: '年中税务规划节点' }, where: { en: 'Maya + James', zh: 'Maya + James' }, status: { en: 'Optional', zh: '可选' } },
]

interface FeeRow { label: TL; amount: string; status: TL; date: TL; note?: TL }
const FEES: FeeRow[] = [
  { label: { en: 'Initial planning fee', zh: '初始规划费' }, amount: '$5,800', status: { en: 'Paid', zh: '已支付' }, date: { en: 'Sep 30, 2025', zh: '2025 年 9 月 30 日' }, note: { en: 'One-time engagement fee · IPS + tax projection', zh: '一次性入项费 · IPS + 税务预测' } },
  { label: { en: 'Q4 2025 advisory fee', zh: '2025 Q4 顾问费' }, amount: '$4,950', status: { en: 'Paid', zh: '已支付' }, date: { en: 'Jan 04, 2026', zh: '2026 年 1 月 4 日' }, note: { en: '0.65% AUM · billed quarterly in arrears', zh: '0.65% AUM · 季度后置计费' } },
  { label: { en: 'Q1 2026 advisory fee', zh: '2026 Q1 顾问费' }, amount: '$5,170', status: { en: 'Paid', zh: '已支付' }, date: { en: 'Apr 04, 2026', zh: '2026 年 4 月 4 日' }, note: { en: 'Auto-debited from joint Schwab brokerage', zh: '从联合 Schwab 证券账户自动扣款' } },
  { label: { en: 'Custodian platform fee', zh: '托管平台费' }, amount: '$0', status: { en: 'Paid', zh: '已支付' }, date: { en: 'Apr 04, 2026', zh: '2026 年 4 月 4 日' }, note: { en: 'Schwab waived · advisor partnership tier', zh: 'Schwab 已豁免 · 顾问合作层级' } },
  { label: { en: 'Q2 2026 advisory fee (est.)', zh: '2026 Q2 顾问费（预估）' }, amount: '$5,420', status: { en: 'Pending', zh: '待支付' }, date: { en: 'Due Jul 03', zh: '7 月 3 日到期' }, note: { en: '0.65% AUM · post-window AUM update', zh: '0.65% AUM · 窗口后 AUM 更新' } },
  { label: { en: 'Tax-prep coordination (James)', zh: '税务申报协调（James）' }, amount: '$1,400', status: { en: 'Pending', zh: '待支付' }, date: { en: 'Due May 02', zh: '5 月 2 日到期' }, note: { en: 'Two-year projection update + 1099-B reconciliation', zh: '两年期预测更新 + 1099-B 对账' } },
  { label: { en: 'Annual NAPFA + CFP® dues (passed through at cost)', zh: 'NAPFA + CFP® 年度会费（按成本转嫁）' }, amount: '$0', status: { en: 'Paid', zh: '已支付' }, date: { en: 'Jan 02, 2026', zh: '2026 年 1 月 2 日' }, note: { en: 'Absorbed by Sterling Wealth Advisors — never billed to clients.', zh: '由 Sterling Wealth Advisors 自行承担——不会向客户收费。' } },
]

interface DocumentRow { name: TL; kind: TL; updated: TL; action?: boolean }
const DOCUMENTS: DocumentRow[] = [
  { name: { en: 'Investment policy statement (signed)', zh: '投资策略说明书（已签字）' }, kind: { en: 'PDF · 18 pages', zh: 'PDF · 18 页' }, updated: { en: 'Feb 09, 2026', zh: '2026 年 2 月 9 日' } },
  { name: { en: 'Sterling Wealth Advisors engagement letter', zh: 'Sterling Wealth Advisors 服务协议' }, kind: { en: 'PDF · 9 pages', zh: 'PDF · 9 页' }, updated: { en: 'Sep 28, 2025', zh: '2025 年 9 月 28 日' } },
  { name: { en: 'ADV Part 2A brochure (2025)', zh: 'ADV Part 2A 披露表（2025）' }, kind: { en: 'PDF · 36 pages', zh: 'PDF · 36 页' }, updated: { en: 'Sep 28, 2025', zh: '2025 年 9 月 28 日' } },
  { name: { en: '10b5-1 trading plan (Schwab)', zh: '10b5-1 交易计划（Schwab）' }, kind: { en: 'PDF · 12 pages', zh: 'PDF · 12 页' }, updated: { en: 'Apr 11, 2026', zh: '2026 年 4 月 11 日' } },
  { name: { en: 'DAF (donor-advised fund) contribution letter', zh: 'DAF 捐赠确认函' }, kind: { en: 'PDF · 3 pages', zh: 'PDF · 3 页' }, updated: { en: 'Apr 09, 2026', zh: '2026 年 4 月 9 日' } },
  { name: { en: 'Two-year tax projection (2026 + 2027)', zh: '两年期税务预测（2026 + 2027）' }, kind: { en: 'PDF · 11 pages', zh: 'PDF · 11 页' }, updated: { en: 'Feb 09, 2026', zh: '2026 年 2 月 9 日' } },
  { name: { en: '529 funding confirmation — Owen', zh: '529 注入确认 — Owen' }, kind: { en: 'PDF · 2 pages', zh: 'PDF · 2 页' }, updated: { en: 'Apr 14, 2026', zh: '2026 年 4 月 14 日' } },
  { name: { en: '529 funding confirmation — Emma', zh: '529 注入确认 — Emma' }, kind: { en: 'PDF · 2 pages', zh: 'PDF · 2 页' }, updated: { en: 'Apr 14, 2026', zh: '2026 年 4 月 14 日' } },
  { name: { en: 'Q1 2026 portfolio review (preliminary)', zh: '2026 Q1 投资组合回顾（初稿）' }, kind: { en: 'PDF · 14 pages', zh: 'PDF · 14 页' }, updated: { en: 'Apr 15, 2026', zh: '2026 年 4 月 15 日' } },
  { name: { en: 'Updated ADV Part 2A brochure (2026)', zh: '更新版 ADV Part 2A 披露表（2026）' }, kind: { en: 'PDF · 38 pages · ACTION', zh: 'PDF · 38 页 · 待处理' }, updated: { en: 'Apr 16, 2026', zh: '2026 年 4 月 16 日' }, action: true },
  { name: { en: 'Beneficiary forms — combined IRAs', zh: '受益人表格 — 合并 IRA' }, kind: { en: 'PDF · 4 pages', zh: 'PDF · 4 页' }, updated: { en: 'Mar 22, 2026', zh: '2026 年 3 月 22 日' } },
]

interface StrategyCard { label: TL; value: TL; sub: TL }
const STRATEGY_CARDS: StrategyCard[] = [
  { label: { en: 'Target asset allocation', zh: '目标资产配置' }, value: { en: '70 / 30 equity-bond · global diversified', zh: '70 / 30 股债 · 全球多元化' }, sub: { en: 'Rebalance band: ± 5% per sleeve before triggering action.', zh: '再平衡区间：每个篮子上下 5% 才触发动作。' } },
  { label: { en: 'Single-stock policy', zh: '单只股票政策' }, value: { en: 'Cap at 15% liquid NW within 24 months', zh: '24 个月内压到流动净资产 15% 以下' }, sub: { en: 'Currently 54% — sell-down underway via 10b5-1.', zh: '目前为 54%——通过 10b5-1 计划逐步卖出。' } },
  { label: { en: 'Tax bracket plan', zh: '税档规划' }, value: { en: 'Stay within 32% federal bracket in 2026; harvest in 2027 at 35%', zh: '2026 年保持在 32% 联邦税档；2027 年在 35% 处收割' }, sub: { en: 'Coordinated with James (EA) — quarterly check-in.', zh: '与 James（EA）协同——按季度检查。' } },
  { label: { en: 'Cash reserve', zh: '现金储备' }, value: { en: '9 months of household expenses + Q2 tax estimate', zh: '9 个月家庭开支 + Q2 预估税款' }, sub: { en: 'Held in 13- and 26-week T-bills + HYSA.', zh: '配置在 13 周与 26 周国债 + 高息储蓄账户。' } },
  { label: { en: 'Education funding', zh: '教育金' }, value: { en: '$120k 529 across two kids · age-based glide path', zh: '两个孩子合计 $120k 的 529 · 按年龄降权曲线' }, sub: { en: 'On track for 75% of 4-yr private; gap covered by Daniel’s deferred comp.', zh: '可覆盖 75% 的 4 年私立学费；缺口由 Daniel 的递延薪酬承担。' } },
  { label: { en: 'Estate and beneficiary', zh: '遗产与受益人' }, value: { en: 'Trust funded · all beneficiaries refreshed Mar 2026', zh: '信托已注资 · 所有受益人 2026 年 3 月已刷新' }, sub: { en: 'David (estate liaison) reviews annually in September.', zh: 'David（遗产联络）每年 9 月做年度审阅。' } },
]

interface StrategyStat { big: TL; small: TL }
const STRATEGY_STATS: StrategyStat[] = [
  { big: { en: '70 / 30', zh: '70 / 30' }, small: { en: 'Equity / bond target', zh: '股债目标' } },
  { big: { en: '15%', zh: '15%' }, small: { en: 'Single-stock cap (24-mo)', zh: '24 个月单只股票上限' } },
  { big: { en: '0.65%', zh: '0.65%' }, small: { en: 'Advisor fee · all-in', zh: '顾问费 · 全包' } },
  { big: { en: '24 mo', zh: '24 个月' }, small: { en: 'IPS revisit cadence', zh: 'IPS 重新审视周期' } },
]

interface MessageRow { speaker: TL; time: TL; body: TL; me?: boolean }
const MESSAGES: MessageRow[] = [
  { speaker: { en: 'Maya', zh: 'Maya' }, time: { en: 'Apr 16 · 4:12 PM', zh: '4 月 16 日 · 16:12' },
    body: { en: 'Updated ADV brochure is live in your Documents tab. Read it this week and flag any line you don’t understand — no question is too small. I’ll walk through it with you both on our 10am Wed call.',
            zh: '更新版 ADV 披露表已经在「文件」标签里了。这周读一读，任何不懂的一行都告诉我——再小的问题都不傻。我们周三早上 10 点的通话里会一起过一遍。' } },
  { speaker: { en: 'Daniel & Mira', zh: 'Daniel 和 Mira' }, time: { en: 'Apr 15 · 6:40 PM', zh: '4 月 15 日 · 18:40' }, me: true,
    body: { en: 'NEXA closed at $51.40 today, above our $46–52 ladder midpoint. Does the 10b5-1 plan still work the way we set it?',
            zh: 'NEXA 今天收 $51.40，高于我们 $46–52 价格阶梯的中点。我们设的 10b5-1 计划还按原来跑吗？' } },
  { speaker: { en: 'Maya', zh: 'Maya' }, time: { en: 'Apr 15 · 7:02 PM', zh: '4 月 15 日 · 19:02' },
    body: { en: 'Yes — the plan is price-laddered exactly so you don’t have to make this call. Above $52 we sell more, below $46 we slow down. No emotional override needed; that’s the whole point.',
            zh: '对——计划本来就是价格阶梯式的，正是为了让你们不用做这个判断。高于 $52 多卖，低于 $46 放慢。不用情绪化干预；这就是 10b5-1 的全部意义。' } },
  { speaker: { en: 'Daniel & Mira', zh: 'Daniel 和 Mira' }, time: { en: 'Apr 14 · 8:15 AM', zh: '4 月 14 日 · 08:15' }, me: true,
    body: { en: 'Quick one — Mira wants to know if the DAF contribution closes our 2026 charitable runway or if we can add later.',
            zh: '一个快问 —— Mira 想知道这次 DAF 捐赠是不是把我们 2026 年的慈善额度用完了，还是后面还能再加。' } },
  { speaker: { en: 'Maya', zh: 'Maya' }, time: { en: 'Apr 14 · 8:41 AM', zh: '4 月 14 日 · 08:41' },
    body: { en: 'Good catch. The $84k contribution uses about 47% of your 2026 ceiling at current AGI. We have room to add another in Q4 if NEXA pops past $58 — Maya’s rule of thumb is "donate the gain, not the cost basis." Adding it to the year-end harvest checklist.',
            zh: '好眼力。$84k 大约用掉了你们 2026 年额度的 47%（按当前 AGI 估）。如果 NEXA 在 Q4 涨过 $58，我们还能再加一笔——Maya 的口诀是「捐增值部分，别捐成本基础」。我已经把它加进年终收割清单。' } },
  { speaker: { en: 'Maya', zh: 'Maya' }, time: { en: 'Apr 09 · 5:55 PM', zh: '4 月 9 日 · 17:55' },
    body: { en: 'Q1 portfolio review draft is in. Two items worth flagging — the international sleeve is 1.8% under target and we have an unused harvest opportunity in your VXUS lots from 2024. Proposed action language going over tonight.',
            zh: 'Q1 投资组合回顾的草稿出了。有两项值得标注 —— 国际仓位低于目标 1.8%，2024 年那批 VXUS 还有一个没用上的税损收割机会。今晚把建议执行语言发过来。' } },
]

export default function Dashboard({ member, tenant, onSignOut }: Props) {
  const [tab, setTab] = useState<TabId>('journey')
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  function toggleLang() {
    const next: Lang = lang === 'zh' ? 'en' : 'zh'
    setLangState(next)
    try { window.localStorage.setItem('maya-lang', next) } catch {}
    document.documentElement.lang = next
    document.documentElement.setAttribute('data-lang', next)
  }

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  return (
    <div className="pv-shell">
      <Header current={tab} onTabChange={setTab} member={member} tenant={tenant} onSignOut={onSignOut} lang={lang} onToggleLang={toggleLang} />
      <main className="pv-main">
        <div className="pv-tabpanel">
          {tab === 'journey' && <JourneyView member={member} lang={lang} />}
          {tab === 'holdings' && <HoldingsView lang={lang} />}
          {tab === 'strategy' && <StrategyView lang={lang} />}
          {tab === 'schedule' && <ScheduleView lang={lang} />}
          {tab === 'fees' && <FeesView lang={lang} />}
          {tab === 'documents' && <DocumentsView lang={lang} />}
          {tab === 'messages' && <MessagesView lang={lang} />}
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  )
}

/* ─────────────── Header ─────────────── */
function Header({ current, onTabChange, member, onSignOut, lang, onToggleLang }: { current: TabId; onTabChange: (t: TabId) => void; member: PortalMember; tenant: PortalTenantIdentity | null; onSignOut: () => void; lang: Lang; onToggleLang: () => void }) {
  const firstName = (member.name || 'You').split(/\s+/)[0] || 'You'
  const initial = (member.name || 'Y').charAt(0).toUpperCase()
  return (
    <header className="pv-header">
      <div className="pv-header__top">
        <a className="pv-brand" href="/">
          <span className="pv-brand__mark">MS</span>
          <span className="pv-brand__text">
            <strong>Maya Sterling, CFP®</strong>
            <span className="pv-brand__kicker">{lang === 'zh' ? '纯佣金受托人 · CRD #312587' : 'Fee-Only Fiduciary · CRD #312587'}</span>
          </span>
        </a>
        <div className="pv-header__mid">
          <span className="pv-brand__tagline">{t(lang, 'header.tagline')}</span>
        </div>
        <div className="pv-header__right">
          <span className="pv-demo-pill" title={lang === 'zh' ? '公开演示 — 不需要登录。' : 'This is a public demo — no login required.'}>{t(lang, 'demo.pill')}</span>
          <button type="button" className="pv-lang-btn" onClick={onToggleLang} aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}>
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <a className="pv-contact" href="tel:+16505550244" aria-label="Call Maya">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z"/></svg>
            <span>{t(lang, 'call')}</span>
          </a>
          <UserChip name={firstName} initial={initial} onSignOut={onSignOut} lang={lang} />
        </div>
      </div>
      <nav className="pv-tabs" aria-label="Portal sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`pv-tab ${current === tab.id ? 'pv-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{t(lang, tab.i18nKey)}</span>
            {tab.badge && <span className="pv-tab__badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>
    </header>
  )
}

function UserChip({ name, initial, onSignOut, lang }: { name: string; initial: string; onSignOut: () => void; lang: Lang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])
  return (
    <div className="pv-user" ref={ref}>
      <button type="button" className="pv-user__btn" onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}>
        <span className="pv-user__avatar">{initial}</span>
        <span className="pv-user__name">{name}</span>
      </button>
      {open && (
        <div className="pv-user__menu" role="menu">
          <button type="button" className="pv-user__menu-danger" onClick={() => { setOpen(false); onSignOut() }}>{t(lang, 'back.site')}</button>
        </div>
      )}
    </div>
  )
}

const TABS: { id: TabId; i18nKey: TKey; badge?: number }[] = [
  { id: 'journey', i18nKey: 'tab.journey' },
  { id: 'holdings', i18nKey: 'tab.holdings' },
  { id: 'strategy', i18nKey: 'tab.strategy' },
  { id: 'schedule', i18nKey: 'tab.schedule', badge: 1 },
  { id: 'fees', i18nKey: 'tab.fees' },
  { id: 'documents', i18nKey: 'tab.documents', badge: 1 },
  { id: 'messages', i18nKey: 'tab.messages' },
]

/* ─────────────── Journey — vertical timeline ─────────────── */
function JourneyView({ member, lang }: { member: PortalMember; lang: Lang }) {
  const displayName = member.name || 'Daniel & Mira'
  const done = STAGES.filter(s => s.status === 'done').length
  const pct = Math.round(((done + 0.5) / STAGES.length) * 100)
  const nextTag = STAGES[done] ? tl(lang, STAGES[done].tag) : ''
  return (
    <div className="pv-journey">
      <header className="pv-journey__head">
        <span className="section-label">{t(lang, 'journey.eyebrow')}</span>
        <h1>{displayName}{t(lang, 'journey.title.suffix')}</h1>
        <p>{t(lang, 'journey.subtitle')}</p>
      </header>
      <div className="pv-progress">
        <div className="pv-progress__bar">
          <div className="pv-progress__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="pv-progress__meta">
          <span>{pct}{t(lang, 'journey.complete')}</span>
          <span>{done} {t(lang, 'journey.of')} {STAGES.length} {t(lang, 'journey.stages.done')} {nextTag}</span>
        </div>
      </div>

      <ol className="pv-timeline">
        {STAGES.map(stage => (
          <li key={stage.id} className={`pv-tl pv-tl--${stage.status}`}>
            <aside className="pv-tl__rail">
              <span className="pv-tl__date">{tl(lang, stage.dateLabel)}</span>
              <span className="pv-tl__dot">
                {stage.status === 'done'
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                  : stage.status === 'active'
                    ? <span className="pv-tl__pulse" />
                    : null}
              </span>
            </aside>
            <article className="pv-tl__card">
              {stage.accent && (
                <div className={`pv-tl__accent pv-tl__accent--${stage.accent}`} aria-hidden />
              )}
              <header className="pv-tl__cardhead">
                <span className="pv-tag">{tl(lang, stage.tag)}</span>
                {stage.status === 'active' && <span className="pv-tag pv-tag--active">{t(lang, 'journey.current')}</span>}
              </header>
              <h2 className="pv-tl__title">{tl(lang, stage.title)}</h2>
              {stage.summary && <p className="pv-tl__summary">{tl(lang, stage.summary)}</p>}
              {stage.content.map((block, i) => <ContentBlock key={i} block={block} lang={lang} />)}
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ContentBlock({ block, lang }: { block: StageContent; lang: Lang }) {
  switch (block.kind) {
    case 'info-grid': return (
      <dl className="pv-infogrid">
        {block.rows.map((r, i) => (
          <div key={i} className="pv-infogrid__row">
            <dt>{tl(lang, r.label)}</dt>
            <dd className={r.emphasis ? `pv-infogrid__value--${r.emphasis}` : ''}>{tl(lang, r.value)}</dd>
          </div>
        ))}
      </dl>
    )
    case 'positions': return (
      <div className="pv-embedded-listings">
        {block.items.map((p, i) => (
          <div key={i} className="pv-embedded-listing">
            <div className="pv-embedded-listing__monogram" aria-hidden>{p.ticker.slice(0, 4)}</div>
            <div className="pv-embedded-listing__body">
              {p.status && <span className="pv-tag pv-tag--active">{tl(lang, p.status)}</span>}
              <strong>{p.ticker}</strong>
              <span>{tl(lang, p.account)}</span>
              <span>{p.shares} · {lang === 'zh' ? '成本' : 'basis'} {p.basis}</span>
              <span className="pv-embedded-listing__price">{p.market}</span>
              {p.role && <span className="pv-embedded-listing__role">{tl(lang, p.role)}</span>}
            </div>
          </div>
        ))}
      </div>
    )
    case 'documents': return (
      <ul className="pv-docs">
        {block.items.map((d, i) => (
          <li key={i} className={`pv-docs__row ${d.action ? 'pv-docs__row--action' : ''}`}>
            <span className="pv-docs__icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            </span>
            <div className="pv-docs__body">
              <strong>{tl(lang, d.name)}</strong>
              <span>{tl(lang, d.size)}</span>
            </div>
            <a className="pv-docs__action" href="#">{d.action ? t(lang, 'review') : t(lang, 'open')}</a>
          </li>
        ))}
      </ul>
    )
    case 'checklist': return (
      <ul className="pv-check">
        {block.items.map((it, i) => (
          <li key={i} className={`pv-check__row ${it.done ? 'pv-check__row--done' : ''}`}>
            <span className="pv-check__mark" aria-hidden>
              {it.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
            </span>
            <div className="pv-check__body">
              <span>{tl(lang, it.label)}</span>
              {it.sub && <span className="pv-check__sub">{tl(lang, it.sub)}</span>}
            </div>
          </li>
        ))}
      </ul>
    )
    case 'actions': return (
      <div className="pv-actions">
        {block.buttons.map((b, i) => (
          <a key={i} className={`button ${b.primary ? 'button-primary' : 'button-secondary'}`} href={b.href || '#'}>{t(lang, b.labelKey)}</a>
        ))}
      </div>
    )
    case 'note': return (
      <div className="pv-note">
        <strong>{t(lang, block.titleKey)}</strong>
        <p>{tl(lang, block.body)}</p>
      </div>
    )
  }
}

/* ─────────────── Other tabs ─────────────── */
function HoldingsView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <div className="pv-section-head">
        <h2>{t(lang, 'holdings.title')}</h2>
        <p>{t(lang, 'holdings.subtitle')}</p>
      </div>
      <div className="pv-propgrid">
        {HOLDINGS.map((p, i) => (
          <article key={i} className={`pv-propcard ${p.accent ? 'pv-propcard--accent' : ''}`}>
            <div className="pv-propcard__monogram" aria-hidden>{p.ticker.slice(0, 4)}</div>
            <div className="pv-propcard__body">
              <span className={`pv-tag ${p.accent ? 'pv-tag--active' : ''}`}>{tl(lang, p.status)}</span>
              <h3>{p.ticker}</h3>
              <p className="pv-propcard__hood">{tl(lang, p.account)}</p>
              <div className="pv-propcard__specs">
                <span>{p.shares}</span><span>·</span>
                <span>{lang === 'zh' ? '成本' : 'basis'} {p.basis}</span>
              </div>
              <div className="pv-propcard__price">{p.market}</div>
              {p.role && <div className="pv-propcard__role">{tl(lang, p.role)}</div>}
              {p.notes && <p className="pv-propcard__notes">{tl(lang, p.notes)}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function StrategyView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <div className="pv-hoodhero pv-hoodhero--strategy" aria-hidden>
        <div className="pv-hoodhero__veil" />
        <div className="pv-hoodhero__caption">
          <span>{t(lang, 'strategy.title')}</span>
          <strong>{t(lang, 'strategy.hero.caption')}</strong>
        </div>
      </div>
      <div className="pv-section-head">
        <h2>{t(lang, 'strategy.title')}</h2>
        <p>{t(lang, 'strategy.subtitle')}</p>
      </div>
      <div className="pv-hoodstats">
        {STRATEGY_STATS.map((s, i) => (
          <div key={i} className="pv-hoodstat">
            <strong>{tl(lang, s.big)}</strong>
            <span>{tl(lang, s.small)}</span>
          </div>
        ))}
      </div>
      <div className="pv-hoodgrid">
        {STRATEGY_CARDS.map((c, i) => (
          <article key={i} className="pv-hoodcard">
            <div className="pv-hoodcard__body">
              <span className="pv-hoodcard__label">{tl(lang, c.label)}</span>
              <strong>{tl(lang, c.value)}</strong>
              <p>{tl(lang, c.sub)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function ScheduleView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <div className="pv-section-head">
        <h2>{t(lang, 'schedule.title')}</h2>
        <p>{t(lang, 'schedule.subtitle')}</p>
      </div>
      <ul className="pv-list">
        {APPOINTMENTS.map((a, i) => {
          const statusTxt = tl(lang, a.status)
          const isAction = a.status.en === 'Action needed'
          return (
            <li key={i} className="pv-row">
              <div className="pv-row__left">
                <span className="pv-row__when">{tl(lang, a.when)}</span>
                <strong>{tl(lang, a.title)}</strong>
                <span className="pv-row__sub">{tl(lang, a.where)}</span>
              </div>
              <div className="pv-row__right">
                <span className={`pv-tag ${isAction ? 'pv-tag--active' : ''}`}>{statusTxt}</span>
                <a className="button button-secondary button-sm" href="#">{t(lang, 'addcal')}</a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function FeesView({ lang }: { lang: Lang }) {
  const paid = FEES.filter(p => p.status.en === 'Paid').length
  return (
    <div className="pv-stack">
      <div className="pv-section-head">
        <h2>{t(lang, 'fees.title')}</h2>
        <p>{paid} {t(lang, 'fees.paid')} &middot; {FEES.length - paid} {t(lang, 'fees.pending')}</p>
      </div>
      <ul className="pv-list">
        {FEES.map((p, i) => {
          const isPaid = p.status.en === 'Paid'
          const noteStr = p.note ? tl(lang, p.note) : null
          return (
            <li key={i} className="pv-row">
              <div className="pv-row__left">
                <strong>{tl(lang, p.label)}</strong>
                <span className="pv-row__sub">{tl(lang, p.date)}{noteStr ? ` · ${noteStr}` : ''}</span>
              </div>
              <div className="pv-row__right">
                <strong className="pv-row__amount">{p.amount}</strong>
                <span className={`pv-tag ${isPaid ? '' : 'pv-tag--active'}`}>{tl(lang, p.status)}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DocumentsView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <div className="pv-section-head">
        <h2>{t(lang, 'documents.title')}</h2>
        <p>{t(lang, 'documents.subtitle')}</p>
      </div>
      <ul className="pv-list">
        {DOCUMENTS.map((d, i) => {
          const updatedLabel = lang === 'zh' ? '更新于' : 'updated'
          return (
            <li key={i} className={`pv-row ${d.action ? 'pv-row--flag' : ''}`}>
              <div className="pv-row__left">
                <strong>{tl(lang, d.name)}</strong>
                <span className="pv-row__sub">{tl(lang, d.kind)} · {updatedLabel} {tl(lang, d.updated)}</span>
              </div>
              <div className="pv-row__right">
                <a className="button button-secondary button-sm" href="#">{t(lang, 'download')}</a>
                {d.action && <a className="button button-primary button-sm" href="#">{t(lang, 'reviewsign')}</a>}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function MessagesView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <div className="pv-section-head">
        <h2>{t(lang, 'messages.title')}</h2>
        <p>{t(lang, 'messages.subtitle')}</p>
      </div>
      <div className="pv-thread">
        {MESSAGES.map((m, i) => (
          <div key={i} className={`pv-msg ${m.me ? 'pv-msg--you' : ''}`}>
            <div className="pv-msg__head"><strong>{tl(lang, m.speaker)}</strong><span>{tl(lang, m.time)}</span></div>
            <p>{tl(lang, m.body)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="pv-footer">
      <div className="pv-footer__inner">
        <span>{lang === 'zh' ? 'Sterling Wealth Advisors' : 'Sterling Wealth Advisors'}</span>
        <span>SEC RIA · CRD #312587</span>
        <span>&copy; 2026</span>
      </div>
    </footer>
  )
}
