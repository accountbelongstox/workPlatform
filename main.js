"usr strict"
/*
@func 程序主入口,当有命令参数时执行命令行,无命令参数时则启动程序 
*/
let
    options = process.argv,
    load_class = require("./framework/load/load.class.js"),
    load,
    param=null,
    option,
    func_name=``
;

if(options[2] && options[2].toString().toLowerCase() === "ddrun"){
    //抽取掉是用来判断是否是由ddrun发起命令行的参数
	options.splice(2,1);
	//以命令行模式初始化
    param = {
        is_command:true
    };
    func_name = `command`;
    option = options;
}else{
    func_name = `electron`;
/*    option = { // 动点世纪工作平台
        url:`get_data/index_electron.html`,
        width:1700,
        height:1131
    };*/
    option = {//数据抓取平台
        url:`get_data/index_electron.html`,
        width:1700,
        height:1131
    };
}

load = new load_class(param);
load.module[func_name].init(option);
