class installC{
	
	constructor(load){
        
	}

	run(){
        let 
        that = this
        ;

        that.option.platform = that.load.config.basic.platform;
        that.option.srouceUrl = that.option.platform.base.web.srouceUrl;
        that.option.sourceDir = that.option.platform.base.sourceDir;
        that.option.workDir = that.option.platform.base.workDir;

        that.option.softwareSourceDir = that.option.sourceDir.softwareSourceDir;
        //安装app的目录
        that.option.applicationDir = that.option.workDir.application;
        //安装程序的目录
        that.option.programFiles = that.option.workDir.programFiles;
        //工作目录
        that.option.workroomDir = that.option.workDir.workroom;
        that.option.conf = that.load.get_class(`config/command/windows.install`);

	}


	/*
	@func 查找一个软件的信息
	*/
	getSoftInfo(softname){
        let 
            that = this,
            info = null,
            //软件安装列表
            installList = that.load.support.install,
            callbackBaseDir = that.load.node.path.join(that.load.path.command_modules,`wintools/install`)
        ;
        for(let p in installList){
	        let 
	            installTypeOne = installList[p].list
	        ;
            for(let o in installTypeOne ){
		        let 
		            installSoftOne = installTypeOne[o],
		            softwareName = installSoftOne.name
		        ;
            	if(softwareName == softname){
            		info = installSoftOne;
            		info['group'] = p;
            		info['callbackBaseDir'] = callbackBaseDir;
            		break;
            	}
            }
            if(info != null)break;
        }
        //名称
		info['softwareName'] = that.load.node.path.parse(info['downUrl']).base;
		//远程下载地址
		info['downUrl'] = that.formatSoftwareUrl(info['downUrl']);
		//本地存放地址
		info['softwareLocalDir'] = that.localSoftwaerDir(info).replace(/\\/g,`/`);
		//安装地址
		info['applicationDir'] = that.applicationDir(info).replace(/\\/g,`/`);
        return info;
	}


	/*
	@func 格式化软件下载地址
	*/

	formatSoftwareUrl(softnameUrl){
        let 
        that = this,
        softDownUrlParse = that.load.node.url.parse(softnameUrl)
        ;

        if(!softDownUrlParse.host || !softDownUrlParse.protocol){
            softnameUrl = that.option.srouceUrl +softnameUrl;
        }
        return softnameUrl;
	}


	/*
	@func 软件softwareLocalDir
	*/

	localSoftwaerDir(softinfo){
        let 
        that = this,
        softdir = that.load.node.path.join(that.option.softwareSourceDir,`${softinfo.group}/${softinfo.softwareName}`)
        ;
        return softdir;
	}



    /*
    @func 查找本地安装软件包,如果没有则远程下载
    */
    getLocalSoftwaerOrNotDownload(softinfo,fn){
        let 
        that = this
        ;

        if(that.load.module.file.isFileSync(softinfo.softwareLocalDir)){
            if(fn)fn(softinfo.softwareLocalDir);
        }else{
        	let
        	saveDir = that.load.node.path.parse(softinfo.softwareLocalDir).dir
        	;
            that.load.module.network.downFile({
            	url:softinfo.downUrl,
            	save:saveDir,
            	force:false
            },(softdir)=>{
                if(fn)fn(softdir);
            });
        }
    }


    /*
    @func 根据安装路径取得app安装地址
    */
    applicationDir(softInfo){
        let 
        that = this,
        //满足条件则被 安装到程序目录下
        installToDir = that.option.conf.extend.installToDir,
        appBaseDir_ = that.option.applicationDir,
        insatllDir = ``,
        installPath = `${softInfo.group}/`
        ;

        for(let p in installToDir){

            let 
            installToDirOne = installToDir[p],
            installToDirRegArray = []
            ;

            if(that.load.module.string.isString(installToDirOne)){

                installToDirRegArray.push(installToDirOne);

            }else if(that.load.module.array.isObject(installToDirOne)){

                installToDirRegArray = installToDirOne;
            }

            installToDirRegArray.forEach((installToDirReg)=>{
                if(installToDirReg.test(softInfo.group)){
                    if(that.option.sourceDir[p]){
                        appBaseDir_ = that.option.sourceDir[p];
                        installPath = "";
                        return;
                    }
                }
            });
        }

        console.log(appBaseDir_,installPath,softInfo.name);
        insatllDir = that.load.node.path.join(appBaseDir_,`${installPath}${softInfo.name}`);
        return insatllDir;
    }


