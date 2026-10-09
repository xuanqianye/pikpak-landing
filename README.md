# PikPak 引导页（Hexo + Cloudflare Pages）

面向海外访客的单页引导站，最终 CTA 跳转到 PikPak 推广链接。黄色小红书风视觉，纯静态，部署到 Cloudflare Pages。

## 1. 本地预览

```bash
npm install
npm run server      # 本地 http://localhost:4000 预览
npm run build       # 生成静态文件到 public/
```

## 2. 必填占位符（改 `_config.yml`）

| 字段 | 含义 | 当前占位 |
|---|---|---|
| `url` | 你要绑定的顶级域名 | `https://yourdomain.com` |
| `pikpak_url` | **你的 PikPak 推广/邀请链接** | `https://mypikpak.com/ref/REPLACE_ME` |
| `cta_text` / `hero_title` / `hero_subtitle` 等 | 文案 | 可改 |

> ⚠️ 部署前务必把 `pikpak_url` 换成你真实的推广链接，否则按钮会跳到占位地址。

## 3. 部署到 Cloudflare Pages（两种方式，任选其一）

### 方式 A：命令行直接上传（无需 GitHub）
```bash
npm install
npx hexo generate
npx wrangler pages deploy public --project-name pikpak-landing
```
首次会让你登录 Cloudflare 并创建项目。

### 方式 B：GitHub 自动部署
1. 把本仓库 push 到 GitHub（main 分支）。
2. Cloudflare Pages 控制台 → Create a project → 连接该 GitHub 仓库。
3. 构建设置：Build command `npm run build`，Build output `public`。
4. 在仓库 `Settings → Secrets` 添加 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。
5. 之后每次 push 自动部署（`.github/workflows/pages-deploy.yml`）。

## 4. 绑定顶级域名

1. Cloudflare Pages 项目 → Settings → Custom domains → 输入你的域名（如 `yourdomain.com`）。
2. 按提示到你的域名注册商（Namesilo 等）把该域名的 DNS 改为 Cloudflare 提供的记录（或把 NS 转到 Cloudflare）。
3. 等待签发免费 SSL 证书（自动），即可用自定义域名访问。
