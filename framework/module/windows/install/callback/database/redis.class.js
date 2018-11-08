class _redisC{
	constructor(load){
        
        
	}

	run(callback){


		let
			that = this,
            rootDir = that.option.softinfo.environmentVariableX.path,
            redisServer = that.load.node.path.join(rootDir,`redis-server.exe`),
            redisWindowsConf = that.load.node.path.join(rootDir,`redis.windows.conf`),
        	redisServiceName = `redis`,
			redisInstallServiceAndStart = [
				`${redisServer} --service-install "${redisWindowsConf}" --loglevel verbose --service-name ${redisServiceName}`,
				`${redisServer} --service-start --service-name ${redisServiceName}`
				//,`redis-server --service-stop --service-name redis`
			]
		;
		that.load.module.func.exec(redisInstallServiceAndStart,(info)=>{
            that.load.module.console.info(info,4);
            console.log(redisInstallServiceAndStart);
            that.load.module.console.info(`start config software in ${that.option.softinfo.name}`,4);
            /*
            @func successfully
            */
            that.load.module.console.success(`Software ${that.option.softinfo.name} installed successfully`);
            if(callback){
                callback();
            }
		});
	}
}

module.exports = _redisC;
        	