---
title: '提升效率与稳定性:深入掌握conda环境与包管理'
tags:
  - AI
  - Python
categories:
  - 方法
date: 2024-08-11T18:35:00.000Z
slug: 提升效率与稳定性：深入掌握conda环境与包管理
ascii_slug: conda
---

![Conda 环境管理流程](/images/posts/conda/workflow.svg)

## 一、conda基础概念

在深入使用**conda**命令之前，首先需要了解**conda**的基础概念。**conda** 是一个开源的包管理系统和环境管理系统，可以安装、更新和管理多种语言的依赖库（不仅限于<font color='Peach'>Python</font>）。它的强大之处在于将包管理与环境管理结合为一体，使得在项目开发中，无论是管理依赖包还是创建虚拟环境，**conda** 都能够提供完整的解决方案。

### conda与虚拟环境的区别

**conda** 与传统的虚拟环境工具（如<font color='Salmon'>venv、virtualenv</font>）不同，后者主要用于隔离项目的依赖，而  则同时管理包和环境。通过使用 **conda**，可以更方便地在不同项目之间切换环境，避免包之间的冲突。



## 二、必要准备：配置镜像源

<font color='Bitersweet'>在使用Anaconda安装Python包时，系统会自动从默认源下载安装包，但是由于网络访问限制或网络连接速度较慢等原因，可能导致安装失败或速度较慢。为了解决这些问题，配置镜像源可以让用户从国内的服务器下载Python包，加快下载速度并减少下载失败的问题。</font>

### 添加镜像源

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/pro
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
#显示检索路径
conda config --set show_channel_urls yes
#显示镜像通道
conda config --show channels
```



## 三、环境命令

### 1.创建虚拟环境:conda create - -prefix +路径+python=xxx版本

```bash
conda create --prefix D:\Python\Enviroment\myenv python=3.10.6
```

### 2.查看虚拟环境:conda env list

<font color='Magenta'>其中`*`表示当前所在的环境</font>

命令输出中带 `*` 的一行表示当前激活的环境。

### 3.切换、退出和删除环境:

> 切换环境:conda activate+路径
>
> ```bash
> conda activate D:\Python\Enviroment\myenv
> ```
>



>退出环境
>
>```bash
>conda deactivate
>```
>



> 删除环境:conda env remove -p+路径
>
> ```bash
> conda env remove -p D:\Python\Enviroment\myenv
> ```
>



## 四、包命令(先进入某一虚拟环境后使用)

### 1.查找包:conda search+包名

 <font color='Magenta'>使用该命令会显示不同版本的python所支持的该包的版本</font>

### 2.安装包:conda install+包名

```bash
conda install seaborn 
```

<font color='Magenta'>也可以使用 conda install seaborn=xxxx 下载指定版本的包</font>

### 3.查看已下载的包:conda list

### 4.更新包:conda update+包名

### 5.删除包:conda remove+包名
