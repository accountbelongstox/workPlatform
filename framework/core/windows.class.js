const 
systemOS=require('os')
;
//windows 服务 -----------------------------------------------------------------------------------------------------------------------------------

class win32{
    constructor(common){
        common.get_core('func');
        common.get_core('string');
        common.get_core('console');

        common.get_node('path');
        common.get_node('fs');

        common.get_config();
    }

   

    /**
     * @tools 添加一个右键菜单注册表
     * @param object {
          description,
          command,
          opt {
          [icon]
          [type]: [file,base,multi,all]
          }
      }
     */
    addRightMenuSync(description,command,opt={}){
        let
            that = this,
            //可添加的类型
            addType={
                file:["*"],
                multi:["Directory\\Background","Directory","Drive"],
                all:["Directory\\Background","Directory","Drive","*"],
                base:["Directory\\Background","Directory"]
            },
            commandFormat = commandFormatFunc(command),
            commandParse = that.common.node.path.parse(commandFormat),
            type = opt.type ? opt.type : "base",
            addTypeDirectory = addType[type],
            icon = opt.icon ? opt.icon : commandFormat,
            runas = opt.runas ? opt.runas : false,
            name = commandParse.base.replace(/[\\\/\.\s]+/ig,``),
            regCMD =[]
        ;
        //如果命令实体没有路径,则where查找一下
        if(!commandParse.root){
            let
                where = that.common.core.func.execSync(`where ${icon}`)
            ;
            if(where[0]){
                icon = where[0][0];
            }
            if(!that.common.core.file.isFileSync(icon)){
                icon = commandFormat;
            }
        }
        if(runas)name ="runas";
        addTypeDirectory.forEach((TypeDirectory)=>{
            regCMD.push(`reg add "HKEY_CLASSES_ROOT\\${TypeDirectory}\\shell\\${name}" /ve /d "${description}" /f `);
            regCMD.push(`reg add "HKEY_CLASSES_ROOT\\${TypeDirectory}\\shell\\${name}" /v Icon /d "${valueFormatFunc(icon)}" /f`);
            regCMD.push(`reg add "HKEY_CLASSES_ROOT\\${TypeDirectory}\\shell\\${name}" /v NoWorkingDirectory /d "" /f`);//没有工作目录路径
            regCMD.push(`reg add "HKEY_CLASSES_ROOT\\${TypeDirectory}\\shell\\${name}\\command" /ve /d "${valueFormatFunc(command)}" /f`);
            if( runas ){
                regCMD.push(`reg add "HKEY_CLASSES_ROOT\\${TypeDirectory}\\shell\\${name}" /v HasLUAShield /f`);
            }
        });
        that.common.core.func.execSync(regCMD);
        function valueFormatFunc(val){
            val = val.replace(/\"/g,`\\"`);
            return val;
        }
        function commandFormatFunc(_command){
            //如果是引号引起的地址
            if(/^[\'\"]{1}/.test(_command)){
                let
                    commandMath = _command.match(/(?<=[\'\"]{1}).+?(?=[\'\"])/)
                ;
                if(commandMath){
                    _command = commandMath[0];
                }
                //非引号引的地址直接移除空格后的一切
            }
            console.log(`_command`,_command)
            _command = _command.replace(/\s.+/,``)
            return _command;
        }
    }

    /*
    @func 判读一个windows服务是否运行中..
    @return true运行中 false未运行 null没有安装
    */
    serviceIsRun(server_name,callback){
        let
            that = this,
            isRun = false
        ;
        that.isService(server_name,function(is_server){
            if(!is_server){
                callback(null);
            }else{
                that.common.core.func.exec(`SC QUERY "${server_name}"`,function(result){
                    if(/\s*STATE\s*\:\s*[0-9]*\sSTOPPED*/.test(result)){
                        isRun = true;
                    }
                    if(callback){
                        callback(isRun);
                    }
                });
            }
        });
    }

    /*
    查询系统是否有该服务*/
    isService(server_name,callback){
        let
            that = this,
            is_server = true
        ;
        that.common.core.func.exec(`SC QUERY "${server_name}"`,function(result){
            if(/^[\s\r\n]*SERVICE\_NAME\:\s*[a-zA-Z0-9]/.test(result)){
                is_server = false;
            }
            callback(is_server);
        });
    }

    /**
     * @func 保存一个命令
     * @param command
     * @param target_path
     * @param is_admin
     * @param callback
     * @param is_cmd
     */
    saveCommand(command,target_path,is_admin,is_cmd){
        let
            that = this,
            command_text = ""
        ;
        if(command instanceof Array){
            for(var i = 0 ;i<command.length;i++){
                command_text+=command[i]+"\r\n";
            }
        }
        if(command instanceof String){
            command_text+=command[i]+"\r\n";
        }
        const admin_command = '@echo off\r\n'+
            '>nul 2>&1 "%SYSTEMROOT%\\system32\\cacls.exe" "%SYSTEMROOT%\\system32\\config\\system"\r\n' +
            'if \'%errorlevel%\' NEQ \'0\' (\r\n' +
            'goto UACPrompt\n' +
            ') else ( goto gotAdmin )\r\n' +
            ':UACPrompt\r\n' +
            'echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\\getadmin.vbs"\r\n' +
            'echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\\getadmin.vbs"\r\n' +
            '"%temp%\\getadmin.vbs"\r\n' +
            'exit /B\r\n' +
            ':gotAdmin\r\n' +
            'if exist "%temp%\\getadmin.vbs" ( del "%temp%\\getadmin.vbs" )\r\n' +
            'pushd "%CD%"\r\n' +
            'CD /D "%~dp0"\r\n';
        if(is_admin){
            command_text = admin_command+command_text;
        }
        if(is_cmd){
            command_text += '\r\ncmd';
        }
        command_text = iconv.encode(command_text, 'gbk');
        that.common.core.file.writeFileSync(target_path,command_text);
    }


    /*
    @func 判断windows是否运行在管理员之下
    */
    IsAdmin(){
        let 
        that = this,
        SystemRoot = that.env().get("SystemRoot"),
        TempFile_Name = that.common.node.path.join(`${SystemRoot}`,"System32/BatTestUACin_SysRt_"+(Math.random()*1000))
        ;
        try{
            that.common.node.fs.mkdirSync(TempFile_Name);
            that.common.node.fs.rmdirSync(TempFile_Name);
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    /**
     * @tools 设置hosts
     */
    setHosts(keyValue,keyValueOrStatus,status=true){
        if(typeof keyValueOrStatus == "string"){
            keyValue = keyValue+ ` ${keyValueOrStatus}`;
        }else{
            status = keyValueOrStatus;
        }
        if(keyValue){
            let 
            that = this,
            keyValues = keyValue.split(/\s/),
            key = keyValues[0],
            value = keyValues[1] ? keyValues[1] : "",
            homedir = that.homedir(),
            driveRoot = that.common.node.path.parse(homedir).root,
            hostsDir = that.common.node.path.join(driveRoot,`Windows/System32/drivers/etc/hosts`),
            hostsContent = that.common.core.file.readFileSync(hostsDir),
            keyRegText = that.common.core.string.strToRegText(key),
            valueRegText = value ? that.common.core.string.strToRegText(value) : ``,
            queryReg = new RegExp(`[\\n\\r]{1,}\\s*\\#*\\s*${keyRegText}\\s+${valueRegText}\\s*$`),
            hostsMatch = hostsContent.match(queryReg),
            keyAndValue = `\r\n${key} ${value}`
            ;
            if(hostsMatch){
                //如果已经有值了,则先替换为正常的值待用
                keyAndValue = `\r\n`+hostsMatch[0].replace(/^\s*\#*\s*|\n+|\r+/i,``).replace(/\s+/ig,' ');
            }
            //设置开启
            if (status){
                //如果已经查找存在的值,则开启即可
                if(hostsMatch){
                    hostsContent = hostsContent.replace(hostsMatch[0],keyAndValue);
                }else{
                    //如果没有查找到,则添加
                    hostsContent += keyAndValue;
                }
            }else{
                //如果是关闭该项,在前面添加#号即可
                if(hostsMatch){
                    //正则添加#号
                    keyAndValue = keyAndValue.replace(/\r\n/,`\r\n#`);
                    hostsContent = hostsContent.replace(hostsMatch[0],`${keyAndValue}`);
                }
            }
            that.common.core.console.success(`Set hosts in => ${keyValues} `);
            that.common.core.file.writeFileSync(hostsDir,hostsContent);
            return true;
        }else{
            that.common.core.console.error(`Not find set Key or Value ...`);
            return false;
        }
    }

    /*
    @func 设置一个环境变量
    @params object {
        path:"./bin"
    }
    */
    setEvn(environmentO,callback,extend=null){
        let 
        that = this
        ;
        //如果不是数组则添加到数组
        if( !(environmentO instanceof Array)){
            environmentO = [environmentO]
        }
        //如果传入的是key value模式
        if( (typeof environmentO === "string") && (typeof callback === "string")){
            let 
            __o = {}
            ;
            //如果第一个值最字符
            //则表示这是 key,value,callback 形式的传参
            //则要做如下调
            __o[environmentO] = callback;
            environmentO = [__o];
        }
        //不管设置多少个变量,都只查询一次
        that.common.core.func.exec(`reg query "HKEY_LOCAL_MACHINE\\SYSTEM\\ControlSet001\\Control\\Session Manager\\Environment"`,(exeInfo)=>{
            let
                envQuery = [],
                env = that.common.core.string.trim(exeInfo,[`\r`,`\n`]),
                envQueryJson = {}
            ;
            env = env.split("\n");
            env.splice(0,1);
            //过滤掉无用的查询的信息和空格信息
            env.forEach((evnOne)=>{
                evnOne = that.common.core.string.trim(evnOne,[`\r`,`\n`]);
                if(evnOne)envQuery.push(evnOne);
            });
            //将被分割后的查询结果数组处理成JSON格式
            envQuery.forEach((evnOne)=>{
                let
                    evnOneMatch = evnOne.match(/([a-zA-Z0-9\_]+)?\s*([a-zA-Z0-9\_]+)?\s*(.+)/),
                    //如果此处取值报错,代表 exe 查询出了问题
                    //因为注册表的查询是33对应
                    name = evnOneMatch[1],
                    type = evnOneMatch[2],
                    values = that.common.core.array.filter(evnOneMatch[3].split(`;`))
                ;
                values.forEach((value,index)=>{
                    values[index] = that.common.core.string.trim(value,[`\\`,`\/`]);
                });
                envQueryJson[name]={
                    name,
                    type,
                    values
                }
                /** 处理后的格式
                 * { PATH:
                    {
                    name: 'PATH',
                     type: 'REG_SZ',
                     value:[ 'C:\\Windows\\system32',
                            'C:\\Windows',
                            'C:\\Windows\\System32\\Wbem',
                            'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\',
                            'C:\\Windows\\System32\\OpenSSH\\'
                            ]
                     },
                 */
            });
            (function startSet(len){
                if(len >= environmentO.length){
                    if(callback)callback();
                }else{
                    let
                        OneSet = environmentO[len],
                        commands = []
                    ;
                    for(let p in OneSet){
                        let
                            setEnvValue = OneSet[p],
                            //以数组的方式处理待设置的变量集
                            //不管是否数组都处理成数组
                            setEnvValues = ( (typeof setEnvValue) === "string") ? setEnvValue.split(`;`) : setEnvValue,
                            setEnvName = p,
                            existsEvnJson = null
                        ;
                        //处理要设置的值
                        setEnvValues.forEach((setValueOne,index)=>{
                            //去除前后斜杠是为了能方便比较
                            setEnvValues[index] = that.common.core.string.trim(setValueOne,[`\\`,`\/`]);
                        });
                        //判断是否有存在的值
                        for(let envLen in envQueryJson){
                            if(envLen.toUpperCase() === setEnvName.toUpperCase()){
                                existsEvnJson = envQueryJson[envLen];
                                //为了避免大小写错乱,此处等于原大小写
                                setEnvName = envLen;
                            }
                        }
                        //如果设置的项存在
                        //例如都是设置PATH项
                        if(existsEvnJson){
                            //将要添加的值和原值合并
                            setEnvValues = existsEvnJson.values.concat(setEnvValues);
                            //将值去重
                            setEnvValues = that.common.core.array.unique(setEnvValues);
                            //得出最终要设置的值
                            setEnvValue = setEnvValues.join(`;`);
                            that.common.core.console.info(`SET ENVIRONMENT ${setEnvName} => ${setEnvValue}\n`,4);
                            //检查是否有重复的值
                        }else{
                            //如果没有重复 比添加添 JAVA_HOME 原环境变量中并没有
                            //得出最终要设置的值
                            setEnvValue = setEnvValues.join(`;`);
                            that.common.core.console.info(`ADD ENVIRONMENT ${setEnvName} => ${setEnvValue}\n`,4);
                        }
                        //此命令用于刷新环境变量,变量存在时需要先执行
                        commands.push(`wmic ENVIRONMENT where "name='${setEnvName}'" delete`);
                        commands.push(`wmic ENVIRONMENT create name="${setEnvName}",username="<system>",VariableValue="${setEnvValue}"`);
                        //此命令用于添加环境变量到注册表
                        commands.push(`setx ${setEnvName} "${setEnvValue}"`);
                        commands.push(`reg add "HKCU\\Environment" /f /t REG_SZ /v ${setEnvName} /d "${setEnvValue}"`);
                        commands.push(`reg add "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /f /t REG_SZ /v ${setEnvName} /d "${setEnvValue}"`);
                    }
                    that.common.core.func.exec(commands,()=>{
                        startSet(++len);
                    });
                }
            })(0);
        });
    }
    /*
    @func 用于取得或设置环境变量
    */
    env(){
        let 
        that = this,
        o = {}
        ;
        o.get = function(name="path"){
            if(!name)return null;
            return process.env[name];
        }
        o.set = function(name,fn){
            if(typeof name != "object"){
                console.log(`params not object.`);
                return false;
            }
            if(!name){
                console.log(`params not exists.`);
                return false;
            }
            that.setEvn(name,fn);
        }
        return o;
    }

    /*
    @func 取得当前用户名
    */
    currentUser(){
        let 
            that = this,
            user = that.common.node.path.parse(that.os().homedir).name
        ;
        return user;
    }

    /*
    @func 获取系统盘
    */
    systemDisk(){
        let
            that = this,
            root = that.common.node.path.parse(that.os().homedir).root

        ;
        return root;
    }

    /*
    @func 取得当前用户名
    */
    homedir(){
        let
            that = this
        ;
        return that.os().homedir;
    }

    /*
    @func 获取系统信息
    */ 
    os(name){
    	let 
    	    o = {
    	        list:[]
            }
    	;
        o.arch=systemOS.arch();//获取cpu(处理器架构)
        o.cpus=systemOS.cpus();//获取cpu信息
        o.endianness=systemOS.endianness();//字节顺序 高位优先返回BE,低位优先的返回LE
        o.freemem=systemOS.freemem();//空闲内存字节
        o.homedir=systemOS.homedir();//当前登录用户的根目录
        o.hostname=systemOS.hostname();//操作系统主机名
        o.loadavg=systemOS.loadavg();//系统最近5、10、15分钟的平均负载,这是一个针对linux或unix的统计，windows下始终返回[0,0,0]
        o.networkInterfaces=systemOS.networkInterfaces();//网络配置列表
        o.platform=systemOS.platform();//操作系统类型,返回值有'darwin', 'freebsd', 'linux', 'sunos' , 'win32'
        o.release=systemOS.release();//操作系统版本
        o.tmpdir=systemOS.tmpdir();//操作系统临时文件的默认目录
        o.totalmem=systemOS.totalmem();//系统总内存
        o.type=systemOS.type();//操作系统名称，基于linux的返回linux,基于苹果的返回Darwin,基于windows的返回Windows_NT
        o.uptime=systemOS.uptime(); //计算机正常运行时间
        o.EOL = systemOS.EOL;
    	for(let p in systemOS){
    	    o.list.push(p);
        }
        if(name)return o[name];
        return o;
    }

    /**
     * @func 判断是否是一个命令行
     */
    isCommand(command){
        let
            that = this,
            commandParse = that.common.core.string.trimX(command)
        ;
        if(that.common.core.file.isFileSync(commandParse)){
            return false;
        }else{
            let
                spaceSplit = that.common.core.string.splitSpace(commandParse)
            ;
            console.log(spaceSplit);
            return true;
        }
    }

    /*
    @func 创建一个启动项 Desktop
    */
    startup(filedirs,deleteStartUP=false,callback){
        if(deleteStartUP instanceof Function){
            callback = deleteStartUP;
            deleteStartUP = false;
        }
        let
            that = this,
            deleteTempBak = true,
            result = []
        ;
        // 如果第二项被设置为true  或 falsh
        // 则第三项为函数
        if(typeof filedirs === "string"){
            filedirs = [filedirs];
        }
        if(typeof filedirs === "object" && !(filedirs instanceof Array) ){
            filedirs = [filedirs];
        }
        (function Startup(i){
            if(i>=filedirs.length){
                if(result.length === 1)result = result.join(``);
                if(callback)callback(result);
            } else {
                let
                    entry = filedirs[i],
                    entrys = {
                        application : "",
                        icon : "005",
                        arguments : "",
                        windowsStyle : 1,
                        description : "",
                        workingDirectory : "",
                        hotkey : "",
                        shortcutType :  "Startup",
                        lnk:""
                    }
                ;
                if(typeof entry === "string"){
                    console.log(111,that.isCommand(entry));
                    if(that.common.core.file.isPath(entry)){
                        entrys.application = entry;
                        entrys.icon = entry;
                        entrys.description = that.common.node.path.parse(entry).name;
                        entrys.workingDirectory = that.common.node.path.parse(entry).dir;
                    }else{
                        let
                            starUpTmpDir = that.common.node.path.join(that.common.config.platform.base.local.tmpDir,`.startup`),
                            batFileName = `${Date.parse(new Date())}${Math.ceil(Math.random()*10)}.bat`,
                            starUpDir = that.common.node.path.join(starUpTmpDir,batFileName)
                        ;
                        return that.common.core.file.writeFile(starUpDir,entry,()=>{
                            that.startup({
                                application:starUpDir,
                                icon:that.common.node.path.join(that.common.core.windows.systemDisk(),"Windows\\system32\\cmd.exe")
                            },callback);
                        });
                    }
                }else{
                    let
                        app = entry.application,
                        appParse = that.common.node.path.parse(app)
                    ;
                    entrys.application = app;
                    entrys.icon = entry.icon ? entry.icon : app;
                    entrys.description = entry.description ? entry.description : appParse.name;
                    entrys.workingDirectory = entry.workingDirectory?entry.workingDirectory : appParse.dir;
                    for(let p in entry){
                        entrys[p] = entry[p];
                    }
                }
                let 
                    startPath = that.common.node.path.join(that.homedir(),`AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup`),
                    startName = that.common.node.path.parse(entrys.application).name+".lnk",
                    startNamePath = that.common.node.path.join(startPath,startName)
                ;
                //如果是关闭,则删除启动项
                if(deleteStartUP){
                    that.common.core.file.deleteFile(startNamePath,(err)=>{
                        Startup(++i);
                    });
                }else{
                    console.log(entrys);
                    that.createShortcut(entrys,(tempBakPath)=>{
                        result.push(tempBakPath);
                        Startup(++i);
                    },deleteTempBak);
                }
            }
        })(0);
    }

    /*
    @func 创建一个快捷方式
    @params entrys Object [{
        Application 入口文件
        Icon 图标地址
        ShortcutName 快捷方式名
        Arguments = "" 附加参数
        WindowsStyle = 1 样式
        Description = "" 介绍
        WorkingDirectory 工作目录
        Target : {
            AllUsersDesktop 
            AllUsersStartMenu 
            AllUsersPrograms 
            AllUsersStartup 
            Desktop 
            Favorites 
            Fonts 
            MyDocuments 
            NetHood 
            PrintHood 
            Programs 
            Recent 
            SendTo 
            StartMenu 
            Startup 
            Templates 
        },
        lnk: "xxx/xxx.lnk"指定快捷方式的名称
    }]
    */
    createShortcut(entrys,callback,deleteTempBak=true){
        let
            that = this,
            systemDisk = that.systemDisk(),
            homedir = that.homedir(),
            ProgramsDir = ``,
            result = [],
            shortcuts = {
                "AllUsersDesktop": {
                    "pathname": that.common.node.path.join(systemDisk,"Users/Public/Desktop")
                },
                "AllUsersStartMenu": {
                    "pathname": that.common.node.path.join(homedir,"AppData/Roaming/Microsoft/Windows/Start Menu")
                },
                "AllUsersPrograms": {
                    "pathname": that.common.node.path.join(homedir,"AppData/Roaming/Microsoft/Windows/Start Menu/Programs")
                },
                "AllUsersStartup": {
                    "pathname": that.common.node.path.join(homedir,"AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup")
                },
                "Desktop": {
                    "pathname": that.common.node.path.join(homedir,"Desktop")
                },
                "Favorites": {
                    "pathname": that.common.node.path.join(homedir,"Favorites")
                },
                "Fonts": {
                    "pathname": that.common.node.path.join(systemDisk,"Windows/Fonts")
                },
                "MyDocuments": {
                    "pathname": that.common.node.path.join(systemDisk,"Documents")
                },
                "NetHood": {
                    "pathname": that.common.node.path.join(homedir,"NetHood")
                },
                "PrintHood": {
                    "pathname": that.common.node.path.join(homedir,"PrintHood")
                },
                "Programs": {
                    "pathname": that.common.node.path.join(homedir,"AppData/Roaming/Microsoft/Windows/Start Menu/Programs")
                },
                "Recent": {
                    "pathname": that.common.node.path.join(homedir,"Recent")
                },
                "SendTo": {
                    "pathname": that.common.node.path.join(homedir,"SendTo")
                },
                "StartMenu": {
                    "pathname": that.common.node.path.join(homedir,"AppData/Roaming/Microsoft/Windows/Start Menu")
                },
                "Startup": {
                    "pathname": that.common.node.path.join(homedir,"AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup")
                },
                "Templates": {
                    "pathname": that.common.node.path.join(homedir,"Templates")
                }
            }
        ;
        //如果是字符,转为数组
        if(typeof entrys === "string"){
            entrys = [entrys];
        }
        //如果是对象,依然转为数组
        if(typeof entrys === "object" && !(entrys instanceof Array) ){
            entrys = [entrys];
        }
        (function shortcut(i){
            if(i>=entrys.length){
                if(callback)callback(result);
            }else{
                let
                    entry = entrys[i],
                    shortcutType = entry.shortcutType ? ( (typeof entry.shortcutType === "string") ? [entry.shortcutType] : entry.shortcutType ) : [`Desktop`]
                ;
                (function shortcutTypeFunc(shortcutTypeLen){
                    if(shortcutTypeLen >= shortcutType.length){
                        shortcut(++i);
                    }else{
                        let
                            application = {
                                application : "",
                                icon : "",
                                args : "",
                                windowsStyle : 1,
                                description : "",
                                workingDirectory : "",
                                hotkey : "",
                                link : ``,
                                shortcutType
                            },
                            Target = application.shortcutType[shortcutTypeLen],
                            removeDir = []
                        ;
                        for(let l in shortcuts){
                            if(l.toUpperCase() === Target.toUpperCase()){
                                Target = l;
                                ProgramsDir = shortcuts[l].pathname
                            }
                        }
                        if(typeof entry === "string"){
                            application.application = entry;
                            application.icon = entry;
                            application.description = that.common.node.path.parse(entry).name;
                            application.workingDirectory = that.common.node.path.parse(entry).dir;
                        }else{
                            let
                                app = entry.application,
                                appParse = that.common.node.path.parse(app)
                            ;
                            application.application = app;
                            application.icon = entry.icon?entry.icon:app;
                            application.description = entry.description?entry.description : appParse.name;
                            application.workingDirectory = entry.workingDirectory?entry.workingDirectory : appParse.dir;

                            for(let l in entry){
                                application[l] = entry[l];
                            }
                        }

                        if(!application.link){
                            application.link = `${application.description}.lnk`;
                        }else{

                            application.link = application.link.replace(/\.+$/,``);
                        }

                        for(let p in application){
                            let
                                removeThis = p.match(/remove(.+?)Dir/i)
                            ;
                            if(removeThis){
                                removeDir.push(removeThis[1]);
                            }
                        }

                        let
                            LinkParse = that.common.node.path.parse(application.link),
                            TargetDir = ``
                        ;

                        if(!LinkParse.ext){
                            application.link = application.link+".lnk";
                        }

                        if(LinkParse.dir){
                            if(!ProgramsDir){
                                that.common.core.console.error(`Not find ProgramsDir.`);
                                shortcut(++i);
                                return;
                            }
                            if(that.common.core.array.findX(removeDir,Target)) {
                                application.link = LinkParse.base;
                            }else{
                                TargetDir = that.common.node.path.join(ProgramsDir,LinkParse.dir);
                                that.common.core.file.mkdirSync(TargetDir);
                            }
                        }

                        application.link = application.link.replace(/^[\\\/]+/,``).replace(/\//g,`\\`);

                        let
                            tmpDir = that.common.node.path.join(that.common.config.platform.base.local.tmpDir,`.shortcut`),
                            tmpVbs = that.common.node.path.join(tmpDir,`tmpStartup${Date.parse(new Date())}${Math.ceil(Math.random() * 10000)}.vbs`),
                            commands = [
                                `if exist "${tmpVbs}" del /f /q "${tmpVbs}"`,
                                `echo set WshShell = WScript.CreateObject("WScript.Shell")>"${tmpVbs}"`,
                                `echo strDesktop = WshShell.SpecialFolders("${Target}")>>"${tmpVbs}"`,
                                `echo set oShellLink = WshShell.CreateShortcut(strDesktop ^& "\\${application.link}")>>"${tmpVbs}"`,
                                `echo oShellLink.TargetPath ="${application.application}">>"${tmpVbs}"`,
                                `echo oShellLink.Arguments = "${application.args}">>"${tmpVbs}"`,
                                `echo oShellLink.WindowStyle ="${application.windowsStyle}">>"${tmpVbs}"`,
                                `echo oShellLink.Hotkey = "${application.hotkey}">>"${tmpVbs}"`,
                                `echo oShellLink.IconLocation = "${application.icon} ,0">>"${tmpVbs}"`,
                                `echo oShellLink.Description = "${application.description}">>"${tmpVbs}"`,
                                `echo oShellLink.WorkingDirectory = "${application.workingDirectory}">>"${tmpVbs}"`,
                                `echo oShellLink.Save>>"${tmpVbs}"`,
                                `call "${tmpVbs}"`
                            ]
                        ;
                        that.common.core.file.mkdirSync(tmpDir);
                        //if( deleteTempBak )commands.push(`del /f /q "${tmpVbs}"`);
                        result.push(tmpVbs);
                        that.common.core.console.info(`create ${Target} to ${ProgramsDir}`,4);
                        console.log(application);
                        console.log(commands);
                        that.common.core.func.exec(commands,()=>{
                            console.log(124);
                            shortcutTypeFunc(++shortcutTypeLen);
                        });
                    }
                })(0);
            }
        })(0);
    }

    /**
     * @func 取得电脑的所有磁盘
     * @param callback
     * @param debug
     * @constructor
     */
    getDrive(callback){
        let
            that = this
        ;
        that.common.core.func.exec(`wmic logicaldisk where "drivetype=3" get freespace,name`,function(result) {
            console.log(result);
            result = result.replace(/\r/g, '');
            result = result.replace(/\n\n/g, "\n");
            result = result.replace(/\n$/g, "");
            result = result.split("\n");
            result = Array.prototype.slice.call(result);
            if ( result[0] && /Name.*/.test( result[0] ) ) {
                result.splice( 0, 1 );
            }
            let
                d = {}
            ;
            result.forEach( ( drive ) => {
                drive = drive.replace(/^\s*?|\s*$/g, "");
                drive = drive.replace(/\s\s/g, " ");
                drive = drive.replace(/\s\s/g, " ");
                let
                    a = drive.split(/\s+/),
                    b = a[0] ? a[0] : 0
                ;
                a = a[1] ? a[1] : "";
                if( a ) {
                    a = a.replace(/[^a-zA-Z]/g, '');
                    b = parseInt( b );//parseFloat();
                }
                if( b > 0 ){
                    d[a] = Math.floor( ( b/1024/1024/1024 ) * 100 ) / 100;
                }
            });
            if(!callback){
                console.log(d);
            }
            if(callback){
                callback(d);
            }
        })
    }
}

module.exports = win32;