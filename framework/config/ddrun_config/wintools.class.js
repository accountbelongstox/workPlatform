class C{

	//windows工具命令
	run(){

		let
		that = this,
		o = {
            description:`Windows之下的系统备份/菜单/文件关联/安装软件/软件配置工具.`,
            mustParamsIsOne:true,//表示必要的参数
            mustParams : {//必要的命令参数
                systembak:that.load("wintools.systembak"),
                fileWith:that.load("wintools.fileWith"),
                install:that.load("wintools.install"),
                config:that.load("wintools.config")
            }
        }
        ;
        return o;
	}
}

module.exports = C;