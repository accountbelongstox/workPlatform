class _mongodbC{
	constructor(common){
		common.get_core("console");
	}

	run(callback){
        let
            that = this,
            MongoDBserviceName = `MongoDB`,
            MongoDBBinDir = that.option.softinfo.environmentVariableX.path,
            MongodDir = that.common.node.path.join(MongoDBBinDir,`mongod.exe`),
            MongoDBRootDir = that.common.node.path.join(MongoDBBinDir,`../`),
            confName = `${that.option.softinfo.name}.config`,
            confPath = that.common.node.path.join(MongoDBRootDir,confName),
            installWindowsService = [
                `${MongodDir} --config "${confPath}" --serviceName ${MongoDBserviceName} --install`,
                `net start ${MongoDBserviceName}`
            ]
		;
        that.common.core.func.exec(installWindowsService,(info)=>{
            that.common.core.console.success(`Software ${that.option.softinfo.name} installed successfully`);

            if(callback){
                callback();
            }
        });
	}
}

module.exports = _mongodbC;
        	