    /*
    @func 查看此文件是否是一个可执行的安装文件
    */
    isSetup(softDir){
        let
        that = this,
        files = that.load.node.fs.readdirSync(softDir),
        filePath = "",
        setup = that.load.module.file.isOneExeFile(softDir)
        ;

        //如果没有文件夹,且只有单个文件
        if( setup ){
        	return setup;
        }
        return null;
    }


    /*
    @func 更宽松的查找
    */
    isSetupX(softDir){
        let
        that = this,
        setup = that.isSetup(softDir),
        files = that.load.node.fs.readdirSync(softDir),
    	setupTmp = ``,
        filesFullPath = []
        ;
        if(!setup){
        	setup = that.load.module.file.isOneExeFileX(softDir);
        }

        //如果上面没有找到,则根据文件名里出现setup字符的优先级来查找
        if(!setup){
        	let
        	setups = [],
        	indexOf = 0,
        	indexOfC = 99999
        	;

        	files.forEach((file)=>{
        		if(that.load.module.file.isExeFile(file)){
        			filesFullPath.push(that.load.node.path.join(softDir,file));
        			file = file.toLowerCase();
        			if(file.includes(`setup`)){
        				setups.push(file);
        			}
        		}
        	});

        	if(setups.length ==1){

        		setupTmp = setups[0];

        	}else if(setups.length > 1){
	        	setups.forEach((file)=>{

	        		file = file.toLowerCase();

	        		if(/^setup/.test(file)){
	        			setupTmp = file;
	        			return;
	        		}else if(/setup\.exe/.test(file)){
	        			setupTmp = file;
	        			return;
	        		}else if( (indexOfC = file.indexOf('setup')) < indexOf){
	        			indexOf = indexOfC;
	        			setupTmp = file;
	        		}
	        	});
        	}

        	if(setupTmp)setup = that.load.node.path.join(softDir,setupTmp);
        }

        //如果上面没有找到,则根据文件大小来排列,则大到小
        if(!setup){
        	let
        	size = 0
        	;
        	filesFullPath.forEach((file)=>{
        		let
        		states = that.load.node.fs.statSync(file)
        		;
        		if( states.size > size){
        			indexOf = indexOfC;
        			setupTmp = file;
        		}
        	});
        	setup = setupTmp;
        }

        return setup;
    }

    /*
    @func 查询并执行安装文件
    */
    startInstall(softinfo,callback,applicationDirExists=false){
        let
            that = this,
            errInfo = ``
        ;
        if(!applicationDirExists && !softinfo.setupInstall){
            //将软件移到指定的目录
            that.load.module.console.info(`rename  ${softinfo.tmp} => ${softinfo.applicationDir}...`,5);
            that.load.module.file.rename(softinfo.tmp,softinfo.applicationDir,(data)=>{
                //下一步
                that.startInstall_next(softinfo,callback);
            },true);
        }else{
            //下一步
            that.startInstall_next(softinfo,callback);
        }
    }

