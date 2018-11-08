/*
@func 基本载入类 , 需要配合核心类 core/path , core/param 使用
1.载入node 基本类
2.载入核心类
3.加载支持文件
4.加载配置文件
5.加载工具类
6.加载模型
7.加载模型方法
*/
class commonC{
    constructor(object={}){
        let
            that = this
        ;
        if(!that.option){
            that.option = {};
        }
        //将调用此参数时传入的值都赋给类
        if(object && (typeof object === "object")){
            for(let p in object){
                that.option[p] = object[p];
            }
        }
        if(!that.iniLoadAllCoreClass) {


            // 加载基本 node
            that.get_node();
            // 加载所有核类
            that.get_all_class("core");
            // 加载支持文件
            that.get_all_class("support");
            // 加载配置文件
            that.get_config();
            // 加载所有工具类
            that.get_all_class("tool");
            // 加载所有的模型
            let
                is_command = (object && object.is_command) ? object.is_command : false // 是否以命令方式加载
            ;
            that.get_modules(is_command);
            // 加载模型附加工具类
            that.get_all_class("module_func");
            // 设置加载标识
            that.iniLoadAllCoreClass = true;
        }
        // 基本运行方法
        that.basic_run();
    }

    /**
     * @func 基本运行内容, 不同的软件写入不同的值
     */
    basic_run(){
        let
            that = this
        ;

    }

    /*
     * @func 加载webview后启动 需要先设置document
     */
    webview_start(callback){
        let
            that = this,
            webview_name = [],
            webviews = []
        ;
        if(!that.option.viewStartIsLoad){
            that.option.viewStartIsLoad = true;
            if(that.eles && that.eles.webview){
                let
                    ws = that.eles.webview
                ;
                for(let p in ws){
                    webview_name.push(p);
                    webviews.push(ws[p]);
                }
            }
            (function eventListerner(len){
                if(len >= webviews.length){
                    //监听全部事件
                    if(callback)callback();
                }else{
                    let
                        WebView = webviews[len],
                        WebViewName = webview_name[len]
                    ;
                    WebView.addEventListener('dom-ready', () => {
                        let
                            getWebContents = WebView.getWebContents()
                        ;
                        that.eles.webview[WebViewName] = getWebContents;
                        if(!that.webview)that.webview = {};
                        that.webview[WebViewName] = getWebContents;
                        //通过代码注入可以取得信息
                        //webContents
                        eventListerner(++len);
                    });
                }
            })(0);
        }
    }

    /**
     * @func 将electron 截的document 设置到load.eles 属性下
     */
    set_document(document){
        let
            that = this,
            all = document.all,
            select = (()=>{
                if(that.eles){
                    let
                        $ = that.eles.$
                    ;
                    if($)return $;
                    return document.querySelectorAll;
                }
            })()
        ;
        if(!that.eles)that.eles={};
        that.eles.document = document;
        for(let i = 0;i<all.length;i++){
            let
                item = all[i]
            ;
            if(`getAttribute` in item){
                let
                    id = item.getAttribute(`id`)
                ;
                if(id){
                    that.eles[id] = select(item);
                }
                if(/^webview/i.test(item.tagName)){
                    if(!that.eles[`webview`]){
                        that.eles[`webview`] = {};
                    }
                    that.eles[`webview`][id] = document.getElementById(id);
                }
            }
        }
    }

    /*
     * @func 将jquery设置到 load
     */
    set_jQuery($){
        let
            that = this
        ;
        if(!that.eles)that.eles={};
        that.eles.$ = $;
    }

    //加载所有NODE类
    get_node(){
        let
            that = this,
            nodes = [
                "path",
                "fs",
                "os",
                "url",
                "iconv-lite",
                "electron",
                "request",
                "crypto",
                "colors",
                "readline",
                "child_process",
                "http",
                "https",
                "cheerio",
                "compressing",
                "node-cmd",
                `express`,
                `body-parser`,
                `excel-xlsx`,
                `xlsx`,
                `node-xlsx`
            ]
        ;
        that.node = {};
        //加载全部 node
        nodes.forEach((node)=>{
            if(node)that.node[node] = require(node);
        });
        //初始化系统接收
        that.node.readLine = that.node.readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }


