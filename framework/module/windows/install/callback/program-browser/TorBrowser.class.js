class _TorBrowserC{
	constructor(load){
		
	}
	run(callback){
		let
		that = this
		;
		that.load.console.info(`start config software in ${that.option.softinfo.name}`,4);
		/*
		successfully
		*/
		that.load.console.success(`Software ${that.option.softinfo.name} installed successfully`);
		if(callback){
			callback();
		}
	}
}
module.exports = _TorBrowserC;