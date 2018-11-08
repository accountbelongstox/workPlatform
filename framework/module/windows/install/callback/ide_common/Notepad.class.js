class _NotepadC{
	constructor(load){
		
	}

	run(callback){


		let
			that = this,
        	applicationDir = that.option.softinfo.applicationDir,
            appPath = that.load.node.path.join(applicationDir,`notepad++.exe`),
            addRightMenu = `"${appPath}" `,
            addRightMenuFile = `"${appPath}" "%1"`
        ;
        that.load.module.windows.addRightMenuSync(`Open notepad++`,addRightMenu);
        that.load.module.windows.addRightMenuSync(`Open with notepad++`,addRightMenuFile,{type:`file`});
		that.load.module.console.info(`start config software in ${that.option.softinfo.name}`,4);
		/*
		successfully
		*/
		that.load.module.console.success(`Software ${that.option.softinfo.name} installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _NotepadC;
        	