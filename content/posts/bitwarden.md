---
title: 自建Bitwarden密码管理器
tags:
  - Linux
  - Github
categories:
  - 软件
date: 2026-02-11T23:15:40.000Z
slug: 自建Bitwarden密码管理器
ascii_slug: bitwarden
---
**自建Bitwarden密码管理，推荐选择开源项目：[Vaultwarden](https://github.com/dani-garcia/vaultwarden)，轻量级、开源且免费，适合个人用户和小团队使用，部署简单，资源占用少。对于大多数用户来说，足以满足密码管理需求。**

![Vaultwarden 自托管架构](/images/posts/bitwarden/architecture.svg)

部署非常简单，尤其是通过Docker，只需少量的配置就可以启动服务，安全稳定又可靠。而且 Bitwarden 大部分高级付费功能可以通过手动配置或第三方集成来免费实现。

## 安装教程：

### 步骤 1：获取一台轻量级的VPS 【[点击前往](https://www.vultr.com/?ref=7045490)】，已经有vps的可以跳过，系统推荐选择Debian 11，地区选择就近原则。

SSH远程连接工具，可以选择开源的WindTerm 【[点击下载](https://github.com/kingToolbox/WindTerm)】  

### 步骤 2: 更新系统

首先，更新你的系统以确保所有软件包都是最新的：

```bash
sudo apt update && sudo apt upgrade -y
```

### 步骤 3: 安装 Docker 和 Docker Compose

Vaultwarden使用Docker来运行，因此我们需要安装Docker和Docker Compose。

1. 安装Docker 和 Docker Compose 命令：

```bash
curl -fsSL https://get.docker.com  | bash && sudo curl -L "https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-$(uname  -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose && docker-compose --version
```

**完成安装后：**

Docker和Docker Compose就都安装好了，你可以通过以下命令验证安装：

- **Docker版本检查**：`docker --version`
- **Docker Compose版本检查**：`docker-compose --version`

### 步骤 3: 一键部署 Vaultwarden ，含 WebSocket 端口

```bash
docker run -d --name vaultwarden -v /vw-data/:/data/ --restart unless-stopped -p 8080:80 -p 3012:3012 vaultwarden/server:latest
```

安装以后，就可以通过ip:8080 访问你的 Bitwarden密码管理面板，ip:3012 是你的 WebSocket 通信链接 ,但现在它是http协议，为了更安全，我们需要部署下HTTPS加密的访问协议。 我们可以通过Nginx Proxy Manager进行配置SSL和Nginx反代

### 步骤 4：一键安装 Nginx Proxy Manager

```bash
docker run -d \
  --name=npm \
  -p 81:81 \
  -p 443:443 \
  -v /home/npm/data:/data \
  -v /home/npm/letsencrypt:/etc/letsencrypt \
  --restart=always \
  jc21/nginx-proxy-manager:latest
```

安装成功后进入**Nginx Proxy Manager 管理界面：`http://<你的服务器IP>:81`**

用户：admin@example.com

密码：admin

登入后记得先修改密码！然后在里面绑定你自己的域名并安装SSL证书，都是可视化操作，非常简单，可以看零度的视频教程演示！记得开放下端口：

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 3012/tcp
```

### 步骤 5 ：安装 Bitwarden 的客户端 或 浏览器插件你可以通过以下链接下载 **Bitwarden** 的官方客户端和浏览器插件：

#### 1. **Bitwarden 桌面客户端**

- **Windows**: [点击下载](https://bitwarden.com/download/#downloads-desktop) 
- **macOS**: [点击下载](https://apps.apple.com/us/app/bitwarden/id1352778147?mt=12&browser=macos) 
- **Linux**: [点击下载](https://bitwarden.com/download/#downloads-desktop) 

#### 2. **Bitwarden 移动客户端**

- **iOS（App Store）**: [点击下载](https://apps.apple.com/us/app/bitwarden-password-manager/id1137397744) 
- **Android（Google Play）**: [点击下载](https://play.google.com/store/apps/details?id=com.x8bit.bitwarden&pli=1) 

#### 3. **Bitwarden 浏览器插件**

- **Chrome**: [点击下载](https://chromewebstore.google.com/detail/bitwarden-密码管理器/nngceckbapebfimnlniiiahkandclblb?browser=chrome) 
- **Firefox**: [点击下载](https://addons.mozilla.org/en-US/firefox/addon/bitwarden-password-manager/?browser=firefox) 
- **Microsoft Edge**: [点击下载](https://microsoftedge.microsoft.com/addons/detail/bitwarden-free-password-ma/cnjalbhlkpghadgdpnddpjlldadblomo) 
- **其它浏览器**: [点击下载](https://bitwarden.com/download/#downloads-web-browser) 

#### 4. **Bitwarden 命令行工具 (CLI)**

- **CLI 下载**: [点击下载](https://bitwarden.com/download/#downloads-command-line-interface) 

你可以根据你的设备和浏览器选择相应的版本下载并安装。所有这些链接均为官方提供的下载链接，确保软件的安全和可靠性。
