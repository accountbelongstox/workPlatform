
class index{


    constructor(common) {
        common.get_tools(`zip`);

        common.get_core(`console`);
        common.get_core(`file`);
        common.get_core(`func`);

        common.get_config();
    }


    run(callback){
		let
			that = this
		;
        //提取命令分组
        that.option.exeType = that.common.params.contain(that.option.paramsGroup.zip);
		if(!that.option.exeType){
			that.option.errorInfo = `Types must be executed : --x or --c ...`;
            that.common.core.console.error(that.option.errorInfo);
            if(callback)callback(that.option.errorInfo );
		}else{
            that.option.file = that.common.params.get("file");
            that.option.password = that.common.params.get("password");
            that.option.target = that.common.params.get("target");
            that.option.force = that.common.params.get("force");
            //如果是解压则只有一个文件,如果是压缩则文件是一个数组
            that.getFile();
            //拼接解压地址
            that.getTarget();
            that.common.tools.zip.option.conf = that.option.conf;
            //取得对应的执行软件
            that.option.zipSoft = that.common.tools.zip.getSoft(that.option.file,that.option.target,that.option.exeType);
            if(that.option.zipSoft === false){
                that.option.errorInfo = `file does not exist.`;
                that.common.core.console.error( that.option.errorInfo );
                if(callback)callback( that.option.errorInfo );
            }
            if(!that.option.zipSoft ){
                that.option.errorInfo = `No such files are supported.`;
                that.common.core.console.error( that.option.errorInfo );
                if(callback)callback(that.option.errorInfo );
            }else{
                let
                    method = that.option.zipSoft.replace(/^(\d)/,"_$1")
                ;
                if( that[method] ){
                    that.common.core.console.success(`start run ${method}` );
                    if(that.option.run){
                        that[method](callback);
                    }else{
                        if(callback)callback(that.option );
                    }
                }else{
                    that.option.errorInfo = `No decompression method *${method}*.`;
                    that.common.core.console.error(that.option.errorInfo );
                    if(callback)callback(that.option.errorInfo );
                }
            }
        }
	}

    /**
	 * @func 解压一个压缩文件
     * @param callback
     */
    bandizip(callback){
        let
            that = this,
            zipSoftDir = that.common.node.path.join(that.common.core.appPath.apps,`Bandizip/Bandizip.exe`),
            password = ``,
            target = ``,
            file = ``,
			zip_command = ``
        ;

        switch(that.option.exeType){
            case "c":

                password = (that.option.password) ? `-p:${that.option.password} ` : "";
                target = `"${that.option.target}" `;

                zip_command = `${zipSoftDir} a -y ${password}${target}`;

                that.option.file.forEach((file)=>{
                    file = `"${that.option.file}" `;
                    zip_command += `${file} `;
                });

                zip_command += ``;
            break;
            //解压文件
            default: // x xtmp
                password = (that.option.password) ? `-p:${that.option.password} ` : "";
                target = `-o"${that.option.target}" `;
                file = `"${that.option.file}"`;
                zip_command = `echo Y|${zipSoftDir} -x ${password}${target}${file}`//默认强制
                break;
        }
        that.execZipCommond(zip_command,callback);
	}
	

	_7z(callback){
        let
            that = this,
            zipSoftDir = that.common.node.path.join(that.common.core.appPath.bin,`7z.exe`),
            password = ``,
            target = ``,
            file = ``,
            zip_command = null
            
        ;

        switch(that.option.exeType){
            //压缩文件
            case "c":
                password = (that.option.password) ? `-p:${that.option.password} ` : "";
                target = `"${that.option.target}" `;
                zip_command = [];
                that.option.file.forEach((file)=>{
                    file = `"${that.option.file}" `;
                    //默认强制
                    zip_command.push(`${zipSoftDir} a ${target}${file}${password}`);
                });
            break;
            //解压文件
            default:
                password = (that.option.password) ? `-p:${that.option.password} ` : "";
                target = `-o"${that.option.target}" `;
                file = `"${that.option.file}" `;
                zip_command = `echo Y|${zipSoftDir} x ${file}${target}${password}`;//默认强制
                break;
        }
        that.execZipCommond(zip_command,callback);
	}



