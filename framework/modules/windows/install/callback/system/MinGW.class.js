class _MinGWC{
	constructor(o){
		
	}

	run(callback){


		let
		that = this
		;

		/*
		//使用此命令可以自动编译平台文件
	mingw-get install base
	mingw-get install gcc-ada
	mingw-get install gcc-fortran
	mingw-get install gcc-objc
	mingw-get install gcc g++ mingw32-make
	mingw-get install msys-base
	mingw-get install gcc gcc-c++ autoconf zlib bzip2 ncurses
	mingw-get install ncurses
		*/
		that.o.tool.console.info(`start config software in ${that.option.softinfo.name}`,4);

		/*
		successfully
		*/
		that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _MinGWC;
        	