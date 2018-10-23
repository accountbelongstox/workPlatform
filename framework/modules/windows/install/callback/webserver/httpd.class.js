class _httpdC{

	constructor(o){
	}

	run(callback){
		let
			that = this
		;

        that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);
        if(callback){
            callback();
        }
	}
}

module.exports = _httpdC;
        	