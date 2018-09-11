/**
 * @tools 文件关联类.
 */
class index{

    run(opt,o){
        let that = this;
        let fileExt = opt[0];
        let softName = opt[1];

        let command = opt[2];
        let description = (!opt[3]) ? softName : opt[3];
        let icon = (!opt[4]) ? `` : opt[4];

        let regCmd = [];


        /**
         * @tools 如果不是通过 ddrun 命令来执行关联,则用本地的扩展名来关联.
         * @ 当不指定参数时,默认执行本地关联
         */
        if(!fileExt || fileExt == "*"){
            let fileExtends = require("./fileWith.json");
            for(let p in fileExtends){
                softName = p;
                let _o = fileExtends[p];
                description = _o.description;
                icon = _o.icon;
                command = _o.command;
                for(let n = 0;n < _o.fileExt.length;n++){
                    fileExt = _o.fileExt[n];
                    let newCmd = that.regAddFileWith(fileExt,softName,description,icon,command);
                    regCmd = regCmd.concat(newCmd)
                }
            }
        }else{
            /**
             * @当时通过 ddrun 带参数来执行时,执行此段.
             */
            if(softName && command ){
                try{
                    let _command = command.split(" ")
                    _command = _command.slice(0,-1)
                    _command = _command.join(" ")
                    if(!icon || !o.fs.existsSync(icon)){
                        icon = _command
                    }
                }catch(e){
                    console.log(e)
                }
                let newCmd = that.regAddFileWith(fileExt,softName,description,icon,command);
                regCmd = regCmd.concat(newCmd)
            }else{
                that.help();
            }
        }

        if(regCmd){
            o.func.exec(regCmd,(e)=>{

            })
        }
    }

    regAddFileWith(fileExt,softName,description,icon,command){
        let regCmd = [];
        let withName = softName+fileExt;

        command = command.replace(/\"/g,"\\\"");
        //替换各个条目
        description = this._replace(description,fileExt);
        icon = this._replace(icon,fileExt);
        command = this._replace(command,fileExt);

        regCmd.push(`reg add HKEY_CLASSES_ROOT\\${fileExt} /ve /d "${withName}" /f`);
        regCmd.push(`reg add HKEY_CLASSES_ROOT\\${withName} /ve /d "${description}" /f`);
        regCmd.push(`reg add HKEY_CLASSES_ROOT\\${withName}\\DefaultIcon /ve /d "${icon}" /f`);
        regCmd.push(`reg add HKEY_CLASSES_ROOT\\${withName}\\Shell\\Open /v FriendlyAppName /d "${softName}" /f`);
        regCmd.push(`reg add HKEY_CLASSES_ROOT\\${withName}\\Shell\\Open\\Command /ve /d "${command}" /f`);

        return regCmd;
    }

    /**
     * @tools 替换各个条目
     */
    _replace(t,fileExt){
        fileExt = fileExt.replace(/\./,"");
        t = t.replace(/\%fileExt\%/g,fileExt);
        t = t.replace(/\%fileExt\%/g,fileExt);
        return t;
    }

    /**
     *
     */
    help(){
        console.log("Require parameter")
        console.log("<fileExt|*=all> <softName> <command> [description] [icon]")
    }
}

module.exports = index;