    /*
    @func 查询并执行安装文件
    */
    startInstall_next(softinfo,callback){
        let
            that = this
        ;
        //如果是安装执行,则寻找安装文件
        if(softinfo.setupInstall){
            //如果路径有空格则替换,否则exe执行不起来
            let 
                softdir = softinfo.tmp//,
                //softdirParse = that.load.node.path.parse(softdir),
                //isMsi = (softdirParse.ext.toLowerCase() === ".msi")
            ;
            if(/\s+/.test(softdir)){
                let
                    newSoftDir = softdir.replace(/\s+/ig,``)
                ;
                if(!that.load.module.file.existsSync(newSoftDir)){
                    that.load.module.file.rename(softdir,newSoftDir,(data)=>{
                        //进入下一步查找安装文件
                        that.readyQueryInstallFile(newSoftDir,softinfo,callback);
                        //that.executeMisfileOrExefile(softdir,isMsi,softinfo,callback);
                    },true);
                }else{
                    that.readyQueryInstallFile(newSoftDir,softinfo,callback);
                }
            }else{
                that.readyQueryInstallFile(softdir,softinfo,callback);
            }
        }else{//解压并设置环境变量
            that.load.module.console.info(`setEnvironment...`,5);
            that.setEnvironment(softinfo,callback);
        }
    }

    //准备查找安装文件
    readyQueryInstallFile(softdir,softinfo,callback){
        let
        that = this
        ;
        //通过各类优先级查找出要执行的文件名,然后开始执行
        that.queryInstallFile(softdir,softinfo,(installFile)=>{
            if(installFile){
                softinfo["softdir"] = installFile;
                that.load.module_func.install.executeMisfileOrExefile(installFile,softinfo,()=>{
                    that.getProgramInstallCallback(softinfo,callback);
                });
            }else if(installFile === null || installFile === false){
                let
                    optCmd = `explorer "${softinfo.tmp}"`
                ;
                that.load.module.func.spawn(optCmd,(info)=>{
                    that.load.module.console.info(`open application in ${softinfo.tmp}`,6);
                    that.getProgramInstallCallback(softinfo,callback);
                });
            }else{
                errInfo = `Not find setup.exe or entry application..`;
                that.load.module.console.error(errInfo);
                if(callback)callback(errInfo);
            }
        });
    }

    /*
	@func 如果当前只有一个文件夹,则提升至上一级
    */
    OnlyOneFolderIsSuperior(target,callback){
        let
        that = this,
        isOneFolder = that.load.module.file.isOneFolder(target),
        folderParent = null
        ;
        if(isOneFolder){
        	folderParent = that.load.node.path.join(isOneFolder,`../`);
        	//将文件夹下的文件提升一级
        	console.log(`OnlyOneFolderIsSuperior ...`)
        	that.load.module.file.rename(isOneFolder,folderParent,(data)=>{
        		//OnlyOneFolderIsSuperior
                if(that.load.module.file.isOneFolder(folderParent)){
                    that.OnlyOneFolderIsSuperior(folderParent,callback);
                }else{
                    if(callback)callback();
                }
        	},true);
        }else{
        	if(callback)callback();
        }
    }

    /*
    @func 如果将当前文件夹下降一级
    */
    OnlyOneFolderIsDesc(softinfo,callback){
        let
        that = this,
        target = softinfo.tmp,
        isOneFolder = that.load.module.file.isOneFolder(target),
        folderParent = null
        ;
        //不是一个文件夹时才下降
        if(!isOneFolder){
            folderParent = that.load.node.path.join(target,`../__${softinfo.name}`);
            //先将文件移到另一个临时目录
            console.log(`OnlyOneFolderIsDesc ...`);
            let
                newFolder = that.load.node.path.parse(softinfo.downUrl).name,
                newFolderDesc = that.load.node.path.join(target,newFolder)
            ;
            that.load.module.file.rename(target,newFolderDesc,(data)=>{
                //从临时目录将文件下降一级
                if(callback)callback();
            });
        }else{
            if(callback)callback();
        }
    }

