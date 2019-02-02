/*
@start step
1.载入node 基本类
2.载入核心类
3.加载支持文件
4.加载配置文件
5.加载工具类
6.加载模型
7.加载模型方法
8.HTML加载启动方法 如下:
	<script type="text/javascript">
		(()=>{
			const
					path = require(`path`),
					root_dir = path.join(__dirname,`../../../../`),
					load_dir = path.join(root_dir,`framework/load/load.class.js`),
					load_o = require(load_dir),
					load = new load_o()
			;
			load.set_jQuery($);
			//设置document时同时设置webview
			load.set_document(document);
			load.webview_start();
		})();
	</script>

@func
event           执行本地事件方法
load_path       本地路径配置
webview_start   设置webview类 在html指定webview的类

*/
class commonC{
    /**
     *
     * @param object path object 指定核心目录
     * @param object is_command boolean 是否以命令行模式运行
     */
    constructor(object={}){
        let
            that = this
        ;

        that.debug = true;//开启调试

        if(!that.option){
            that.option = {};
        }
        //将调用此参数时传入的值都赋给类
        if(object && (typeof object === "object")){
            for(let p in object){
                that.option[p] = object[p];
            }
        }
        if(!that.option.__initLoadAll) {
            // 加载基本 node
            that.get_node();
            // 载入输出信息控制台
            that.load_console();
            // 载入核心路径库,可以设置路径库
            that.load_path((object && object.path) ? object.path : null);
            // 加载参数获取方法
            that.load_param();
            // 加载所有核类
            that.get_all_class("core");
            // 加载支持文件
            that.get_all_class("support");
            // 加载配置文件
            that.get_all_class(`config`,this,false);//不载入子目录
            //that.get_config();
            // 加载所有工具类
            that.get_all_class("tool");
            // 加载所有的模型
            let
                is_command = ( object && object.is_command ) ? object.is_command : false // 是否以命令方式加载
            ;
            that.get_modules( is_command );
            // 加载模型附加工具类
            that.get_all_class("module_func");
            // 设置加载标识
            that.option.__initLoadAll = true;
        }
        // 前置运行方法
        that.run();
    }

    /**
     * @func 基本运行内容, 不同的软件写入不同的值
     */
    run(c_run_func=null){
        let
            that = this
        ;
        // ... 首要执行函数 , 此函数只在程序启动时执行一次.
        if(c_run_func){
            c_run_func(that);
        }
    }

