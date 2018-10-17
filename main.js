"usr strict"

/*
@func 程序主入口,当有命令参数时执行命令行,无命令参数时则启动程序 
*/

const
    options = process.argv,
    o_class = require("./framework/o.class.js"),
    o = (new o_class())
;

if(options[2] && options[2].toString().toLowerCase() === "ddrun"){
    //抽取掉是用来判断是否是由ddrun发起命令行的参数
	options.splice(2,1);
	/*
	@tools 带参数的程序入口
	*/
    o.module.command.init(options);
}else{
	/*
	@u 非命令行由启动electorn
	@runc 则此处指定需要截入的模版
	*/
    o.module.electron.init(`ddrun`);
}
