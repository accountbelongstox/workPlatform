class AC{
    constructor(o){
        let
            that = this
        ;
        //获取程序的事实根目录
        that.root = (function getRoot(path){
            let
                dirs = o.node.fs.readdirSync(path),
                isRoot = 0
            ;
            dirs.forEach((dir)=>{
                if(dir === "framework"){
                    isRoot ++;
                }
                if(dir === "main.js"){
                    isRoot ++;
                }
                //------------------------------
                if(dir === "app.asar"){
                    isRoot ++;
                }
                if(dir === "electron.asar"){
                    isRoot ++;
                }
            });
            if((isRoot >= 2)){
                //多一次判断用于对已经编译后的识别
                let
                    parentDir = o.node.path.dirname(path)
                ;
                dirs = o.node.fs.readdirSync(parentDir);
                isRoot = 0;
                dirs.forEach((dir)=>{
                    if(dir === "framework"){
                        isRoot ++;
                    }
                    if(dir === "main.js"){
                        isRoot ++;
                    }
                    //------------------------------
                    if(dir === "app.asar"){
                        isRoot ++;
                    }
                    if(dir === "electron.asar"){
                        isRoot ++;
                    }
                });
                if(isRoot >= 2){
                    return parentDir
                }else{
                    return path;
                }
            }else{
                return getRoot(o.node.path.dirname(path));
            }
        })(__dirname)
        ;
    }

    run(){

        let
            that = this
        ;

        that.commandBat = that.join("root",`ddrun.bat`).replace(/\/+/ig,`\\`);
        that.framework = that.join("root",`framework`);


        that.apps = that.join("framework",`apps`);
        that.framework_bin = that.join("framework",`bin`);
        that.bin = that.join("framework",`bin`);
        that.tmp = that.join("framework",`tmp`);
        that.data = that.join("framework",`data`);


        that.template = that.join("framework",`template`);
        that.core = that.join("framework",`core`);
        that.tool = that.join("framework",`tool`);
        that.support = that.join("framework",`support`);
        that.modules = that.join("framework",`modules`);
        that.config = that.join("framework",`config`);
        that.func = that.join("framework",`func`);


        that.tmp_html = that.join("tmp",`_html`);
        that.tmp_csv = that.join("tmp",`_csv`);


        that.html_template = that.join("template",`html`);
        that.html_template_extend = that.join("html_template",`page_extend_modules`);
        that.html_template_extend_page = that.join("html_template_extend",`page`);


        that.command_modules = that.join("modules",`command_modules`);
        that.electron_modules = that.join("modules",`electron_modules`);
        that.sqlite_modules = that.join("modules",`sqlite_modules`);
    }

    join(a,b){
        let
            that = this
        ;
        return that.o.node.path.join(that[a],b);
    }
    /*
    @func 取得对象的内容
    @params "support.files"
    */
    get(_name,name2=null){
        let
            that = this
        ;
        if(!_name){
            return false;
        }
        if( (typeof _name) === "string"){
            let
                _nameArr = _name.split("."),
                _tmp
            ;
            for(let i=0;i<_nameArr.length;i++){
                let
                    _s = _nameArr[i]
                ;
                if(!_tmp)_tmp = that;
                if(_tmp[_s]){
                    _tmp = _tmp[_s];
                }else{
                    return null;
                }
            }
            if(name2){
                let
                    ext = ["",".class.js",".js"]
                ;
                for(let i=0;i<ext.length;i++){
                    let _t_ = that.o.node.path.join(_tmp,name2+ext[i]);
                    if(that.o.node.fs.existsSync(_t_)){
                        return require(_t_);
                    }
                }
                return {};
            }
            if(that.o.node.fs.existsSync(_tmp))return require(_tmp);
        }
        return {};
    }

    /*
    @func 用于获取一个地址,可以连接本类和指定的地址
    */
    getPath(a,b=null){
        let 
        that = this
        ;
        if(this[a]) a = this[a];
        if(a && b){ 
            return that.o.node.path.join(a,b);
        }
        return a;
    }

    /**
     * @func 本类必须的工具函数
     * @param dir
     */
    getDir(dir){
        let
        that = this
        ;
        if( that[dir]){
            dir = that[dir];
        }
        let
        files = that.o.node.fs.readdirSync( dir ),
        dirs = {}
        ;
        for(let i=0;i<files.length;i++){
            let name = files[i];
            dirs[ name.replace(/\..+/ig,"") ] = that.o.node.path.join(dir,files[i]);
        }
        return dirs;
    }
}
/*
* @exports 类需要使用module.exports导入才可以使用
* */
module.exports = AC;