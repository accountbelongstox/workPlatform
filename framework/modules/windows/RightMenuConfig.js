const zipConfig = require(`../zip/zipFiles.json`)
//获得所有zip文件的扩展名
let zipFileExt = []
for(let p in zipConfig){
    zipFileExt.push(p)
}

module.exports = {
/*    example:{
        description:``,
        icon:``,
        command:``,
        type:`  file(*)
                base(Directory\\Background,Directory)
                multi(Directory\\Background,Directory,Drive)
                all
             `
        runas:`` 是否用管理员运行
    },*/
/*    unzip:{
        description:`Unzip the file`,
        icon:`D:\\Program Files\\Bandizip\\Bandizip.exe`,
        command:`\\"D:\\developEnv\\framework\\bin\\ddrun.bat\\" unzipdir \\"%1\\"`,
        type:`file`,
        fileExt:zipFileExt,
        runas:false
    },
    zip:{
        description:`Add the file in zip`,
        icon:`D:\\Program Files\\Bandizip\\Bandizip.exe`,
        command:`\\"D:\\developEnv\\framework\\bin\\ddrun.bat\\" unzipdir \\"%1\\"`,
        type:`file`,
        runas:false
    },*/
    zipDirectory:{
        description:`Unzip the directory all Zip?`,
        icon:`D:\\Program Files\\Bandizip\\Bandizip.exe`,
        command:`\\"D:\\developEnv\\framework\\bin\\unzipdir.bat\\" \\"%V\\"`,
        type:`base`,
        runas:false
    },
    replaceDir:{
        description:`Rename & replace the director files?`,
        icon:`D:\\developEnv\\win\\windows\\Icon\\imageres_5330.ico`,
        command:`\\"D:\\developEnv\\framework\\bin\\replacedir.bat\\" \\"%V\\"`,
        type:`base`,
        runas:false
    },
    runas:{
        description:`Cmd as administrator Here`,
        icon:`C:\\Windows\\SysWOW64\\cmd.exe`,
        command:`cmd.exe /s /k pushd \\"%V\\"`,
        type:`multi`,
        runas:true
    },
    cmder:{
        description:`Cmder&Git Here`,
        icon:`D:\\developEnv\\application\\apps\\soft\\cmder\\icons\\cmder.ico`,
        command:`"D:\\developEnv\\application\\apps\\soft\\cmder\\Cmder.exe" "%V"`,
        type:`multi`,
        runas:false
    },
/*    git:{
        description:`Git Here`,
        icon:`D:\\developEnv\\application\\apps\\soft\\cmder\\vendor\\git-for-windows\\usr\\share\\git\\git-for-windows.ico`,
        command:`D:\\developEnv\\application\\apps\\soft\\cmder\\vendor\\git-for-windows\\git-bash.exe`,
        type:`multi`,
        runas:false
    },*/
    "notepad++":{
        description:`Open with NotePad++`,
        icon:`D:\\developEnv\\application\\apps\\ides\\common\\Notepad++\\notepad++.exe`,
        command:`\\"D:\\developEnv\\application\\apps\\ides\\common\\Notepad++\\notepad++.exe\\" \\"%1\\"`,
        type:`file`,
        runas:false
    },
    sublimetext:{
        description:`Open with SublimeText`,
        icon:`D:\\developEnv\\application\\apps\\ides\\common\\Sublime Text 3\\sublime_text.exe`,
        command:`\\"D:\\developEnv\\application\\apps\\ides\\common\\Sublime Text 3\\sublime_text.exe\\" \\"%1\\"`,
        type:`file`,
        runas:false
    },

};
