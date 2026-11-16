/**
 * [INPUT]: 读取 BACKLINKS_DIR；接收 MCP 操作元数据与无字段值的表单结构。
 * [OUTPUT]: 提供 BacklinkStore，追加日志、读写站点说明与提交台账。
 * [POS]: 本地记录边界；不调用浏览器、模型或网络，不推断提交成功。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createHash, randomUUID } from 'node:crypto'

const csv = (s: unknown) => '"' + String(s ?? '').replaceAll('"', '""') + '"'
export function siteOf(url: string) {
  const u = new URL(url.includes('://') ? url : `https://${url}`)
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Use an HTTP(S) site.')
  if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(u.hostname) || u.hostname.includes('..')) throw new Error('Invalid site hostname.')
  return u.hostname.toLowerCase()
}
function route(url: string) { try { const u = new URL(url); return u.origin + u.pathname } catch { return '' } }
export class BacklinkStore {
  readonly run = randomUUID()
  private contexts = new Map<number, { domain: string; product?: string; profile?: string }>()
  constructor(readonly root = process.env.BACKLINKS_DIR) {}
  private dir(name: string) { const p = join(this.root!, name); mkdirSync(p, { recursive: true, mode: 0o700 }); return p }
  private path(domain: string) { return join(this.dir('sites'), `${siteOf(domain)}.json`) }
  get(domain: string): any {
    if (!this.root) return null
    const p = this.path(domain)
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
  }
  save(domain: string, patch: Record<string, unknown>) {
    if (!this.root) throw new Error('BACKLINKS_DIR is not configured.')
    const value = { ...this.get(domain), ...patch, domain: siteOf(domain), updatedAt: new Date().toISOString() }
    writeFileSync(this.path(domain), JSON.stringify(value, null, 2) + '\n', { mode: 0o600 })
    return value
  }
  context(tabId: number, domain: string, product?: string, profile?: string) {
    this.contexts.set(tabId, { domain: siteOf(domain), product, profile })
    return this.get(domain)
  }
  event(method: string, args: any, durationMs: number, error?: unknown, result?: any) {
    if (!this.root) return
    try {
      if (method === 'navigate' && /^https?:/.test(args?.url)) {
        const previous = this.contexts.get(args.tabId)
        this.contexts.set(args.tabId, { ...previous, domain: siteOf(args.url) })
      }
      const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
      // 不保存输入正文、脚本、上传字节、页面正文或原始错误消息。
      const row = { at: new Date().toISOString(), run: this.run, ...this.contexts.get(args?.tabId ?? result?.tabId), tool: method,
        action: args?.action, ref: args?.ref, durationMs: Math.round(durationMs), result: error ? 'error' : 'ok',
        errorCode: error ? String((error as any)?.code || /^([a-z_]+):/.exec(String((error as any)?.message))?.[1] || 'tool_error') : undefined,
        url: method === 'navigate' ? route(args?.url) : undefined,
        taskStatus: result?.status, steps: Array.isArray(result?.steps) ? result.steps.length : undefined,
        costUsd: result?.cost_usd }
      appendFileSync(join(this.dir('runs'), `${day}.jsonl`), JSON.stringify(row) + '\n', { mode: 0o600 })
    } catch { /* 记录失败不能重放或中断已完成的浏览器动作。 */ }
  }
  inspect(tabId: number, url: string, schema: any) {
    try { return this.inspectForm(tabId, url, schema) } catch { return "\n[Saved site] Local record unavailable; browser read succeeded." }
  }
  private inspectForm(tabId: number, url: string, schema: any) {
    if (!this.root || !schema || !/^https?:/.test(url)) return ''
    const domain = siteOf(url)
    const old = this.get(domain)
    const fingerprint = createHash('sha256').update(JSON.stringify(schema)).digest('hex')
    const sameRoute = old?.formUrl === route(url)
    const match = sameRoute && old?.fingerprint === fingerprint
    const first = !old?.fingerprint
    // 变化只写 lastObserved，不自动覆盖已验证基线。
    this.save(domain, first ? { formUrl: route(url), fingerprint, form: schema } : { lastObserved: { url: route(url), fingerprint, matches: match } })
    const ctx = this.contexts.get(tabId)
    this.contexts.set(tabId, { ...ctx, domain })
    return `\n[Saved site] ${domain}: ${first ? 'baseline captured' : match ? 'form structure matches' : 'form changed or different route; inspect changed fields'}. Main-document native fields only; this does not verify pricing or terms.\n${JSON.stringify(old?.recipe ?? {})}`
  }
  status(domain: string, product: string, status: string, note = '', landingUrl = '') {
    if (!this.root) throw new Error('BACKLINKS_DIR is not configured.')
    this.dir('runs')
    const path = join(this.root, 'submissions.csv')
    if (!existsSync(path)) writeFileSync(path, 'at,product,site,status,note,landing_url\n', { mode: 0o600 })
    // 追加状态历史；同一产品和站点的最后一行代表当前状态。
    appendFileSync(path, [new Date().toISOString(), product, siteOf(domain), status, note, route(landingUrl)].map(csv).join(',') + '\n')
    const entry = { at: new Date().toISOString(), status, note, landingUrl: route(landingUrl) }
    this.save(domain, { submissions: { ...this.get(domain)?.submissions, [product]: entry } })
    return { domain: siteOf(domain), product, ...entry }
  }
}
