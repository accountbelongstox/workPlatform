﻿# Talent 工作平台
- 命令类和electron类放一起
- 工具类和功能类放分开


# 程序结构
	# 主要类
		- `that.o` 全部切面类
		- `that.load.core` 所有核心类,核心类也可以直接在`that.o`上调用
		- `that.load.func` 所有辅助方法类
		- `that.load.tool` 所有核心工具类

	# 主要方法
		- `that.load.core.appPath` 程序的全部主要路径集合