    /*
    @func 设置环境变量
    */
    setEnvironment(softinfo,callback){
        let
            that = this,
            environmentVariable = softinfo.environmentVariable,
            envQueue = [],
            isNormalProgram = that.load.module.file.isNormalProgram(softinfo.applicationDir),
            isChangeVersion = (softinfo.allowChangeVersion && !isNormalProgram)
        ;
        //处理后的环境变量信息
        softinfo.environmentVariableX = {};
        if(environmentVariable){
            //如果是字符串，需要转为{ path:xxx}的格式
            if(typeof environmentVariable === "string"){
                environmentVariable = {
                    path : environmentVariable
                };
            }
        }
        if(that.load.module.array.isObject(environmentVariable)){
            for(let p in environmentVariable){
                let 
                    oneEvn = environmentVariable[p],
                    typeofOneEvn = (typeof oneEvn),
                    oneSetObj = {},
                    oneEvns = []
                ;
                oneEvns = (typeofOneEvn === "string") ? [oneEvn] : oneEvn;
                let
                    oneSetObjTmpArray = []
                ;
                // 此软件是可以改变版本号,则下级还要深入一层
                if(isChangeVersion){
                    oneEvns.forEach((theOne)=>{
                        let
                            //如果直接判断临时地址是存在的,则本次设置采用临时设置
                            oneEvnTmp = that.load.module.file.pathFormat(softinfo.applicationDir,theOne),
                            versions = that.load.node.fs.readdirSync(softinfo.applicationDir)
                        ;
                        //将版本号排序
                        versions.sort((a,b)=>{
                            return b>a;
                        });
                        theOne = theOne.replace(/[\\\/]+$/,``);
                        oneEvnTmp = that.load.module.file.pathFormat(oneEvnTmp);
                        //如果连接后的地址是相等的,则代表指定的环境变量是当前目录
                        //但因为此软件可以改变版本号,因此需要将最高版本号的当前目录设置为环境变量
                        if(oneEvnTmp === that.load.module.file.pathFormat(softinfo.applicationDir)){
                            oneEvnTmp = that.load.node.path.join(softinfo.applicationDir,versions[0]);
                        }
                        // 不存在时,则向下继续查找
                        if(!that.load.module.file.isDirSync(oneEvnTmp)){
                            //以查找到的第一个为准
                            versions.forEach((version)=>{
                                let
                                    versionPath = that.load.node.path.join(softinfo.applicationDir,version),
                                    queryEnvPathOne = that.load.module.file.queryPathSync(versionPath,theOne)
                                ;
                                //查找到,中断循环
                                if(queryEnvPathOne){
                                    oneEvnTmp = queryEnvPathOne;
                                    return;
                                }
                            });
                        }
                        //最终查找到的结果
                        oneSetObjTmpArray.push( oneEvnTmp );
                    });
                }else{
                    oneEvns.forEach((theOne)=>{
                        oneSetObjTmpArray.push( that.load.node.path.join(softinfo.applicationDir,theOne) );
                    });
                }
                //给出 environmentVariableX 处理过后的环境变量,以便在最后回调时调用
                softinfo.environmentVariableX[p] = (typeofOneEvn === "string") ? oneSetObjTmpArray.join(`;`) : oneEvn;
                //最后组织出的环境变量加入队列数组
                oneSetObj[p] = oneSetObjTmpArray.join(`;`);
                envQueue.push(oneSetObj);
            }
        }
        that.load.module.windows.setEvn(envQueue,()=>{
            //获取APP文件,建立快捷方式
            that.load.module.console.info(`CreateShortcutsInApplication...`,5);
            that.CreateShortcutsInApplication(softinfo,callback);
        });
    }

