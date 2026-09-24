---
title: Windows右键菜单管理软件
tags:
  - Windows
  - 工具
categories:
  - 软件
date: 2025-08-01T23:15:00.000Z
slug: Windows右键菜单管理软件
ascii_slug: windows
---

#### ContextMenuManager 是一款免安装的开源软件，可以非常方便的管理Windows 电脑的右键菜单，轻松去除不必要的或者是流氓的菜单选项，还你电脑一个干净、清爽、简洁

## 主要功能

- 启用或禁用文件、文件夹、新建、发送到、打开方式、自定义文件格式、IE浏览器、WinX等右键菜单项目
- 对上述场景右键菜单项目进行修改名称、修改图标、导航注册表位置、导航文件位置、永久删除等操作
- 对上述场景右键菜单自定义添加项目，自定义菜单命令

## 兼容性能

- 适用于Win 11、Win10、8.1、8、7、Vista
- 适用于 64bit、32bit CPU 操作系统
- 适用于高分屏，最佳显示缩放比为150%
- 程序支持国际化多语言显示，欢迎为此程序制作语言字典

## 开源程序：【[点击下载](https://github.com/BluePointLilac/ContextMenuManager)】



## 运行截图

![Windows 右键菜单管理示意](/images/posts/windows-context-menu/overview.svg)



## 程序下载

- [最新版本](https://github.com/BluePointLilac/ContextMenuManager/releases/latest)
	[GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases)
	[Gitee Releases](https://gitee.com/BluePointLilac/ContextMenuManager/releases)
- 下载说明：在Assets文件列表里面下载zip（建议）或者直接下载exe
- .NET版本说明：程序分为.NET3.5版和.NET4.0版，均适用于Win10、8.1、8、7、Vista系统
	win7自带.NET3.5，win8、win8.1、win10自带.NET4.0以上版本，Vista系统既不自带.NET3.5也不自带4.0以上版本
	自带.NET可直接运行程序，不自带则需要安装对应版本的[.NET Framework运行库](https://dotnet.microsoft.com/download/dotnet-framework)



## 温馨提示

- 程序需要对注册表项和文件进行读写删改操作，这些行为比较敏感，可能会被 Windows Defender 等误报为病毒，如发生此情况请自行添加进白名单。
- 一些特殊菜单项可能会受到其他因素影响导致不会直接显示在右键菜单中，但是按照程序使用的通用规则在此程序中仍会显示为启用，这是正常的现象。
- 每个右键管理程序禁用菜单方法可能不同，建议不要同时使用多个右键菜单管理程序，大部分程序使用简单暴力的备份删除法，此程序尽可能使用了系统提供的键值进行隐藏，通过其他程序禁用的菜单项目。请先使用对应程序还原，不然可能无法在此程序中看到它。
- 此程序不用于清理未卸载干净的程序，但是可以帮助你快速定位菜单项相关注册表位置和文件位置，你可以根据相关内容进行你的操作。如果你是一个电脑小白，建议只使用启用或者禁用功能。
