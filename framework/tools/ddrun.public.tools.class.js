class ddrunPublicTools{
	constructor(common){
		/*
		fn_name = 当前调用的方法的
		*/
        common.get_config();

        common.get_core("console");
	}




	/*
	@func 判断参数是否齐全
	*/
	isFullParams(argvs,params,config=null,exeI=0){
		let
		that = this
		;

		if(!config && exeI===0){
			//每次新建立的需要重新清除
			that.option.beforeCommand = "";
			config = this.common.config.framwork.modules.ddrun_modules;
			that.option.record = [];
		}
		//保存命令行执痕迹
		if(!that.option.record){

			that.option.beforeCommand = "";
			that.option.record = [];
		}

		//如果有必须的下级命令
		if( config.mustParams && ( Object.keys(config.mustParams).length > 0) ){
			let
			command = params.contain(config.mustParams)
			;
			//如果没有命令则警告
			if(!command){
				//警告并反回 false
				return that.paramsNotice(config);
			}else{
				//递归下一级查看
				that.option.beforeCommand += `/${command}`;
				that.option.record.push({
					name:that.option.beforeCommand,
					conf:config.mustParams[command],
					command,
					params: that.countParams(config.mustParams[command]).params,
					mustParams: that.countParams(config.mustParams[command]).mustParams,
					additionalParams: that.countParams(config.mustParams[command]).additionalParams
				});
				return that.isFullParams(argvs,params,config.mustParams[command],++exeI);
			}
			
		}else{
			return that.option.record;
		}
	}


	/*
	@func 统计参数
	*/
	countParams(config){
		let
			that = this,
            params = [],
			mustParams = [],
			additionalParams = []
		;

		if(config.mustParams){
			for(let p in config.mustParams){
				params.push(p);
				mustParams.push(p);
			}
		}

		if(config.additionalParams){
			for(let p in config.additionalParams){
				params.push(p);
				additionalParams.push(p);
			}
		}

		let 
			o = {
				params,
				mustParams,
				additionalParams
			}
		;

		return o;
	}


	/*
	@func 从全局配置文件 framwork/config/ 下取得每个模型支持的命令集合
	*/
	getSupportParams(fn_name,conf=null,get_source=false){

		if(!conf){
			conf = this.common.config.framwork.modules.ddrun_modules[ fn_name ];
		}

		if(get_source)return conf;

		let 
		c = {},
		o = {},
		mustParams = `mustParams`,
		additionalParams = `additionalParams`
		;

		if(conf && mustParams in conf){
			c[ mustParams ] = conf[ mustParams ];
		}

		if(conf && additionalParams in conf){
			c[ additionalParams ] = conf[ additionalParams ];
		}

        o.source = { };
        o.source = conf;
        o.params = { };//返回的命令参数
        o.params[ mustParams ] = [];
        o.params[ additionalParams ] = [];

        if(c !== {}){
	        for(let p in c){
	        	let
	        		tmp = c[p]
	        	;
		        for(let k in tmp){
		        	if(p == mustParams){
		        		o.params[ mustParams ].push( k );
		        	}
		        	if(p == additionalParams){
		        		o.params[ additionalParams ].push( k );
		        	}
		        }
	        }
        }
        return o;
	}


	/*
	@func 用于参数不全的时候提醒
	*/
	paramsNotice(config){
		let
			that = this,
			errorInfo = [
				`---------------------------------------------`,
                `Command name - ${that.option.beforeCommand}`,
                `This command need parameter.`,
                `Or the parameter not exists.`
			]
		;
        that.common.core.console.error(errorInfo);
        return that.printCommandParamsNeedRequirement(config);
	}

	/*
	@func 用于帮助文件显示 
	*/
	showCommandHelp(fn_name,params){

		let
		that = this
		;
		//如果是没有顶级,则给出模型集
		if(!fn_name){
            console.log("\n");
            console.log("* All parameter :");
            let
				modules = that.common.core.appPath.getDir(`command_modules`),
                conf = this.common.config.framwork.modules.ddrun_modules
			;
            for(let p in modules){
            	let
					e = that.common.node.path.parse(modules[p]).base,
                    description = ""
				;

                console.log(`--${ e }`);

            	if(e in conf){
            		let
						_e = conf[e]
					;
                    description = (_e.description) ? _e.description :"" ;
                }
                console.log(`\tdescription : ${ description }\n`);
			}
            return null;
            //如果是没有顶级,则给出模型集
		}else{

            console.log("\n");
            console.log("Help:");
            console.log("---------------------------------------------");
            console.log(`Command name - ${fn_name} `);
            console.log(`The help of ${fn_name} command.`);

            that.printCommandParamsNeedRequirement(fn_name,params);
		}
	}


	/*
	@func 用于帮助文件显示 
	*/
	printCommandParamsNeedRequirement(config){

		let
		that = this
		;

        for( let p in config ){

        	let 
        		sourceChildren = config[p],
                mustParamsIsOne = config.mustParamsIsOne,
				consoleType = 1
        	;

        	if(p == `mustParams` && sourceChildren){
                consoleType = 2;
		        that.common.core.console.info("* Necessary parameters :",consoleType);
        	}
        	if(p == `additionalParams` && sourceChildren){
                consoleType = 5;
                that.common.core.console.info("* Addition parameter :",consoleType);
        	}

        	if(p == `mustParams`  || p == `additionalParams` ){

	        	let 
	        	iCount = 0
	        	;
	        	for( let k in sourceChildren ){
	        		if(iCount > 0){
		        		console.log("\n");
	        		}

	        		iCount++;

		            let 
						d = sourceChildren[ k ],
						before = `-`,
						format = `\texample : `,
                        MustBeSatisfiedInfo = `\tmust be satisfied!`
		            ;

		            if( k.length > 1){
		            	before = `--`
		            }


		            if(d.keyValue){
		            	format+=`${before}${k}:"Parameter content" `
		            }else{
                        format+=`${before}${k}`
					}

		            if(!d.description){
		            	d.description = '';
		            }

                    that.common.core.console.info(` ${before}${k}`,consoleType);
                    //如果可以一个参数
                    if(mustParamsIsOne && d.MustBeSatisfied){
                        that.common.core.console.info(MustBeSatisfiedInfo,8);
                    }
                    //没有标识可以单个参数
                    if(!mustParamsIsOne){
                        that.common.core.console.info(MustBeSatisfiedInfo,8);
                    }
                    that.common.core.console.info(`\tdescription : ${d.description}`,consoleType);
                    if(format){
                        that.common.core.console.info(format,consoleType);
                    }
	        	}
        	}
        }

        return false;
	}
}

module.exports = ddrunPublicTools;