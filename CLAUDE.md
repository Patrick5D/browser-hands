# Browser Hands — notes for coding agents

Chrome extension (`extension/`) + local MCP server (`server/`).

## Rules
- Behaviour of each module is defined by `specs/<module>.md` and `test/unit/<module>.test.ts`. Change the spec in the same commit when behaviour changes.
- Run `bun run check` before handing in; it must be all green.
- End-to-end tests live in `test/` and need a real Chrome: `bun run test:e2e`.
- Do not copy code from other browser extensions. Contributions must be your own work under the MIT license.
- User-facing text is English.

## 本地 fork 扩展
server/backlinks.ts 提供轻量外链记录，配置 BACKLINKS_DIR 后启用。
server/CLAUDE.md、extension/CLAUDE.md、specs/CLAUDE.md、test/unit/CLAUDE.md 为模块入口。
work/backlinks/ 保存本机站点说明、操作日志与提交台账，不提交 Git。
目录操作复用入口为 backlinks 工具；规则见 server/instructions.md。
