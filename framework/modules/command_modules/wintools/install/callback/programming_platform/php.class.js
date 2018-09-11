class _phpC{
	constructor(common){
		common.get_core("console");
		common.get_core("module");
	}

	run(callback){


		let
		that = this
		;

		that.common.core.console.info(`start config software in ${that.option.softinfo.name}`,2);

        let 
        opt = [
            "--wintools",
            "--config",
            "--init",
            "--php"
        ]
        ;
        that.common.core.module.runModule(`command`,opt,()=>{
			/*
			successfully
			*/
			that.common.core.console.success(`Software ${that.option.softinfo.name} installed successfully`);
			if(callback){
				callback();
			}
        });
	}
}

module.exports = _phpC;
        	