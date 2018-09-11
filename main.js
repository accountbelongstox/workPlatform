"usr strict"

/*
@func 程序主入口,当有命令参数时执行命令行,无命令参数时则启动程序 
*/


const
options = process.argv,
funcs = `./framework/funcs/`
;

if(options[2] == "ddrun"){
	
	const 
	DrunBase = require(`${funcs}/drunBase.js`)
	;

	options.splice(2,1);//抽取掉是用来判断是否是由ddrun发起命令行的参数
	
	/*
	@tools 带参数的程序入口
	@params <fun-name> <parametes...>
	@function-name
		unzipDir 解压一个文件
	*/
	
	DrunBase.executeDDRUN(options);
	
}else{
	
	/*
	@u 非命令行由启动electorn
	*/
	
	const 
	base = require(`${funcs}/electornBase.js`)
	;

	let 
	CBase = new base()
	;
	CBase.run();
}
