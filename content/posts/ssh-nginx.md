---
title: SSH与Nginx从零到实战
slug: SSH与Nginx从零到实战
ascii_slug: ssh-nginx
categories:
  - 方法
tags:
  - Linux
  - 运维
date: 2026-09-08 14:35:00
---

# SSH 与 Nginx 从零到实战

> 面向完全没有 Linux 运维经验的初学者。建议准备一台自己的 Linux 虚拟机（Ubuntu 22.04/24.04 均可），所有带 `sudo` 的命令都在这台实验机中执行。不要直接在生产服务器上照抄实验命令。

---

## 0. 你将学会什么

学完本教程，你应该能够：

1. 理解服务器、端口、进程、服务、域名之间的关系。
2. 使用 SSH 进行远程登录、上传文件、执行命令和端口转发。
3. 使用密钥登录替代密码登录，并完成基本的 SSH 安全加固。
4. 安装、配置和管理 Nginx。
5. 让 Nginx 提供静态网页、反向代理 Node.js/Python 等后端服务。
6. 配置多个域名、HTTPS、访问日志和常见安全策略。
7. 按照日志和网络连接逐层排查“访问不了网站”的问题。

---

## 1. 先建立一张总地图

### 1.1 几个必须知道的词

| 词 | 白话解释 | 例子 |
|---|---|---|
| 客户端 | 发起连接的一方 | 你的电脑、手机、浏览器 |
| 服务器 | 提供服务的一方 | 云服务器、家里的 Linux 主机 |
| IP 地址 | 设备在网络中的地址 | `203.0.113.10`、`192.168.1.20` |
| 端口 | 一台机器上某个服务的“门牌号” | SSH 常用 `22`，HTTP `80`，HTTPS `443` |
| 进程 | 正在运行的程序实例 | `nginx`、`sshd`、`python app.py` |
| 服务 | 可以被系统启动/停止/重启的后台程序 | `nginx.service` |
| 域名 | 便于记忆的名字，通过 DNS 指向 IP | `www.example.com` |
| 协议 | 双方约定的通信规则 | SSH、HTTP、TLS |

一次典型的网站访问大致是：

<div class="mermaid">
sequenceDiagram
    participant B as 浏览器
    participant D as DNS
    participant N as Nginx服务器
    participant A as 后端应用
    B->>D: 查询 example.com 的 IP
    D-->>B: 返回服务器 IP
    B->>N: TCP 连接 443，发送 HTTPS 请求
    N->>N: 匹配 server/location 规则
    N-->>B: 直接返回静态文件，或
    N->>A: 反向代理到 127.0.0.1:8000
    A-->>N: 返回应用响应
    N-->>B: 返回最终响应
</div>

SSH 是“管理员进入服务器”的通道，Nginx 是“用户访问网站”的入口。两者经常同时出现：你用 SSH 登录服务器，再用 Nginx 发布网站。

### 1.2 推荐的实验环境

- Linux：Ubuntu 22.04/24.04 LTS。
- Windows：PowerShell 自带 OpenSSH 客户端；也可以使用 WSL。
- 虚拟机：VirtualBox、VMware、Hyper-V 都可以。
- 云服务器：选择按小时计费的最低配置，实验结束后关机或删除，避免持续扣费。

在 Linux 中查看系统信息：

```bash
cat /etc/os-release
uname -a
```

在 Windows PowerShell 中确认 SSH 客户端：

```powershell
ssh -V
```

---

## 2. Linux 命令最低基础

SSH 和 Nginx 都离不开 Linux 命令。先掌握以下最小集合：

```bash
pwd                         # 当前目录
ls -lah                     # 查看文件（包含隐藏文件、大小、人类可读格式）
cd /etc/nginx               # 进入目录
cd ..                       # 返回上一级
mkdir -p ~/lab/site         # 创建目录
touch ~/lab/site/index.html # 创建空文件
cp a.txt b.txt              # 复制
mv old.txt new.txt          # 移动或改名
rm file.txt                 # 删除文件（务必确认路径）
cat file.txt                # 输出小文件
less /var/log/nginx/access.log  # 分页查看大文件，按 q 退出
grep -n "error" app.log    # 搜索文本
tail -f app.log             # 持续追踪日志，Ctrl+C 退出
```

### 2.1 权限的直觉理解

运行 `ls -l` 可能看到：

```text
-rw-r--r-- 1 alice www-data 1234 Sep  8 10:00 index.html
```

开头的 `-rw-r--r--` 分三组：所有者、所属组、其他用户。`r` 是读，`w` 是写，`x` 是执行/进入目录。