    /**
     * @func 设置路径库
     */
    load_path(paths={}){
        let
            that = this,
            get_dir = (name,default_value)=>{//判断该地址是否被从实例化传入.  实例化参数为 option.path = {}
                if(paths && paths[name]){
                    return paths[name];
                }else{
                    return default_value;
                }
            },
            join = (a,b)=>{
                if(that.path[a]){
                    return that.node.path.join(that.path[a],b);
                }else{
                    console.log(`path not find param in ${a}`);
                    return undefined;
                }
            },
            get = (k,v=null)=>{ //取得一个核心路径属性
                if(that.path[k]){
                    return that.path[k];
                }else{
                    return v;
                }
            }
        ;

        that.path = {};
        //获取程序的真实根目录
        //由于编译后,真实根目录找不到, 所以根据 app.asar / electron.asar来判断
        //开发中根据 main.js 来判断
        that.path.root = get_dir(`root`,(function getRoot(path,develop_root,build_root){
            let
                dirs = that.node.fs.readdirSync(path)
            ;
            if(dirs.find( a => a.toLowerCase() === "main.js" )){
                //开发版根目录
                develop_root = path;
            }
            if(dirs.find( a => a.toLowerCase() === "app.asar" ) && dirs.find( a => a.toLowerCase() === "electron.asar" )){
                //加密编译后的目录
                build_root = path;
            }
            let
                path_parse = that.node.path.parse(path),
                remove_string = /[\:\\\/]+/ig,
                path_dir = path_parse.dir.replace(remove_string,``),
                path_root = path_parse.root.replace(remove_string,``)
            ;
            //没找到时继续上级查找
            if(!build_root && path_dir !== path_root){
                return getRoot(that.node.path.dirname(path),develop_root,build_root);
            }else{
                return (build_root ? build_root : develop_root);
            }
        })(__dirname,null,null));

        that.path.load_class = that.node.path.join(__dirname,`load.class.js`);
        that.path.commandBat = get_dir(`commandBat`,join("root",`ddrun.bat`).replace(/\/+/ig,`\\`));
        that.path.framework = get_dir(`framework`,join("root",`framework`));

        that.path.apps = get_dir(`apps`,join("framework",`apps`));
        that.path.framework_bin = get_dir(`framework_bin`,join("framework",`bin`));
        that.path.bin = get_dir(`bin`,join("framework",`bin`));
        that.path.tmp = get_dir(`tmp`,join("framework",`tmp`));
        that.path.data = get_dir(`data`,join("framework",`data`));

        that.path.template = get_dir(`template`,join("framework",`template`));
        that.path.core = get_dir(`core`,join("framework",`core`));
        that.path.tool = get_dir(`tool`,join("framework",`tool`));
        that.path.support = get_dir(`support`,join("framework",`support`));
        that.path.module = get_dir(`module`,join("framework",`module`));
        that.path.config = get_dir(`config`,join("framework",`config`));
        that.path.func = get_dir(`func`,join("framework",`func`));

        that.path.tmp_html = get_dir(`tmp_html`,join("tmp",`_html`));
        that.path.tmp_csv = get_dir(`tmp_csv`,join("tmp",`_csv`));

        that.path.html_template = get_dir(`html_template`,join("template",`html`));
        that.path.html_template_extend = get_dir(`html_template_extend`,join("html_template",`page_extend_modules`));
        that.path.html_template_extend_page = get_dir(`html_template_extend_page`,join("html_template_extend",`page`));

        that.path.get = get; //取得一个核心路径
        that.path.join = join; //将一个路径与核心路径连接


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
                    //从web模块启动
                    if(callback){
                        callback();
                    }else if(`web` in that.module){
                        that.module.web.start();
                    }else{
                        console.log(`html start not find function!`);
                    }
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
        if(!that.eles){
            that.eles={};
        }
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
        if(!that.eles){
            that.eles={};
        }
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
        let
            not_modules = []
        ;
        //加载全部 node
        nodes.forEach((node)=>{
            if(node){
                try{
                    that.node[node] = require(node);
                }catch(err){
                    not_modules.push(node);
                }
            }
        });
        //拥有不存在的包,提醒 npm 安装
        if(not_modules.length){
            let
                not_module = not_modules.join(` `)
            ;
            console.log('\u001b[31m cnpm install '+not_module+' --save-dev\n\n \u001b[39m');
            throw (new Error(`Please install the NPM package first.`));
        }
    }


    /*
    @func 取得core基本类
    */
    get_all_class(name,bind=this,loadChildrenDir=true){
        let
            that = this,
            dir = (()=>{
                let
                    _dir = that.get(`core/path/${name}`, /*默认值*/that.node.path.join( __dirname, `../${name}/`))
                ;
                if(!that.node.fs.existsSync(_dir) || !that.node.fs.lstatSync(_dir).isDirectory()){
                    that.node.fs.mkdirSync(_dir);
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
                that.get_class(`${name}/${class_file}`,bind,loadChildrenDir);
            }
        });
    }

