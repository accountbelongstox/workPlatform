class _cmderC{
	constructor(o){
        
        

        
	}
	run(callback){
		let
			that = this,
            applicationDir = that.option.softinfo.applicationDir,
			cmderPath = that.o.node.path.join(applicationDir,`Cmder.exe`),
            //注册 Cmder
			register = `${cmderPath} /REGISTER ALL`,
            //注册 Git
            gitBash = that.o.node.path.join(applicationDir,`vendor/git-for-windows/git-bash.exe`),
            gitIcon = that.o.node.path.join(applicationDir,`vendor/git-for-windows/usr/share/git/git-for-windows.ico`),
			addRightMenuGit = `"${gitBash}" "--cd=%v."`
		;
		that.o.tool.console.info(`start config software in ${that.option.softinfo.name}`,4);
		that.o.tool.func.exec(register,(show)=>{
			//设置Git 菜单
            that.o.tool.windows.addRightMenuSync(`Git Bush Here`,addRightMenuGit,{
                icon:gitIcon
			});
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

module.exports = _cmderC;
        	