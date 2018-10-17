class __360C{
	constructor(o){
		
	}

	run(callback){


		let
		that = this
		;

		that.o.tool.console.info(`start config software in _360`,4);

		/*
		successfully
		*/
		that.o.tool.console.success(`Software _360 installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __360C;
        	