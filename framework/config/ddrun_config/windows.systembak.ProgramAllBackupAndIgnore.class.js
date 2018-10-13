
class AalBackupC{
	constructor(common){
		common.get_node("fs");
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
            applications = that.common.node.fs.readdirSync(applicationDir),
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
                childFolder = that.common.node.path.join(applicationDir,folder),
                childFolders = that.common.node.fs.readdirSync(childFolder)
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
        return o;
	}
}

module.exports = AalBackupC;