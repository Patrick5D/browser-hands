# extension/
> L2 | 父级: ../CLAUDE.md

成员清单
abort.js: 中止相关的三个小工具：统一的「已停止」错误、可停点检查、可被信号打断的等待。
background-tab.js: 后台标签支持：焦点模拟 + 临时静音、隐藏标签唤醒、最小化窗口下的点击拦截。
background.js: 保活：只靠 native messaging 连接 + 30 秒 alarm 看门狗。没有 offscreen、没有心跳、没有固定 sleep。
connect.html: connect 界面资源
connect.js: connect 浏览器连接能力
debugger.js: 调试器挂载管理：全扩展唯一直接调用 chrome.debugger.* 的地方。
dispatch.js: 扩展命令路由，统一会话准入与动作守卫
dom-input.js: 调试器实在挂不上时的兜底：在页面里派发模拟事件（isTrusted 为 false，部分网站不认）。
errors.js: 错误归一模块：把各种来源的异常统一成「错误码 + 说明 + 建议」三件套。
frames.js: iframe 支持：每个 frame 各扫一次，编号带 frame 前缀（主 frame 不带，如 `f2:ref_5`）；
gif-recorder.js: gif-recorder：按会话录动作帧，导出时交给 offscreen 合成页做成 GIF，再下载或拖放到页面。
gif.js: gif.js 0.2.0 - https://github.com/jnordberg/gif.js
gif.worker.js: gif.worker.js 0.2.0 - https://github.com/jnordberg/gif.js
guard.js: 执行器第 2 步：记下调用开始时标签所在的网站，执行前 / 点击按下前 / 截图前再查（含正在跳转的目标），变了报 navigated_away。
icons/: 扩展图标资源
indicator-page.js: 注入网页的「操作指示器」：边缘光晕 + Stop 按钮 + 点击前的瞄准光标。
indicator.js: 指示器的后台一侧 + 调用取消。
input.js: 真实输入：经 CDP Input 域发鼠标 / 键盘事件；调试器挂不上或设置为页面内模拟时退到 dom-input
keys.js: 按键数据模块：按公开标准（W3C UI Events code/key、Windows VK、Apple 默认键绑定）按规则生成两张查找表。
logs.js: 标签页控制台 / 网络日志：懒开启收集，按标签分桶，换站清空，空闲自动停止。
manifest.json: manifest 浏览器连接能力
navigate.js: navigate 工具：打开网址 / 后退 / 前进，按 force 处理离开确认框，等页面切换与加载后汇报。
observe.js: jev_observe：给 server 端 jev_task 循环的结构化观察。主 frame + 各 iframe 各观察一次，iframe 的编号带前缀（跟 read_page 一致）。
offscreen.html: offscreen 界面资源
offscreen.js: GIF 合成页脚本：由 offscreen.html 以普通脚本加载（排在 gif.js 之后），不含 import / export。
options.html: options 界面资源
options.js: 设置页：打开时读一次，点保存时写一次；不轮询。key 只写不读（host 只回「是否已设置」）。
page-scan.js: 页内扫描与原生表单填写，产生无字段值结构快照
page-tools.js: page-tools：javascript_tool / resize_window / file_upload / upload_image 的扩展侧执行，
popup.html: popup 界面资源
popup.js: 状态小窗：打开时问后台要一次会话列表，点"全部停止"才再发消息；不轮询。
redact.js: 脱敏与文本清理：纯函数，无副作用。行为见 specs/redact.md。
screenshot.js: 截图模块：可视区截图、区域放大、出图尺寸求解、坐标上下文与批次、按会话缓存图片。
sessions.js: 会话 ↔ 标签组。一切建组/改组都排进 serial 队列；靠 Chrome 事件自愈，不轮询。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
