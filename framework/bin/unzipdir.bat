@echo off

set /p iszip=contuniu unzip the dir all zip(1^|0):
set /p pass=Is password^?:
set /p del=Delete the source file^?(Y^|N):
IF "%del%" EQU "" set "del=N"
set /p tar=Target directory^?(default current directory!):
IF "%tar%" EQU "" set "tar=N"

IF "%iszip%" EQU "1" (
D:\developEnv\framework\bin\ddrun.bat unzipdir %1 %tar% %del% %pass% 
cmd
)