    /*
    @func 通过app建立快捷方式
    */
    CreateShortcutsInApplication(softinfo,callback){
        let
            that = this,
            application = softinfo.application,
            softName = softinfo.name,
            applicationList = [],
            typeofIs = (typeof application),
            icon = application,
            shortcutItem = function(){
                let o ={
                    args : ``,
                    shortcutType : []
                }
                return o;
            },
            shortcutType = function(){
                let o = {
                    startup : softinfo.startup,
                    allUsersDesktop : null,
                    allUsersStartMenu : null,
                    allUsersPrograms : null,
                    allUsersStartup : null,
                    desktop : true,//默认桌面图标
                    favorites : null,
                    fonts : null,
                    myDocuments : null,
                    netHood : null,
                    printHood : null,
                    programs : null,
                    recent : null,
                    sendTo : null,
                    startMenu : null,
                    templates : null,
                }
                ;
                for(let l in softinfo){
                    if(o[l] && softinfo[l]){
                        o[l] = softinfo[l];
                    }
                }
                return o;
            }
        ;
        if(typeofIs === "string" && application){
            that.load.module.console.info(`application is a String.`,4);
            let
                currentShortcutItem = new shortcutItem()
            ;
            currentShortcutItem.icon = icon;
            currentShortcutItem.application = application;
            currentShortcutItem.description = softName;
            currentShortcutItem.shortcutType = that.load.module.array.getObjectTrue((new shortcutType()),true);
            applicationList.push(currentShortcutItem);
        }else if(typeofIs === "object" && application instanceof Array  && application.length){
            that.load.module.console.info(`application is a Array.`,4);
            application.forEach((app)=>{
                let
                    currentShortcutItem = new shortcutItem()
                ;
                currentShortcutItem.icon = app;
                currentShortcutItem.application = app;
                currentShortcutItem.description = softName;
                currentShortcutItem.shortcutType = that.load.module.array.getObjectTrue((new shortcutType()),true);
                applicationList.push(currentShortcutItem);
            });
        }else if(application instanceof Object){
            that.load.module.console.info(`application is a Object.`,4);
            for(let p in application){
                let
                    app = application[p],
                    apps = []
                ;
                that.load.module.array.isArray(app) ? apps = app : apps = [app];
                for(let i = 0;i<apps.length;i++){
                    let
                        appItem = apps[i],
                        currentShortcutItem = new shortcutItem(),
                        currentShortcutType = new shortcutType()
                    ;
                    for(let l in appItem){
                        let
                            appItemOne = appItem[l]
                        ;
                        currentShortcutItem[l] = appItemOne;
                        if(l in currentShortcutType){
                            currentShortcutType[l] = appItemOne;
                        }
                    }
                    //将图标指向程序本身
                    let
                        _icon = p
                    ;
                    currentShortcutItem.application = p;
                    if(currentShortcutItem.icon && typeof currentShortcutItem.icon === "string"){
                        currentShortcutItem.icon = _icon;
                    }
                    currentShortcutItem.shortcutType = that.load.module.array.getObjectTrue(currentShortcutType,true);
                    //如果该软件自定了是否启动,以定义的为准
                    if(!currentShortcutItem.icon){
                        //如果有总的图标,则使用
                        if(softinfo.icon){
                            _icon = softinfo.icon;
                        }
                        currentShortcutItem.icon = _icon;
                    }
                    applicationList.push(currentShortcutItem);
                }
            }
        }
        applicationList.forEach((entry,index)=>{
            for(let m in entry){
                let
                    waitQueryItem = entry[m]
                ;
                if(waitQueryItem && that.load.module.string.isString(waitQueryItem)){
                    if(waitQueryItem.match(/\%.+?\%/)){
                        //如果没有程序入口,则不需要设置启动
                        for(let l in softinfo){
                            let
                                queryL = `%${l}%`,
                                queryResult = softinfo[l]
                            ;
                            if(waitQueryItem.includes(queryL)){
                                if(that.load.module.string.isString(queryResult)){
                                    applicationList[index][m] = waitQueryItem.replace(queryL,queryResult);
                                }else{
                                    that.load.module.console.waring(`${waitQueryItem.application} ${queryL} not is a string , replace fail.`);
                                }
                            }
                        }
                    }
                }
            }
            //如果没有程序入口,则不需要设置启动
            if(entry.application){
                that.load.module.console.info(`Query ${softinfo.applicationDir} to ${entry.application} path.`,4);
                that.load.module.console.info(`Query ${softinfo.applicationDir} to ${entry.icon} path.`,4);
                console.log(entry.icon);
                let
                    app_ = that.load.module.file.queryFileSync(softinfo.applicationDir,entry.application),
                    icon_ = that.load.module.file.queryFileSync(softinfo.applicationDir,entry.icon)
                ;
                entry.application = app_;
                entry.icon = icon_;
            }
        });
        //如果有快捷方式生成项
        if(applicationList.length > 0 ){
            that.load.module.windows.createShortcut(applicationList,()=>{
                //检查是否是启动项,是否需要设置
                that.getProgramInstallCallback(softinfo,callback);
            });
        }else{
            //没有快捷方式生成直接进入回调
            that.getProgramInstallCallback(softinfo,callback);
        }
    }

