class __7z18C{
	constructor(common){
		common.get_core("console");
	}

	run(callback){


		let
		that = this
		;

		that.common.core.console.info(`start config software in _7z18`,4);

		/*
		successfully
		*/
		that.common.core.console.success(`Software _7z18 installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __7z18C;
        	