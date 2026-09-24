---
title: 本地部署Llama3.1最强开源大模型！支持Windows、MacOS
tags:
  - AI
categories:
  - 科技
date: 2024-08-07T12:15:00.000Z
slug: 本地部署Llama3.1最强开源大模型：支持Windows、MacOS
ascii_slug: llama3-1-windows-macos
---



![Llama 3.1 本地或云端运行选择](/images/posts/llama31/local-or-cloud.svg)



1.本地电脑安装的硬件要求：

Windows：3060以上显卡+8G以上显存+16G内存，硬盘空间至少20G

Mac：M1或M2芯片 16G内存，20G以上硬盘空间

在开始之前，首先我们需要安装Ollama客户端，来进行本地部署Llama3.1大模型

**官方下载：**【[点击前往](https://ollama.com/)】

安装命令：

安装llama3.1-8b，至少需要8G的显存，安装命令就是

``` bash
ollama run llama3.1:8b
```

安装llama3.1-70b，至少需要大约 70-75 GB 显存，适合企业用户，安装命令就是

```bash
ollama run llama3.1:78b
```

安装llama3.1-405b，这是一个极其庞大的模型，安装和运行它在本地需要非常高的显存和硬件资源，至少需要大约 400-450 GB 显存，适合顶级大企业用户，安装命令就是

```bash
ollama run llama3.1:405b
```

2.如果你没有可运行的显卡，那么可以在Huggingface平台上使用，因为huggingFace 上已经托管了Llama3.1大模型，现在完全免费使用！

【[链接直达](https://huggingface.co/chat/)】

如果本机硬件不足，可以使用上图右侧的云端方案快速体验。
