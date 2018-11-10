class _phpC{
	constructor(load){
		
		
	}

	run(callback){


		let
		that = this
		;

		that.load.console.info(`start config software in ${that.option.softinfo.name}`,2);

        let 
        opt = [
            "--windows",
            "--config",
            "--init",
            "--php"
        ]
        ;
        that.load.run_module(`command`,opt,()=>{
			/*
			successfully
			*/
			that.load.console.success(`Software ${that.option.softinfo.name} installed successfully`);
			if(callback){
				callback();
			}
        });
	}
}

module.exports = _phpC;
        	