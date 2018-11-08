class _httpdC{

	constructor(load){
	}

	run(callback){
		let
			that = this
		;

        that.load.module.console.success(`Software ${that.option.softinfo.name} installed successfully`);
        if(callback){
            callback();
        }
	}
}

module.exports = _httpdC;
        	