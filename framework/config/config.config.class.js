class configC_{

	constructor(load){
		let
			that = this
		;
	}

	/*
	@func 
	*/
	run(){
		let 
		that = this
		;
        that.platform = that.load.get_class(`config/command/platform`);
        that.framwork = {
            modules:{//framwork下的模型配置
                command:{// 命令行执行时必须满
                    mustParamsIsOne:true,//表示必要的参数
                        description:`命令行模块`,
                        mustParams : {//必要的命令参数
                        //windows工具命令
                        windows:that.load.get_class(`config/windows`),
                            zip:that.load.get_class(`config/zip`),
                            copyweb:that.load.get_class(`config/copyweb`),
                            develop:that.load.get_class(`config/develop`)
                    }
                }
            }
        }
		;
	}

}


module.exports = configC_;