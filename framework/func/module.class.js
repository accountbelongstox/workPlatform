class moduleC{
    /*
    @func
    * */
    constructor(o){
        
    }

    /*
    * @func 将参数分组
    * */
    paramsGroup(...args){
        let
            that = this,
            params = {},
            groups = {}
        ;
        args.forEach((arg)=>{
            for(let p in arg){
                let
                    obj = arg[p]
                ;
                if(p === "mustParams"){
                    for(let o in obj){
                        let
                            oneParams = obj[o]
                        ;
                        params[o] = oneParams;
                    }
                }
                if(p === "additionalParams"){
                    for(let o in obj){
                        let
                            oneParams = obj[o]
                        ;
                        params[o] = oneParams;
                    }
                }
            }
        });
        for(let p in params){
            let
                param = params[p],
                group = (`group` in param) ? param.group : `undefined`,
                typeGroup = (typeof group)
            ;
            if(typeGroup === "string"){
                if( !(group in groups) ){
                    groups[group] = {};
                }
                groups[group][p] = param;
            }else{
                group.forEach((groupOne)=>{
                    if( !(groupOne in groups) ){
                        groups[groupOne] = {};
                    }
                    groups[groupOne][p] = param;
                });
            }
        }
        return groups;
    }

    /*
    @func 将一个传入的对象转为参数数组
    */
    optionToArgv(option){
        let
            that = this,
            argv = []
        ;
        //不是数组同时又是对象
        if( !(option instanceof Array) && option instanceof Object){
            for(let p in option){
                let
                    v = option[p]
                ;
                //如果是布尔则不是 key value类型的参数
                if( v instanceof Boolean){
                    argv.push(`${p}`);
                }else if(v){
                    argv.push(`${p}:"${v.toString()}"`);
                }else{
                    argv.push(`${p}`);
                }
            }
        }else if(typeof option === "string"){
            argv.push(option);
        }else if(!option){
            argv = [];
        }else{
            argv = option;
        }
        return argv
    }

    /*
    @func 获取全部命令模型
    */
    getCommandModuleNames(){
        let
            that = this,
            moduleNames = that.o.node.fs.readdirSync(that.o.path.command_modules)
        ;
        return moduleNames;
    }

}

module.exports = moduleC;