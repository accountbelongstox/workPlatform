class _phpC{
	constructor(o){
		
		
	}

	run(callback){


		let
		that = this
		;

		that.o.tool.console.info(`start config software in ${that.option.softinfo.name}`,2);

        let 
        opt = [
            "--windows",
            "--config",
            "--init",
            "--php"
        ]
        ;
        that.o.tool.module.runModule(`command`,opt,()=>{
			/*
			successfully
			*/
			that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);
			if(callback){
				callback();
			}
        });
	}
}

module.exports = _phpC;
        	