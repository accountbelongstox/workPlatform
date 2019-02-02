class CJ{
    constructor(load){
        //所有事件
        //事件的that需要通过参数传过来,因为该函数内部执行不能带来that
        //所有方法都必须有 callback 回调.以便行执行后告诉子进程
        //方法不能是大写字母
    }

    //最大化和最小化来回切换
    windowmaxmin(that,args,callback,event){
        if(!that.load.option.windowmaxmin){
            that.load.window.maximize();
        }else{
            that.load.window.unmaximize();;
        }
        that.load.option.windowmaxmin=!that.load.option.windowmaxmin;
        if(callback)callback();
    }

    //升级软件后替换
    softwareupdatereplace(that,args,callback,event){
        let
            files = args.files,
            file = files[0],
            tmpPath = that.load.node.path.join(that.load.option.tmpDir,file),
            tmpUnzipDir = that.load.node.path.join(that.load.option.rootDir,`public/`),
            //exeFile = that.load.node.path.join(that.load.option.rootDir,`../../定制数据抓取.exe`)
            exeFile = that.load.node.path.join(that.load.option.rootDir,`../../定制数据抓取.exe`)
        ;
        that.load.module.tools.unzip(tmpPath,tmpUnzipDir,()=>{
            //删除临时文件
            //删除临时目录
            //重启软件
            if(that.load.node.fs.existsSync(exeFile)){
                that.load.node["node-cmd"].get(`start ${exeFile}`,()=>{
                    that.load.node.electron.app.quit();
                    //if(callback)callback();
                });
            }
        });
    }

    //打开工具栏
    openDevTools(that,args){
        if(!that.load.option.openDevTools){
            that.load.window.webContents.openDevTools();
        }else{
            that.load.window.webContents.closeDevTools();
        }
        that.load.option.openDevTools = !that.load.option.openDevTools;
    }
}

module.exports = CJ;