    /*
    @func 取得core基本类
    */
    get_all_class(name,bind=null){
        let
            that = this,
            dir = (()=>{
                let
                    _dir = that.get(`core/path/${name}`, /*默认值*/that.node.path.join( __dirname, `../${name}/`))
                ;
                if(!that.node.fs.existsSync(_dir) || !that.node.fs.lstatSync(_dir).isDirectory()){
                    console.log(_dir,32424)
                    that.node.mkdirSync(_dir);
                }
                return _dir;
            })(),
            class_files  = that.node.fs.readdirSync(dir),
            is_load = new RegExp(`^${name}\\.`)
        ;
        //加载全部 module
        class_files.forEach((class_file)=>{
            let
                path = that.node.path.join(dir,class_file)
            ;
            if(is_load.test(class_file) && that.node.fs.lstatSync(path).isFile()){
                class_file = class_file.replace(is_load,``).replace(/\.(class|json)\.js$|\.json$/,``);
                that.get_class(`${name}/${class_file}`,bind);
            }
        });
    }

    /**
     * @func
     * @param name_path
     * @param bind
     * @private
     */
    get_class(name_path,bind=null){
        let
            that = this,
            name_parse_to_array = name_path.split(/[\/\\]+/),
            class_name = name_parse_to_array[name_parse_to_array.length - 1],
            source_name = class_name,
            name = name_parse_to_array[0],
            that_is_value = that.get(name_path)// 判断是否加载过
        ;
        if(that_is_value){
            return that_is_value;
        }else {
            if (!that[name]) that[name] = {};
            let
                dir = (()=>{
                    name_parse_to_array.splice(0,1);
                    name_parse_to_array.splice(name_parse_to_array.length-1,1);
                    let
                        _dir = that.get(`core/path/${name}`, /*默认值*/that.node.path.join( __dirname, `../${name}/`)),
                        path_name = name_parse_to_array.join(``)
                    ;
                    _dir = that.node.path.join(_dir,path_name);
                    if(!that.node.fs.existsSync(_dir) || !that.node.fs.lstatSync(_dir).isDirectory()){
                        that.node.mkdirSync(_dir);
                    }
                    return _dir;
                })(),
                exists = (file_path)=>{
                    return (that.node.fs.existsSync(file_path) && that.node.fs.lstatSync(file_path).isFile());
                },
                class_name_format = `${name}.${class_name}`,
                class_name_path = that.node.path.join(dir,`${class_name_format}.class.js`),//分别可载入3种文件 1 xxx.class.js
                json_class_name_path = that.node.path.join(dir,`${class_name_format}.json.js`),//2 xxx.json.js
                json_name_path = that.node.path.join(dir,`${class_name_format}.json`),//3 json.js
                static_file_path = (()=>{//静态资源文件直接读入
                    let
                        static_path = that.node.path.join(dir,source_name)
                    ;
                    if(exists(static_path)){
                        return static_path;
                    }else if(exists(source_name)){
                        return source_name;
                    }else{
                        let
                            dirs = that.node.fs.readdirSync(dir)
                        ;
                        if(dirs && dirs.length){
                            let
                                static_file = null
                            ;
                            dirs.forEach((file)=>{
                                let
                                    file_parse = that.node.path.parse(file),
                                    file_name = (()=>{
                                        let
                                            the_file_name = file_parse.name,
                                            is_load = new RegExp(`^${name}\.`),
                                            result_file_name=null
                                        ;
                                        if(is_load.test(the_file_name)){
                                            the_file_name = the_file_name.replace(is_load,``);
                                        }
                                        if(the_file_name === class_name){
                                            result_file_name = class_name;
                                        }
                                        return result_file_name;
                                    })()
                                ;
                                if(file_name){
                                    static_file = file;
                                    return;
                                }
                            });
                            return static_file;
                        }else{
                            return null;
                        }
                    }
                })(),//加载静态资源文件
                include = (class_path,isJson=false,isStatic=false)=>{
                    let
                        c = require(class_path),
                        m
                    ;
                    if(isStatic){// 静态资源读取
                        m = that.set(name_path,that.node.fs.readFileSync(class_path));
                    }else if(isJson){// json 直接载入
                        m = that.set(name_path,c);
                    }else{// class.js / json.js 需要实例化
                        let
                            e = new c(that)
                        ;
                        e.load = that;
                        e.option = {};
                        if("run" in e){
                            e.run(321313);
                        }
                        m = that.set(name_path,e);
                    }
                    if(bind){
                        that.set(name_path,m,bind);
                    }
                    return m;
                }
            ;
            if(exists(class_name_path)){//优先载入 xxx.class.js
                return include(class_name_path);
            }else if(exists(json_class_name_path)){// 如上面不存在 载入 xxx.json.js  json.js 是 module.export 直接导出的格式.非class.也不是.json
                return include(json_class_name_path,true);
            }else if(exists(json_name_path)){ //如上面不存在 载入 xxx.json
                return include(json_name_path,true);
            }else if(static_file_path){// 最后载入静态资源文件
                return include(static_file_path,false,true);
            }
        }

    }

