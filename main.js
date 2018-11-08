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
    func=``
;

if(options[2] && options[2].toString().toLowerCase() === "ddrun"){
    //抽取掉是用来判断是否是由ddrun发起命令行的参数
	options.splice(2,1);
	//以命令行模式初始化
    param = {
        is_command:true
    };
    func = `command`;
    option = options;
}else{
	/*
	@u 非命令行由启动electorn
	@runc 则此处指定需要载入的模版
	*/
    func = `electron`;
    option = `ddrun`;
}

load = new load_class(param);
load.module[func].init(option);


console.log(load.config.platform);
