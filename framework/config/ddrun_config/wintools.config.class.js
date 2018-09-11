class C{
	constructor(common){
        common.get_support(`install`);
        common.get_core(`file`);

        common.get_node(`fs`);
        common.get_node(`path`);
	}


	/*
	@func 获取软件配置的参数
	*/
	run(){
		let
        that = this,
        additionalParams = {},
        versionMustParams = {},
        initParams = {}
        ;
        for(let p in that.common.support.install){
        	let 
        	oo = that.common.support.install[p]
        	;
        	for(let p2 in oo){
	        	let 
	        	oo2 = oo[p2],
	        	tmpO = {
	        			description:`配置${oo2.name}`,
	        			keyValue:false,
	        			extend:{

	        			}
	        		}
	        	;

	        	if(oo2.allowConfig || oo2.allowChangeVersion){
	        		additionalParams[oo2.name] = tmpO;
	        	}

	        	if(oo2.allowConfig){
	        		initParams[oo2.name] = tmpO;
	        	}

	        	if(oo2.allowChangeVersion){
                    //需要拼接安装目录,并扫描安装目录下的全部版本
                    let
                    softinfo = that.common.node.path.join(that.option.platform.base.sourceDir.application,oo2.group+"/"+oo2.name),
                    softversions = [],
                    files = 0,
                    folders = [],
                    docs = 0
                    ;
                    if(that.common.node.fs.existsSync(softinfo)){

                        softversions = that.common.node.fs.readdirSync(softinfo);
                        softversions.forEach((file)=>{
                            let
                            filePath = that.common.node.path.join(softinfo,file)
                            ;

                            if(that.common.core.file.isFileSync(filePath)){
                                files++;
                            }

                            if(that.common.core.file.isDocFile(filePath)){
                                docs++;
                            }

                            if(that.common.core.file.isDirSync(filePath)){
                                folders.push(file);
                            }
                        });
                        
                        //意味着都是DOC文件
                        if((docs - files) == 0){
                            tmpO.mustParams = {};
                            folders.forEach((folder)=>{
                                tmpO.mustParams[folder] = {
                                    description: `切换到版本${folder}`,
                                    keyValue:false,
                                    extend: {}
                                }
                            });
                        }
                    }
                               // console.log(tmpO);
	        		versionMustParams[oo2.name] = tmpO;
	        	}
        	}
        }

        //---------------------------------------------------------//---------------------------------------------------------
        //---------------------------------------------------------//---------------------------------------------------------
        //---------------------------------------------------------//---------------------------------------------------------

        let 
        o = {
            description:"配置一个服务",
            mustParamsIsOne:true,//只需要满足1个参数
            mustParams: {
                init: {
                    description: "初始化配置",
                    keyValue: false,//表示是键值对参数
                    mustParamsIsOne:true,
                    extend: {},
                    mustParams:initParams
                },
                version: {
                    description: "切换软件版本",
                    keyValue: false,//表示是键值对参数
                    mustParamsIsOne:true,
                    extend: {},
                    mustParams:versionMustParams
                }
            },
            //不必须的附加参数
            additionalParams: additionalParams,
            extend:{
                //init初始化支持的配置
                support:{
                    init : {
                        support:[]
                    }  
                }
            }
        }
        ;
        return o;
	}

}

module.exports = C;