常用命令：

```bash
whoami                      # 当前用户
id                          # 用户、组及数字 ID
sudo command                # 临时以管理员身份执行一条命令
chmod 644 index.html        # 文件：所有者可读写，其他人只读
chmod 755 script.sh         # 脚本：所有者可读写执行，其他人可读执行
chown -R www-data:www-data /var/www/example
```

原则：应用只拿到它真正需要的权限；不要习惯性使用 `chmod -R 777`。

---

## 3. SSH 是什么

SSH（Secure Shell）是一个加密的远程管理协议。它通常运行在 TCP `22` 端口上，但管理员也可以改成别的端口。

### 3.1 SSH 连接发生了什么

<div class="mermaid">
flowchart LR
    C[你的电脑\nSSH客户端] -->|TCP 22| S[服务器\nsshd服务]
    S --> K{验证身份}
    K -->|密码| P[密码认证]
    K -->|私钥签名| Q[公钥认证]
    P --> T[建立加密会话]
    Q --> T
    T --> R[远程Shell/命令/文件传输/端口转发]
</div>

加密会话在认证前后都会保护通信内容。服务器还会把自己的主机指纹交给客户端，客户端将它记录在 `~/.ssh/known_hosts` 中，用来识别“这是不是以前见过的那台服务器”。

### 3.2 第一次登录

命令格式：

```bash
ssh 用户名@服务器IP
# 例如
ssh ubuntu@203.0.113.10
```

如果 SSH 使用非 22 端口：

```bash
ssh -p 2222 ubuntu@203.0.113.10
```

第一次连接会出现主机指纹确认。先通过云厂商控制台或服务器管理员核对指纹，再输入 `yes`。登录后执行：

```bash
whoami
hostname
pwd
```

退出远程会话：

```bash
exit
# 或按 Ctrl+D
```

### 3.3 Windows PowerShell 示例

```powershell
ssh ubuntu@203.0.113.10
ssh -p 2222 ubuntu@203.0.113.10
```

Windows OpenSSH 默认读取 `C:\Users\你的用户名\.ssh\` 下的配置和密钥。路径中不要把私钥发给任何人。

---

## 4. SSH 密钥登录：最重要的技能

### 4.1 公钥和私钥

- 私钥：留在你的电脑上，像银行卡密码一样保密；通常是 `id_ed25519`。
- 公钥：复制到服务器，可以公开；通常是 `id_ed25519.pub`。
- 登录时，客户端用私钥完成签名，服务器用公钥验证签名。私钥本身不会通过网络发送。

推荐 Ed25519 算法：

```bash
ssh-keygen -t ed25519 -C "你的设备名-2026"
```

一路回车会使用默认路径；强烈建议为私钥设置一个口令（passphrase）。查看文件：

```bash
ls -l ~/.ssh/id_ed25519*
```

### 4.2 把公钥安装到服务器

Linux/macOS：

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@203.0.113.10
```

Windows PowerShell 没有 `ssh-copy-id` 时，可先查看公钥：

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

然后用密码登录服务器，把整行内容追加到服务器的 `~/.ssh/authorized_keys`：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo '粘贴你的公钥整行内容' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

注意：不要折行，不要多复制空格，不要覆盖已有的 `authorized_keys`。

测试密钥登录：

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@203.0.113.10
```

只有确认密钥登录成功后，才考虑关闭密码登录，避免把自己锁在服务器外。

### 4.3 使用 SSH config 简化命令

在本地创建 `~/.ssh/config`：

```sshconfig
Host lab-server
    HostName 203.0.113.10
    User ubuntu
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
    ServerAliveInterval 60
```

以后只需：

```bash
ssh lab-server
```

权限建议：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### 4.4 ssh-agent：避免反复输入私钥口令

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add -l
```

Windows PowerShell（管理员终端）：

```powershell
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

---

## 5. SSH 的日常用途

### 5.1 远程执行一条命令

```bash
ssh lab-server 'df -h && systemctl is-active nginx'
```

引号里的命令在服务器执行，不会打开交互式 Shell。

### 5.2 复制文件：scp

上传：

```bash
scp ./index.html lab-server:/tmp/index.html
scp -r ./site/ lab-server:/tmp/site/
```

下载：

```bash
scp lab-server:/var/log/nginx/error.log ./error.log
```

### 5.3 更适合大量文件：rsync

```bash
rsync -avz --delete ./site/ lab-server:/var/www/example/
```

`--delete` 会删除目标目录中源目录没有的文件，第一次使用前先去掉它或加 `--dry-run` 预览。

### 5.4 本地端口转发

假设服务器上的后端只监听 `127.0.0.1:8000`，外网不能直接访问。将远程端口映射到本地：

```bash
ssh -N -L 9000:127.0.0.1:8000 lab-server
```

然后在本地浏览器打开 `http://127.0.0.1:9000`。`-N` 表示只转发、不执行远程命令。

