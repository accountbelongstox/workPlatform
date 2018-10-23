/*
@公共类,该类主要用来取得其他目录的类,并直接返回
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
        for(let p in object){
            that.option[p] = object[p];
        }

        if(!that.iniLoadAllCoreClass) {
            // 1.加载NODE
            that.get_basic_node();
            // 2.加载所有核类
            that.get_all_core();
            // 加载支持文件
            that.get_class("support");
            that.get_class("config");
            // 3.加载所有工具类
            that.get_all("tool");
            that.get_all("func");
            // 5.加载所有的模型
            that.get_modules();

            // 3.加载所有工具类
            that.iniLoadAllCoreClass = true;
        }
    }

    //加载所有NODE类
    get_basic_node(){
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
                "",
                ""
            ]
        ;
        that.node = {
        };
        //加载全部 node
        nodes.forEach((node)=>{
            if(node)that.node[node] = require(node);
        });

    }


    /*
    @func 加载所有核类,并将核心类的值赋给本函数
    */
    get_all_core(){
        let
            that = this
        ;
        return that.get_all("core",that);
    }

    /*
    @func 取得core基本类
    */
    get_all(name,bind=null){
        let
            that = this,
            dir = that.node.path.join( __dirname, `./${name}/`),
            files  = that.node.fs.readdirSync(dir)
        ;
        //加载全部 module
        files.forEach((file)=>{
            let
                path = that.node.path.join(dir,file)
            ;
            if(that.node.fs.lstatSync(path).isFile()){
                file = file.replace(/\.class\.js$/i,``);
                that.get(file,name,bind);
            }
        });
    }

    /*
    @func 取得core基本类
    */
    get(name,getType,bind){
        let
            that = this
        ;
        if(!that[getType]){
            that[getType] = {};
        }
        if(!that[getType][name]){
            let
                _p = that.node.path.join( __dirname, `./${getType}/${name}.class.js`),
                _c = require(_p),
                _m = new _c(that)
            ;
            that[getType][name] = _m;
            that[getType][name].o = that;
            that[getType][name].option = {};
            if("run" in that[getType][name])that[getType][name].run();
        }
        if(bind){
            bind[name] = that[getType][name];
        }
        return that[getType][name];
    }

    get_class(name){
        let
            that = this,
            dir = that.path[name],
            files  = that.node.fs.readdirSync(dir)
        ;
        //加载全部 module
        files.forEach((file)=>{
            let
                path = that.node.path.join(dir,file)
            ;
            if(/^[a-zA-Z0-9\-\_]+\.(json|class)(\.js)*$/.test(file)){
                if(that.node.fs.lstatSync(path).isFile()){
                    that[`get_${name}`](file);
                }
            }
        });
    }


    /*
    @func 获取一个支持
    */
    get_support(name="",bind){
        if(!this.support){
            this.support = {};
        }
        let
            that = this,
            fileNameBase = name.replace(/\..+$/,``)
        ;

        if(!that.support[fileNameBase]){
            let
                //先加载源文件,如果有则直接引用
                configPathSource = that.node.path.join(that.path.support,name),
                //加载.json.js的文件
                configPathJSONPrefixJs = that.node.path.join(that.path.support,`${fileNameBase}.json.js`),
                //加载.json文件
                configPathJSONFile = that.node.path.join(that.path.support,`${fileNameBase}.json`),
                configPath = ``,
                configC = null
            ;
            if( that.node.fs.existsSync(configPathSource) && that.node.fs.lstatSync(configPathSource).isFile() ){
                configPath = configPathSource;
            }else if( that.node.fs.existsSync(configPathJSONPrefixJs) ){
                configPath = configPathJSONPrefixJs;
            }else if( that.node.fs.existsSync(configPathJSONFile) ){
                configPath = configPathJSONFile;
            }else{
                return null;
            }
            configC = require(configPath);
            that.support[fileNameBase] = configC;
        }
        if(bind){
            if(!bind.support){
                bind.support = {};
            }
            bind.support[fileNameBase] = that.support[fileNameBase];
        }
        return that.support[fileNameBase];
    }


    /*
    @func 获取全局配置
    */
    get_config(name=""){
        let 
            that = this
        ;
        if(!that.config){
            that.config = {};
        }
        if(!name)name=`config`;
        name = name.replace(/\.class\.js$/,``);
        if(!that.config[name]){
            let 
                configPath = that.node.path.join(that.path.config,`${name}.class.js`),
                configO =  require(configPath),
                configCl = new configO(that),
                configC
            ;
            configCl.o = that;
            configCl.option = {};
            configC = configCl.run();
            /*
            @explain 默认时直接给值
            */
            if(name === 'config'){
                for(let p in configC){
                    that.config[p] = configC[p];
                }
                that.config.option = {};

                if(that.config["run"]){
                    that.config["run"]();
                }
            }else{
                that.config[name] = configC;
                that.config[name].option = {};
                if(that.config[name]["run"]){
                    that.config[name]["run"]();
                }
            }
        }
        return that.config[name];
    }


    get_modules(){
        let
            that = this,
            dir = that.path.modules,
            files  = that.node.fs.readdirSync(dir)
        ;
        //加载全部 module
        files.forEach((file)=>{
            let
                path = that.node.path.join(dir,file)
            ;

            if(that.node.fs.lstatSync(path).isFile()){
                that.get_module(file);
            }
        });
    }

    /*
    @func 获取一个模型但不运行
    */
    get_module(module){
        let
            that = this
        ;
        if(!that.module){
            that.module = {};
        }

        if(!that.module[module]){
            module = module.replace(/\.class\.js$/,``);
            let
                modulePath = that.node.path.join(that.path.modules,`${module}.class.js`),
                _m = require(modulePath),
                r = new _m(that)
            ;
            r.o = that;
            r.option = {};
            that.module[module] = r;
            if(that.module[module]["run"]){
                that.module[module]["run"]();
            }
        }
        return that.module[module];
    }


    /*
    @func config 加载器 用于分离避免循环
    */
    config_load(name){
        let
            that = this,
            p = that.node.path.join(that.path.config,`./ddrun_config/${name}.class.js`),
            c =  require(p),
            c2 = new c(that)
        ;

        if(!that[`config_load`]){
            that[`config_load`] = {};
        }

        c2.o = that;
        c2.option = {};

        if(!that[`config_load`][name]){
            that[`config_load`][name] = c2.run();
        }

        return that[`config_load`][name];
    }

}

module.exports = commonC;