    /**
     * @func
     * @param name_path
     * @param bind
     * @param loadChildrenDir
     * @private
     */
    get_class(name_path,bind=this,loadChildrenDir=true){
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
                        that.node.fs.mkdirSync(_dir);
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
                    console.log(class_path,isJson,12212);


                    //TODO  .........................


                    if(isStatic){// 静态资源读取
                        m = that.set(name_path,that.node.fs.readFileSync(class_path),bind);
                    }else if(isJson){// json 直接载入
                        try{//是类时取得 run 的结果
                            let
                                e = new c(that)
                            ;
                            e.load = that;
                            e.option = {};
                            if("run" in e){
                                m = that.set(name_path,e.run(),bind);
                            }else{
                                m = {};
                            }
                        }catch(err){//非类时直接载入  module.exports = {}
                            m = that.set(name_path,c,bind);
                        }
                    }else{// class.js / json.js 需要实例化
                        let
                            e = new c(that)
                        ;
                        e.load = that;
                        e.option = {};
                        if("run" in e){
                            e.run();
                        }
                        m = that.set(name_path,e,bind);
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

    load_param(){
        let
            that = this
        ;
    }

    /**
     * @func 载入模型工具包
     * @returns {{optionToArgv: (function(*=): Array)}}
     */
    get_module_func(){
        let
            that = this,
            printCommandParamsNeedRequirement = (config)=>{//用于帮助文件显示
                for( let p in config ){

                    let
                        sourceChildren = config[p],
                        mustParamsIsOne = config.mustParamsIsOne,
                        consoleType = 1
                    ;
                    if(p == `mustParams` && sourceChildren){
                        consoleType = 2;
                        that.console.info("* Necessary parameters :",consoleType);
                    }
                    if(p == `additionalParams` && sourceChildren){
                        consoleType = 5;
                        that.console.info("* Addition parameter :",consoleType);
                    }

                    if(p == `mustParams`  || p == `additionalParams` ){
                        let
                            iCount = 0
                        ;
                        for( let k in sourceChildren ){
                            if(iCount > 0){
                                console.log("\n");
                            }
                            iCount++;
                            let
                                d = sourceChildren[ k ],
                                before = `-`,
                                format = `\texample : `,
                                MustBeSatisfiedInfo = `\tmust be satisfied!`
                            ;
                            if( k.length > 1){
                                before = `--`
                            }
                            if(d.keyValue){
                                format+=`${before}${k}:"Parameter content" `
                            }else{
                                format+=`${before}${k}`
                            }
                            if(!d.description){
                                d.description = '';
                            }
                            that.console.info(` ${before}${k}`,consoleType);
                            //如果可以一个参数
                            if(mustParamsIsOne && d.MustBeSatisfied){
                                that.console.info(MustBeSatisfiedInfo,8);
                            }
                            //没有标识可以单个参数
                            if(!mustParamsIsOne){
                                that.console.info(MustBeSatisfiedInfo,8);
                            }
                            that.console.info(`\tdescription : ${d.description}`,consoleType);
                            if(format){
                                that.console.info(format,consoleType);
                            }
                        }
                    }
                }
                return false;
            },
            paramsNotice = (config) => { // 用于参数不全的时候提醒
                let
                    errorInfo = [
                        `---------------------------------------------`,
                        `Command name - ${that.option.beforeCommand}`,
                        `This command need parameter.`,
                        `Or the parameter not exists.`
                    ]
                ;
                that.console.error(errorInfo);
                return printCommandParamsNeedRequirement(config);
            },
            getSupportParams = (fn_name,conf=null,get_source=false) => {//从全局配置文件 framwork/config/ 下取得每个模型支持的命令集合
                if(!conf){
                    conf = this.o.config.framwork.modules.command[ fn_name ];
                }
                if(get_source)return conf;
                let
                    c = {},
                    o = {},
                    mustParams = `mustParams`,
                    additionalParams = `additionalParams`
                ;
                if(conf && mustParams in conf){
                    c[ mustParams ] = conf[ mustParams ];
                }
                if(conf && additionalParams in conf){
                    c[ additionalParams ] = conf[ additionalParams ];
                }
                o.source = { };
                o.source = conf;
                o.params = { };//返回的命令参数
                o.params[ mustParams ] = [];
                o.params[ additionalParams ] = [];
                if(c !== {}){
                    for(let p in c){
                        let
                            tmp = c[p]
                        ;
                        for(let k in tmp){
                            if(p == mustParams){
                                o.params[ mustParams ].push( k );
                            }
                            if(p == additionalParams){
                                o.params[ additionalParams ].push( k );
                            }
                        }
                    }
                }
                return o;
            },
            countParams = (config)=>{ // 统计参数
                let
                    params = [],
                    mustParams = [],
                    additionalParams = []
                ;
                if(config.mustParams){
                    for(let p in config.mustParams){
                        params.push(p);
                        mustParams.push(p);
                    }
                }
                if(config.additionalParams){
                    for(let p in config.additionalParams){
                        params.push(p);
                        additionalParams.push(p);
                    }
                }
                let
                    o = {
                        params,
                        mustParams,
                        additionalParams
                    }
                ;
                return o;
            },
            isFullParams = (args,params,is_command=false,config,exeI=0)=>{//判断参数是否齐全
                if(!config && exeI===0){
                    //每次新建立的需要重新清除
                    that.option.beforeCommand = "";
                    config = that.config.basic.framwork.modules.command;
                    that.option.record = [];
                }
                //保存命令行执痕迹
                if(!that.option.record){
                    that.option.beforeCommand = "";
                    that.option.record = [];
                }
                //如果有必须的下级命令
                //如果是命令模型,则附上参数,非命令模型不用管
                if( config.mustParams && ( Object.keys(config.mustParams).length > 0)  ){
                    let
                        command = params.contain(config.mustParams)
                    ;
                    //如果没有命令则警告
                    if(!command){
                        if(is_command){//命令行时才阻断  警告并反回 false
                            return paramsNotice(config);
                        }else{//非命令行如果没有下级了,直接返回
                            if(!that.option.record.length){//以记录是否被插入数据来判断,该模型是否是命令行模型.因为命令行模型通过配置文件,会符上参数
                                let
                                    module_not_command_name = ``,
                                    module_name = argvs[0]
                                ;
                                args.forEach((command_arg)=>{
                                that.option.record.push({
                                    name:module_not_command_name+=`/${command_arg}`,
                                    conf:{},
                                    command:module_name,
                                    root_module:module_name,
                                    params: params,
                                    mustParams: {},
                                    additionalParams: {}
                                });
                            });
                        }
                        return that.option.record;
                    }
                }else{
                    //递归下一级查看
                    that.option.beforeCommand += `/${command}`;
                    that.option.record.push({
                        name:that.option.beforeCommand,
                        conf:config.mustParams[command],
                        command,
                        root_module:command,
                        params: countParams(config.mustParams[command]).params,
                        mustParams: countParams(config.mustParams[command]).mustParams,
                        additionalParams: countParams(config.mustParams[command]).additionalParams
                    });
                    return isFullParams(args,params,is_command,config.mustParams[command],++exeI);
                }
            }else{
                return that.option.record;
            }
        },
        optionToArgv = (option)=>{//将一个传入的对象转为参数数组
            let
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
            },
        getParam = (opt,paramName=null,defaultV=null,isValue=false,getKey=false)=>{
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
                            let Dir = that.node.path.parse(_vTname);
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
                        _v = that.module.string.trimX(_v);
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
        },
            paramsGroup = (...args)=>{ // 获取一个参数 paramName:需要获取的参数名 isValue:该参数是否含有值 default:如果没有找到参数则返回默认值
                let
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
        ;
        return {
            printCommandParamsNeedRequirement,
            paramsNotice,
            countParams,
            isFullParams,
            optionToArgv,
            getParam,
            paramsGroup
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
            module_func = that.get_module_func(),
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
        that.console.info(`\nExecute module in ${rootModuleName}.`,7);
        argv = module_func.optionToArgv(command_option);
        params = module_func.getParam(argv);
        //判断本次参数是否满足基本条件,指必须的参数都要有值
        //如果参数有多个,则根据构架,会返回一个数组,并依次由远而近的执行
        FullParams = module_func.isFullParams(argv,((()=>{
            return params
        })()),is_command);
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
                        paramsGroup = module_func.paramsGroup(conf)
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
                            that.console.success(`default : ${paramName}/${defaultRun}:`);
                            let
                                callbackFunction = isBeforeFunction ? null : ()=>{//如果还有附加方法,则run方法不再传回调函数实体
                                    run_module(++len);//没有上一个方法时,则于RUN不接受回调,直接在此回调
                                }
                            ;
                            that.module[module_name_pathname][defaultRun](callbackFunction);
                        }
                        //如果有上一级的方法,也需要执行
                        if(isBeforeFunction){
                            that.console.success(`define : ${paramName}/${beforeFuncName}:`);
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
                        that.console.info(`${len} No model ${paramName} found.`);
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
            dir = (()=>{
                let
                    module_dir = that.path.get(`module`,that.node.path.join(__dirname,`module`))
                ;
                if(!that.node.fs.existsSync(module_dir) || !that.node.fs.lstatSync(module_dir).isDirectory()){
                    that.node.fs.mkdirSync(module_dir);
                }
                return module_dir;
            })(),
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
        that.console.info(`\nExecute module in ${module_name}.`,7);

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
                            that.console.success(`default : ${paramName}/${defaultRun}:`);
                            let
                                callbackFunction = isBeforeFunction ? null : ()=>{//如果还有附加方法,则run方法不再传回调函数实体
                                    run_module(++len);//没有上一个方法时,则于RUN不接受回调,直接在此回调
                                }
                            ;
                            that.module[module_name_pathname][that.option.defaultRun](callbackFunction);
                        }
                        //如果有上一级的方法,也需要执行
                        if(isBeforeFunction ){
                            that.console.success(`define : ${paramName}/${beforeFuncName}:`);
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
                        module_basic_path = that.path.get(`module`, /*默认值*/that.node.path.join( __dirname, `../module/`)),
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
    get_config(name="",bind=this){
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
                c = that.get_class(`config/config`,bind)
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

    /**
     * @func 载入输出控制台
     */
    load_console(){
        let
            that = this,
            info = (...arg)=>{//输出信息
                let
                    type = parseInt(arg[arg.length-1])
                ;
                if(type !==type){
                    type = 1;
                }else{
                    arg.splice(arg.length-1,1);
                }
                switch (type) {
                    case 1:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.white);
                        });
                        break;
                    case 2:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.yellow);
                        });
                        break;
                    case 3:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.blue);
                        });
                        break;
                    case 4:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.green);
                        });
                        break;
                    case 5:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.cyan);
                        });
                        break;
                    case 6:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.grey);
                        });
                        break;
                    case 7:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.magenta);
                        });
                        break;
                    case 8:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(`${c}`.red);
                        });
                        break;
                    default:
                        arg.forEach((c,i)=>{
                            if(typeof c === "object"){
                                c = c.join(`\n`);
                            }
                            console.log(c);
                        });
                        break;
                }
            }
            ;
            that.console = {
                stop:(...arg)=>{//抛出错误并停止
                    console.log('Throw error : '.red);
                    let
                        content=""
                    ;
                    arg.forEach((c,i)=>{
                        if(typeof c === "object"){
                            c = c.join(`\n`);
                        }
                        content+=c;
                    });
                    throw content;
                },
                process:(...arg)=>{//在同一行打印
                    let
                        that = this
                    ;
                    let
                        type = parseInt(arg[arg.length-1])
                    ;
                    if(type !==type){
                        type = 1;
                    }else{
                        arg.splice(arg.length-1,1);
                    }

                    arg.forEach((c,i)=>{
                        if(typeof c === "object"){
                            c = c.join(`\n`);
                        }
                        //删除光标所在行
                        that.node.readline.clearLine(process.stdout, 0);
                        //移动光标到行首
                        that.node.readline.cursorTo(process.stdout, 0, 0);
                        info(c,type);
                        //process.stdout.write( c, 'utf-8');
                    });
                },
                error:(...arg)=>{//输出一条错误信息
                    console.log('Error : '.red);
                    arg.forEach((c,i)=>{
                        if(typeof c === "object"){
                            c = c.join(`\n`);
                        }
                        console.log(`${c}`.red);
                    })
                },
                waring:(...arg)=>{//输出一条警告信息
                    arg.forEach((c,i)=>{
                        if(typeof c === "object"){
                            c = c.join(`\n`);
                        }
                        c = `Waring : ${c}`;
                        console.log(`${c}`.yellow);
                    })
                },
                success:(...arg)=>{//成功提示
                    console.log('Success : '.green);
                    arg.forEach((c,i)=>{
                        if(typeof c === "object"){
                            c = c.join(`\n`);
                        }
                        console.log(`${c}`.green);
                    })
                },
                extras:(...arg)=>{//输出带背景色的信息
                    let
                        type = parseInt(arg[arg.length-1])
                    ;
                    if(type !==type){
                        type = 1;
                    }else{
                        arg.splice(arg.length-1,1);
                    }
                    switch (type) {
                        case 1:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.rainbow);
                            });
                            break;
                        case 2:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.zebra);
                            });
                            break;
                        case 3:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.america);
                            });
                            break;
                        case 4:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.trap);
                            });
                            break;
                        case 5:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.random);
                            });
                            break;
                        default:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(c);
                            });
                            break;
                    }
                },
                style:(...arg)=>{//输入一条带style的信息
                    let
                        type = parseInt(arg[arg.length-1])
                    ;
                    if(type !==type){
                        type = 1;
                    }else{
                        arg.splice(arg.length-1,1);
                    }
                    switch (type) {
                        case 1:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.reset);
                            });
                            break;
                        case 2:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bold);
                            });
                            break;
                        case 3:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.dim);
                            });
                            break;
                        case 4:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.italic);
                            });
                            break;
                        case 5:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.underline);
                            });
                            break;
                        case 6:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.hidden);
                            });
                            break;
                        case 7:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.strikethrough);
                            });
                            break;
                        default:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(c);
                            });
                            break;
                    }
                },
                background:(...arg)=>{//输出带背景色的信息
                    let
                        type = parseInt(arg[arg.length-1])
                    ;
                    if(type !==type){
                        type = 1;
                    }else{
                        arg.splice(arg.length-1,1);
                    }
                    switch (type) {
                        case 1:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgBlack);
                            });
                            break;
                        case 2:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgRed);
                            });
                            break;
                        case 3:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgGreen);
                            });
                            break;
                        case 4:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgYellow);
                            });
                            break;
                        case 5:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgBlue);
                            });
                            break;
                        case 6:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgMagenta);
                            });
                            break;
                        case 7:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgCyan);
                            });
                            break;
                        case 8:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(`${c}`.bgWhite);
                            });
                            break;
                        default:
                            arg.forEach((c,i)=>{
                                if(typeof c === "object"){
                                    c = c.join(`\n`);
                                }
                                console.log(c);
                            });
                            break;
                    }
                },
                info//输出信息
            }
        ;
    }


    /**
     * @func 执行一个事件
     * @param eventName
     * @param args
     * @param callback
     * @returns {*}
     */
    event(eventName,args=null,callback){
        let
            that = this,
            result = null,
            //此处传入的因为直接 是load本身
            //为了统一书写习惯  将 load 再往下一级
            thatLoad = {
                load:that
            },
            HTMLEventModule = that.module[`event-html`],
            electronEventModule = that.module[`event-electron`]
        ;
        if(!that.eventObejct){
            that.eventObejct = {};
        }
        if(!that.eventObejct[eventName]){
            if(eventName in HTMLEventModule){
                that.eventObejct[eventName] = HTMLEventModule[eventName];
            }else if(eventName in electronEventModule){
                that.eventObejct[eventName] = electronEventModule[eventName];
            }
        }
        if(that.eventObejct[eventName]){
            //electron 执行的 that 必须以参数的形式传入进却说
            result = that.eventObejct[eventName](thatLoad,args,callback);
        }else{
            console.log(`event ${eventName} not exists!`);
        }
        return result;
    }
}

module.exports = commonC;