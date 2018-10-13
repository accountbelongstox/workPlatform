class __2345SoftC{
	constructor(common){
		common.get_core("console");
	}

	run(callback){


		let
		that = this
		;

		that.common.core.console.info(`start config software in _2345Soft`,4);

		/*
		successfully
		*/
		that.common.core.console.success(`Software _2345Soft installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __2345SoftC;
        	