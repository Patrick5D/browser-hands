# 轻量外链记录

BACKLINKS_DIR 指定本机目录；未设置时不写文件。
`backlinks` 工具提供 get/start/save/status。
start 为标签绑定产品、站点和身份别名。
工具调用与 quick_task 内部浏览器动作自动追加到 runs/YYYY-MM-DD.jsonl。
文件日期使用 America/Los_Angeles，时间戳使用 UTC。
日志只写动作类型、ref、耗时、结果与错误码。
不写字段值、脚本、页面正文、上传字节或原始错误消息。
日志写入失败不重放动作、不阻断浏览器结果。

sites/<domain>.json 保存公共操作说明与表单基线。
read_page 同次扫描读取主文档原生表单字段。
指纹比较字段类型、名称、标签、必填、长度、文件类型与选项。
输入值、选中状态、查询参数不进入指纹。
首次观察建立基线；后续变化只写 lastObserved。
变化不覆盖已验证基线；重新验证后再更新记录。
不比较 iframe、自定义控件、收费文案和条款。
结构匹配只支持复用定位，不授权最终提交。

submissions.csv 追加状态，最后一条产品/站点记录为当前状态。
只有 Agent 明确调用 status 才改变业务状态。
支持 filled_not_submitted/submitted/live/failed/skipped。
历史补录标记 conversation_backfill，不伪造逐动作时间。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