    /*
    @func 查找目录下的安装文件
    */
    queryInstallFile(dir,softinfo,callback){

        if(!dir)dir = softinfo.applicationDir;

        let
            that = this,
            application = softinfo.application,
            isOneExeFile = that.load.module.file.isOneExeFile(dir),
            applicationExists = (((typeof application) === "string") && application),
            setupFiles = ``
        ;
        /*-------------------------------------------------------------------*/
        if(application === null || application === false ){
            if(callback)callback(null);
        }else{
            if(applicationExists ){
                applicationExists = that.load.module.file.queryFileSync(dir,application);
            }
            /*-------------------------------------------------------------------*/
            if(applicationExists){
                callback(applicationExists);
            }else{
                if(isOneExeFile){
                    setupFiles = isOneExeFile;
                }else{
                    let
                        files = that.load.module.file.scanGetFileSync(dir),
                        exeFiles = [],
                        setupFileSize = 0,
                        setupCheckRegexp = /setup/ig
                    ;
                    files.forEach((file)=>{
                        if(that.load.module.file.isExeFile(file)){
                            exeFiles.push(file);
                        }
                    });
                    exeFiles.forEach((file)=>{
                        let
                            name = that.load.node.path.parse(file).name
                        ;
                        //1.优先查找带setup的文件
                        if(setupCheckRegexp.test(name)){
                            setupFiles = file;
                            return;
                        }
                        //2.查找文件名互相包含的项
                        if(name.includes(softinfo.name)){
                            setupFiles = file;
                            return;
                        }
                        //3.查找文件最大的项
                        let
                            stat = that.load.node.fs.lstatSync(file)
                        ;
                        if(stat.size > setupFileSize){
                            setupFiles = file;
                            setupFileSize = stat.size;
                        }
                    });
                }
                if(!setupFiles){
                    setupFiles = that.load.module.file.queryFileSync(dir,`setup.exe`);
                }
                if(callback)callback(setupFiles);
            }
        }
    }

    /**
     * @func 执行一个安装文件或者程序文件
     * @param softdir
     * @param isMsi
     * @param callback
     */
    executeMisfileOrExefile(softdir,softinfo,callback){
        let
            that = this,
            exeInstall = null,
            exeCallback = true,
            softdirParse = that.load.node.path.parse(softdir),
            isMsi = (softdirParse.ext.toLowerCase() === ".msi")
        ;
        if(isMsi){
            that.load.module.func.exec(softdir,(info)=>{
                if(callback && exeCallback){
                    exeCallback = false;
                    that.load.module.console.success(`Install exited with child_process exec.`);
                    that.keyCodeActions(softinfo,callback);
                }
            });
        }else{
            exeInstall = that.load.node.child_process.spawn(softdir);
            exeInstall.stdout.on('data', (data) => {
                that.load.module.console.info(data.toString(),4);
            });
            exeInstall.stderr.on('data', (data) => {
                that.load.module.console.error(data.toString());
            });
            exeInstall.on('exit', (code) => {
                if(callback && exeCallback){
                    exeCallback = false;
                    that.load.module.console.success(`Install exited with code ${code}`);
                    that.keyCodeActions(softinfo,callback);
                }
            });
            exeInstall.on('close', (code) => {
                if(callback && exeCallback){
                    exeCallback = false;
                    that.load.module.console.success(`Install close with code ${code}`);
                    that.keyCodeActions(softinfo,callback);
                }
            });
        }
    }

