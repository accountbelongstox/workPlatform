class _apachetomcatC{
	constructor(o){
	}

	run(callback){


		let
		that = this
		;

		that.o.tool.console.info(`start config software in ${that.option.softinfo.name}`,4);

		/*
		successfully
		*/
		that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _apachetomcatC;
        	