class __360C{
	constructor(common){
		common.get_core("console");
	}

	run(callback){


		let
		that = this
		;

		that.common.core.console.info(`start config software in _360`,4);

		/*
		successfully
		*/
		that.common.core.console.success(`Software _360 installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __360C;
        	