    /**
     * @func 执行解压/压缩命令
     */
     execZipCommond(zip_command,callback){

        let
            that = this,
            targetExists = that.common.node.fs.existsSync(that.option.target)
        ;

        that.common.core.console.info( `info: force ${that.option.force}\n`,6);
        //如果是强制则先删除
        if(that.option.force && targetExists ){

            that.common.core.file.deleteDirSync(that.option.target);

            //如果不强制同时目标存在,则跳过
        }else if(!that.option.force && targetExists ){
            if(callback)callback(that.option);
            return;
        }

        that.common.core.console.info( `info: source file --> ${that.option.file}\n`,6);
        that.common.core.console.info( `info: target dir --> ${that.option.target}\n`,6);

        let 
        setIntervalI = 0,
        interval = setInterval(()=>{
            setIntervalI++;
            that.common.core.console.info( `Please wait. It has been used for ${setIntervalI} minute.`,6);
        },60000)
        ;

        if(zip_command){
            that.common.core.func.exec(zip_command,(e)=>{
                clearInterval(interval);
                if(callback)callback(that.option);
            });
        }else{
            let 
            e = `not output zip command...`
            ;
            clearInterval(interval);
            that.common.core.console.error(e);
            if(callback)callback(e);
        }
     }


    /**
     * @func 获取一个文件的解压目录
     */
     getTarget(){ 
        let
            that = this
        ;

        switch(that.option.exeType){
            case "x":

                if(that.option.target){
                    that.option.target = that.common.node.path.join(that.option.target,that.common.node.path.parse(that.option.file).name );
                }else{
                    that.option.target = that.common.node.path.join(that.common.node.path.parse(that.option.file).dir,that.common.node.path.parse(that.option.file).name );
                }
                break;
                //解压到临时目录
            case "xtmp":
                let
                    filename = that.common.node.path.parse(that.option.file).name
                ;
                if(that.option.target){
                    let
                        targetPathname = that.option.target.replace(/^.+?\:/,``)
                    ;
                    filename = that.common.node.path.join(targetPathname,filename);
                }
                that.option.target = that.common.node.path.join(that.common.config.platform.base.local.tmpDir ,`.zip/${filename}` );
                break;
            case "c":
            //创建压缩时,方件是一个数组
                let
                oneFile = that.option.file[0]
                ;
                if(that.option.target){

                    let 
                    targetParse = that.common.node.path.parse(that.option.target)
                    ;

                    if(!targetParse.ext){
                        that.option.target = that.common.node.path.join(that.option.target,that.common.node.path.parse(oneFile).base+".7z" )
                        //that.option.target+=".7z";
                    }

                }else{

                    let 
                    oneFileParse = that.common.node.path.parse(oneFile)
                    ;

                    if(that.option.file.length >1){

                        let
                        oneFileParent = that.common.node.path.join(oneFile,"../")
                        ;

                        oneFileParse = that.common.node.path.parse(oneFileParent)

                        if(!oneFileParse.name){

                            oneFileParent = oneFile;

                        }

                        oneFileParse = that.common.node.path.parse(oneFileParent)
                        that.option.target = that.common.node.path.join(oneFileParse.dir,oneFileParse.name+".7z" );

                    }else{

                        that.option.target = that.common.node.path.join(oneFileParse.dir,oneFileParse.name+".7z" );

                    }
                }
            break;
        }
        return that.option.target;
     }


    /**
     * @func 如果是解压 文件是一个字符串，如果是压缩则文件是一个组数
     */
     getFile(){
        let
            that = this,
            files = []
        ;
        switch(that.option.exeType){
            case "c":
                that.option.file = that.option.file.split(`,`);
            break;
        }
        return that.option.file;
     }
}


module.exports = index;

