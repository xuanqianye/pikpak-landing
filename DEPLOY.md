# PikPak / Feetworld 落地页 — 部署与维护文档

> 用途：给海外访客看的极简引导页，引导点击 **OPEN PikPak** 跳转到推广链接。
> 技术栈：Hexo 7.3.0（静态站点生成器）+ Cloudflare Pages（Git 集成自动部署）+ 自有域名 feetworld.cc
> 最后更新：2026-10-09

---

## 一、线上地址与关键账号

| 项 | 值 |
|---|---|
| 线上地址（apex） | https://feetworld.cc |
| 线上地址（www） | https://www.feetworld.cc |
| Cloudflare Pages 项目名 | `pikpak-landing` |
| GitHub 仓库 | `xuanqianye/pikpak-landing`（分支 `main`） |
| Cloudflare 账号 ID | `3a4f3c51777bd916bb80e202947bd84e` |
| 域名注册商 | Namesilo（域名所有权/续费仍在此） |
| 域名 NS 现由 | Cloudflare 托管（`gracie.ns.cloudflare.com` / `rocky.ns.cloudflare.com`） |
| PikPak 推广链接 | https://mypikpak.com/s/VP3V3ddFhPQOmLUf5IV7Ue3Go2 |

---

## 二、本地工程位置与结构

源文件根目录：**`E:\pikpak-landing`**

```
E:\pikpak-landing
├── _config.yml              # 站点配置：标题、描述、PikPak 链接、文案变量
├── package.json             # Hexo 依赖声明（必须含 "hexo": {"version":"7.3.0"} 字段）
├── package-lock.json
├── wrangler.toml            # Cloudflare 配置（备用，Git 集成下基本不用）
├── README.md                # 工程说明
├── themes\landing\
│   ├── layout\index.ejs     # ★ 页面结构/文案模板（最常改）
│   └── source\
│       ├── css\style.css    # ★ 页面样式（颜色/字体/布局）
│       └── favicon.svg      # 浏览器标签页脚印图标
├── source\                  # Hexo 默认空目录（本工程未使用，可忽略）
├── public\                  # 构建产物（自动生成，勿手改）
├── node_modules\            # 依赖库（勿动）
└── db.json                  # Hexo 缓存（勿动）
```

**能改的**：`_config.yml`、`themes/landing/layout/index.ejs`、`themes/landing/source/css/style.css`、`themes/landing/source/favicon.svg`
**不能手改的**：`public/`、`node_modules/`、`db.json`（都是自动生成/依赖）

---

## 三、本地构建与预览

### 构建（生成 public/）

在 `E:\pikpak-landing` 目录下，用 **Git Bash** 执行（注意：npx 在 Git Bash 下有时会失效，直接用 node 调用最稳）：

```bash
node node_modules/hexo/bin/hexo generate
```

> 提示：本机 node 在 PATH 里即可；若 `node` 命令找不到，用完整路径
> `C:/Users/47282/.workbuddy/binaries/node/versions/22.22.2-6/node.exe node_modules/hexo/bin/hexo generate`

构建成功会输出 `INFO  Generated: public/index.html` 等，且 `public/` 下应有 `index.html` 与 `css/style.css`、`favicon.svg`。

### 本地预览（不依赖线上）

```bash
cd E:\pikpak-landing\public
python -m http.server 8771 --bind 127.0.0.1
# 浏览器打开 http://127.0.0.1:8771/
```

---

## 四、推送到 GitHub

### 首次配置（已做过，备忘）

```bash
cd /e/pikpak-landing
git remote add origin https://github.com/xuanqianye/pikpak-landing.git
git push -u origin main
```

首次推送会弹出 GitHub 登录（Git Credential Manager，选"用浏览器授权"即可），授权后代码上传。

### 日常推送

```bash
cd /e/pikpak-landing
git add -A
git commit -m "描述这次改了什么"
git push origin main
```

> 注意：本机直连 GitHub 上传通道偶尔会卡顿（偶发挂起）。若前台 push 长时间无响应，改用后台跑或直接在本地终端/GitHub Desktop 点 Push。

---

## 五、Cloudflare Pages 自动部署配置

Cloudflare 通过**连接 GitHub 仓库**实现：每次 `git push` 到 `main` 自动重新构建并上线。

构建参数（在 Cloudflare 控制台 **Workers 和 Pages → pikpak-landing → 设置** 里）：

| 字段 | 值 |
|---|---|
| Production branch | `main` |
| Framework preset | **None**（务必选 None，不要选 Hexo） |
| Build command | `npm install && npx hexo generate` |
| Build output directory | `public` |
| 环境变量（advanced） | `NODE_VERSION` = `20` |

> 要点：Framework 选 None，构建命令必须由我们自己写全（`npm install` 装依赖 + `hexo generate` 生成）。选了 Hexo 预设反而会被套上 Cloudflare 自己的命令导致失败。

---

## 六、域名接入流程（feetworld.cc，已做完，备忘）

