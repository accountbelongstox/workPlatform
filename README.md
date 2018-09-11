# Talent 工作平台
* 命令行模式
```
	ddrun
		--h 获取帮助
+------------------
```	

* 一些基本的命令
1. `rimraf`一个豪华版本的`rm -rf`，兼容window。
2. `cross-env`一个豪华版本的环境变量设置，有`NODE_ENV=*`的地方，就可以考虑使用`cross-env`，兼容window。

* electron-packager打包

- **必须安装**`cnpm install asar rimraf cross-env electron-packager --save-dev` 
```
	rimraf out && cross-env NODE_ENV=production && electron-packager ./ dwork --platform=win32 --arch=x64 --win32metadata.LegalCopyright='Copyright (C) 2018 Talent-BigData-ddweb.com, Inc. All rights reserved.' --win32metadata.CompanyName='Talent-BigData旗下(动点世纪科技),Inc' --win32metadata.FileDescription='Talent-BigData(泰乐特大数据旗下动点世纪科技有限公司CRM工作平台.)' --overwrite --ignore=node_modules/electron-* --ignore=node_modules/.bin --ignore=.git --ignore=./dist --ignore=.idea --ignore=./test --no-prune --out=./dist --icon=./html/assets/images/icon.ico --asar"
```

1. `--platform`平台参数.包含`darwin,linux,mas,win32`
2. `--arch`CPU构架参数.包含`ia32,x64`
3. `--overwrite`会覆盖原有的build.它和下面几项有关系：`--out=out`、`--ignore=out`、`rimraf out`
4. `--ignore`，要排除掉的不打包的文件，可以叠加效果。主要是出于减少最终文件大小的考虑。
5. `--out`打包完的可执行文件，放在在哪里。
6. `--no-prune`，这个参数请慎用，是说不处理node_modules里面dev依赖包，把相关的代码都放进最终asar里面。默认情况下，是会将dev相关的node_modules里面的包给去除之后，再打包的。注意：目前的最新版electron-packager里面没有`--prune`参数。
7. `--win32metadata.FileDescription="一款内公CRM办公平台"`，文件描述信息。`--win32metadata.CompanyName="动点世纪科技有限公司"`公司描述信息
8. `--electron-version`，指定打包时使用的electron的版本。example：`--electron-version=1.7.9`
9. `--icon`设置打包的时候的图标。敲黑板重点，天天有人问如何更换这个图标，就这里更换。图标制作使用`PS`和`icnstool`软件,Icon必须尺寸`256、128、64、32、16，必须要有个256*256的尺寸`.使用`icofx`可以做套娃全部图标.[参考URL](https://newsn.net/say/electron-ico-format.html)
10. `--asar`加密打包选项，是否在resource文件夹下面，生成app.asar文件。否则将会是个app文件夹加上自己的代码文件
11. `electron-packager --help`查看更多信息

- 在管理员模式下运行
1. `ResourceHacker`修改请求管理员权限 `Manifest`修改`requestedExecutionLevel`的`level`为`requireAdministrator`. `asInvoker`以前当权限运行.`highestAvailable`这个是以当前用户可以获得的最高权限运行。`requireAdministrator`: 这个是仅以系统管理员权限运行。
2. 添加sudo.exe到目录下.编写start.bat.内容`sudo.exe dwork.exe`
3. 使用`vbsedit`编译sudu.vbs.
```
	Set UAC = CreateObject("Shell.Application")  
	Set Shell = CreateObject("WScript.Shell")  
	If WScript.Arguments.count<1 Then
		WScript.arguments(0) = "xxx.exe"
		'WScript.echo "example sudo <command> [args]"  
	ElseIf WScript.Arguments.count=1 Then  
		UAC.ShellExecute WScript.arguments(0), "", "", "runas", 1  
	'    WScript.Sleep 10  
	'    Dim ret  
	'    ret = Shell.Appactivate("用户账户控制")  
	'    If ret = true Then  
	'        Shell.sendkeys "%y"          
	'    Else  
	'        WScript.echo "自动获取管理员权限失败，请手动确认。"  
	'    End If  
	Else  
		Dim ucCount  
		Dim args  
		args = NULL  
		For ucCount=1 To (WScript.Arguments.count-1) Step 1  
			args = args & " " & WScript.Arguments(ucCount)  
		Next  
		UAC.ShellExecute WScript.arguments(0), args, "", "runas", 5  
	End If  
```

- 添加右键菜单`bin/add_menu.bat`
```
	#参数1 BashName(注册表名字)
	#参数2 Command命令地址
	#参数3 Icon图标地址(可选)
	#参数4 右键菜单名字
```




