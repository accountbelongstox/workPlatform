@echo off
rem require administrator
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
goto UACPrompt
) else ( goto gotAdmin )
:UACPrompt
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
"%temp%\getadmin.vbs"
exit /B
:gotAdmin
if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
pushd "%CD%"
CD /D "%~dp0"
del node-v10.9.0-win-x64.zip
if not exist "node-v10.9.0-win-x64.zip" ( wget https://nodejs.org/dist/v10.9.0/node-v10.9.0-win-x64.zip )
ECHO A|7z.exe x node-v10.9.0-win-x64.zip -o..\..\apps
ren ..\..\apps\node-v10.9.0-win-x64 nodejs
del node-v10.9.0-win-x64.zip