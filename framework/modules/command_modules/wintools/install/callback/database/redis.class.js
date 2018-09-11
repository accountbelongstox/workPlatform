class _redisC{
	constructor(common){
        common.get_core("console");
        common.get_core("func");
	}

	run(callback){


		let
			that = this,
            rootDir = that.option.softinfo.environmentVariableX.path,
            redisServer = that.common.node.path.join(rootDir,`redis-server.exe`),
            redisWindowsConf = that.common.node.path.join(rootDir,`redis.windows.conf`),
        	redisServiceName = `redis`,
			redisInstallServiceAndStart = [
				`${redisServer} --service-install "${redisWindowsConf}" --loglevel verbose --service-name ${redisServiceName}`,
				`${redisServer} --service-start --service-name ${redisServiceName}`
				//,`redis-server --service-stop --service-name redis`
			]
		;
		that.common.core.func.exec(redisInstallServiceAndStart,(info)=>{
            that.common.core.console.info(info,4);
            console.log(redisInstallServiceAndStart);
            that.common.core.console.info(`start config software in ${that.option.softinfo.name}`,4);
            /*
            @func successfully
            */
            that.common.core.console.success(`Software ${that.option.softinfo.name} installed successfully`);
            if(callback){
                callback();
            }
		});
	}
}

module.exports = _redisC;
        	