const
encoding = 'cp936',
binaryEncoding = 'binary'
;


/**
 * @class 全局公共函数.
 */
class func{

    constructor(load){
    }

    //自身功能 -----------------------------------------------------------------------------------------------------------------------------------


    /**
     * @tools 执行cmd命令
     */
    exec(command,callback,showInfo = false){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let 
        output = [],
        that = this
        ;

        (function exec_cmd(len){
            if(len  >= command.length){
                //如果只有一次命令返回,则直接返回无须数组
                if(output.length < 2){
                    output  = output.join(``);
                }
                output = that.exists(output);
                if(callback)callback(output);
            }else{
                let
                    cmd = command[len]
                ;
                that.load.node.child_process.exec(cmd, { encoding: binaryEncoding }, function(err, StdOpt, stderr){
                    StdOpt =  that.load.node[`iconv-lite`].decode(Buffer.alloc(StdOpt.length,StdOpt, binaryEncoding), encoding);
                    stderr =  that.load.node[`iconv-lite`].decode(Buffer.alloc(stderr.length,stderr, binaryEncoding), encoding);
                    output.push(StdOpt);
                    if( err  )console.log("Error:\n"+err);
                    if( StdOpt && ( !callback || showInfo) )console.log(StdOpt);
                    if( stderr )console.log("StdErr:\n"+stderr);
                    exec_cmd(++len);
                });
            }
        })(0);
    }

    /*
    @func 执行命令同步版
    */
    execSync(command){
        if( !(command instanceof Array) ){
            command = [command]
        }

        let 
        output = [],
        that = this
        ;

        for(let i=0;i<command.length;i++){
            let cmd = command[i];
            try{
                let e = that.load.node.child_process.execSync(cmd, { encoding: binaryEncoding });
                e = e.toString("utf8");
                e = that.load.module.string.trim(e,[`\n`,`\r`]);
                console.log(e);
                output.push(e);
            }catch(err){
                console.log("error:");
                console.log(err);
            }
        }
        return output;
    }

