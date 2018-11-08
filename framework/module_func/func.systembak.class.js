/*
* @func 系统备份的工具类
* */
class systembakC{

    constructor(load){
        
        
        
        
        
        
        

        
        

        
    }
    /**
     * 清除其他备份,只保留最近3个备份.
     */
    clearBakDir(){
        let that = this;
        let clearDir= that.sortBakDirs();

        clearDir.splice(-3);

        for(let i=0;i<clearDir.length;i++){
            that.load.module.file.deletedir(clearDir[i]);
        }
    }



    /**
     * @tools 取得备份目录的备份列表
     */
    getBakDirs(){
        let
            that = this,
            _bakDirs = that.load.node.fs.readdirSync(that.option.basicSystemBakDir),
            bakDirs = []
        ;

        for(let i =0;i<_bakDirs.length;i++){
            let dir_ = _bakDirs[i];
            if(that.isBakDir(dir_)){
                bakDirs.push(dir_);
            }
        }
        return bakDirs;
    }

    /**
     * @tools 判断是否是一个备份文件夹
     * @param dir
     */
    isBakDir(dir){
        let that = this;
        let isBakDirReg = /^\d+\-\d+\-\d+\-\d+\-\d+\-\d+$/;
        if(isBakDirReg.test(dir)){
            if(that.load.node.fs.existsSync(that.load.node.path.join(that.option.basicSystemBakDir,dir))){
                return true;
            }
        }
        return false;
    }

    /**
     * @tools 按大小顺序排列备份目录
     * @param dirs
     */
    sortBakDirs(dirs){
        let that = this;
        if(!dirs)dirs = this.getBakDirs();
        let sortDirs = [];
        for(let i=0;i<dirs.length;i++){
            let dirname = dirs[i];
            let dirnameEle = dirname.split('-');
            let _bakDate = new Date();

            _bakDate.setFullYear(dirnameEle[0]);
            _bakDate.setMonth(dirnameEle[1]-1);
            _bakDate.setDate(dirnameEle[2]);
            _bakDate.setHours(dirnameEle[3]);
            _bakDate.setMinutes(dirnameEle[4]);
            _bakDate.setSeconds(dirnameEle[5]);

            let _bakTimestamp = Date.parse(_bakDate);//.valueOf();getTime();
            sortDirs.push(_bakTimestamp);
        }

        sortDirs = sortDirs.sort();

        let bakDirs = [];

        for(let i=0;i<sortDirs.length;i++){
            let folderName = (new Date(sortDirs[i])).toLocaleString().replace(/\s+|\:/g,"-");
            let _clearDir = that.load.node.path.join(that.option.basicSystemBakDir,folderName);
            bakDirs.push(_clearDir);
        }

        return bakDirs;
    }


