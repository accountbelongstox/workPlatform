class _mongodbC{
	constructor(load){
		
	}

	run(callback){
        let
            that = this,
            MongoDBserviceName = `MongoDB`,
            MongoDBBinDir = that.option.softinfo.environmentVariableX.path,
            MongodDir = that.load.node.path.join(MongoDBBinDir,`mongod.exe`),
            MongoDBRootDir = that.load.node.path.join(MongoDBBinDir,`../`),
            confName = `${that.option.softinfo.name}.config`,
            confPath = that.load.node.path.join(MongoDBRootDir,confName),
            installWindowsService = [
                `${MongodDir} --config "${confPath}" --serviceName ${MongoDBserviceName} --install`,
                `net start ${MongoDBserviceName}`
            ]
		;
        that.load.module.func.exec(installWindowsService,(info)=>{
            that.load.module.console.success(`Software ${that.option.softinfo.name} installed successfully`);

            if(callback){
                callback();
            }
        });
	}
}

module.exports = _mongodbC;
        	