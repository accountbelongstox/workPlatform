class __2345SoftC{
	constructor(load){
		
	}

	run(callback){


		let
		that = this
		;

		that.load.module.console.info(`start config software in _2345Soft`,4);

		/*
		successfully
		*/
		that.load.module.console.success(`Software _2345Soft installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __2345SoftC;
        	