class _Dism++C{
	constructor(load){
		
	}

	run(callback){


		let
		that = this
		;

		that.load.module.console.info(`start config software in ${that.option.softinfo.name}++`,4);

		/*
		successfully
		*/
		that.load.module.console.success(`Software Dism++ installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _Dism++C;
        	