    /**
     * @tools 执行cmd命令
     */
    spawn(command,fn){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let 
            output = [],
            that = this
        ;
        if(command.length > 0 ){
            (function spawn_cmd(i){
                let 
                cmd = command[i],
                symbolSplit = cmd.match(/\".+?\"/ig),
                splitToken = `^*^*^`
                ;

                if(symbolSplit){
                   symbolSplit.forEach((symbolSplitOne)=>{
                    cmd = cmd.replace(symbolSplitOne,` ${splitToken} `)
                   }); 
                }
                let 
                    splitCmds = cmd.split(/\s+/),
                    cmds = []
                ;
                splitCmds.forEach((cmdOne)=>{
                    let 
                    _cmdOne = cmdOne
                    ;
                    if(cmdOne.includes(splitToken) && (_cmdOne = symbolSplit.splice(0,1)) ){
                        _cmdOne = _cmdOne[0];
                    } 
                    if(_cmdOne){
                        _cmdOne = that.load.module.string.trim(_cmdOne);
                        cmds.push(_cmdOne);
                    }
                });
                let
                    command_c = (cmds.splice(0,1))[0],
                    parmas = cmds,
                    c = that.load.node.child_process.spawn(command_c,parmas)
                ;
                c.stdout.on('data', function (data) {
                    if(!fn){
                        console.log('spawn_stdout: ' + data);
                    }
                });
                c.stderr.on('data', function (data) {
                    if(!fn){
                        console.log('spawn_stderr: ' + data);
                    }
                });
                c.on('exit', function (code) {
                    i++;
                    if(i<command.length){
                        spawn_cmd(i);
                    }else{
                        if(fn)fn(code);
                    }
                });
            })(0)
        }
    }

    /**
     * @tools 执行cmd命令
     */
    execFile(command,callback,showInfo){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let
            that = this,
            errorArray = []
        ;
        (function spawn_cmd(i){
            if(i >= command.length){
                if(errorArray.length == 1){
                    errorArray = errorArray.join(``);
                }
                if(callback)callback(errorArray);
            }else{
                let
                    cmd = command[i]
                ;
                cmd = cmd.match(/[^\"](.+?)\s|[^\"](.+?)$|\"(.+?)\"/ig);
                for(let i=0;i<cmd.length;i++){
                    cmd[i] = cmd[i].replace(/^\"|\"$/,"");
                }
                let
                    command_c = cmd[0],
                    parmas = cmd.splice(1)
                ;
                that.load.node.child_process.execFile(command_c,parmas, (error, stdout, stderr) => {
                    if (error) {
                        console.log(error);
                    }
                    if (stderr) {
                        console.log(stderr);
                    }
                    if (showInfo && stdout) {
                        console.log(stdout);
                    }
                    errorArray.push(stdout);
                    spawn_cmd(++i);
                });
            }
        })(0);
    }

    /**
     * @func 执行一个程序或文件,同步版
     */

    execFileSync(command,callback,showInfo=false){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let
            that = this
        ;
        (function spawn_cmd(i){
            if(i >= command.length){
                if(callback)callback();
            }else{
                let
                    cmd = command[i]
                ;
                cmd = cmd.match(/[^\"](.+?)\s|[^\"](.+?)$|\"(.+?)\"/ig);
                for(let i=0;i<cmd.length;i++){
                    cmd[i] = cmd[i].replace(/^\"|\"$/,"");
                }
                let
                    command_c = cmd[0],
                    parmas = cmd.splice(1)
                ;
                that.load.node.child_process.spawn(command_c,parmas);
                spawn_cmd(++i);
            }
        })(0);
    }


    /*
    @func 获取一个参数
    @params paramName:需要获取的参数名 isValue:该参数是否含有值 default:如果没有找到参数则返回默认值
    */
    getParam(opt,paramName=null,defaultV=null,isValue=false,getKey=false){
        let
            that = this
        ;
        if(!paramName && paramName !== 0){//如果不传该值,则返回一个带有各类方法的类.!=0 防止正好取下标为0的参数。0刚好被识别为false
            let 
                o = {},
                isValueExp = new RegExp(`^\\-+?[a-zA-Z0-9]+?\\:(.+)`,"i"),
                _isValueExp = new RegExp(`^[a-zA-Z0-9]+?\\:(.+)`,"i"),
                notValueExp = new RegExp(`^\\-+?[a-zA-Z0-9]+?$`,"i"),
                _notValueExp = new RegExp(`^[a-zA-Z0-9]+?$`,"i")
            ;
            for(let i=0;i<opt.length;i++){
                let 
                _vTname = opt[i],
                _vTnameNotDir = function(){
                    //排除该参数为一个目录
                    let Dir = that.load.node.path.parse(_vTname);
                    if(Dir.root && Dir.dir){
                        return false;
                    }
                    return true;
                },
                _vKey = _vTname.replace(/\:.+$/ig,""),
                _vKey2 = _vTname.replace(/^\-+/ig,""),
                _vValue = true
                ;
                if( (isValueExp.test(_vTname) || _isValueExp.test(_vTname) ) && _vTnameNotDir()){//带值的参数
                    let isValueExpTReg = /(?<=(\-|^))[a-zA-Z0-9]+?(?=\:)/;
                    let isValueExpVReg = /(?<=\:)(.+)$/ig;
                    let _vVK = _vTname.match(isValueExpTReg);
                    let _vVV = _vTname.match(isValueExpVReg);
                    _vKey2 = _vVK[0];
                    if(_vVV){
                        _vValue = _vVV[0].replace(/^\'|^\"|\"$|\'$/ig,"");
                    }
                }
                o[_vKey] = `${_vValue}`;
                o[_vKey2] = `${_vValue}`;
            }
            //1. is("xxxx") 该方法根据参数是否存在，返回值
            o.is = function (name){
                let isV = this[name];
                if(isV){
                    return true
                }else{
                    return null;
                }
            };
            //1. get("xxx") 该方法根据参数是否存在，返回值
            o.get = function (paramName=null,defaultV=null,isValue=false){
                let r = that.getParam(opt,paramName,defaultV,isValue);
                return r;
            };
            //2. 只会返回 key部份
            o.getKey = function (paramName){
                if(!paramName) return null;
                let r = that.getParam(opt,paramName,null,false,true);
                return r;
            };
            //1. getValue("xxx") 将会返回一个KEY,VALUE的值 
            o.getValue = function (paramName=null,defaultV=null){
                let r = that.getParam(opt,paramName,defaultV,true);
                return r;
            };
            //1. getValue("xxx") 将会返回一个KEY,VALUE的值 
            o.value = function (paramName=null,defaultV=null){
                let r = that.getParam(opt,paramName,defaultV,true);
                return r;
            };
            /*
            @ 判断参数是否存在于某一个数组中,并返回第一个值,用于参数无序时的判断
            */
            o.contain = function (arr){
                let 
                that = this
                ;
                if(!(arr instanceof Array) && (typeof arr === "object")){
                    let
                        narr = []
                    ;
                    for(let p in arr){
                        narr.push(p);
                    }
                    arr = narr;
                }
                for(let p in that){
                    for(let i = 0 ;i<arr.length;i++){
                        let _ = arr[i];
                        //console.log(p)
                        if(p.toUpperCase() === _.toUpperCase()){
                            return _;
                        }  
                    }
                }
                return null;
            }
            /*
            @func 各类扩展
            */
            return o;
        }
        let 
            param,
            isValueExp = new RegExp(`^\\-*${paramName}\\:(.+)`,"i"),
            notValueExp = new RegExp(`^\\-*${paramName}$`,"i"),
            isNumberValueExp = new RegExp(`^\\-+`,"ig"),
            isNumber = parseInt(paramName)//如果值是数字,则判断是否有该值即可
        ;
        //如果是指定数组来取参数
        if(isNumber === isNumber){
            let oneV = opt[isNumber];
            if(oneV){
                oneV = oneV.replace(isNumberValueExp,"");
                return oneV;
            }else{
                if(defaultV)return defaultV;
            }
            return null;
        }
        let
            _v = null
        ;
        //如果是指定名字来取参数 
        for(let i=0;i<opt.length;i++){

            let
                command = opt[i]
            ;
            //该参数是否是KEY,value型的
            if(isValueExp.test(command)){
                //如果 key.value 只要求返回 key
                if(getKey)return paramName;
                isValue = true;
            }

            if(isValue){
                //如果是带有值的参数，则样式为 --dir:"C:\xxx\xxx" 
                _v = command.match(isValueExp);
                if(_v && _v.length > 1){
                    _v = _v[1];
                    _v = that.load.module.string.trimX(_v);
                    let
                        _vIsInt = parseInt(_v)
                    ;
                    //如果是数字类型则直接返回数字型 
                    if( _vIsInt === _vIsInt){
                        return _vIsInt;
                    }
                    return _v;
                }
            }else{
                if(notValueExp.test(command)){
                    return true;
                }
            }
        }
        if(defaultV !== null){
            //如果没有找到参数则返回默认值
            return defaultV;
        }else{
            //以上条件都不成立的情况下最终返回空
            return _v;
        }
    }

    /**
     * @func 判断一个值是否存在
     * @param val
     */
    exists(val){
        let
            that = this,
            exists = 0
        ;
        if(that.load.module.array.isArray(val)){
            if(val.length){
                val.forEach((v)=>{
                   if(v) exists++;
                });
            }else{
                exists = val.length;
            }
        }else if(that.load.module.array.isObject(val)){
            for(let p in val){
                if(val[p]){
                    exists++;
                }
            }
        }else{
            exists = val;
        }
        if(exists){
            return val;
        }else{
            return false;
        }
    }
}

module.exports = func;