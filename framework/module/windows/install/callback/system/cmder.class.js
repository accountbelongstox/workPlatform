class _cmderC{
	constructor(load){
        
        

        
	}
	run(callback){
		let
			that = this,
            applicationDir = that.option.softinfo.applicationDir,
			cmderPath = that.load.node.path.join(applicationDir,`Cmder.exe`),
            //注册 Cmder
			register = `${cmderPath} /REGISTER ALL`,
            //注册 Git
            gitBash = that.load.node.path.join(applicationDir,`vendor/git-for-windows/git-bash.exe`),
            gitIcon = that.load.node.path.join(applicationDir,`vendor/git-for-windows/usr/share/git/git-for-windows.ico`),
			addRightMenuGit = `"${gitBash}" "--cd=%v."`
		;
		that.load.module.console.info(`start config software in ${that.option.softinfo.name}`,4);
		that.load.module.func.exec(register,(show)=>{
			//设置Git 菜单
            that.load.module.windows.addRightMenuSync(`Git Bush Here`,addRightMenuGit,{
                icon:gitIcon
			});
            /*
            successfully
            */
            that.load.module.console.success(`Software ${that.option.softinfo.name} installed successfully`);
            if(callback){
                callback();
            }
		});
	}
}

module.exports = _cmderC;
        	