    /*
    @func 获取程序的回调路径
    */
    getProgramInstallCallback(softinfo,callback){
        let
            that = this,
            configCallback = softinfo.configCallback
        ;
        //不存在回调文件则创建
        that.createProgramInstallCallback(softinfo,(callbackName)=>{
            let
                _callbackClass = require(callbackName),
                callbackClass = new _callbackClass(that.o)
            ;
            callbackClass.o = that.o;
            callbackClass.option = softinfo.option;
            callbackClass.option.tmpDir = that.load.module.file.getTmpDir();
            callbackClass.option.getTmpDir = function(pathname=``){
                return that.load.module.file.getTmpDir(pathname)
            };
            softinfo.option = null;
            callbackClass.option.softinfo = softinfo;
            //回调前判断是否需要配置初始化
            if(configCallback){
                let
                    opt = [
                        "--windows",
                        "--config",
                        configCallback,
                        softinfo.name
                    ]
                ;
                that.load.run_module(`command`,opt,(option)=>{
                    //程序的安装结束将在回调集里结束
                    callbackClass.run(()=>{
                        that.keyCodeActions(softinfo,callback);
                    });
                });
            }else{
                //程序的安装结束将在回调集里结束
                callbackClass.run(()=>{
                    that.keyCodeActions(softinfo,callback);
                });
            }
        });

    }

    /*
    @func 如果有,启动.激活应用程序
    */
    keyCodeActions(softinfo,callback){
        let
            that = this,
            Activators = softinfo.activator
        ;
        if(Activators){
            that.load.module.console.info(`${softinfo.name} Activator...`,4);
            if(typeof Activators === "string"){
                Activators = [Activators]
            }
            (function GetActivator(ALen){
                if(ALen >= Activators.length){
                    if(callback)callback();
                } else {
                    //如果是JSON,则为 application入口程序
                    //如果是程序,则执行该程序
                    let
                        Activator = Activators[ALen],
                        typeOfActivator = (typeof Activator),
                        GNPathname = `${softinfo.group}/${softinfo.name}`,
                        ActivatorRootDir = that.option.sourceDir.activator,
                        ActivatorScanRoots = that.load.node.fs.readdirSync(ActivatorRootDir),
                        ActivatorPathnameDir = that.load.node.path.join(ActivatorRootDir,GNPathname),
                        ActivatorResults = []
                    ;
                    ActivatorScanRoots.forEach((ActivatorScanFile,index)=>{
                        let
                            ActivatorScanFilePath = that.load.node.path.join(ActivatorRootDir,ActivatorScanFile)
                        ;
                        if(!that.load.module.file.isFileSync(ActivatorScanFilePath)){
                           ActivatorScanRoots.splice(index,1);
                        }
                    });
                    that.load.module.file.mkdirSync(ActivatorPathnameDir);
                    //如果是文字, 则可能为激活码或者路径
                    if(typeOfActivator === "string"){
                        ActivatorResults.push({
                            name:Activator
                        });
                    } else {
                        for(let p in Activator){
                            let
                                ActivatorOne = Activator[ p ]
                            ;
                            ActivatorOne.name = p;
                            ActivatorResults.push(ActivatorOne);
                        }
                    }
                    (function ActivatorExec(len){
                        if(len >= ActivatorResults.length){
                            GetActivator(++ALen);
                        }else{
                            let
                                ActivatorObject = ActivatorResults[len],
                                ActivatorName = ActivatorObject.name,
                                ActivatorApplication = ActivatorObject.application,
                                ActivatorDir = that.load.node.path.join(ActivatorPathnameDir,ActivatorName)
                            ;
                            ActivatorScanRoots.forEach((ActivatorScanFile)=>{
                                //如果文件放在根目录,移动到对应的位置
                                if(ActivatorScanFile.includes(ActivatorName) || ActivatorName.includes(ActivatorScanFile)){
                                    let
                                        ActivatorScanFilePath = that.load.node.path.join(ActivatorRootDir,ActivatorScanFile)
                                    ;
                                    if(!that.load.module.file.isFileSync(ActivatorDir)){
                                        //that.load.node.fs.createReadStream(ActivatorScanFilePath).pipe(that.load.node.fs.createWriteStream(ActivatorDir));
                                        that.load.node.fs.renameSync(ActivatorScanFilePath,ActivatorDir);
                                    }
                                }
                            });
                            //如果是路径,则直接执行
                            if(that.load.module.file.isZipFile(ActivatorDir,true)){
                                let
                                    zipOption = [
                                        "zip",
                                        `--xtmp`,
                                        `target:"activator/${GNPathname}"`,
                                        `file:"${ActivatorDir}"`
                                    ]
                                ;
                                //为了防止这是一个可执行安装文件,需要先解压到临时目录
                                that.load.run_module(`command`,zipOption,(option)=>{
                                    let
                                        optCmd = `explorer "${option.target}"`,
                                        ActivatorApplicationPath = null
                                    ;
                                    //如果有入口程序,则要查找并打开
                                    if(ActivatorApplication){
                                        ActivatorApplicationPath = that.load.module.file.queryFileSync(option.target,ActivatorApplication);
                                    }
                                    if(ActivatorApplicationPath){
                                        that.load.module.console.info(`Activator in ${ActivatorApplicationPath}`,4);
                                        that.load.module.func.exec(ActivatorApplicationPath,()=>{
                                            that.load.module.func.exec(optCmd,()=>{
                                                GetActivator(++ALen);
                                            });
                                        });
                                    }else{
                                        that.load.module.func.exec(optCmd,()=>{
                                            GetActivator(++ALen);
                                        });
                                    }
                                });
                            }else if(that.load.module.file.isExeFile(ActivatorDir)){
                                that.load.module.func.execFileSync(ActivatorDir,()=>{
                                    GetActivator(++ALen);
                                });
                            }else{
                                //如果是文字,则为激活码
                                //需要写入文件,并打开
                                let
                                    keyCodePath= that.load.node.path.join(ActivatorPathnameDir,`${softinfo.name}KeyCode.txt`),
                                    optCmd = `notepad "${keyCodePath}"`
                                ;
                                that.load.module.file.writeFile(keyCodePath,ActivatorName,()=>{
                                    that.load.module.func.exec(optCmd,()=>{
                                        GetActivator(++ALen);
                                    });
                                });
                            }
                        }
                    })(0);
                }
            })(0);
        }else{
            if(callback)callback();
        }
    }

