class _mongodbC{
	constructor(o){
		
	}

	run(callback){
        let
            that = this,
            MongoDBserviceName = `MongoDB`,
            MongoDBBinDir = that.option.softinfo.environmentVariableX.path,
            MongodDir = that.o.node.path.join(MongoDBBinDir,`mongod.exe`),
            MongoDBRootDir = that.o.node.path.join(MongoDBBinDir,`../`),
            confName = `${that.option.softinfo.name}.config`,
            confPath = that.o.node.path.join(MongoDBRootDir,confName),
            installWindowsService = [
                `${MongodDir} --config "${confPath}" --serviceName ${MongoDBserviceName} --install`,
                `net start ${MongoDBserviceName}`
            ]
		;
        that.o.tool.func.exec(installWindowsService,(info)=>{
            that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);

            if(callback){
                callback();
            }
        });
	}
}

module.exports = _mongodbC;
        	