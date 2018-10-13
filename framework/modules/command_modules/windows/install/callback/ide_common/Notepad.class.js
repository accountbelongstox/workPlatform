class _NotepadC{
	constructor(common){
		common.get_core("console");
	}

	run(callback){


		let
			that = this,
        	applicationDir = that.option.softinfo.applicationDir,
            appPath = that.common.node.path.join(applicationDir,`notepad++.exe`),
            addRightMenu = `"${appPath}" `,
            addRightMenuFile = `"${appPath}" "%1"`
        ;
        that.common.core.windows.addRightMenuSync(`Open notepad++`,addRightMenu);
        that.common.core.windows.addRightMenuSync(`Open with notepad++`,addRightMenuFile,{type:`file`});
		that.common.core.console.info(`start config software in ${that.option.softinfo.name}`,4);
		/*
		successfully
		*/
		that.common.core.console.success(`Software ${that.option.softinfo.name} installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _NotepadC;
        	