    /*
    @func 创建一个程序的回调文件
    */
    createProgramInstallCallback(softinfo,callback){
        let
            that = this,
            callbackPathname = `callback/${softinfo.group}/${softinfo.name}.class.js`,
            callbackName = that.load.node.path.join(softinfo.callbackBaseDir,callbackPathname),
            callbackNameDir = that.load.node.path.parse(callbackName).dir,
            callbackClass = that.createProgramInstallCallbackContent(softinfo)
    	;
        that.load.module.console.info(`Callback : ${callbackPathname}`,2);
    	that.load.module.file.mkdir(callbackNameDir,()=>{
			that.load.node.fs.exists(callbackName,(exists)=>{
	        	if(!exists){
	        		that.load.node.fs.writeFile(callbackName,callbackClass,"utf8",(err)=>{
	        			if(err)console.log(err);
	        			if(callback)callback(callbackName);
	        		});
	        	}else{
	        		if(callback)callback(callbackName);
	        	}
	        })
    	});
    }


    /*
    @func 创建一个程序的回调类初始内容
    */
    createProgramInstallCallbackContent(softinfo){
    	let
    	    callbackClass = `class _${softinfo.name}C{
	constructor(load){
		
	}
	run(callback){
		let
		that = this
		;
		that.load.module.console.info(\`start config software in \$\{that.option.softinfo.name\}\`,4);
		/*
		successfully
		*/
		that.load.module.console.success(\`Software \$\{that.option.softinfo.name\} installed successfully\`);
		if(callback){
			callback();
		}
	}
}
module.exports = _${softinfo.name}C;`
        ;
        return callbackClass;
    }

}

module.exports = installC;