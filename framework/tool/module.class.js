

class moduleC{
	
	constructor(o){
    }

    run(){
        let
        that = this
        ;
        //默认运行方法
        that.option.defaultRun = "run";
    }

    /**
     *
     * @param command_option 命令参数,可以是一个数组,也可以是名字.将依次执行模型中的命令
     * @param args
     * @param callback
     * @param is_command
     */
    runModule(command_option=[],args,callback=null,is_command=false){
        if(typeof command_option === "string")command_option = [command_option];
        let
            that = this,
            rootModuleName = command_option[0],
            option,
            argv,//命令参数被转换后的JSON格式
            params,//通过JSON获取到的参数对象
            FullParams//参数对象添加了配置文件信息
        ;
        //用来存储之前的函数名
        that.option.beforeFuncName = [null];
        //执行方式, file folder 文件直接执行或是文件夹内执行
        that.option.currentExecuteType = null;
        that.o.tool.console.info(`\nExecute module in ${rootModuleName}.`,7);

        argv = that.o.func.module.optionToArgv(command_option);
        params = that.o.tool.func.getParam(argv);
        //判断本次参数是否满足基本条件,指必须的参数都要有值
        //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
        FullParams = that.o.func.command_public_tools.isFullParams(argv,params,is_command);
        //将params作为值通过common传入到即将调用的模块
        that.o.params = params;
        //必须的参数不全
        //此参数不成立
        if(FullParams === false){//阻断后面的执行
            if(callback)callback();
        }else{

            //倒转是为了从最顶层一直执行到底层
            FullParams = FullParams.reverse();
            (function run_module(len/*用来统计执行了几次文件*/){

                if(len >= FullParams.length ){
                    if(callback)callback();
                }else{

                    let
                        paramName = FullParams[len].name,
                        conf = FullParams[len].conf,
                        extend = (conf ? conf.extend : {}),
                        command = FullParams[len].command,
                        params = FullParams[len].params,
                        mustParams = FullParams[len].mustParams,
                        additionalParams = FullParams[len].additionalParams,
                        //查询方法名,需要依次递减执行
                        queryClassName = paramName.split(/\\|\//),
                        classPathFileFullPah = that.o.node.path.join(that.o.path.modules,paramName.replace(/^[\\\/]+/,``).replace(/[\/\\]/ig,`_`)+`.class.js`),//文件形式
                        classPathFolderFullPah = that.o.node.path.join(that.o.path.modules,paramName+`/index.class.js`),//文件夹形式
                        classPathFile,
                        beforeFuncName,
                        currentExecuteType,
                        paramsGroup = that.o.func.module.paramsGroup(conf)
                    ;

                    that.option.beforeFuncName.push( queryClassName[queryClassName.length-1] );
                    beforeFuncName = (that.option.beforeFuncName.splice(0,1))[0];//存放上一个方法

                    //如果文件形式的模型文件存在,则优先执行
                    //通过第一次判断给出要执行那一项
                    if(that.o.tool.file.isFileSync( classPathFileFullPah )){
                        classPathFile = classPathFileFullPah;
                        currentExecuteType = "file";
                        if(!that.option.currentExecuteType)that.option.currentExecuteType = currentExecuteType;
                    }else if(that.o.tool.file.isFileSync( classPathFolderFullPah )){
                        classPathFile = classPathFolderFullPah;
                        currentExecuteType = "folder";
                        if(!that.option.currentExecuteType)that.option.currentExecuteType = currentExecuteType;
                    }
                    //执行方式一致时才可以继续
                    if(currentExecuteType && (currentExecuteType === that.option.currentExecuteType)){
                        //由循环中判断是否有扩展参数类
                        let
                            classReadyRequire = require( classPathFile ),
                            classReadyNew = new classReadyRequire(that.o)
                        ;
                        //给该方法common的值
                        classReadyNew.o = that.o;
                        //参数的值附加
                        classReadyNew.args = args;
                        //给该方法option
                        classReadyNew.option = {
                            run:true,//允许执行函数
                            params,//该参数下支持 的全部参数,包含必须参数和资源参数
                            mustParams, //必须参数
                            additionalParams,//资源参数
                            conf,//conf配置
                            extend,//扩展配置
                            command,//命令本身
                            paramsGroup // 参数分组
                        };
                        let
                            isRunFunction = classReadyNew[that.option.defaultRun],//当前默认方法
                            isBeforeFunction = (beforeFuncName && classReadyNew[beforeFuncName])//上级方法
                        ;
                        /*
                        @explain 类的入口函数为 run
                        */
                        if(isRunFunction){
                            that.o.tool.console.success(`default : ${paramName}/${that.option.defaultRun}:`);
                            let
                                callbackFunction = isBeforeFunction ? null : ()=>{//如果还有附加方法,则run方法不再传回调函数实体
                                    run_module(++len);//没有上一个方法时,则于RUN不接受回调,直接在此回调
                                }
                            ;
                            classReadyNew[that.option.defaultRun](callbackFunction);
                        }
                        //如果有上一级的方法,也需要执行
                        if(isBeforeFunction){
                            that.o.tool.console.success(`define : ${paramName}/${beforeFuncName}:`);
                            let
                                callbackFunction = ()=>{ //模型方法第一个参数永远是回调
                                    run_module(++len);
                                }
                            ;
                            classReadyNew[beforeFuncName]( callbackFunction ,args);
                        }
                    }else{
                        that.o.tool.console.error(`No model ${paramName} found.`);
                        run_module(++len);
                    }
                }
            })(0);
        }
    }


    getModule(module_name,args,callback=null,is_command=false){
        let
            that = this,
            rootModuleName = module_name,
            option,
            argv,//命令参数被转换后的JSON格式
            params,//通过JSON获取到的参数对象
            FullParams//参数对象添加了配置文件信息
        ;
        //用来存储之前的函数名
        that.option.beforeFuncName = [null];
        //执行方式, file folder 文件直接执行或是文件夹内执行
        that.option.currentExecuteType = null;
        that.o.tool.console.info(`\nExecute module in ${rootModuleName}.`,7);

        argv = that.o.func.module.optionToArgv(module_name);
        params = that.o.tool.func.getParam(argv);
        //判断本次参数是否满足基本条件,指必须的参数都要有值
        //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
        FullParams = that.o.func.command_public_tools.isFullParams(argv,params,is_command);
        //将params作为值通过common传入到即将调用的模块
        that.o.params = params;
        //必须的参数不全
        //此参数不成立
        if(FullParams === false){//阻断后面的执行
            if(callback)callback();
        }else{

            //倒转是为了从最顶层一直执行到底层
            FullParams = FullParams.reverse();
            (function run_module(len/*用来统计执行了几次文件*/){

                if(len >= FullParams.length ){
                    if(callback)callback();
                }else{

                    let
                        paramName = FullParams[len].name,
                        conf = FullParams[len].conf,
                        extend = (conf ? conf.extend : {}),
                        command = FullParams[len].command,
                        params = FullParams[len].params,
                        mustParams = FullParams[len].mustParams,
                        additionalParams = FullParams[len].additionalParams,
                        //查询方法名,需要依次递减执行
                        queryClassName = paramName.split(/\\|\//),
                        classPathFileFullPah = that.o.node.path.join(that.o.path.modules,paramName.replace(/^[\\\/]+/,``).replace(/[\/\\]/ig,`_`)+`.class.js`),//文件形式
                        classPathFolderFullPah = that.o.node.path.join(that.o.path.modules,paramName+`/index.class.js`),//文件夹形式
                        classPathFile,
                        beforeFuncName,
                        currentExecuteType,
                        paramsGroup = that.o.func.module.paramsGroup(conf)
                    ;

                    that.option.beforeFuncName.push( queryClassName[queryClassName.length-1] );
                    beforeFuncName = (that.option.beforeFuncName.splice(0,1))[0];//存放上一个方法

                    //如果文件形式的模型文件存在,则优先执行
                    //通过第一次判断给出要执行那一项
                    if(that.o.tool.file.isFileSync( classPathFileFullPah )){
                        classPathFile = classPathFileFullPah;
                        currentExecuteType = "file";
                        if(!that.option.currentExecuteType)that.option.currentExecuteType = currentExecuteType;
                    }else if(that.o.tool.file.isFileSync( classPathFolderFullPah )){
                        classPathFile = classPathFolderFullPah;
                        currentExecuteType = "folder";
                        if(!that.option.currentExecuteType)that.option.currentExecuteType = currentExecuteType;
                    }

                    //执行方式一致时才可以继续
                    if(currentExecuteType && (currentExecuteType === that.option.currentExecuteType)){
                        //由循环中判断是否有扩展参数类
                        let
                            classReadyRequire = require( classPathFile ),
                            classReadyNew = new classReadyRequire(that.o)
                        ;

                        //给该方法common的值
                        classReadyNew.o = that.o;
                        //参数的值附加
                        classReadyNew.args = args;
                        //给该方法option
                        classReadyNew.option = {
                            run:true,//允许执行函数
                            params,//该参数下支持 的全部参数,包含必须参数和资源参数
                            mustParams, //必须参数
                            additionalParams,//资源参数
                            conf,//conf配置
                            extend,//扩展配置
                            command,//命令本身
                            paramsGroup // 参数分组
                        };

                        let
                            isRunFunction = classReadyNew[that.option.defaultRun],//当前默认方法
                            isBeforeFunction = (beforeFuncName && classReadyNew[beforeFuncName])//上级方法
                        ;
                        /*
                        @explain 类的入口函数为 run
                        */
                        if(isRunFunction){
                            that.o.tool.console.success(`default : ${paramName}/${that.option.defaultRun}:`);
                            let
                                callbackFunction = isBeforeFunction ? null : ()=>{//如果还有附加方法,则run方法不再传回调函数实体
                                    run_module(++len);//没有上一个方法时,则于RUN不接受回调,直接在此回调
                                }
                            ;
                            classReadyNew[that.option.defaultRun](callbackFunction);
                        }

                        //如果有上一级的方法,也需要执行
                        if(isBeforeFunction){
                            that.o.tool.console.success(`define : ${paramName}/${beforeFuncName}:`);
                            let
                                callbackFunction = ()=>{ //模型方法第一个参数永远是回调
                                    run_module(++len);
                                }
                            ;
                            classReadyNew[beforeFuncName]( callbackFunction ,args);
                        }
                    }else{
                        that.o.tool.console.error(`No model ${paramName} found.`);
                        run_module(++len);
                    }
                }
            })(0);
        }
    }

    /*
    @func 获取一个模型
    */
    _getModule(moduleTypeName,option={},callback=null){
        let
            that = this
        ;
        //用来存储之前的函数名
        that.option.beforeFuncName = [null];
        if(!that.option.getCommandModuleList){
            that.option.getCommandModuleList = [];
        }

        that.option.getCommandModuleList.push({
            option
        });

        return (function runModuleListFunc(moduleLen){
            let
                newModule = that.option.getCommandModuleList[0]
            ;
            if(!newModule){
                that.o.tool.console.error(`\nNot find module.`);
                return null;
            }
            that.o.tool.console.info(`\nGet module list in ${moduleLen+1}.`,7);
            that.option.getCommandModuleList.splice(0,1);
            let
                option = newModule.option,
                argv = that.o.func.module.optionToArgv(option),
                params = that.o.tool.func.getParam(argv),
                //判断本次参数是否满足基本条件,指必须的参数都要有值
                //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
                FullParams = that.o.func.command_public_tools.isFullParams(argv,params),
                moduleName = params.contain(that.o.func.module.getCommandModuleNames()),
                //由于获取时只能获取一个
                //此变量用于存放过滤后的模型对象
                FullParam = null
            ;

            //将params作为值通过common传入到即将调用的模块
            that.o.params = params;

            //必须的参数不全
            //此参数不成立
            if(FullParams === false){
                that.o.tool.console.error(`\nFullParams is flase.`);
                return null;
            }
            FullParams.forEach((FullParamOne)=>{
                let
                    name = FullParamOne.name.replace(/[\\\/]+/ig,"")
                ;
                if(name == moduleName){
                    FullParam = FullParamOne;
                }
            });
            if(!FullParam){
                that.o.tool.console.error(`\nNot find FullParam.`);
                return null;
            }
            let
                paramName = FullParam.name,
                conf = FullParam.conf,
                extend = (conf ? conf.extend : {}),
                command = FullParam.command,
                mustParams = FullParam.mustParams,
                additionalParams = FullParam.additionalParams,
                //查询方法名,需要依次递减执行
                _extend_class = that.o.node.path.join(that.o.path[`${moduleTypeName}_modules`],paramName+`/index.class.js`),
                paramsGroup = that.o.func.module.paramsGroup(conf)
            ;
            //由循环中判断是否有扩展参数类
            if(that.o.node.fs.existsSync( _extend_class )){
                let
                    _extend_class_Func = require( _extend_class )
                ;
                _extend_class_Func = new _extend_class_Func(that.o);
                //给该方法common的值
                _extend_class_Func.o = that.o;
                //给该方法option
                _extend_class_Func.option = {
                    run:false,//不允许执行函数
                    params:FullParam.params,//该参数下支持 的全部参数,包含必须参数和资源参数
                    mustParams, //必须参数
                    additionalParams,//资源参数
                    conf,//conf配置
                    extend,//扩展配置
                    command,//命令本身
                    paramsGroup
                };
                return _extend_class_Func;
            }else{
                that.o.tool.console.error(`\nNot find class: ${_extend_class}`);
                return null;
            }
        })(0);
    }


    /*
    @func 运行一个命令模型
    */
    runEletornModule(option={},callback=null){
        let
        that = this,
        argv = that.o.func.module.optionToArgv(option),
        params = that.o.tool.func.getParam(argv),
        FullParams = null
        
        ;
        let 
            modulePath = that.node.path.join(that.o.path.electron_modules,module+"/index.class.js"),
            _m = require(modulePath),
            r = new _m(that)
        ;

        r.o = that;
        r.option = option;

        if(r[ that.option.defaultRun]){
            r[ that.option.defaultRun](callback);
        }
    }
    /*
    @func 获取一个electorn模型
    */
    getEletronModule(option={}){        
            let
            that = this,
            argv = that.o.func.module.optionToArgv(option),
            params = that.o.tool.func.getParam(argv),
            modulePath = that.node.path.join(that.o.path.electron_modules,module+"/index.class.js"),
            _m = require(modulePath),
            r = new _m(that)
            ;

            r.o = that;
            r.option = option;

            return r;
    }
}
module.exports = moduleC;
