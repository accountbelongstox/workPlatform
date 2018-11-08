class __360C{
	constructor(load){
		
	}

	run(callback){


		let
		that = this
		;

		that.load.module.console.info(`start config software in _360`,4);

		/*
		successfully
		*/
		that.load.module.console.success(`Software _360 installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __360C;
        	