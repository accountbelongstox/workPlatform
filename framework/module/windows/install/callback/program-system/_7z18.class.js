class __7z18C{
	constructor(load){
		
	}

	run(callback){


		let
		that = this
		;

		that.load.module.console.info(`start config software in _7z18`,4);

		/*
		successfully
		*/
		that.load.module.console.success(`Software _7z18 installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __7z18C;
        	