class _httpdC{

	constructor(common){
		common.get_core("console");
        common.get_core("module");

        common.get_tools("install");
        common.get_tools("config");
	}

	run(callback){
		let
			that = this
		;

        that.common.core.console.success(`Software ${that.option.softinfo.name} installed successfully`);
        if(callback){
            callback();
        }
	}
}

module.exports = _httpdC;
        	