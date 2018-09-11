class _cmderC{
	constructor(common){
        common.get_core("console");
        common.get_core("windows");

        common.get_node("path");
	}
	run(callback){
		let
			that = this,
            applicationDir = that.option.softinfo.applicationDir,
			cmderPath = that.common.node.path.join(applicationDir,`Cmder.exe`),
            //注册 Cmder
			register = `${cmderPath} /REGISTER ALL`,
            //注册 Git
            gitBash = that.common.node.path.join(applicationDir,`vendor/git-for-windows/git-bash.exe`),
            gitIcon = that.common.node.path.join(applicationDir,`vendor/git-for-windows/usr/share/git/git-for-windows.ico`),
			addRightMenuGit = `"${gitBash}" "--cd=%v."`
		;
		that.common.core.console.info(`start config software in ${that.option.softinfo.name}`,4);
		that.common.core.func.exec(register,(show)=>{
			//设置Git 菜单
            that.common.core.windows.addRightMenuSync(`Git Bush Here`,addRightMenuGit,{
                icon:gitIcon
			});
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

module.exports = _cmderC;
        	