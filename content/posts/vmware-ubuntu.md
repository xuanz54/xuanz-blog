---
title: 详尽指南：在VMware中安装和配置Ubuntu
tags:
  - Linux
categories:
  - 方法
date: 2024-08-02T00:01:00.000Z
slug: 详尽指南：在VMware中安装和配置Ubuntu
ascii_slug: vmware-ubuntu
---

![VMware 中运行 Ubuntu 的系统层次](/images/posts/vmware-ubuntu/layers.svg)

## 前言

### 1. 什么是Linux？

Linux是一种开源的操作系统，由Linus Torvalds于1991年首次发布。它基于Unix操作系统，并以其强大的稳定性、安全性和灵活性著称。Linux被广泛应用于服务器、桌面计算机、移动设备和嵌入式系统中。

### 2. 常见的Linux发行版

Linux发行版是将Linux内核与其他软件（如系统工具、图形用户界面、应用程序等）打包在一起的操作系统。以下是几种常见的Linux发行版及其优缺点：

#### 2.1 Ubuntu

**优点：**
- **易于使用**：Ubuntu具有用户友好的图形界面，适合Linux初学者。
- **广泛的社区支持**：拥有大量的用户和开发者，遇到问题时可以很容易地找到解决方案。
- **定期更新**：每六个月发布一个新的版本，提供最新的软件和功能。

**缺点：**
- **系统资源占用**：相比一些轻量级发行版，Ubuntu对系统资源的需求更高。

#### 2.2 CentOS

**优点：**

- **稳定性高**：基于Red Hat Enterprise Linux（RHEL），适用于企业级应用。
- **长期支持**：每个版本都有长达十年的支持期，适合生产环境。

**缺点：**
- **软件包较旧**：为了保证稳定性，CentOS的软件包版本较旧，不适合需要最新软件的用户。

#### 2.3 Fedora

**优点：**
- **前沿技术**：提供最新的技术和软件，适合开发者和技术爱好者。
- **社区驱动**：由社区主导开发，开放性强。

**缺点：**
- **更新频繁**：版本更新周期短（约六个月），可能不适合需要长期稳定的用户。

#### 2.4 Debian

**优点：**
- **稳定可靠**：经过严格测试的软件包，适合服务器和生产环境。
- **丰富的软件库**：拥有超过50000个软件包，几乎可以满足所有需求。

**缺点：**
- **安装和配置较复杂**：相比Ubuntu，Debian的安装和配置过程对新手来说不够友好。

### 3. 为什么选择Ubuntu？

对于初学者和普通用户来说，Ubuntu是一个理想的选择。其易用性、广泛的社区支持以及定期的更新使其成为个人和企业用户的首选。此外，Ubuntu还提供了丰富的软件资源和文档支持，帮助用户更快地上手和解决问题。

## 1. 在VMware中安装Ubuntu

### 1.1 准备工作

