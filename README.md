# Opus 5.5 视频提示词站

在线访问：https://jinshiyu914.github.io/opus5-5-video-prompt-website/

用 Claude Opus 5.5 写代码做视频的中文浏览站，汇集三个子站：

| 子站 | 目录 | 源仓库 |
|---|---|---|
| Lemo-Opuscar 风格图鉴 | `lemo-opuscar/` | https://github.com/lemomo-ai/lemo-opuscar （MIT） |
| awesome-opus5-5-videos | `awesome-opus5-5-videos/` | https://github.com/yihui-dev/awesome-opus5-5-videos （MIT） |
| Opus 5.5 Video Prompts | `opus-video-prompts/` | https://github.com/joeseesun/opus-video-prompts （无 LICENSE，版权归原作者） |

首页 `index.html` 读取 `sites.json` 渲染入口卡片。

## 添加一个新子站

1. 新建文件夹，例如 `my-site/`，放入一个完整的静态站（`index.html` 等）。所有路径都要用相对路径（比如 `data/x.json`、`img/a.jpg`），不要以 `/` 开头。
2. 可选：在子站 `index.html` 的 `<body>` 后面加上统一顶栏 `<div class="hubbar">…</div>`（可从现有子站复制），并把新子站的链接加进其他子站的顶栏。
3. 在 `sites.json` 里加一条：
```json
{"slug":"my-site","title":"标题","desc":"一句话介绍","cover":"my-site/img/cover.jpg","counts":["N 条内容"],"source":"https://github.com/owner/repo","license":"许可说明"}
```
4. 提交并 push 到 main，GitHub Pages 会自动更新。

## 性能

面向网速较慢的大陆网络：每个子站首屏只加载一个很小的索引 JSON，详情和全文搜索数据按需加载，图片懒加载，请求超过 15 秒会显示错误和重试按钮。