    /**
     * @param command_option 命令参数,可以是一个数组,也可以是名字.将依次执行模型中的命令
     * @param args
     * @param callback
     * @param is_command
     */
    run_module(command_option=[],args,callback=null,is_command=false){
        if(typeof command_option === "string"){
            command_option = [command_option];
        }
        let
            that = this,
            defaultRun = `run`,//默认要运行的类方法
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
        //TODO  将此处修改为原生JS ----------------------------------->
        that.tool.console.info(`\nExecute module in ${rootModuleName}.`,7);
        argv = that.func.module.optionToArgv(command_option);
        //TODO  将此处修改为原生JS ----------------------------------->
        params = that.tool.func.getParam(argv);
        //判断本次参数是否满足基本条件,指必须的参数都要有值
        //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
        FullParams = that.func.command_public_tools.isFullParams(argv,params,is_command);
        //将params作为值通过common传入到即将调用的模块
        that.params = params;
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
                } else {
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
                        module_name_pathname = paramName.replace(/^[\\\/]+/,``).replace(/[\/\\]/ig,`.`),
                        beforeFuncName,
                        paramsGroup = that.func.module.paramsGroup(conf)
                    ;

                    that.option.beforeFuncName.push( queryClassName[queryClassName.length-1] );
                    beforeFuncName = (that.option.beforeFuncName.splice(0,1))[0];//存放上一个方法

                    //执行方式一致时才可以继续
                    if(that.module[module_name_pathname]){
                        //由循环中判断是否有扩展参数类
                        //参数的值附加
                        that.module[module_name_pathname].args = args;
                        //给该方法option
                        that.module[module_name_pathname].option = {
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
                            isRunFunction = that.module[module_name_pathname][defaultRun],//当前默认方法
                            isBeforeFunction = (beforeFuncName && that.module[module_name_pathname][beforeFuncName])//上级方法
                        ;
                        /*
                        @explain 类的入口函数为 run
                        */
                        if(isRunFunction){
                            that.tool.console.success(`default : ${paramName}/${defaultRun}:`);
                            let
                                callbackFunction = isBeforeFunction ? null : ()=>{//如果还有附加方法,则run方法不再传回调函数实体
                                    run_module(++len);//没有上一个方法时,则于RUN不接受回调,直接在此回调
                                }
                            ;
                            that.module[module_name_pathname][defaultRun](callbackFunction);
                        }
                        //如果有上一级的方法,也需要执行
                        if(isBeforeFunction){
                            that.tool.console.success(`define : ${paramName}/${beforeFuncName}:`);
                            let
                                callbackFunction = ()=>{ //模型方法第一个参数永远是回调
                                    run_module(++len);
                                }
                            ;
                            that.module[module_name_pathname][beforeFuncName]( callbackFunction ,args);
                        }
                        if(!isRunFunction  && !isBeforeFunction){
                            run_module(++len);
                        }
                    }else{
                        that.tool.console.info(`${len} No model ${paramName} found.`);
                        run_module(++len);
                    }
                }
            })(0);
        }
    }

    //获取全部模型
    get_modules(is_command){
        let
            that = this,
            dir = that.get(`core/path/module`,that.node.path.join(__dirname,`module`)),
            files  = that.node.fs.readdirSync(dir)
        ;
        //加载全部 module
        files.forEach((file)=>{
            //静态载入模型 不运行也不传参数
            //静态载入会 new 模型
            that.get_module_static(file,is_command);
        });
    }

    /**
     * @func 获取一个模型
     * @param module_name
     * @param args
     * @param callback
     * @param is_command
     * @param sync
     */
    get_module(module_name,args,callback=null,is_command=false){
        let
            that = this,
            defaultRun = `run`,
            option,
            argv,//命令参数被转换后的JSON格式
            params,//通过JSON获取到的参数对象
            FullParams//参数对象添加了配置文件信息
        ;
        if(!that.module){
            that.module = {};
        }

        //用来存储之前的函数名
        that.option.beforeFuncName = [null];
        //执行方式, file folder 文件直接执行或是文件夹内执行
        that.option.currentExecuteType = null;
        that.tool.console.info(`\nExecute module in ${module_name}.`,7);

        argv = that.func.module.optionToArgv(module_name);
        params = that.tool.func.getParam(argv);
        //判断本次参数是否满足基本条件,指必须的参数都要有值
        //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
        FullParams = that.func.command_public_tools.isFullParams(argv,params,is_command);
        //将params作为值通过common传入到即将调用的模块
        that.params = params;
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
                        additionalParams = FullParams[len].additionalParams,//查询方法名,需要依次递减执行
                        queryClassName = paramName.split(/\\|\//),
                        module_name_pathname = `module.${paramName.replace(/^[\\\/]+/,``).replace(/[\/\\]/ig,`_`)}.class.js`,
                        beforeFuncName,
                        paramsGroup = that.func.module.paramsGroup( conf )
                    ;
                    if(that.module[module_name_pathname]){

                        //由循环中判断是否有扩展参数类
                        that.module[module_name_pathname].args = args;
                        //给该方法option
                        that.module[module_name_pathname].option = {
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
                            isRunFunction = that.module[module_name_pathname][defaultRun],//当前默认方法
                            isBeforeFunction = (beforeFuncName && that.module[module_name_pathname][beforeFuncName])//上级方法
                        ;
                        //非同步时要执行方法
                        //当存在运行方法  并且  非同步获取时,执行RUN.如果是同步获取,则不执行.
                        if( isRunFunction ){
                            that.tool.console.success(`default : ${paramName}/${defaultRun}:`);
                            let
                                callbackFunction = isBeforeFunction ? null : ()=>{//如果还有附加方法,则run方法不再传回调函数实体
                                    run_module(++len);//没有上一个方法时,则于RUN不接受回调,直接在此回调
                                }
                            ;
                            that.module[module_name_pathname][that.option.defaultRun](callbackFunction);
                        }
                        //如果有上一级的方法,也需要执行
                        if(isBeforeFunction ){
                            that.tool.console.success(`define : ${paramName}/${beforeFuncName}:`);
                            let
                                callbackFunction = ()=>{ //模型方法第一个参数永远是回调
                                    run_module(++len);
                                }
                            ;
                            that.module[module_name_pathname][beforeFuncName]( callbackFunction ,args);
                        }
                        that.option.beforeFuncName.push( queryClassName[queryClassName.length-1] );
                        beforeFuncName = (that.option.beforeFuncName.splice(0,1))[0];//存放上一个方法
                    }else{
                        run_module(++len);
                    }
                }
            })(0);
        }
    }

    /*
    * @func 静态获取一个模型但不运行 run
    */
    get_module_static(module){
        let
            that = this
        ;
        if(!that.module ){
            that.module = {};
        }
        module = module.replace(/^module\./i,``);
        module = module.replace(/\.class\.js$/i,``);
        if(!that.module[module]){
            let
                module_name = `module.${module}.class.js`,
                module_wait_execute = (()=>{
                    let
                        module_basic_path = that.get(`core/path/module`, /*默认值*/that.node.path.join( __dirname, `../module/`)),
                        module_folder_path = that.node.path.join(module_basic_path,module),
                        module_file_path = that.node.path.join(module_basic_path,module_name)
                    ;
                    //是模型文件夹
                    if(that.node.fs.existsSync(module_folder_path) && that.node.fs.lstatSync(module_folder_path).isDirectory()){
                        return {
                            type:`folder`,
                            path:module_folder_path
                        };
                        //是模型类
                    }else if(that.node.fs.existsSync(module_file_path) && that.node.fs.lstatSync(module_file_path).isFile()){
                        return {
                            type:`file`,
                            path:module_file_path
                        };
                    }else{
                        return null;
                    }
                })(),
                is_module_regexp = /^module\..+\.class\.js$/
            ;
            if(module_wait_execute !== null){
                let
                    module_type = module_wait_execute.type,
                    module_path = module_wait_execute.path,
                    modules = []
                ;
                if(module_type === `folder`){
                    let
                        module_paths = that.node.fs.readdirSync(module_path)
                    ;
                    module_paths.forEach((module_path_one)=>{
                        if(is_module_regexp.test(module_path_one)){
                            let
                                module_full_path = that.node.path.join(module_path,module_path_one)
                            ;
                            modules.push(module_full_path);
                        }
                    });
                }else if(module_type === `file`){
                    modules.push(module_path);
                }
                modules.forEach((module_path_item)=>{
                    let
                        module_require = require(module_path_item)
                    ;
                    let
                        module_path_parse = that.node.path.parse(module_path_item),
                        module_name_1 = module_path_parse.base.replace(/^module\.|\.class\.js$/ig,``),
                        module_name_2 = module_name_1.replace(/\./ig,`_`)
                    ;
                    that.module[ module_name_1 ] = new module_require(that); // xxx.xxx
                    that.module[ module_name_1 ].load = that;
                    that.module[ module_name_1 ].option = {};
                    that.module[ module_name_2 ] = that.module[ module_name_1 ]; // xxx_xxx
                });
            }else{
                that.module[module] = {};
            }
        }
        return that.module[module];
    }


    /*
    @func 获取配置变量
    */
    get_config(name=""){
        if(!name){
            name = "config";
        }else{
            name = name.replace(/\.class\.js$/,``);
        }
        let
            that = this
        ;
        if(that.config && that.config[name]){
            return that.config[name];
        }else{
            if(!that.config){
                that.config = {};
            }
            let
                c = that.get_class(`config/config`)
            ;
            /*
            @explain 默认时直接给值
            */
            if(name === 'config'){
                for(let p in c){
                    that.config[p] = c[p];
                }
            }
            return c;
        }
    }


    /**
     *@func 从本类取得 / 设置一个属性
     */
    get(name,v=null,bind=this){
        let
            result = v,
            names = name.split(/[\/\\]+/)
        ;
        (function set_that(obj,level){
            let
                the_name = names[level]
            ;
            if(level >= (names.length - 1) ){
                if(obj[the_name]){
                    result = obj[the_name];
                }
            }else{
                if(obj[the_name]){
                    set_that(obj[the_name],++level);
                }
            }
        })(bind,0);
        return result;
    }

    /**
     * @func  对本类设置一个属性
     */
    set(name,v=null,bind=this){
        let
            result = null,
            names = name.split(/[\/\\]+/)
        ;
        (function set_that(obj,level){
            let
                the_name = names[level]
            ;
            if(level >= (names.length - 1) ){
                if(v){
                    obj[the_name] = v;
                    result = obj[the_name];
                }
            }else{
                if(!obj[the_name]){
                    obj[the_name] = {};
                }
                set_that(obj[the_name],++level);
            }
        })(bind,0);
        return result;
    }

}

module.exports = commonC;