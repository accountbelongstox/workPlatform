class ddrunPublicTools{
	constructor(o){
		//
		//
		//
		//
	}

	/*
	@func 判断参数是否齐全
	*/
	isFullParams(argvs,params,is_command=false,config,exeI=0){
		let
			that = this
		;
		if(!config && exeI===0){
			//每次新建立的需要重新清除
			that.option.beforeCommand = "";
			config = this.o.config.framwork.modules.command;
			that.option.record = [];
		}
		//保存命令行执痕迹
		if(!that.option.record){
			that.option.beforeCommand = "";
			that.option.record = [];
		}
		//如果有必须的下级命令
		//如果是命令模型,则附上参数,非命令模型不用管
		if( config.mustParams && ( Object.keys(config.mustParams).length > 0)  ){
			let
				command = params.contain(config.mustParams)
			;
			//如果没有命令则警告
			if(!command){
				if(is_command){//命令行时才阻断  警告并反回 false
                    return that.paramsNotice(config);
				}else{//非命令行如果没有下级了,直接返回
					if(!that.option.record.length){//以记录是否被插入数据来判断,该模型是否是命令行模型.因为命令行模型通过配置文件,会符上参数
						let
							module_not_command_name = ``,
							module_name = argvs[0]
						;
                        argvs.forEach((command_arg)=>{
                            that.option.record.push({
                                name:module_not_command_name+=`/${command_arg}`,
                                conf:{},
                                command:module_name,
								root_module:module_name,
                                params: params,
                                mustParams: {},
                                additionalParams: {}
                            });
						});
					}
                    return that.option.record;
				}
			}else{
				//递归下一级查看
				that.option.beforeCommand += `/${command}`;
				that.option.record.push({
					name:that.option.beforeCommand,
					conf:config.mustParams[command],
					command,
                    root_module:command,
					params: that.countParams(config.mustParams[command]).params,
					mustParams: that.countParams(config.mustParams[command]).mustParams,
					additionalParams: that.countParams(config.mustParams[command]).additionalParams
				});
				return that.isFullParams(argvs,params,is_command,config.mustParams[command],++exeI);
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
			conf = this.o.config.framwork.modules.command[ fn_name ];
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
        that.o.tool.console.error(errorInfo);
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
				modules = that.o.path.getDir(`command_modules`),
                conf = this.o.config.framwork.modules.command
			;
            for(let p in modules){
            	let
					e = that.o.node.path.parse(modules[p]).base,
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
		        that.o.tool.console.info("* Necessary parameters :",consoleType);
        	}
        	if(p == `additionalParams` && sourceChildren){
                consoleType = 5;
                that.o.tool.console.info("* Addition parameter :",consoleType);
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
                    that.o.tool.console.info(` ${before}${k}`,consoleType);
                    //如果可以一个参数
                    if(mustParamsIsOne && d.MustBeSatisfied){
                        that.o.tool.console.info(MustBeSatisfiedInfo,8);
                    }
                    //没有标识可以单个参数
                    if(!mustParamsIsOne){
                        that.o.tool.console.info(MustBeSatisfiedInfo,8);
                    }
                    that.o.tool.console.info(`\tdescription : ${d.description}`,consoleType);
                    if(format){
                        that.o.tool.console.info(format,consoleType);
                    }
	        	}
        	}
        }
        return false;
	}
}

module.exports = ddrunPublicTools;