

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

    /*
    @func 运行一个模型
    */
    runModule(moduleTypeName,option={},callback=null){
        let
            that = this
        ;
        //用来存储之前的函数名
        that.option.beforeFuncName = [null];

        if(!that.option.moduleList){
            that.option.moduleList = [];
        }
        that.option.moduleList.push({
            option,
            callback
        });
        (function runModuleListFunc(moduleLen){
            let
                newModule = that.option.moduleList[0]
            ;
            if(!newModule){
                return;
            }
            that.o.tool.console.info(`\nExecute module list in ${moduleLen+1}.`,7);
            that.option.moduleList.splice(0,1);
            let
                option = newModule.option,
                callback = (newModule.callback && newModule.callback instanceof Function) ? newModule.callback : null,
                argv = that.o.func.module.optionToArgv(option),
                params = that.o.tool.func.getParam(argv),
                //判断本次参数是否满足基本条件,指必须的参数都要有值
                //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
                FullParams = that.o.func.command_public_tools.isFullParams(argv,params)
            ;
            //将params作为值通过common传入到即将调用的模块
            that.o.params = params;
            //必须的参数不全
            //此参数不成立
            if(FullParams === false){
                if(callback)callback();
                return;
            }
            //倒转是为了从最顶层一直执行到底层
            FullParams = FullParams.reverse();
            (function RunStartModule(len,classCount,funcCount/*用来统计执行了几次文件*/){

                if(len >= FullParams.length ){
                    runModuleListFunc(++moduleLen);
                    return;
                }
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
                    _extend_class = that.o.node.path.join(that.o.path[`${moduleTypeName}_modules`],paramName+`/index.class.js`),
                    beforeFuncName = ``,
                    paramsGroup = that.o.func.module.paramsGroup(conf)
                ;
                that.option.beforeFuncName.push( queryClassName[queryClassName.length-1] );
                /*
                @func 下一个队列
                */
                beforeFuncName = (that.option.beforeFuncName.splice(0,1))[0];
                //由循环中判断是否有扩展参数类
                if(that.o.node.fs.existsSync( _extend_class )){
                    let
                        _extend_class_Func = require( _extend_class ),
                        _callbak = function(){
                            //需要回调下一个模块
                            RunStartModule(++len,++classCount,++funcCount);
                            if(callback){
                                callback();
                            }
                        }
                    ;
                    _extend_class_Func = new _extend_class_Func(that.o);
                    //给该方法common的值
                    _extend_class_Func.o = that.o;
                    //给该方法option
                    _extend_class_Func.option = {
                        run:true,//允许执行函数
                        params,//该参数下支持 的全部参数,包含必须参数和资源参数
                        mustParams, //必须参数
                        additionalParams,//资源参数
                        conf,//conf配置
                        extend,//扩展配置
                        command,//命令本身
                        paramsGroup // 参数分组
                    };
                    /*
                    @explain 类的入口函数为 run
                    */
                    if(_extend_class_Func[that.option.defaultRun]){
                        that.o.tool.console.success(`default : ${paramName}/${that.option.defaultRun}:`);
                        //如果还有附加方法,则run方法不再传回调函数实体
                        RunStartModule(++len,++classCount,++funcCount);
                        _extend_class_Func[that.option.defaultRun]( callback );

                    }
                    //如果有上一级的方法,也需要执行
                    if(beforeFuncName && _extend_class_Func[beforeFuncName]){
                        that.o.tool.console.success(`define : ${paramName}/${beforeFuncName}:`);
                        _extend_class_Func[beforeFuncName]( _callbak );
                    }
                    if(funcCount === 0 && len === (FullParams.length -1)){
                        that.o.tool.console.error(`Not find function: ${that.option.defaultRun}\n`);
                    }
                }else{
                    //如果没有任何一个入口类,则提示
                    if(classCount === 0 && len === (FullParams.length -1)){
                        that.o.tool.console.error(`Not find class: ${_extend_class}\n`);
                    }
                    RunStartModule(++len,++classCount,++funcCount);
                }
            })(0,0,0);
        })(0);
    }

    /*
    @func 获取一个模型
    */
    getModule(moduleTypeName,option={},callback=null){
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
