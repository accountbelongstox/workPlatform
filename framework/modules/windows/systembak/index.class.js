/**
 * @tools 系统备份执行
 * @command 备份系统 ddrun windows systembak bak [bakdir]
 */


class index{

    constructor(o){
    }

    run(callback){
        let
            that = this,
            getSave = that.o.params.get("dir"),
            command = that.o.params.contain(that.option.params)
        ;
        //本次执行命令
        that.option.command = command;
        if(!that.option.backupDirs){
            that.option.backupDirs = {
                Environment:[],
                BackupDirs:[]
            };
        }
        //备份或恢复类型
        that.option.execType = that.o.params.contain(that.option.conf.mustParams[command].mustParams);
        //如果指定备份目录,则按指定的目录
        that.option.basicSystemBakDir = getSave ? getSave : that.option.conf.extend[that.option.execType].localBackupDirectory;
        //extend
        that.option.extend = that.option.conf.extend[that.option.execType];
        //系统用户根目录
        that.option.homedir =that.o.tool.windows.homedir();
        //当前登陆用户名
        that.option.currentOSUser =that.o.tool.windows.currentUser();
        that.o.tool.console.info(`systembak in ${command}:`,2);
        if(!that[command]){
            that.o.tool.console.error(`not find function : ${command}:`);
        }
    }

    /**
     * @func 恢复系统备份
     * @param opt
     * @param o
     */
    recovery(opt,o){

        let
            that = this,
            params = that.option.conf.mustParams[that.option.command].mustParams,
            command = that.o.params.contain(params)
        ;
        //传值给工具类
        that.o.func.systembak.option = that.option;
        switch (command) {
            case "init":
                //初始化windows系统
                that.o.func.systembak.initWindows();
                break;
            case "initnodejs":
                //初始化nodejs,在新系统安装时
                that.o.func.systembak.initnodejs();
                break;
        }
    }

    /*
    恢复用户数据
    恢复环境变量
    恢复右键菜单
    */
    step1(){
        let
            that = this,
            systemBakDir = that.o.func.systembak.getBakDirs(),
            recoverType = that.o.params.contain(that.option.conf.mustParams.recovery.additionalParams)
        ;
        //默认恢复全部
        if(!recoverType) recoverType = "all";
        function readSyncByRl(tips) {
            tips = tips || '> ';
            return new Promise((resolve) => {
                const rl = that.o.node.readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question(tips, (answer) => {
                    rl.close();
                    resolve(answer.trim());
                });
            });
        }

        that.o.tool.console.info(`\nPlease select the backup directory. \n`,5);
        systemBakDir.forEach((item,index)=>{
            that.o.tool.console.info(`${index+1}: ${item} `,7);
        });
        that.o.tool.console.success(`Please select the backup directory:\ndefault ${systemBakDir.length} : `,);
        readSyncByRl('').then((res) => {
            let
                selectNumber = parseInt(res)
            ;
            if(selectNumber !== selectNumber || selectNumber > systemBakDir.length){
                selectNumber = systemBakDir.length;
            }
            if(selectNumber < 1){
                selectNumber = 1;
            }
            selectNumber --;

            let
                verifyMax = 9,
                verifyMin = 1,
                selectBackupDir = that.o.node.path.join(that.option.basicSystemBakDir,systemBakDir[selectNumber]),
                backupConfig = that.o.node.path.join(selectBackupDir,that.option.backupConfig),
                verifyCode = Math.floor(Math.random()*(verifyMax-verifyMin+1)+verifyMin)
                //verifyCode = Math.floor(Math.random()*(9-1+1)+1)
            ;

            that.o.tool.console.info(`\nPlease input verification Code :${verifyCode}. \n`,8);
            readSyncByRl('').then((res) => {
                if(parseInt(res) !== verifyCode){
                    that.o.tool.console.error(`Verification code error, end`);
                    return;
                }
                that.o.node.fs.readFile(backupConfig,(err,data)=>{
                    if(!err){
                        data = JSON.parse(data.toString());
                    }
                    let
                        Environment = data.Environment,
                        BackupDirs = data.BackupDirs
                    ;
                    switch (recoverType){
                        case "env":
                            recoveryEnv(Environment);
                            break;
                        case "user":
                            recoveryHomeDir(BackupDirs);
                            break;
                        case "all":
                            recoveryEnv(Environment,(e)=>{
                                recoveryHomeDir(BackupDirs);
                            });
                            break;
                    }
                })

            });
        });

        /**
         * @func 恢复系统环境变量
         */
        function recoveryEnv(Environment,fn){
            for(let p in Environment){
                that.o.node.fs.readFile(Environment[p],(err,data)=>{
                    if(!err){
                        data = JSON.parse(data.toString())
                    }
                    for(let p2 in data){
                        that.o.tool.windows.setEvn(data);
                    }
                })
            }
        }

        /**
         * @func 恢复系统用户数据
         */
        function recoveryHomeDir(BackupDirs,fn){
            BackupDirs.forEach((item,index)=>{
                console.log(item);
                that.o.tool.file.node_copy(item.target,item.source,(data)=>{
                    //将备份的文件进行压缩
                });
            });
        }
    }

    /**
     * @func 备份系统
     * @param systemBakDir
     */
    backup(callback){
        
        let
            that = this,
            folderDate = (new Date()).toLocaleString().replace(/\s+|\:/g,"-")//此时间戳用来生成备份目录文件夹名
        ;
        
        that.option.backupDir = that.o.node.path.join(that.option.basicSystemBakDir,"/"+folderDate/*+"/"+that.option.currentOSUser*/);
        //传值给工具类
        that.o.func.systembak.option = that.option;
        
        switch(that.option.execType){
            case "userdata":
                that.o.func.systembak.backupUserData();
            break;
            case "program":
                that.o.func.systembak.backupProgram();
            break;
        }
    }
}

module.exports = index;