### 5.5 跳板机（堡垒机）

```bash
ssh -J jump-user@jump.example.com app-user@10.0.0.8
```

这会先连接跳板机，再连接内网应用服务器。生产环境建议把跳板机、密钥和权限纳入统一管理。

### 5.6 常见 SSH 报错

| 报错 | 常见原因 | 排查命令 |
|---|---|---|
| `Connection refused` | 端口没有服务监听或端口写错 | `sudo ss -lntp` |
| `Connection timed out` | 防火墙、安全组、路由不通 | `nc -vz IP 22` |
| `Permission denied (publickey)` | 用户名错、私钥错、公钥未安装、权限不对 | `ssh -vvv lab-server` |
| `REMOTE HOST IDENTIFICATION HAS CHANGED` | 主机重装导致指纹变化，或存在中间人风险 | 核对指纹后再处理 `known_hosts` |
| `Too many authentication failures` | agent 提供了太多密钥 | 配置 `IdentitiesOnly yes` |

详细调试：

```bash
ssh -vvv lab-server
```

先看客户端输出，再看服务器端 `/var/log/auth.log`（Debian/Ubuntu）或 `journalctl -u ssh`。

---

## 6. SSH 安全加固

先备份配置：

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F)
```

编辑：

```bash
sudo nano /etc/ssh/sshd_config
```

推荐逐项理解后再启用：

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
AllowUsers ubuntu
```

先检查语法，再重载：

```bash
sudo sshd -t
sudo systemctl reload ssh
sudo systemctl status ssh --no-pager
```

安全操作顺序：

1. 保留当前 SSH 窗口不要关闭。
2. 新开一个终端，用密钥登录测试。
3. 确认新窗口成功后，才关闭旧窗口。
4. 修改云平台安全组和服务器防火墙，只放行必要来源 IP。

UFW 示例：

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

不要把 SSH 端口改掉就以为完成了安全加固；密钥、最小权限、更新、日志监控和备份更重要。

---

## 7. Nginx 是什么

Nginx（读作 engine-x）是高性能 Web 服务器和反向代理。它可以：

- 直接返回 HTML、CSS、JavaScript、图片等静态文件。
- 把请求转发到后端应用（反向代理）。
- 处理 HTTPS/TLS 证书。
- 根据域名、路径、请求头做路由。
- 记录访问日志、限制请求速率和大小。

![Nginx 标志](/images/posts/ssh-nginx/nginx-logo.svg)

### 7.1 正向代理与反向代理

- 正向代理：客户端主动指定代理，代理代表客户端访问互联网。
- 反向代理：用户只看到 Nginx，Nginx 代表服务器把请求转发给内部应用。

<div class="mermaid">
flowchart LR
    U[用户浏览器] -->|HTTPS :443| N[Nginx\n公网入口]
    N -->|静态资源| F[/var/www/example/]
    N -->|HTTP :8000\n仅本机可见| A[后端应用]
    A --> DB[(数据库)]
</div>

---

## 8. 安装和管理 Nginx

Ubuntu/Debian：

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable --now nginx
sudo systemctl status nginx --no-pager
```

查看版本和编译参数：

```bash
nginx -v
nginx -V
```

服务管理：

```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl is-active nginx
```

检查端口：

```bash
sudo ss -lntp | grep -E ':80|:443'
curl -I http://127.0.0.1
```

浏览器访问服务器 IP，看到欢迎页即表示基础安装完成。

---

## 9. 发布第一个静态网站

### 9.1 创建网站文件

```bash
sudo mkdir -p /var/www/example
sudo tee /var/www/example/index.html > /dev/null <<'EOF'
<!doctype html>
<html lang="zh-CN">
  <meta charset="utf-8">
  <title>我的第一个 Nginx 网站</title>
  <h1>部署成功</h1>
  <p>这个页面由 Nginx 返回。</p>
