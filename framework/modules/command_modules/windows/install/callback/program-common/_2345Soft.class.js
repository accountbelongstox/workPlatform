class __2345SoftC{
	constructor(o){
		
	}

	run(callback){


		let
		that = this
		;

		that.o.tool.console.info(`start config software in _2345Soft`,4);

		/*
		successfully
		*/
		that.o.tool.console.success(`Software _2345Soft installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = __2345SoftC;
        	