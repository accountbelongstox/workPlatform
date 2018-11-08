
class index{
    constructor(load){

    }

    run(){
        let
            that = this
        ;
        //平台配置 Object
        that.option.platformBase = that.load.config.platform.base;
        //全局配置里的软件安装配置 Object
        that.option.sourceDir = that.option.platformBase.sourceDir;
        //工作目录 Object
        that.option.workDir = that.option.platformBase.workDir;
        //全局配置里的软件安装目录
        that.option.applicationDir = that.option.workDir.application;
        //软件安装列表
        that.option.installList = that.load.support.install;
        //安装单个软件
        that.option.onesoft = that.load.params.get(`onesoft`);
        if(!that.option.onesoft){
            //安装单个软件
            that.option.onesoft = that.load.params.get(`one`);
        }
        //查找软件
        that.option.querySoft = that.load.params.get(`query`);
        //安装所有软件
        that.option.allsoft = that.load.params.get(`allsoft`);
        //所有支持的软件
        that.option.softlist = that.list(false);
    }

    /*
    @func 安装一个软件
    */
    one(callback,softname=null,force=false){
        let
            that = this
        ;
        return that.onesoft(callback,softname,force);
    }
    /*
    @func 安装一个软件
    */
    onesoft(callback,softname=null,force=null,groupNext=null,softNext=null,cmdCallback=null){
        let 
            that = this,
            //回调的CMD命令
            callbackCommand = (function (){
                let
                    cmd = (cmdCallback === null) ? that.load.params.get(`cmd`) : cmdCallback
                ;
                if(cmd){
                    cmd = cmd.split(/\,/);
                }
                return cmd;
            })()
        ;
        //强制安装
        if(force === null)force = that.load.params.get(`force`);
        //当前分组的下一个软件将继续被安装
        if(groupNext === null)groupNext = that.load.params.get(`group-next`);
        //总列表下一个软件将继续被安装
        if(softNext === null)softNext = that.load.params.get(`next`);
        if(!softname)softname = that.load.module.array.find(that.option.softlist,that.option.onesoft,true);
        that.load.module.console.info(`start install software ${softname} ...`,8);
        for(let p in that.option){
            if( !that.load.module_func.install.option[ p ] ){
                that.load.module_func.install.option[ p ] = that.option[ p ]
            }
        }

        if(!softname){
            that.load.module.console.error(` not find software : ${that.option.onesoft}\n please use *--list* qurey soft list.`);
            that.query(callback,that.option.onesoft);
        }else{
            //1. 如果是exe则直接执行
            //2. 如果可以解压,则解压到临时目录,然后查找是否是setup.exe安装
            //3. 如果是zip安装则node.js安装
            let
                softinfo = that.load.module_func.install.getSoftInfo(softname),
                xTarget = `x`
            ;
            if(callback){
                let
                    _callback = callback
                ;
                callback = function(){
                    let
                        commandCallbackExecuteFinish = function(){
                            //分组的下一个软件是否要安装
                            if(groupNext || softNext){
                                let
                                    installList = that.option.installList,
                                    groupQuery = false,
                                    groupSoft = null,
                                    nextSoftName
                                ;
                                if(groupNext){
                                    for(let p in installList){
                                        let
                                            groupOne = installList[ p ],
                                            listOne = groupOne.list
                                        ;

                                        groupQuery = false;

                                        if(groupSoft)break;

                                        for(let o in listOne){
                                            let
                                                oneSoft = listOne[o]
                                            ;
                                            if(groupQuery && !groupSoft){
                                                groupSoft = oneSoft;
                                            }else if(groupQuery){
                                                break;
                                            }
                                            if(oneSoft.name === softname){
                                                groupQuery = true;
                                            }
                                        }
                                    }
                                }
                                nextSoftName = (groupSoft && ("name" in groupSoft) && groupSoft.name) ?　groupSoft.name : ``;
                                if(softNext){
                                    let
                                        softIndex = that.option.softlist.findIndex(value => value === softname)
                                    ;
                                    if(!nextSoftName){
                                        nextSoftName = that.option.softlist[softIndex+1]
                                    }
                                }
                                //如果发现下一个软件,则继续安装
                                if(nextSoftName){
                                    //不强制，但如果有下一个安装，则要一直安装下去
                                    return that.onesoft(_callback,nextSoftName,null,groupNext,softNext);
                                }else{
                                    if(_callback)_callback();
                                }
                            }else{
                                if(_callback)_callback();
                            }
                        }
                    ;
                    //回调有CMD时先执行CMD
                    if(callbackCommand){
                        that.load.module.func.exec(callbackCommand,(err)=>{
                            commandCallbackExecuteFinish();
                        });
                    }else{
                        commandCallbackExecuteFinish();
                    }
                };
            }
            //安装前要求重启系统
            if(softinfo.installBeforeRestart && !force){
                let
                    readLine = that.load.node.readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    })
                ;
                that.load.module.console.info(`You need to restart the system before installation the software in ${softname}...`,8);
                readLine.question(`Do you want to restart the system immediately? (y|n) : `, (answer) => {
                    let
                        batFileName = `install-${softname}.BAT`
                    ;
                    that.load.module.windows.startup(``,batFileName,(startupResult)=>{
                        let
                            applicationPath = startupResult.application,
                            appName = that.load.node.path.parse(applicationPath).name,
                            programsDir = that.load.node.path.join(startupResult.programsDir,`${appName}.lnk`),
                            //安装前要求重启系统命令行
                            systemReset = that.load.node["iconv-lite"].encode(`${that.load.core.path.commandBat} wintools install --onesoft:"${softname}" --force${groupNext ? ` --group-next` : ``}${softNext ? ` --next` : ``} --cmd:"DEL \\"${applicationPath}\\",DEL \\"${programsDir}\\""`, `gbk`)
                        ;
                        that.load.node.fs.appendFile(applicationPath,systemReset,(err)=>{
                            if(err)console.log(err.toString());
                            if(answer && ( (answer = answer.toLowerCase()) === "y" || answer === "yes") ){
                                let
                                    shutdown = `shutdown /r /t 15`
                                ;
                                that.load.module.func.exec(shutdown,()=>{
                                    (function stopRestarting(){
                                        that.load.module.console.info(`Warning : `,2);
                                        readLine.question(`Stop restarting ? (y|n) `, (answer) => {
                                            if(!answer || answer.toLowerCase() !== "n"){
                                                //中止重启
                                                that.load.module.func.exec(`shutdown /a`,()=>{
                                                    that.load.module.console.info(`System restart has been cancelled. Please restart manually.`,8);
                                                    readLine.close();
                                                });
                                            }else{
                                                stopRestarting();
                                            }
                                        });
                                    })();
                                });
                            }else{
                                that.load.module.console.info(`End of installation, Please restart the system manually.`,8);
                            }
                        });
                    });
                });
            }else{
                //如果软件本地没有，则下载
                that.load.module_func.install.getLocalSoftwaerOrNotDownload(softinfo,(softdir)=>{
                    softinfo["softdir"] = softdir;
                    softinfo.setupInstall ? xTarget = `--xtmp` : xTarget = `--x`;
                    //如果软件是一个可执行文件,则直接执行即可,通过检测线程判断是否安装完成
                    if(softdir){
                        if(softinfo.setupInstall  && that.load.module.file.isExeFile(softdir)){
                            that.load.module_func.install.executeInstallFile(softinfo,callback);
                            //如果软件是压缩文件,则先提取解压,再查找内部是否有setup.exe安装文件,如果有则执行安装文件
                        }else if(that.load.module.file.isZipFile(softdir)){
                            let
                                args =[
                                    xTarget,
                                    `file:"${softdir}"`,
                                    `target:"${softinfo.applicationDir}"`
                                ],
                                zipModule = that.load.module.module.getModule(`zip`,args),
                                applicationDirExists = (that.load.node.fs.existsSync(softinfo.applicationDir) && !softinfo.setupInstall)
                            ;
                            if(applicationDirExists && force){
                                that.load.module.file.deleteSync(softinfo.applicationDir);
                            }
                            console.log(zipModule);
                            //快速安装,不执行解压解压
                            (force || !applicationDirExists) ? zipModule.option.run = true : zipModule.option.run = false;
                            applicationDirExists = that.load.node.fs.existsSync(softinfo.applicationDir);
                            zipModule.run((option)=>{
                                softinfo["tmp"] = option.target;
                                softinfo["forceInstall"] = force;
                                softinfo["option"] = that.option;
                                softinfo["callbackBaseDir"] = __dirname;
                                if(applicationDirExists){
                                    that.load.module_func.install.startInstall(softinfo,()=>{
                                        if(callback)callback();
                                    },true);
                                }else{
                                    let
                                        isOneFolder = that.load.module.file.isOneFolder(softinfo.tmp),
                                        isNormalProgram = that.load.module.file.isNormalProgram(softinfo.tmp)
                                    ;
                                    //如果是安装文件
                                    //解压完成后查看此文件是否是可执行的安装文件
                                    if(softinfo.setupInstall){
                                        //通过各类优先级查找出要执行的文件名,然后开始执行
                                        that.load.module_func.install.startInstall(softinfo,()=>{
                                            if(callback)callback();
                                        });
                                        //如果当前只有一个文件夹,并且是不可改变版本号的软件,则提升至上一级
                                    }else if(isOneFolder && !softinfo.allowChangeVersion){
                                        that.load.module_func.install.OnlyOneFolderIsSuperior(softinfo.tmp,()=>{
                                            that.load.module_func.install.startInstall(softinfo,()=>{
                                                if(callback)callback();
                                            });
                                        });
                                        //如果是可以改变软件版本号,同是是一个普通程序,则下降一级别
                                    }else if(softinfo.allowChangeVersion && isNormalProgram ){
                                        that.load.module_func.install.OnlyOneFolderIsDesc(softinfo,()=>{
                                            that.load.module_func.install.startInstall(softinfo,()=>{
                                                if(callback)callback();
                                            });
                                        });
                                    }else{
                                        that.load.module_func.install.startInstall(softinfo,()=>{
                                            if(callback)callback();
                                        });
                                    }
                                }
                            });
                        }
                    }else{
                        that.load.module.console.error(`Not find soft dir in ${softname}.`);
                        if(callback){
                            callback(false);
                        }
                    }
                });
            }
        }
    }


    /*
    @func 安装所有软件
    */
    allsoft(callback,installListSortArray){
        //1.先安装编程平台
        //2.安装系统软件
        //3.安装数据库
        //4.安装服务器平台
        //6.安装其他软件
        let
            that = this,
            installList = that.option.installList
        ;
        if(!installListSortArray){
            for(let p in installList){
                let
                    installListOne = installList[p]
                ;
                installListOne.group = p;
                installListSortArray.push(installListOne);
            }
            installListSortArray.sort((a,b)=>{
                return a.sort - b.sort;
            });
        }
        (function StartSoftGorup(GLen){
            if(GLen >= installListSortArray.length){
                if(callback)callback();
            }else{
                let
                    GObject = installListSortArray[GLen],
                    GList = GObject.list,
                    GGroup = GObject.group,
                    GSort = GObject.sort,
                    GSoftArray = []
                ;
                for(let p in GList){
                    let
                        GSoftOne = GList[p]
                    ;
                    GSoftArray.push(GSoftOne);
                }
                (function StartSoftOne(SLen){
                    if(SLen >= GSoftArray.length){
                        StartSoftGorup(++GLen);
                    }else{
                        let
                            SObject = GSoftArray[SLen],
                            SName = SObject.name
                        ;
                        that.load.module.console.info(`Start install software ${SName}`,3);
                        //StartSoftOne(++SLen);
                        that.onesoft(()=>{
                            StartSoftOne(++SLen);
                            that.load.module.console.success(`${SName} install finish!`);
                        },SName,false,true);
                    }
                })(0);
            }
        })(0);
    }

    /*
    @func 安装一组软件
    */
    group(callback){
        //1.先安装编程平台
        //2.安装系统软件
        //3.安装数据库
        //4.安装服务器平台
        //6.安装其他软件
        let
            that = this,
            group = that.option.onesoft = that.load.params.getValue(`group`),
            installList = that.option.installList,
            installListSortArray = [],
            groupList = [],
            isGroup = null
        ;
        for(let p in installList){
            let
                installListOne = installList[p]
            ;
            groupList.push(p);
            installListOne.group = p;
            installListSortArray.push(installListOne);
        }
        installListSortArray.sort((a,b)=>{
            return a.sort - b.sort;
        });
        if(group && (isGroup = that.load.module.array.findX(groupList,group))){
            for(let index = 0;index < installListSortArray.length;index++){
                let
                    installOne = installListSortArray[index]
                ;
                if(installOne.group !== isGroup){
                    installListSortArray.splice(index,1);
                    index--;
                }
            }
            that.allsoft(()=>{
                that.load.module.console.success(`Group ${isGroup} install success!`);
                if(callback){
                    callback();
                }
            },installListSortArray);
        }else{
            that.load.module.console.error(`Not find the group ${group}`);
            console.log(groupList);
        }
    }

    /*
     @func 查找一个软件包
     */
    query(callback,queryName=null){
        let
            that = this,
            softname = queryName ? queryName.toUpperCase() : that.option.querySoft.toUpperCase(),
            queryListResult= [],
            queryResult= {},
            installList = that.option.installList
        ;
        that.option.softlist.forEach((softOne)=>{
            if(softOne.toUpperCase().includes(softname)){
                queryListResult.push(softOne);
            }
        });
        queryListResult.forEach((queryOne)=>{
            for(let group in installList){
                let
                    installListGroup = installList[ group ],
                    installListGroupList = installListGroup.list,
                    sort = installListGroup.sort
                ;
                for(let md5name in installListGroupList ){
                    let
                        soft = installListGroupList[ md5name ]
                    ;
                    if(soft.name.toUpperCase() === queryOne.toUpperCase()){
                        if( !(group in queryResult) ){
                            queryResult[ group ] = {
                                sort,
                                list:{}
                            };
                        }
                        queryResult[ group ].list[ md5name ]=soft
                    }
                }
            }
        });
        that.load.module.console.info(`Query soft ${softname} result.`,4);
        that.list(true,queryResult);
    }

    /*
    @func 列表支持的软件 
    */
    list(show=true,installList=null){
        let 
            that = this,
            list = [],
            sortObjectTmp = [],
            listShowIgnores = [
                `group`,`md5`,`downUrl`,`name`,`callbackBaseDir`,`callback`,`activator`
            ],
            _installList = {}
        ;
        if(!installList){
            installList = that.option.installList;
        }
        for(let p in installList){
            sortObjectTmp.push(installList[p].sort);
        }
        //将分组降序排列
/*        sortObjectTmp.sort((a,b)=>{
            return b-a;
        });*/
        //排序
        sortObjectTmp.forEach((sortOne)=>{
            for(let p in installList){
                let
                installListOne = installList[p]
                ;
                if(installListOne.sort === sortOne){
                    _installList[p]=installListOne;
                }
            }
        });
        //排序后再次赋值回来
        installList = _installList;
        for(let p in installList){
            let
                installListOne = installList[p],
                softList = installListOne.list
            ;
            if(show || show==null)console.log('\n\x1B[44m%s\x1B[0m \x1B[90m%s\x1B[0m',p,` - sort:${installListOne.sort}`);
            for(let o in softList){
                let
                    softOne = softList[o],
                    soft_obj = softList[o],
                    soft_name = soft_obj.name,
                    ohterInfoArr = [],
                    showType = 6,
                    ohterInfo = null
                ;
                for(let softParamName in softOne){
                    let
                        softParam = softOne[softParamName],
                        isSoftParam = false,
                        typeofSoftParam = (typeof softParam),
                        isShow = true,
                        softParamTranslate = null
                    ;
                    listShowIgnores.forEach((listShowIgnore)=>{
                        if(listShowIgnore === softParamName){
                            isShow = false;
                            return;
                        }
                    });
                    if(isShow){
                        if(typeofSoftParam === "string" && softParam){
                            isSoftParam = true;
                            softParamTranslate = `${softParamName}:${softParam}`;
                        }else if(softParam instanceof Array && softParam.length > 0){
                            isSoftParam = true;
                            softParamTranslate = JSON.stringify(softParam);
                        }else if(typeofSoftParam === "boolean" && softParam){
                            isSoftParam = true;
                            softParamTranslate = softParamName;
                        }else if(typeofSoftParam === "object" ){
                            for(let testSoft in softParam){
                                isSoftParam = true;
                            }
                            softParamTranslate = `${softParamName}:${JSON.stringify(softParam)/*.replace(/[\{\}]+/ig,``)*/}`;
                        }
                        if(isSoftParam){
                            ohterInfoArr.push( softParamTranslate );
                        }
                    }
                }
                ohterInfoArr = that.load.module.array.filter(ohterInfoArr);
                ohterInfo = ohterInfoArr.join(` / `);
                //没有任何附加信息的软件红色提示
                if(!ohterInfo){
                    showType = 8;
                }else{
                    ohterInfo = `---- <${ohterInfoArr.length}> ${ohterInfo}`
                }
                if(show || show==null){
                    if(ohterInfo){
                        console.log('\t\x1B[42m%s\x1B[0m \x1B[90m%s\x1B[0m ', soft_name,ohterInfo);
                    }else{
                        console.log('\t\x1B[31m%s\x1B[0m ', soft_name);
                    }
                }
                list.push(soft_name);
            }
        }
        return list;
    }


    /*
    @func 强制重新扫瞄资源文件夹,认证每个文件包的MD5码 
    */
    scanlistx(callback){
        return this.scanlist(callback,true);
    }


    /*
    @func 根据资源文件扫出安装配置 
    */
    scanlist(callback,scanlistx=false){
        let 
            that = this,
            softtypes = this.o.node.fs.readdirSync(that.option.sourceDir.softwareSourceDir),
            o = {}
        ;
        return (function scanSoftType(typelen){
            if(typelen < softtypes.length ){
                let
                    softtype = softtypes[typelen],
                    softtypefullpath = that.load.node.path.join(that.option.sourceDir.softwareSourceDir,softtype),
                    softs = that.load.node.fs.readdirSync(softtypefullpath)
                ;
                o[softtype] = {
                    sort : typelen,
                    list : {}
                };
                // 如果之前有排序,以之前的为主
                if(that.option.installList[softtype] && ("sort" in that.option.installList[softtype]) ){
                    o[softtype].sort = that.option.installList[softtype].sort;
                }
                //对单个文件进行扫描
                return (function scanSoft(softlen){
                    if(softlen < softs.length ){

                        let
                            softOneName = softs[softlen],
                            softOnePath = that.load.node.path.join(softtypefullpath,softOneName),
                            softNameName = that.load.node.path.parse(softOnePath).name,
                            softNameLen = 4,
                            softnameA = softNameName.substr(0,softNameLen),
                            softnameB = softNameName.substr(softNameLen),
                            softName = `${softnameA.replace(/[\_\-]+|\s+|\.+|\++/gi,'')}${softnameB.replace(/\d.+|[\_\-]+|\s+|\.+|\++/gi,'')}`,
                            alreadyName = null,//如果文件名已经存在
                            alreadySoftName = null,//如果文件名被格式化后存在
                            alreadyMd5name = null
                        ;
                        //中文转英文          
                        softName = that.load.module.string.chinesetounicode(softName);
                        softName = softName.replace(/\\/ig,'');
                        //数字前加_
                        if(/^\d+/.test(softName))softName = `_${softName}`;
                        //如果已经存在则不必要再次读取
                        if(that.option.installList[softtype]){
                            for(let p in that.option.installList[softtype].list){
                                let
                                    _tmpInstall = that.option.installList[softtype].list[p]
                                ;
                                //如果文件名已经存在
                                if(softOneName === _tmpInstall.downUrl){
                                    alreadyName = _tmpInstall.downUrl,
                                        alreadyMd5name = p;
                                }
                                //如果文件名被格式化后存在
                                if(softName === _tmpInstall.name){
                                    alreadySoftName = _tmpInstall.name,
                                        alreadyMd5name = p;
                                }
                            }
                        }
                        softlen++;
                        //如果已经存在则不必要再次读取
                        if(alreadyName && !scanlistx/*非x强制模式*/){
                            o = setSoftList(o,softtype,alreadyMd5name/*-已经存在-*/,softName,alreadyName/*-已经存在-*/,softlen,typelen,softtypes,softs,softOnePath,true);
                            //下一个
                            scanSoft(softlen);
                        }else if(alreadySoftName && !scanlistx/*非x强制模式*/){
                            o = setSoftList(o,softtype,alreadyMd5name/*-已经存在-*/,alreadySoftName/*-已经存在-*/,softOneName,softlen,typelen,softtypes,softs,softOnePath,true);
                            //下一个
                            scanSoft(softlen);
                        }else{
                           //如果是全新则计算MD5脚本
                            that.load.module.file.md5(softOnePath,(md5name)=>{
                                o = setSoftList(o,softtype,md5name,softName,softOneName,softlen,typelen,softtypes,softs,softOnePath,null);
                                //下一个
                                scanSoft(softlen);
                            }); 
                        }
                    } else {
                        //第二组开始扫描
                        typelen++;
                        scanSoftType(typelen);
                    }
                })(0)
            }else{
                o = that.load.module.array.sort(o,function(a,b){return a.list.sort - b.list.sort});
                //全部扫描完成
                let
                    installJsonFile = that.load.node.path.join(that.load.core.path.support,"install.json"),
                    bakJsonFileNameTime = "install.bak."+that.load.module.time.format("yyyy-mm-dd-hh-mm-ss")+".json",
                    bakJsonFileName = that.load.node.path.join(that.load.core.path.support,bakJsonFileNameTime),
                    bakJsonContent = that.load.node.fs.readFileSync(installJsonFile)
                ;
                //备份原来文件
                that.load.node.fs.writeFileSync(bakJsonFileName,bakJsonContent,"utf8");
                //替换新的文件
                that.load.node.fs.writeFileSync(installJsonFile,JSON.stringify(o),"utf8");
                that.load.module.console.success(`Scanlist finish...`);
                //打印出效果
                that.list(true,o);
                return o;
            }
        })(0);
        //scanlist 附加函数.
        function setSoftList(o,softtype,md5name,softName,softOneName,softlen,typelen,softtypes,softs,softOnePath,isNew=null){
            let
            sohwType = 4,
            infoText = `
Progress : [${typelen+1}/${softtypes.length}][${softlen}/${softs.length}]
Group : ${softtype} 
\tMD5 : ${md5name}
\tFile : ${softOneName} 
\tSoftware Path : ${softOnePath}\n`
            ;
            if(isNew){
                sohwType = 6;
                infoText += `Already exists `;
            }
            that.load.module.console.info(infoText,sohwType);
            o[softtype].list[md5name] = {
                sort : softlen,
                group:softtype,
                name :softName,
                md5 :md5name,
                icon :"",
                downUrl :softOneName,
                description :``,
                setupInstall:( (/setup.+?\.exe$/ig.test(softOneName)) ? true : false ),
                allowConfig : false,//是否支持被配置
                allowChangeVersion : false,//允许切换版本
                //APP入口
                application:[],
/*                shortcut:{
                    Desktop:[],
                    Programs:[],
                    StartMenu:[],
                    Favorites:[],
                    MyDocuments:[],
                    Recent:[],
                    SendTo:[],
                    Templates:[],
                    Startup:false,
                },*/
                //是否有数据备份
                environmentVariable:null,
                //是否要安装为服务
                //TODO 如果安装服务,则根据命令查找环境变量路径提交安装
                service:null,
                dataBackup:[],
                Activator:"",//激活程序
                callbackBaseDir:__dirname,
                callback : softName
                //configCallback 初始化配置
            }
            if(that.option.extend.setEnvironment.indexOf(softtype) !== -1){
                o[softtype].list[md5name].environmentVariable = {
                    path:"./bin"
                }
            }
            //1.如果被移到其他组,则一样同步
            for(let p in that.option.installList){
                let 
                installOne = that.option.installList[p].list
                ;
                for(let p2 in installOne){
                    //如果有名称相等的.
                    if(p2 == md5name || p2 == softName ){
                        let
                        _finishSoftOneDetail = installOne[p2]
                        ;
                        //将同步项值同步给新生成的
                        for(let p3 in _finishSoftOneDetail){
                            o[softtype].list[md5name][p3] = _finishSoftOneDetail[p3];
                        }
                    }
                }
            }
            //2.如果正则数据一致,版本号不同,也更新前数据
            if(that.option.installList[softtype] && that.option.installList[softtype].list){
                let
                    _list = that.option.installList[softtype].list
                ;
                //将同步项值同步给新生成的
                for(let p in _list){
                    let
                        listOne = _list[p],
                        _softName = listOne.name,
                        _softNameReg = that.load.module.string.createRegExp(_softName,"i")
                    ;
                    if(_softNameReg.test(softName)){
                        for(let p in listOne){
                            o[softtype].list[md5name][p] = listOne[p];
                        }
                    }
                    //o[softtype].list[md5name][p] = _finishSoftOneDetail[p];
                }
            }
            //3.如果本地被修改过，兼容旧的
            if(that.option.installList[softtype] && that.option.installList[softtype].list[softName]){
                if(that.option.installList[softtype]){
                    let
                        _finishSoftOneDetail = that.option.installList[softtype].list[softName]
                    ;
                    //将同步项值同步给新生成的
                    for(let p in _finishSoftOneDetail){
                        o[softtype].list[md5name][p] = _finishSoftOneDetail[p];
                    }
                }
            }
            //4.如果本地被修改过，那扫出来的将以修改过的值为准
            if(that.option.installList[softtype] && that.option.installList[softtype].list[md5name]){
                let
                _finishSoftOneDetail = that.option.installList[softtype].list[md5name]
                ;
                //将同步项值同步给新生成的
                for(let p in _finishSoftOneDetail){
                    o[softtype].list[md5name][p] = _finishSoftOneDetail[p];
                }
            }
            //需要强制更新的
            o[softtype].list[md5name]["downUrl"] = softOneName;
            o[softtype].list[md5name]["name"] = softName;
            o[softtype].list[md5name]["callback"] = softName;
            o[softtype].list[md5name]["callbackBaseDir"] = __dirname;
            //创建回调脚本
            that.load.module_func.install.createProgramInstallCallback(o[softtype].list[md5name]);
            return o;
        }
    }
}
module.exports = index;