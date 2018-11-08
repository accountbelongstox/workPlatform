
class AalBackupC{
	constructor(load){
		
	}

	run(){
        let
            that = this,
            childrenDir = {
            ignore:[],
            childrenDir:{
                    "*":{
                        ignore: [
                            /^AMD/i,
                            /^Android/i,
                            /^ATI/i,
                            /^Application\s*Data/i,
                            /^History/i,
                            /^Microsoft/i,
                            /^Packages/i,
                            /^Temp/i,
                            /^Temporary\s*Internet\s*Files/i,
                            /^VirtualStore/i,
                            /^Adobe/i,
                            /^Macromedia/i,
                            /^Visual\s*Studio/i,
                            /^Intenret\s*Explorer/i,
                            /^Adobe/i,
                            /^Fences/i,
                            /^SogouWBInput/i,
                            /^Windows/i,
                            /^net\./i,
                            /^Office/i
                        ]
                    }
                }
            },
            o = {//备份范围
                    "D:/Program Files/":childrenDir,
                    "D:/Program Files (x86)/":childrenDir
            }
        ;
        let
            applicationDir = that.option.platform.base.workDir.application,
            applications = that.load.node.fs.readdirSync(applicationDir),
            eChildrenDir = {}
        ;
        applications.forEach((folder)=>{
            if( !(/^[\_\.]{1,}/.test(folder)) ){
                eChildrenDir[folder] = {
                    ignore:[],
                    childrenDir : {

                    }
                }
                let
                childFolder = that.load.node.path.join(applicationDir,folder),
                childFolders = that.load.node.fs.readdirSync(childFolder)
                ;
                childFolders.forEach((childFold)=>{
                    eChildrenDir[folder].childrenDir[childFold] = {
                        ignore:[]
                    }
                });
            }
        });
        o[that.option.platform.base.sourceDir.application] = {
            ignore:[],
            childrenDir: eChildrenDir
        };
        //设置属性
        for(let p in o){
            that[p] = o[p]
        }
        return o;
	}
}

module.exports = AalBackupC;