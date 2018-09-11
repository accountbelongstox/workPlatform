rem @echo off
title talent bigdata
git add -A
set /p commit=commit(default NowTime):
if '%commit%' EQU '' (
goto setCommit
) else ( goto git )
:setCommit
set "commit=%date:~0,10%"
goto git
:git
git commit -m "%commit%"
git push
cmd