    /*
    @func 递归一个备份文件夹
    */
    getBackupsFolders(backupBasicDir,fn,title=""){
        let
        that = this,
        childrenDir = backupBasicDir.childrenDir,
        AllFolderBackup = []
        ;
        if(!that.option.count){
            that.option.count = 0;
        }
        that.option.count++;
        if( childrenDir ){
            for(let p in childrenDir){
                let 
                r = that.getBackupsFolders(childrenDir[p],fn,title+p+"/")
                ;
            }
        }else{
            title = title.replace(/\/\//ig,'/');
            //console.log( backupBasicDir.ignore );
            let
            needBackups = that.pathMatchParse(title,backupBasicDir.ignore)
            ;
            if(fn)fn(needBackups);
        }
    }

    /*
    @func 检测是否属于排除文件
    */
    checkIsNotIgnore(ignores,fold){                    
        let
        isIgnore = true
        ;
        //console.log(fold)
        ignores.forEach((ignoreExp)=>{
            if(fold.match(ignoreExp)){
                isIgnore = false;
                return isIgnore;
            }
        });
        return isIgnore;
    }

    /*
    @func 将带*的地址解析
    @expliam 目前只支持最后一级带 * 号
    */
    pathMatchParse(pathAddress,ignore){
        //如果有通配符
        if( pathAddress.includes("*") ){
            //------------------ * ------------------ * ------------------ * ------------------ * ------------------ * ------------------ *
            //则要将地址解析成数组
            let
                that = this,
                addressArray = pathAddress.split(/\\+|\/+/),
                backupFolderItemReg = new RegExp( that.load.module.string.stringWildcardRegularized(pathAddress),"ig"),
                oneAddressMatchChar = "",
                waitScanFolders = null,
                scanFolders = null,
                pathAddressArray = []
            ;
            addressArray.forEach( (oneAddress) => {
                if( oneAddress.includes("*") ){
                    oneAddressMatchChar = oneAddress;
                }else{
                    (!waitScanFolders) ? (waitScanFolders = oneAddress) : (waitScanFolders = that.load.node.path.join(waitScanFolders,oneAddress));
                }
            });
            if( that.load.node.fs.existsSync(waitScanFolders) && (scanFolders = that.load.node.fs.readdirSync(waitScanFolders)) ){
                let
                    folderReg = new RegExp(that.load.module.string.stringWildcardRegularized(oneAddressMatchChar),"ig")
                ;
                scanFolders.forEach( (fold) => {
                    if( fold.match(folderReg) && that.checkIsNotIgnore(ignore,fold) ){
                        pathAddressArray.push( that.load.node.path.join(waitScanFolders ,fold) );
                    }
                });
            }
            return pathAddressArray;
        }else{
            return [pathAddress]
        }
    }

    /*
    @func 备份一个用户数据
    */
    backupUserData(callback){
        let
        that = this
        ;
        //提示
        that.load.module.console.success(`Start backup ${that.option.execType} ...`);
        //创建新的备份文件夹
        that.load.module.file.mkdirSync(that.option.backupDir);
        //清空没用的空的备份文件夹
        that.load.module.file.deleteChildrenEmptyDir(that.option.basicSystemBakDir);
        /**
         * @tools 备份系统环境变量
         */
        let
            Environments = that.option.conf.extend[that.option.execType].Environment.EnvName,
            backupConfigJSON = that.load.node.path.join(that.option.backupDir,"Environments/"+that.option.conf.extend[that.option.execType].Environment.backupConfig),
            EnvironmentJsonContent = {}
        ;
        Environments.forEach((EvnName,i)=>{
            let
                queryName = `%${EvnName}%`,
                result = that.load.module.func.execSync(`echo ${queryName}`).join('\n')
            ;
            if(result === queryName){
                result = ``;
            }
            EnvironmentJsonContent[EvnName] = result;
        });
        that.load.module.file.writeFileSync(backupConfigJSON,JSON.stringify(EnvironmentJsonContent));
        //提示
        that.load.module.console.success(that.option.backupDir);
        //计算出需要备份的文件目录
        that.getBackupsFolders(that.option.conf.extend[that.option.execType].localBackupScope,(needBackupFolders)=>{
            needBackupFolders.forEach((backupOneFolder)=>{
                let
                    pathName = backupOneFolder.replace(/^.+?[\\\/]/,'').replace(/[\/|\\]+$/,''),
                    backupOneDir = that.load.node.path.join(that.option.backupDir,pathName)
                ;
                that.load.module.file.node_copy(backupOneFolder,backupOneDir,(data)=>{
                    if(callback)callback();
                });
            });
        });
    }


    /*
    @func 备份一个程序目录
    */
    backupProgram(){
        let
        that = this
        ;
        that.option.backupProgramList = [];
        //提示
        that.load.module.console.success(`Start backup ${that.option.execType} ...`);
        //创建新的备份文件夹
        that.load.module.file.mkdirSync(that.option.backupDir);
        //清空没用的空的备份文件夹
        that.load.module.file.deleteChildrenEmptyDir(that.option.basicSystemBakDir);
        // success 
        that.load.module.console.success(that.option.backupDir);
        //计算出需要备份的文件目录
        that.getBackupsFolders(that.option.conf.extend[that.option.execType].localBackupScope,(needBackupFolders)=>{
            needBackupFolders.forEach((backupOneFolder)=>{
                let
                pathName = backupOneFolder.replace(/^.+?[\\\/]/,'').replace(/[\/|\\]+$/,''),
                backupOneDir = that.load.node.path.join(that.option.backupDir,pathName+".7z")
                ;
                that.option.backupProgramList.push({
                    "zip":true,
                    "--c":true,
                    file:backupOneFolder,
                    target:backupOneDir
                });
            });
        });
        (function executeZip(len){
            if(len < that.option.backupProgramList.length){
                let
                    backupOne = that.option.backupProgramList[len],
                    ZipSourceTarget = ["--zip","--c",`file:"${backupOne.file}"`,`target:"${backupOne.target}"`]
                ;
                that.load.module.console.success(`Backup program [${len+1}/${that.option.backupProgramList.length}] : ${backupOne.file} to ${backupOne.target}`);
                that.load.run_module(`command`,ZipSourceTarget,()=>{
                    executeZip(++len);
                });
            }
        })(0);
    }


    /**
     * @func 获取当前安装的操作系统
     */
    getCurrentSystemOsIOSFile(){
        let
            that = this,
            sourceDir = that.load.config.platform.base.sourceDir.thisOS,
            thisOS = that.load.node.fs.readdirSync(sourceDir),
            OSFileTest = /windows\_10/i,
            OSName = ``
        ;
        thisOS.forEach((thisOSOne)=>{
            if(thisOSOne.match(OSFileTest)){
                OSName = thisOSOne;
                return;
            }
        });
        if(!OSName)OSName = thisOS[thisOS.length -1];
        OSName = that.load.node.path.join(sourceDir,OSName);
        return OSName;
    }


    /**
     * @func 初始化 node.js 系统
     */
    initnodejs(){
        let
            that = this,
            apps = that.load.core.path.apps,
            nodeJsPath = that.load.node.path.join(apps,"nodejs/"),
            requireInstall = that.option.extend.extend.requireInstall
        ;
        requireInstall.forEach((requireInstallOne,index)=>{
            let
                requireInstallOneFull = nodeJsPath+ requireInstallOne
            ;
            requireInstall[index] = requireInstallOneFull;
            console.log(requireInstallOneFull);
        });
        that.load.module.func.exec(requireInstall,(info)=>{
            that.load.module.windows.setEvn({
                PATH:nodeJsPath
            });
            console.log(`Node.js is initialized successfully.`);
        },true);
    }

    /**
     * @func 初始化 windows 系统
     */
    initWindows(){
        let
            that = this,
            base = that.load.config.platform.base,
            sourceDir = base.sourceDir,
            workDir = base.workDir,
            tmpDir = that.load.node.path.join(base.local.tmpDir,`.init.windows`),
            currentOs = that.getCurrentSystemOsIOSFile(),
            installNet45 = that.option.extend.extend.installNet45
        ;

        that.load.module.module.runCommandModule([
            "zip",
            "xtmp",
            `file:"${currentOs}"`
        ],(zipInfo)=>{
            let
                sources_sxs = that.load.node.path.join(zipInfo.target,`sources/sxs`).replace(/\//ig,`\\`),
                installNet = [
                    `dism.exe /online /Get-Feature`//取得可安装的项
                ]
            ;
            installNet45.forEach((installNetPage)=>{
                let
                    installNetCommand =`dism.exe /online /enable-feature /featurename:${installNetPage} /Source:${sources_sxs}`
                ;
                installNet.push(installNetCommand);
            });
            //添加右键菜单
            that.load.module.windows.addRightMenuSync("CMD run as Administrator Here","cmd.exe /s /k pushd \\\"%V\\\"",{type:"base",runas:true});
            //设置 framework 下 apps 基本的PATH
            //NODE.js等
            let
                appsPath = that.load.core.path.apps,
                apps = that.load.node.fs.readdirSync(appsPath),
                envObject = {
                    path : []
                }
            ;
            apps.forEach((app)=>{
               let
                   appPath = that.load.node.path.join(appsPath,app)
                ;
                envObject.path.push(appPath);
            });
            that.load.module.windows.setEvn(envObject);
            //添加自定的个性菜单

            return;
            //开始安装.net 4.5
            that.load.module.console.success(`Start install .net 4.5...`);
            that.load.module.func.exec(installNet,(err)=>{
                that.load.module.console.success(`Install .net 4.5 finish...`);
                //开始添加右键菜单
            },true/*显示输出信息*/);
        });
        //调用thisOs下的Windows安装盘,解压并安装net 3. net 4

        //安装vc++系统
/*
*
*

* */
        //设置基本右键菜单 cmd

        //设置文件
    }
}

module.exports = systembakC;