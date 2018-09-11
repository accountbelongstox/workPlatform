class configC_{

	constructor(common){
		common.get_support("install");

		common.get_node("path");
	}

	/*
	@func 
	*/
	run(){
		let 
		that = this
		,
		configObj = {
		    platform:that.load(`platform`),
		    framwork:{
		        modules:{//framwork下的模型配置
		            ddrun_modules:{
	                    mustParamsIsOne:true,//表示必要的参数
	                    description:`命令行模块`,
	                    mustParams : {//必要的命令参数
	                    	//windows工具命令
	                    	wintools:that.load(`wintools`),
	                    	zip:that.load(`zip`),
                            copyweb:that.load(`copyweb`),
                            develop:that.load(`develop`)
	                    }
		            },
		            electron_modules:{
		            	
		            }
		        }
		    }
		}
		;
		return configObj;
	}


    /*
    @func config 加载器
    */
    load(name){
        let
        that = this,
        p = that.common.node.path.join(__dirname,`./ddrun_config/${name}.class.js`),
        c =  require(p),
        c2 = new c(that.common)
        ;

        c2.load = that.load;
        c2.common = that.common;
        c2.option = {
        	platform:that.common.config_load(`platform`)
        };

        let 
        o = c2.run()
        ;

        return o;

    }

}


module.exports = configC_;