</html>
EOF
sudo chown -R www-data:www-data /var/www/example
```

### 9.2 编写 server 配置

Ubuntu 的推荐结构是：`/etc/nginx/sites-available/` 保存配置，`sites-enabled/` 放启用配置的软链接。

```bash
sudo nano /etc/nginx/sites-available/example
```

写入：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    root /var/www/example;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

启用并检查：

```bash
sudo ln -s /etc/nginx/sites-available/example /etc/nginx/sites-enabled/example
sudo nginx -t
sudo systemctl reload nginx
```

如果还没有 DNS，可以在本地电脑的 hosts 文件中临时映射（仅用于测试）：

```text
服务器IP example.com www.example.com
```

Windows 文件位置：`C:\Windows\System32\drivers\etc\hosts`；编辑器需要管理员权限。

### 9.3 配置块如何匹配

Nginx 配置从外到内大致是：

```text
main
└── events
└── http
    └── server（按 IP/端口/Host 选择）
        └── location（按 URL 路径选择）
```

常见 `location`：

```nginx
location = /healthz { return 200 "ok\n"; }
location /static/ { root /var/www/example; }
location /api/ { proxy_pass http://127.0.0.1:8000; }
```

---

## 10. 反向代理到后端应用

先启动一个仅监听本机的测试服务。以 Python 为例：

```bash
mkdir -p ~/hello-app
cd ~/hello-app
cat > app.py <<'PY'
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = b"hello from backend\\n"
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
PY
python3 app.py
```

另开一个 SSH 窗口测试：

```bash
curl -i http://127.0.0.1:8000
```

把 Nginx 的 `server` 改成：

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

配置含义：

- `proxy_pass`：上游应用地址。
- `Host`：把原始域名传给应用。
- `X-Real-IP`：传递用户 IP。
- `X-Forwarded-Proto`：告诉应用用户原来使用 HTTP 还是 HTTPS。

生产环境不要让调试服务器直接暴露在公网；让后端监听 `127.0.0.1` 或内网地址，由 Nginx 作为统一入口。

### 10.1 `proxy_pass` 斜杠陷阱

下面两者路径结果不同：

```nginx
location /api/ { proxy_pass http://127.0.0.1:8000; }
location /api/ { proxy_pass http://127.0.0.1:8000/; }
```

请求 `/api/users` 时，第一种通常把 `/api/users` 原样传给上游；第二种会把匹配到的 `/api/` 替换掉，传成 `/users`。遇到 404 时优先确认这一点。

---

## 11. HTTPS：让网站拥有锁形图标

### 11.1 前置条件

- 域名的 A/AAAA 记录已经指向服务器。
- 服务器的 `80` 和 `443` 端口可达。
- Nginx 已经能通过 HTTP 正常访问。

### 11.2 使用 Certbot（Let's Encrypt）

Ubuntu 示例：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

按提示填写邮箱、同意条款，并选择 HTTP 自动跳转 HTTPS。测试自动续期：

```bash
sudo certbot renew --dry-run
sudo systemctl list-timers | grep certbot
```

验证：

```bash
curl -I https://example.com
```

不要把证书私钥提交到 Git；常见位置是 `/etc/letsencrypt/live/域名/`，权限应保持严格。

---

## 12. 日志、监控和排错方法

### 12.1 Nginx 日志

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -n 100 --no-pager
```

HTTP 状态码速查：

| 状态码 | 含义 | 常见原因 |
|---|---|---|
| 200 | 成功 | 正常响应 |
| 301/302 | 重定向 | HTTP 跳 HTTPS、路径规范化 |
| 403 | 禁止访问 | 文件权限、目录索引关闭、规则拒绝 |
| 404 | 找不到 | 文件路径、`location`、后端路由不对 |
| 413 | 请求体过大 | 上传限制过小，调整 `client_max_body_size` |
| 499 | 客户端提前断开 | 用户取消、网络不稳、上游响应慢 |
| 502 | 网关错误 | 后端没启动、端口错、协议不匹配 |
| 504 | 网关超时 | 后端处理太慢或网络阻塞 |

### 12.2 “网站打不开”的固定排查顺序

1. DNS：`nslookup example.com`，确认解析到预期 IP。
2. 网络和端口：`nc -vz example.com 80`、`nc -vz example.com 443`。
3. Nginx 进程：`systemctl is-active nginx`。
4. 配置语法：`sudo nginx -t`。
5. 本机 HTTP：`curl -I http://127.0.0.1`。
6. Host 路由：`curl -I -H 'Host: example.com' http://127.0.0.1`。
7. 后端端口：`sudo ss -lntp`、`curl -i http://127.0.0.1:8000`。
8. 日志：同时观察 `access.log` 和 `error.log`。
9. 防火墙/云安全组：确认放行规则和来源 IP。

### 12.3 502 Bad Gateway 专项

```bash
sudo ss -lntp | grep 8000
curl -v http://127.0.0.1:8000
sudo tail -n 50 /var/log/nginx/error.log
```

可能原因：

- 应用进程已经退出。
- Nginx 配置写成了错误端口或错误 Unix socket。
- 应用只监听 IPv6，而 Nginx 访问 IPv4（或反过来）。
- SELinux/AppArmor、容器网络或权限阻止连接。

---

## 13. 让后端成为 systemd 服务

手动运行 `python3 app.py`，SSH 退出后程序可能终止。创建服务：

```ini
# /etc/systemd/system/hello-app.service
[Unit]
Description=Hello demo application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/hello-app
ExecStart=/usr/bin/python3 /home/ubuntu/hello-app/app.py
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

加载和启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now hello-app
sudo systemctl status hello-app --no-pager
sudo journalctl -u hello-app -f
```

服务进程使用专门的低权限用户，避免用 root 启动应用。

---

## 14. 有用的 Nginx 配置片段

### 14.1 上传大小和超时

```nginx
client_max_body_size 20m;
proxy_connect_timeout 5s;
proxy_read_timeout 60s;
```

数值应按业务需要设置，不能盲目调得很大。

### 14.2 静态资源缓存

```nginx
location ~* \\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800, immutable";
}
```

只有带内容哈希的文件名才适合长期 `immutable`，否则更新文件后用户可能继续使用旧缓存。

### 14.3 健康检查

```nginx
location = /healthz {
    access_log off;
    add_header Content-Type text/plain;
    return 200 "ok\\n";
}
```

---

## 15. 一套完整练习路线

### 练习 A：SSH 基础

1. 创建 Ubuntu 虚拟机并记下 IP。
2. 从 Windows PowerShell 用密码登录。
3. 创建 Ed25519 密钥并复制公钥。
4. 用 `~/.ssh/config` 改成 `ssh lab-server` 登录。
5. 用 `scp` 上传一个文本文件，再下载回来。

验收：新开终端，不输入服务器密码也能登录；`ssh -vvv` 能看到使用了公钥认证。

### 练习 B：静态网站

1. 安装 Nginx。
2. 在 `/var/www/example` 放置 `index.html`。
3. 创建 `server` 配置并启用。
4. 执行 `nginx -t` 后 reload。
5. 用 `curl -I` 检查状态码，用浏览器查看页面。

验收：访问日志出现一条 200；故意改错文件名后能定位 404 原因。

### 练习 C：反向代理

1. 启动监听 `127.0.0.1:8000` 的 Python 服务。
2. Nginx 将 `/` 代理到该服务。
3. 停止后端，观察 Nginx 返回 502。
4. 查看错误日志，恢复后端并确认 200。

验收：公网只开放 80/443，8000 端口不能从外部访问。

### 练习 D：HTTPS 与安全

1. 绑定一个测试域名。
2. 使用 Certbot 获取证书。
3. 测试 HTTP 自动跳转 HTTPS。
4. 确认密钥登录后关闭密码登录。
5. 配置 UFW，只保留 SSH、HTTP、HTTPS。

验收：`curl -I https://域名` 成功；重启服务器后 Nginx 和后端自动恢复。

---

## 16. 速查表

### SSH

```bash
ssh user@host
ssh -p PORT user@host
ssh -i KEY user@host
ssh -vvv user@host
scp FILE user@host:/path/
rsync -avz DIR/ user@host:/path/
ssh -N -L LOCAL:DEST_HOST:DEST_PORT user@host
```

### Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl reload nginx
sudo ss -lntp
curl -I http://127.0.0.1
sudo tail -f /var/log/nginx/error.log
```

### 记住的原则

- 先确认“请求到没到服务器”，再讨论应用代码。
- 修改 Nginx 前先 `nginx -t`，修改 SSH 前先保留一个可用会话。
- 先做最小可用配置，再一次只改一个变量。
- 日志是证据；不要只凭浏览器提示猜原因。
- 私钥不上传、不粘贴到聊天、不提交 Git。
- 让后端只监听本机或内网，由 Nginx 统一接收公网流量。

## 17. 延伸阅读

- [OpenSSH 官方手册](https://www.openssh.com/manual.html)
- [ssh-keygen 手册](https://man.openbsd.org/ssh-keygen)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Let's Encrypt 文档](https://letsencrypt.org/docs/)
- [SSH 协议栈示意图（Wikimedia Commons）](https://upload.wikimedia.org/wikipedia/commons/6/6f/SSH_protocol_stack.svg)

> 建议学习方式：每看完一个小节就亲手执行命令，记录“预期结果、实际结果、错误信息、解决方法”。运维能力来自可重复的验证，而不是背命令。
