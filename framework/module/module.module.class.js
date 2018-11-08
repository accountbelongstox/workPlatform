

class moduleC{
	
	constructor(load){
    }

    run(){
        let
        that = this
        ;
        //默认运行方法
        that.option.defaultRun = "run";
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
        that.load.module.console.info(`\nExecute module in ${rootModuleName}.`,7);

        argv = that.load.module_func.module.optionToArgv(module_name);
        params = that.load.module.func.getParam(argv);
        //判断本次参数是否满足基本条件,指必须的参数都要有值
        //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
        FullParams = that.load.module_func.command_public_tools.isFullParams(argv,params,is_command);
        //将params作为值通过common传入到即将调用的模块
        that.load.params = params;
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
                        classPathFileFullPah = that.load.node.path.join(that.load.core.path.module,paramName.replace(/^[\\\/]+/,``).replace(/[\/\\]/ig,`_`)+`.class.js`),//文件形式
                        classPathFolderFullPah = that.load.node.path.join(that.load.core.path.module,paramName+`/index.class.js`),//文件夹形式
                        classPathFile,
                        beforeFuncName,
                        currentExecuteType,
                        paramsGroup = that.load.module_func.module.paramsGroup(conf)
                    ;

                    that.option.beforeFuncName.push( queryClassName[queryClassName.length-1] );
                    beforeFuncName = (that.option.beforeFuncName.splice(0,1))[0];//存放上一个方法

                    //如果文件形式的模型文件存在,则优先执行
                    //通过第一次判断给出要执行那一项
                    if(that.load.module.file.isFileSync( classPathFileFullPah )){
                        classPathFile = classPathFileFullPah;
                        currentExecuteType = "file";
                        if(!that.option.currentExecuteType)that.option.currentExecuteType = currentExecuteType;
                    }else if(that.load.module.file.isFileSync( classPathFolderFullPah )){
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
                            that.load.module.console.success(`default : ${paramName}/${that.option.defaultRun}:`);
                            let
                                callbackFunction = isBeforeFunction ? null : ()=>{//如果还有附加方法,则run方法不再传回调函数实体
                                    run_module(++len);//没有上一个方法时,则于RUN不接受回调,直接在此回调
                                }
                            ;
                            classReadyNew[that.option.defaultRun](callbackFunction);
                        }

                        //如果有上一级的方法,也需要执行
                        if(isBeforeFunction){
                            that.load.module.console.success(`define : ${paramName}/${beforeFuncName}:`);
                            let
                                callbackFunction = ()=>{ //模型方法第一个参数永远是回调
                                    run_module(++len);
                                }
                            ;
                            classReadyNew[beforeFuncName]( callbackFunction ,args);
                        }
                    }else{
                        //that.load.module.console.error(`No model ${paramName} found.`);
                        run_module(++len);
                    }
                }
            })(0);
        }
    }

}
module.exports = moduleC;