### 1. Cloudflare 添加站点
- 控制台 **Add a Site** → 输入 `feetworld.cc` → 选 **Free** 计划
- 它会扫描现有 DNS 记录。**本域名扫描结果只有 2 条 A 记录**（`feetworld.cc` 和 `www` 都指向 `177.2.18.5`，即原美足站服务器），**没有任何 MX / TXT**（说明没有在用的邮箱，改 NS 不会切断邮件）。

### 2. 去 Namesilo 改 NS
- Namesilo → Domain Manager → 点 `feetworld.cc` → **NameServers → Edit**
- 把原来的 3 条 `ns1/2/3.dnsowl.com` **全部删除**
- 填入 Cloudflare 给的 2 条：
  ```
  gracie.ns.cloudflare.com
  rocky.ns.cloudflare.com
  ```
- 第 3 个输入框留空或删掉，点 **Save**

### 3. 激活
- 回 Cloudflare 点 **立即检查名称服务器**，或等 Cloudflare 邮件通知
- NS 全球传播一般 10 分钟 ~ 2 小时（本例约 1 分钟就生效）；可用 https://www.whatsmydns.net 查 `feetworld.cc` 的 NS 类型确认

### 4. 添加自定义域
- **Workers 和 Pages → pikpak-landing → 自定义域**
- 依次添加 `feetworld.cc` 和 `www.feetworld.cc`
- 添加时若提示"记录已存在/是否替换"（因为 apex 已有 A 记录指向 `177.2.18.5`）→ **确认替换**，即覆盖原美足站解析
- 添加后 Cloudflare 自动建 DNS + 签免费 SSL（1~5 分钟变「活动」）

> 从此 `feetworld.cc` 指向 PikPak 落地页，原美足站（服务器仍在，只是域名不指过去）正式下线。

---

## 七、日常改文案 / 样式的标准流程

1. 改源文件：
   - 改文字/按钮链接 → 编辑 `themes/landing/layout/index.ejs` 或直接改 `_config.yml` 里的变量
   - 改颜色/字体/布局 → 编辑 `themes/landing/source/css/style.css`
2. 本地构建验证：`node node_modules/hexo/bin/hexo generate`，看 `public/index.html` 是否正确
3. 提交并推送：`git add -A && git commit -m "..." && git push origin main`
4. 等 1~2 分钟，Cloudflare 自动重建，线上更新

### 当前页面内容速查
- 顶部大标题（CSS 转大写显示）：`FEETWORLD`
- 正文 1：`Your destination for foot-focused photos and videos, showcasing warm, artistic foot portraits.`
- 正文 2：`The website is not fully launched yet - please visit our PikPak cloud drive files first！`
- 按钮：`OPEN PikPak →` → 跳转 `https://mypikpak.com/s/VP3V3ddFhPQOmLUf5IV7Ue3Go2`
- 浏览器图标：脚印（favicon.svg）

---

## 八、踩过的坑与注意事项

1. **Hexo 命令未注册**：`package.json` 必须含 `"hexo": {"version": "7.3.0"}` 字段，否则 `hexo generate` 不被识别。
2. **0 篇文章不生成首页**：Hexo 7 把首页生成拆成独立包 `hexo-generator-index`；且需在 `_config.yml` 设 `index_generator: { per_page: 0 }`（0 篇文章时也能强制产出首页）。
3. **EJS 模板原样输出不渲染**：需安装 `hexo-renderer-ejs`，否则 `index.ejs` 会被当静态文件拷贝、变量不替换。
4. **Git Bash 下 npx 失效**：改用 `node node_modules/hexo/bin/hexo` 直接调用。
5. **YAML 描述含冒号要加引号**：`_config.yml` 里 `title` / `description` 等若含 `:`（如 `Feetworld: ...`），整行必须用双引号包住，否则 YAML 解析报错、构建失败。
6. **CSS 4 小时缓存导致"裸版"页面**：Cloudflare 给静态资源 `Cache-Control: max-age=14400`。浏览器会缓存旧 `style.css`，HTML 更新后排版错乱（表现为黑字左上、无样式）。**已修复**：`index.ejs` 里 CSS 引用加 `?v=<%= Date.now() %>` 时间戳，每次部署 URL 都变，浏览器必定重新拉取。若访客仍看到旧版，让他 `Ctrl+Shift+R` 硬刷新即可。
7. **GitHub 推送在本机环境偏慢/偶发挂起**：前台带超时容易失败，改用后台不限时推送或本地终端直接推。
8. **国内访问可能被墙**：`feetworld.cc` 域名历史做过成人站，从国内直连可能打不开（DNS 污染/拦截）。**不影响海外目标访客**；自己验证挂代理看即可。
9. **GitHub 仓库红叉**：早期留了一个 `.github/workflows/pages-deploy.yml`（需 Cloudflare API Token 才能跑，本工程走 Git 集成用不到），会导致每次 push 出现红色失败 Action。不影响部署，可在 GitHub 网页删除该文件清理。

---

## 九、可选优化（未做，按需）

- **SEO 统一**：`feetworld.cc` 与 `www.feetworld.cc` 当前显示同一页，建议用 Cloudflare Redirect Rules 把 apex 301 跳转到 `www`（避免搜索引擎判重复内容）。
- **清理 GitHub Actions 红叉**：见第八条第 9 点。
