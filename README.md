# PikPak 引导页（Hexo + Cloudflare Pages）

面向海外访客的单页引导站，最终 CTA 跳转到 PikPak 推广链接。小红书风视觉，纯静态，部署到 Cloudflare Pages。

已填好的内容：
- `pikpak_url` = `https://mypikpak.com/s/VP3V3ddFhPQOmLUf5IV7Ue3Go2`（CTA 目标）
- `url` = `https://feetworld.cc`（用户确认：直接覆盖原美足站，用 apex）
- 文案为英文（海外访客）

---

## 1. 本地预览

```bash
npm install
npm run server      # 本地 http://localhost:4000 预览
npm run build       # 生成静态文件到 public/（= hexo generate）
```

---

## 2. 部署到 Cloudflare Pages（Git 集成，自动更新）

> 选这条路：以后改文案/图片，只要 `git push`，Cloudflare 自动重新构建上线，**不需要 API Token**。

### 第 1 步：把代码推到 GitHub
- 在 github.com 新建一个**空仓库**（不要勾选 README/.gitignore）。
- 本仓库已 `git init -b main` 并打过提交，只需加远程并推送：
  ```bash
  cd E:\pikpak-landing
  git remote add origin https://github.com/<你的用户名>/<仓库名>.git
  git push -u origin main
  ```
- 小白更省事：装 **GitHub Desktop** → File → Add Local Repository → 选 `E:\pikpak-landing` → Publish to GitHub。

### 第 2 步：Cloudflare Pages 连接仓库
1. Cloudflare 控制台 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
2. 授权 GitHub，选中刚才的仓库。
3. 构建设置（关键）：
   - **Framework preset**：选 `None`（我们用自定义命令）
   - **Build command**：`npm install && npx hexo generate`
   - **Build output directory**：`public`
   - **Node.js version**：`20`（Settings → Builds & deployments 里可改）
4. 点 **Save and Deploy**。约 1–2 分钟出 `https://<项目名>.pages.dev` 预览链接。

### 第 3 步：绑定域名 feetworld.cc（覆盖原美足站）
> ⚠️ 已确认：apex（feetworld.cc）+ www 将改指本引导页，原美足站不再保留。

1. Cloudflare Pages 项目 → **Settings → Custom domains** → 添加 `feetworld.cc` 和 `www.feetworld.cc`。
2. Cloudflare 会要求把 **feetworld.cc 的 NS（域名服务器）转到 Cloudflare**（去 Namesilo → feetworld.cc 的 Nameservers 改成 Cloudflare 给的两条）。
3. NS 生效（几分钟~24h）后，Cloudflare 自动签发免费 SSL，两个域名即可访问本引导页。

---

## 3. 备选：命令行直接上传（不用 GitHub，但要 Token）

```bash
npm install
npx hexo generate
npx wrangler pages deploy public --project-name pikpak-landing
```
首次会让你登录 Cloudflare。这种方式不会自动随 push 更新，需手动重跑。