在开始之前，需要准备以下材料：
- VMware Workstation
- Ubuntu ISO镜像文件，可以从[Ubuntu官网](https://ubuntu.com/download)下载
- Xshell 7和Xftp 7

### 1.2 创建新的虚拟机

1. 打开VMware Workstation，点击“新建虚拟机”（New Virtual Machine）。
2. 选择“典型（推荐）”（Typical (recommended)），点击“下一步”。
3. 选择“安装程序光盘映像文件（iso）”（Installer disc image file (iso)），然后点击“浏览”并选择之前下载的Ubuntu ISO文件，点击“下一步”。
4. 选择操作系统版本。一般来说，VMware会自动检测Ubuntu版本。如果未能自动检测，请手动选择对应版本。
5. 为虚拟机命名并选择安装位置，点击“下一步”。
6. 设置虚拟机的磁盘大小。默认值一般为20GB，可以根据需要调整。选择“将虚拟磁盘存储为单个文件”，点击“下一步”。
7. 点击“完成”，创建虚拟机。

### 1.3 安装Ubuntu

1. 启动新创建的虚拟机，Ubuntu安装程序将自动启动。
2. 选择安装语言，点击“安装Ubuntu”。
3. 选择键盘布局，点击“继续”。
4. 选择安装类型。可以选择“正常安装”或“最小安装”，根据需求选择即可。
5. 在“其他选项”中，选择是否下载更新和第三方软件，点击“继续”。
6. 选择安装类型。一般选择“擦除磁盘并安装Ubuntu”，点击“安装现在”。
7. 确认分区设置，点击“继续”。
8. 设置时区，点击“继续”。
9. 设置用户名、计算机名和密码，点击“继续”。
10. 等待安装完成，点击“重新启动”即可完成安装。

## 2. Ubuntu基本配置

### 2.1 更新系统

安装完成后，首先需要更新系统软件包：

```bash
sudo apt update
sudo apt upgrade -y
```

### 2.2 安装常用软件

可以根据需要安装一些常用的软件，如Git、Vim、Curl等：

```bash
sudo apt install git vim curl -y
```

### 2.3 配置SSH连接

使用Xshell 7和Xftp 7进行SSH连接和文件传输。

#### 2.3.1 安装SSH服务

```bash
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
```

#### 2.3.2 使用Xshell 7连接

1. 打开Xshell 7，点击“新建会话”。
2. 输入会话名称，并在“主机”栏输入虚拟机的IP地址。
3. 在“用户身份验证”中输入用户名和密码，点击“连接”。
4. 成功连接后，可以在Xshell中管理和操作Ubuntu系统。

#### 2.3.3 使用Xftp 7传输文件

1. 打开Xftp 7，点击“新建会话”。
2. 输入会话名称，并在“主机”栏输入虚拟机的IP地址。
3. 在“用户身份验证”中输入用户名和密码，点击“连接”。
4. 成功连接后，可以在Xftp中进行文件的上传和下载。

### 2.4 配置防火墙

为了提高系统安全性，可以配置防火墙：

```bash
sudo apt install ufw -y
sudo ufw allow OpenSSH
sudo ufw enable
```

## 3. 常用命令

### 3.1 文件和目录操作

- 列出目录内容：`ls`
- 切换目录：`cd`
- 创建目录：`mkdir`
- 删除文件或目录：`rm`（使用`rm -r`删除目录及其内容）
- 复制文件或目录：`cp`
- 移动或重命名文件或目录：`mv`

### 3.2 系统管理

- 查看磁盘使用情况：`df -h`
- 查看内存使用情况：`free -h`
- 查看系统信息：`uname -a`
- 查看当前运行的进程：`ps aux`
- 杀死进程：`kill [PID]`

### 3.3 网络操作

- 查看网络接口信息：`ip a`
- 测试网络连通性：`ping [IP/域名]`
- 查看路由表：`ip route`
- 下载文件：`wget [URL]` 或 `curl -O [URL]`

### 3.4 软件管理

- 安装软件包：`sudo apt install [包名]`
- 卸载软件包：`sudo apt remove [包名]`
- 搜索软件包：`apt search [关键字]`
- 更新软件包列表：`sudo apt update`
- 升级已安装的软件包：`sudo apt upgrade`

### 3.5 权限管理

- 修改文件权限：`chmod [权限] [文件]`
- 修改文件所属用户和用户组：`chown [用户]:[用户组] [文件]`
- 查看文件权限：`ls -l`

## 4. 高级配置

### 4.1 配置静态IP

编辑网络配置文件以配置静态IP：

```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

在文件中添加以下内容：

```yaml
network:
  version: 2
  ethernets:
    ens33:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

保存并应用配置：

```bash
sudo netplan apply
```

### 4.2 安装和配置防火墙

除了前面提到的UFW，可以选择更高级的防火墙如`iptables`：

```bash
sudo apt install iptables -y
```

配置规则（以下为示例规则）：

```bash
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p icmp -j ACCEPT
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -P INPUT DROP
```

保存规则：

```bash
sudo iptables-save > /etc/iptables/rules.v4
```

## 5. 常见问题和解决方法

### 5.1 虚拟机网络连接问题

如果遇到虚拟机无法连接网络的问题，可以尝试以下步骤：
- 检查虚拟机的网络适配器设置是否正确。
- 尝试重启网络服务：`sudo systemctl restart networking`
- 确保VMware的虚拟网络编辑器配置正确。

### 5.2 无法启动虚拟机

如果虚拟机无法启动，可能是由于磁盘空间不足或配置文件损坏。可以尝试以下步骤：
- 检查宿主机的磁盘空间是否足够。
- 尝试修复虚拟机配置：打开VMware并选择“修复”（Repair）选项。
