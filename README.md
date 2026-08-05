# 喷油器工程计算平台

> 作者：LU Xu

一个**渐进式 Web 应用（PWA）**，集成三个喷油器工程计算模块，支持离线使用，可安装到桌面 / 手机主屏幕。

---

## 功能模块

| 模块 | 功能 |
|------|------|
| 🔩 孔径 / 流量系数计算 | 双模计算 + 一维参数扫描图表 + 双参数 2D Map 热力图（含等值线、SVG/Excel 导出）|
| 📊 流量范围可视化 | Qhyd 理论计算、多曲线动态扫描、图表叠加对比、PNG 导出 |
| 🔄 发动机参数转换 | kg/h ↔ mg/str，CA ↔ µs 四向单位换算 |

## 在线使用

部署到 GitHub Pages 后，访问：

```
https://<你的用户名>.github.io/<仓库名>/
```

## 本地运行

直接用浏览器打开 `index.html` 即可（无需服务器）。

> **注意**：Service Worker（离线缓存）需要在 `https://` 或 `localhost` 下才能激活。
> 本地调试建议用：
> ```bash
> npx serve .
> # 或
> python3 -m http.server 8080
> ```

## 部署到 GitHub Pages（推荐）

1. 在 GitHub 新建仓库（Public）
2. 将本项目文件推送到 `main` 分支：
   ```bash
   git init
   git add .
   git commit -m "init: 喷油器工程计算平台 PWA"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```
3. 进入仓库 → **Settings → Pages → Source** 选择 **GitHub Actions**
4. 等待 Actions 自动部署（约 1 分钟），即可访问在线地址

## PWA 安装

- **桌面 Chrome / Edge**：地址栏右侧点击「安装」图标
- **iOS Safari**：分享菜单 → 「添加到主屏幕」
- **Android Chrome**：弹出安装横幅 → 点击安装

## 文件结构

```
.
├── index.html          # 主应用（所有逻辑内联，无外部依赖）
├── manifest.json       # PWA 清单
├── sw.js               # Service Worker（离线缓存）
├── icons/
│   ├── icon-192.png    # 应用图标 192×192
│   └── icon-512.png    # 应用图标 512×512
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 自动部署
└── README.md
```

## 技术栈

- 纯 HTML / CSS / JS（零构建依赖）
- [Chart.js 4.4.1](https://www.chartjs.org/)（CDN，离线缓存）
- [SheetJS / xlsx 0.18.5](https://sheetjs.com/)（CDN，Excel 导出）
- Google Fonts Inter + JetBrains Mono（CDN，离线缓存）
- PWA：Web App Manifest + Service Worker（Cache-First 策略）
