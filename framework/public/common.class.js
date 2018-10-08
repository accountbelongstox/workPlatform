/*
@公共类,该类主要用来取得其他目录的类,并直接返回
*/
const
path = require("path")
;

class commonC{

    constructor(){

        //加载基本NODE类
        if(!this.node){
            this.node = {};
        }
        this.node.path = path;
        
        //先要先加载基本类,这个必须放在第一个加载
        this.get_core('string');
        
        this.get_node('fs');
        this.get_node('path');

        //加载常用核心类供调用
        this.get_core('app.path');

        this.get_core('func');
        
    }
    /*
    @func 取得一个node内置模块
    */
    get_node(name,bind,catchFn){
        let
            that = this,
            jsonTile = that.core.string.commonClassNameFormat(name)
        ;

        if(!that.node[jsonTile]){
            try{
                that.node[jsonTile] = require(name);
            }catch(err){
                if(catchFn){
                    catchFn(err);
                }
            }
        }

        if(bind){
            if(!bind.node){
                bind.node = {};
            }
            bind.node[jsonTile] = that.node[jsonTile];
        }

        return that.node[jsonTile];
    }

    /*
    @func 取得core下面的类
    */
    get_core(name,bind,run=true){
        if(!this.core){
            this.core = {};
        }
        let
            that = this,
            jsonTile = name
        ;
        if(that.core.string){//该函数需要做特殊处理,因为第一个加载的是该函数,所以在没有字符串时要判断
            jsonTile = that.core.string.commonClassNameFormat(name)
        }
        if(!that.core[jsonTile]){
            let 
                _p = that.node.path.join( __dirname, `../core/${name}.class.js`),
                _c = require(_p),
                _m = new _c(that)
            ;

            that.core[jsonTile] = _m;
            that.core[jsonTile].common = that;
            that.core[jsonTile].option = {};

            if(_m["run"] && run){
                _m.run();
            }

        }
        if(bind){
            if(!bind.core){
                bind.core = {};
            }
            bind.core[jsonTile] = that.core[jsonTile];
        }
        return that.core[jsonTile];
    }

    /*
    @func 获取一个全局工具类
    */
    get_tools(name,bind){
        if(!this.tools){
            this.tools = {};
        }
        let 
            that = this,
            jsonTile = that.core.string.commonClassNameFormat(name)
        ;
        if(!this.tools[jsonTile]){
            let 
                tools_path = that.node.path.join(that.core.appPath.tools,name.replace(/\.class\.js$/,``)+".class.js"),
                tools_path_f = require(tools_path),
                tools_path_c = new tools_path_f(that)
            ;
            tools_path_c.common = that;
            tools_path_c.option = {};
            that.tools[jsonTile] = tools_path_c;

            if(that.tools[jsonTile]["run"]){
                let
                    callback = null
                ;
                if(bind instanceof Function){
                    callback = bind;
                    bind = null;
                }
                that.tools[jsonTile]["run"](callback);
            }
        }

        if(bind){
            if(!bind.tools){
                bind.tools = {};
            }
            bind.tools[jsonTile] = that.tools[jsonTile];
        }

        return that.tools[jsonTile];
    }


    /*
    @func 获取全局配置
    */
    get_config(name="",bind){

        if(!this.config){
            this.config = {};
        }

        let 
        that = this,
        jsonTile = that.core.string.commonClassNameFormat(name)
        ;

        if(!name)name=`config`;

        if(!that.config[jsonTile]){
            let 
            configPath = that.node.path.join(that.core.appPath.config,name.replace(/\.class\.js$/,``)+".class.js"),
            configO =  require(configPath),
            configCl = new configO(that),
            configC = null
            ;

            configCl.common = that;
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
                    let callback = null;
                    if(bind instanceof Function){
                        callback = bind;
                        bind = null;
                    }
                    that.config["run"](callback);
                }
            }else{
                that.config[jsonTile] = configC;
                that.config[jsonTile].option = {};

                if(that.config[jsonTile]["run"]){
                    let callback = null;
                    if(bind instanceof Function){
                        callback = bind;
                        bind = null;
                    }
                    that.config[jsonTile]["run"](callback);
                }
            }
        }

        if(bind){
            if(!bind.config){
                bind.config = {};
            }
            bind.config[jsonTile] = that.config[jsonTile];
        }

        return that.config[jsonTile];
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
        jsonTile = that.core.string.commonClassNameFormat(name)
        ;

        if(!that.support[jsonTile]){
            let 
            //先加载源文件,如果有则直接引用
            configPathSource = that.node.path.join(that.core.appPath.support,name),
            fileNameBase = name.replace(/\..+$/,``),
            //加载.json.js的文件
            configPathJSONPrefixJs = that.node.path.join(that.core.appPath.support,`${fileNameBase}.json.js`),
            //加载.json文件
            configPathJSONFile = that.node.path.join(that.core.appPath.support,`${fileNameBase}.json`),
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
                console.log(`Not find support ${name}`);
                return null;
            }
            configC = require(configPath);
            that.support[jsonTile] = configC;
        }
        if(bind){
            if(!bind.support){
                bind.support = {};
            }
            bind.support[jsonTile] = that.support[jsonTile];
        }
        return that.support[jsonTile];
    }

    /*
    @func 获取一个模型但不运行
    */
    get_module(module,mType=1/*1,ddrun 2,electron*/,option={},callback=null){

        if(!this.module){
            this.module = {};
        }

        let
            that = this,
            jsonTile = that.core.string.commonClassNameFormat(module),
            params = that.core.func.getParam(that.optionToArgv(option))
        ;
        switch(mType){
            case 1:
            mType = this.core.appPath.command_modules;
            break;
            case 2:
            mType = this.core.appPath.electron_modules;
            break;
        }
        if(!that.module[jsonTile]){
            let 
            modulePath = that.node.path.join(mType,module+"/index.class.js"),
            _m = require(modulePath),
            r = new _m(that)
            ;
            r.common = that;
            r.option = option;
            that.module[jsonTile] = r;

            if(that.module[jsonTile]["run"]){
                that.module[jsonTile]["run"](callback);
            }
        }
        return that.module[jsonTile];
    }

    /*
    @func config 加载器 用于分离避免循环
    */
    config_load(name){
        let
            that = this,
            p = that.node.path.join(that.core.appPath.config,`./ddrun_config/${name}.class.js`),
            c =  require(p),
            c2 = new c(that)
        ;

        if(!that[`config_load`]){
            that[`config_load`] = {};
        }

        c2.common = that;
        c2.option = {};

        if(!that[`config_load`][name]){
            that[`config_load`][name] = c2.run();
        }

        return that[`config_load`][name];
    }
}

module.exports = new commonC();