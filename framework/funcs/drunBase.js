"use strict"
/*
* @function 可执行参数的入口
* */
const 
common = require("../public/common.class.js")
;

class DrunBase{
    constructor(){
        common.get_core("func");
        common.get_core("file");
        common.get_core("windows");
        common.get_core("console");
        common.get_core("module");

        common.get_node("fs");
        common.get_node("path");
        common.get_node("url");

    }

    executeDDRUN(parameters){
        let
            modulesDirs = common.node.fs.readdirSync(common.core.appPath.command_modules),
            moduleName = common.core.func.getParam(parameters).contain(modulesDirs),
            publicTools = common.get_tools('ddrun.public.tools'),
            defaultExecuteFuncionName = "run"//默认执行方法
        ;
        //截取前面多余的参数
        parameters.splice(0,2);

        if( !common.core.windows.IsAdmin() ){
            common.core.console.error("This is not run as administrator.");
            return;
        }
        //运行一个命令行模型
        common.core.module.runModule(`command`,parameters);
    }
}
module.exports = new DrunBase();