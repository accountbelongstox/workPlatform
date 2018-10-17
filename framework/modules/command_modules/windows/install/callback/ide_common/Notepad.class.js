class _NotepadC{
	constructor(o){
		
	}

	run(callback){


		let
			that = this,
        	applicationDir = that.option.softinfo.applicationDir,
            appPath = that.o.node.path.join(applicationDir,`notepad++.exe`),
            addRightMenu = `"${appPath}" `,
            addRightMenuFile = `"${appPath}" "%1"`
        ;
        that.o.tool.windows.addRightMenuSync(`Open notepad++`,addRightMenu);
        that.o.tool.windows.addRightMenuSync(`Open with notepad++`,addRightMenuFile,{type:`file`});
		that.o.tool.console.info(`start config software in ${that.option.softinfo.name}`,4);
		/*
		successfully
		*/
		that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);
		if(callback){
			callback();
		}
	}
}

module.exports = _NotepadC;
        	