# server/
> L2 | 父级: ../CLAUDE.md

成员清单
backlinks.ts: 本地操作日志、站点说明和提交状态边界，无网络依赖
browsers.ts: 扫 socket 目录，握手，清死 socket
cli.ts: 打包成单文件时的入口：node thundermcp.mjs mcp | setup [...] ；Chrome 拉起 native host 时第一个参数是插件 origin
host.ts: native host：Chrome 拉起（stdio 4 字节小端长度 + JSON），本地 unix socket 给 MCP 连（换行分隔 JSON）。只转发，不懂业务。
install.ts: 生成 Native Messaging 清单与启动脚本，绑定扩展固定 ID。
instructions.md: Agent 操作与复用规则，构建时嵌入 MCP
jev-confidence.ts: 把握度三档闸门和可撤回步骤的试错。思路参考 ~/Github/jev-mcp 的 decide/gating.ts（gateChoice）和 runner/rollback.ts（rollbackPlan / hadEffect）。
jev-task.ts: 观察与执行循环，按信心与停止条件交还控制
jev-tools.ts: find / jev_find / jev_check 的逻辑：本地关键词粗筛 → 一次 Jev 提问 → 只认树里真实存在的元素。
jev.ts: 模型服务适配，读取配置并提取原文填写候选
mcp.ts: stdio 工具编排，统一浏览器调用与本地记录
output.ts: MCP 工具输出的体积预算与「连续调用提醒器」，全部同步纯逻辑。
paths.ts: 定义本机 socket 路径和 Chrome Native Messaging 目录。
registry.ts: 浏览器注册表：一个 socket 一个浏览器。fs.watch 目录变化，每次调用前再补扫一次（合并成一次扫描）。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
