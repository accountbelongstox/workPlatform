"use strict"
/*
 * @class 全部程序的主要路径.
 * */
class appPath{
    constructor(common){
        //此为基本类,暂时不能加载其他类
        common.get_node('path');
        common.get_node('fs');
        //此为基本类,暂时不能加载其他类
    }
    run(){
        let
        that = this,
        path = that.common.node.path
        ;
        that.root = path.join(__dirname,`../../`);//安装目录
        that.framework = path.join(that.root,'./framework');//framework目录
        that.apps = path.join(that.root,'./apps/');//apps为程序内置目录,下面的所有目录都必须设置到环境变量
        that.framework_bin = path.join(that.framework,'./bin/');
        that.bin = path.join(that.framework,'./bin/');
        that.tmp = path.join(that.framework,'./tmp/');//临时目录
        that.tmp_html = path.join(that.tmp,"./_html/");//HTML临时目录
        that.tmp_csv = path.join(that.tmp,"./_csv/");//CSV临时目录
        that.template = path.join(that.framework,"./template/");
        that.html_template = path.join(that.template,"./html/");
        that.html_template_extend = path.join(that.html_template,"./page_extend_modules/");//HTML静态页扩展
        that.html_template_extend_page = path.join(that.html_template_extend,"./page/");//HTML扩展page
        that.config = path.join(that.framework,"./config/");//配置文件
        that.files = path.join(that.root,"./resources/");//本地资源
        that.web_down = path.join(that.files,"./web_down/");//网站静态下载目录
        that.resources = path.join(that.files,"./software/");//软件安装包目录
        that.repository = path.join(that.resources,"./localdown/");//本地目录
        that.core = path.join(that.framework,"./core");// 核心目录
        that.tools = path.join(that.framework,"./tools");// 工具类目录
        that.support = path.join(that.framework,"./support");//扩展支持文件目录
        //that.supports = that.getDir(path.join(that.framework,"./supports"));//扩展支持文件目录
        that.modules = path.join(that.framework,"./modules/");//模块
        that.command_modules = path.join(that.modules,"./command_modules/");//的模块
        that.electron_modules = path.join(that.modules,"./electron_modules/");//electron 的模块
        that.sqlite_modules = path.join(that.modules,"./sqlite_modules/");//sqlite 的模块
        return that;
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
        if(typeof _name == "string"){
            let 
            _nameArr = _name.split("."),
            _tmp 
            ;

            for(let i=0;i<_nameArr.length;i++){
                let _s = _nameArr[i];
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
                    let _t_ = that.common.node.path.join(_tmp,name2+ext[i]);
                    if(that.common.node.fs.existsSync(_t_)){
                        return require(_t_);
                    }
                }
                return {};
            }
            if(that.common.node.fs.existsSync(_tmp)){
                let
                    _ = require(_tmp)
                ;
                return _ ;
            }
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
            return that.common.node.path.join(a,b);
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
        files = that.common.node.fs.readdirSync( dir ),
        dirs = {}
        ;
        for(let i=0;i<files.length;i++){
            let name = files[i];
            dirs[ name.replace(/\..+/ig,"") ] = that.common.node.path.join(dir,files[i]);
        }
        return dirs;
    }
}
/*
* @exports 类需要使用module.exports导入才可以使用
* */
module.exports = appPath;