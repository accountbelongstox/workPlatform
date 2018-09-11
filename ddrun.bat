@ECHO OFF
title ddrun
set "nodePath=%~dp0apps\nodejs"
set "node_modules=%~dp0\node_modules"
if not exist "%nodePath%" (
SET rootDir=%~dp0
SET setEnvValue=%PATH%%rootDir%;%nodePath%;
wmic ENVIRONMENT where "name='PATH'" delete
wmic ENVIRONMENT create name="PATH",username="<system>",VariableValue="%setEnvValue%"
setx PATH "%setEnvValue%"
reg add "HKCU\Environment" /f /t REG_SZ /v PATH /d "%setEnvValue%"
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /f /t REG_SZ /v PATH /d "%setEnvValue%"
rd /q /s "C:\Users\MD\AppData\Roaming\npm-cache"
md %~dp0\apps
%~dp0\framework\bin\nodejsinit.bat
cd /d %~dp0
if not exist "%node_modules%" ( %nodePath%\npm --registry https://registry.npm.taobao.org install )
%~dp0\apps\nodejs\node.exe %~dp0\main.js "ddrun" %1 %2 %3 %4 %5 %6 %7 %8 %9
) else (
if not exist "%nodePath%\cnpm" ( %nodePath%\node.exe %~dp0\main.js "ddrun" wintools systembak recovery initnodejs )
if not exist "%node_modules%" ( %nodePath%\cnpm --registry https://registry.npm.taobao.org install )
%~dp0\apps\nodejs\node.exe %~dp0\main.js "ddrun" %1 %2 %3 %4 %5 %6 %7 %8 %9
)

