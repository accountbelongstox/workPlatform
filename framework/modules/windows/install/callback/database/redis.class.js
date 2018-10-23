class _redisC{
	constructor(o){
        
        
	}

	run(callback){


		let
			that = this,
            rootDir = that.option.softinfo.environmentVariableX.path,
            redisServer = that.o.node.path.join(rootDir,`redis-server.exe`),
            redisWindowsConf = that.o.node.path.join(rootDir,`redis.windows.conf`),
        	redisServiceName = `redis`,
			redisInstallServiceAndStart = [
				`${redisServer} --service-install "${redisWindowsConf}" --loglevel verbose --service-name ${redisServiceName}`,
				`${redisServer} --service-start --service-name ${redisServiceName}`
				//,`redis-server --service-stop --service-name redis`
			]
		;
		that.o.tool.func.exec(redisInstallServiceAndStart,(info)=>{
            that.o.tool.console.info(info,4);
            console.log(redisInstallServiceAndStart);
            that.o.tool.console.info(`start config software in ${that.option.softinfo.name}`,4);
            /*
            @func successfully
            */
            that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);
            if(callback){
                callback();
            }
		});
	}
}

module.exports = _redisC;
        	