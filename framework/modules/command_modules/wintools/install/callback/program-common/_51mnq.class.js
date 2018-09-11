class __51mnqC{
	constructor(common){
		common.get_core("console");
	}

	run(callback){


		let
		that = this
		;

		that.common.core.console.info(`start config software in _51mnq`,4);

		/*
		successfully
		*/
		that.common.core.console.success(`Software _51mnq installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __51mnqC;
        	