class _u5c4fu5e55u5f55u50cfu4e13u5bb6vC{
	constructor(common){
		common.get_core("console");
	}

	run(callback){


		let
		that = this
		;

		that.common.core.console.info(`start config software in ${that.option.softinfo.name}`,4);

		/*
		successfully
		*/
		that.common.core.console.success(`Software ${that.option.softinfo.name} installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _u5c4fu5e55u5f55u50cfu4e13u5bb6vC;
        	