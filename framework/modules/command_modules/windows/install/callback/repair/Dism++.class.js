class _Dism++C{
	constructor(o){
		
	}

	run(callback){


		let
		that = this
		;

		that.o.tool.console.info(`start config software in ${that.option.softinfo.name}++`,4);

		/*
		successfully
		*/
		that.o.tool.console.success(`Software Dism++ installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _Dism++C;
        	