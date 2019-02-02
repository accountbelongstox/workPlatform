class EC{
    //升级软件
    softwareupdate(that,args){
        let
            software = that.load.json.webData.software,
            downURL = software.downURL,
            files = that.load.module.array.isArray(args) ? args : [args],
            tmpFiles = []
        ;

        if(!that.load.option.softwareupdateIn){

            that.load.eles.softupdateInfo.html("正在升级...");

            that.load.eles.progress.show();
            that.load.option.softwareupdateIn = true;

            let
                thisProgressLen = (that.load.eles.progress.width() / files.length),
                progressLen = -thisProgressLen
            ;
            that.load.module.console.success("正在下载升级文件,请耐心等持 .... ",false);
            (function downFile(len){
                if(len >= files.length){
                    that.load.option.softwareupdateIn = false;
                    alert(`系统将升级,软件会关闭,若没有自动启动,请手动重启!`);
                    //则主进程来处理替换
                    that.load.node.electron.ipcRenderer.send("electronListener",{
                        arg:{
                            files:files
                        },
                        sendIpc:"softwareupdatereplace"
                    });
                }else{
                    let
                        filesItem =files[len],
                        downFileURL = `${downURL}/${filesItem}`,
                        savePath = that.load.node.path.join(that.load.option.tmpDir,filesItem)
                    ;
                    tmpFiles.push(filesItem);
                    progressLen+=thisProgressLen;
                    that.load.module.network.downloadFile(downFileURL,{
                        save:savePath,
                        progress:function (progress){
                            console.log(`progress => ${progress}`);
                            let
                                thisProgress = (thisProgressLen * (progress/100))  + progressLen
                            ;
                            that.load.eles.progress.show();
                            that.load.eles.progress.children(".bar").width(thisProgress);
                        }
                    },()=>{
                        downFile(++len);
                    });
                }
            })(0);
        }
    }
}

module.exports = EC;