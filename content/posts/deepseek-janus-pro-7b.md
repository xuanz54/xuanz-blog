---
title: DeepSeek 多模态大模型Janus-Pro-7B本地部署教程
tags:
  - AI
categories:
  - 科技
date: 2025-02-01T14:40:00.000Z
slug: DeepSeek-多模态大模型Janus-Pro-7B本地部署教程
ascii_slug: deepseek-janus-pro-7b
---

DeepSeek 又深夜发大招！开源了多模态大模型Janus-Pro-7B，普通电脑可以直接安装使用，现在我们就来本地部署！支持图像识别和图像生成，性能非常强悍！

![Janus-Pro-7B 本地部署流程](/images/posts/deepseek-janus/janus-overview.svg)

1、检查自己是否安装了 Git 和 conda ，如果没有安装，请点击前往下载【[Git](https://git-scm.com/)】和 【[Conda](https://www.anaconda.com/download)】

2、创建虚拟环境

```bash
conda create -n myenvp python=3.10 -y
```

3、激活 Conda 环境

```bash
conda activate myenvp
```

4、克隆 Janus 项目

```bash
git clone https://github.com/deepseek-ai/Janus.git
```

5、进入 Janus 目录

```bash
cd Janus
```

6、安装 Janus 依赖

```bash
pip install -e .
```

7、安装 Gradio（UI）

```bash
pip install gradio

pip uninstall torch torchvision torchaudio -y

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

8、运行 Janus Pro UI

```bash
python demo/app_januspro.py
```

或强行调用GPU运行（速度更快）：

```bash
python demo/app_januspro.py --device cuda
```

 

安装完成以后，根据提示打开本地链接：http://127.0.0.1:7860 即可进入到使用面板

![Janus-Pro 本地 WebUI 示意](/images/posts/deepseek-janus/janus-webui.svg)

右侧的文生图面板用于输入描述并生成图像，操作位置见上图。

**退出以后该如何启动？ 按下方的步骤即可：**

1、激活 Conda 虚拟环境

```bash
conda activate myenvp
```

2、进入安装目录：

```bash
cd Janus
```

3、运行 Janus UI：

```bash
python demo/app_januspro.py
```

如果需要指定 GPU：

```bash
python demo/app_januspro.py --device cuda
```

当然如果你的电脑硬件过低，或者显卡不支持，那么可以使用免费的在线平台进行使用

【[点击前往](https://huggingface.co/spaces/deepseek-ai/Janus-1.3B)】

免费的在线平台是托管在Huggingface上的，使用的是共享GPU，在线人多的时候，可能会比较卡！
