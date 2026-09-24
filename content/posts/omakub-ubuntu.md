---
title: Omakub专为开发者设计的Ubuntu环境配置项目
tags:
  - Linux
categories:
  - 软件
date: 2024-10-28T16:17:00.000Z
slug: Omakub专为开发者设计的Ubuntu环境配置项目
ascii_slug: omakub-ubuntu
---

Omakub 是一个专为开发者设计的 Ubuntu 环境配置项目，由 Ruby on Rails 的创造者 David Heinemeier Hansson（DHH）发起。其目标是通过一条命令将全新的 Ubuntu 系统转化为一个配置完备、美观且现代化的 Web 开发系统，简化开发环境的搭建过程。

提供一键式配置，集成了大量流行的开发工具和应用程序，如 Chrome、Firefox、Alacritty 终端、Neovim 和 VSCode 编辑器等。它不仅适用于新手，也为那些希望快速搭建开发环境的开发者提供了便利。Omakub 还对 Ubuntu 的 UI 进行了优化，适应键盘优先和窗口平铺的工作流程。

![Omakub 开发环境组成](/images/posts/omakub/toolchain.svg)

 

#### 主要功能

1. 一键式配置：通过一条命令即可完成所有配置。
2. 预装工具：包括浏览器、终端、编辑器、通讯工具（如 WhatsApp、Signal、Spotify、Zoom、1Password）等。
3. 版本控制：内置 GitHub CLI，方便进行版本控制和代码管理。
4. 容器管理：预配置 MySQL 和 Redis 容器，提供 lazydocker 工具简化管理。
5. 语言管理：使用 mise 工具管理 Ruby、Node.js、Python、Go、Java 等多种编程语言。
6. 系统优化：调整 Ubuntu UI，提供快捷键操作和窗口平铺功能。

#### 安装指南

安装 Omakub 只需以下步骤：

1. 在计算机上安装 Ubuntu 24.04+。

2. 打开终端（Ctrl+Alt+T），运行以下命令：

	

	```bash
	wget -qO- https://omakub.org/install | bash
	```

	整个安装过程大约需要 30 分钟，具体时间取决于网络状况。安装完成后，系统会自动配置所有工具和设置。
