class C{

	//windows工具命令
	run(){

		let
		that = this,
		o = {
            description:`Windows之下的系统备份/菜单/文件关联/安装软件/软件配置工具.`,
            mustParamsIsOne:true,//表示必要的参数
            mustParams : {//必要的命令参数
                systembak:that.load("windows.systembak"),
                fileWith:that.load("windows.fileWith"),
                install:that.load("windows.install"),
                config:that.load("windows.config"),
                tools:that.load("windows.tools")
            }
        }
        ;
        //设置属性
        for(let p in o){
            that[p] = o[p]
        }
        return o;
	}
}

module.exports = C;