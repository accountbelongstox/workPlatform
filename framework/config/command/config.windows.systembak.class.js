class configSystemBak{
	/*
	@func 配置模块分离
	*/
	run(){
		let
        that = this,
        o = {
            description:"系统文件备份",
            mustParamsIsOne:true,//只需要满足1个参数
            mustParams:{
                backup:{
                    description:`备份系统`,
                    mustParams:{
                        userdata:{
                            description:`备份用户数据`,
                        },
                        program:{
                            description:`备份系统程序`,
                        }
                    },
                    extend:{}
                },
                recovery:{
                    description:`强制恢复系统`,
                    mustParamsIsOne:true,//只需要满足1个参数
                    mustParams:{
                        init:{
                            description:`初始化系统,安装.net3-4,设置一些基本变量`,
                        },
                        initnodejs:{
                            description:`初始化node.js,安装必须的npc插件`,
                        },
                        userdata:{
                            description:`备份用户数据`,
                        },
                        program:{
                            description:`备份系统程序`,
                        }
                    }
                }
            },
            additionalParams : {//不必须的附加参数
                dir: {
                    description: "指定备份/恢复路径",
                    keyValue: true,//表示是键值对参数
                    extend: {}
                },
            },
            extend:{
                userdata:{
                    localBackupDirectory : `E:/CompanyFile/developEvn/storage/systembak/userdata`,//系统备份的目录
                    localBackupScope : {//备份范围
                        ignore : [],
                        childrenDir:{
                            "C:/Windows/" : {
                                ignore : [],
                                childrenDir : {
                                    "Fonts" : {
                                        ignore: []
                                    }
                                }
                            },
                            "C:/Users/MD/" : {
                                ignore : [],
                                childrenDir : {
                                    "_*": {
                                        ignore: []
                                    },
                                    ".*": {
                                        ignore: []
                                    },
                                    "Desktop":{
                                        ignore: []
                                    },
                                    AppData: {
                                        ignore: [],
                                        childrenDir:{
                                            Local:that.load("windows.systembak.UserdataAllBackupAndIgnore"),
                                            LocalLow:that.load("windows.systembak.UserdataAllBackupAndIgnore"),
                                            Roaming:that.load("windows.systembak.UserdataAllBackupAndIgnore")
                                        }
                                    }
                                }
                            }
                        }
                    },
                    Environment : {
                        backupConfig : `backup.config.json`,
                        EnvName : ["PATH","CLASSPATH","JAVA_HOME","MYSQL_HOME","PYTHON"]
                    }
                },
                program:{
                    localBackupDirectory : `E:/CompanyFile/developEvn/storage/systembak/program`,//系统备份的目录
                    localBackupScope : {
                        ignore : [],
                        childrenDir:that.load("windows.systembak.ProgramAllBackupAndIgnore")
                    }
                },
                init:{
                    localBackupDirectory : [
                        `.`,
                        "./bin"
                    ],//连接到配置文件的 apps ,此目录下的文件都要设置环境变量
                    extend:{
                        installNet45:[
                            `NetFx3`,
                            `Microsoft-Windows-NetFx3-OC-Package`,
                            `Microsoft-Windows-NetFx4-US-OC-Package`,
                            `Microsoft-Windows-NetFx3-WCF-OC-Package`,
                            `Microsoft-Windows-NetFx4-WCF-US-OC-Package`,
                            `TelnetClient`,
                            `NetFx4-AdvSrvs`,
                            `WAS-NetFxEnvironment`,
                            `MicrosoftWindowsPowerShellV2Root`,
                            `MicrosoftWindowsPowerShellV2`,
                            `Microsoft-Windows-NetFx-VCRedist-Package`
                        ]
                    }
                },
                initnodejs:{
                    localBackupDirectory : [],
                    extend:{
                        requireInstall : [
                            //初始化NODE 时需要安装的全局模块
                            `npm install -g nrm`,
                            `nrm use taobao`,
                            `npm install -g cnpm`,
                            `cnpm install -g nvm`,
                            `cnpm install -g cross-env`,
                            `cnpm install -g electron`,
                            `cnpm install -g electron-packager`,
                            `cnpm install -g n`,
                            `cnpm install -g ncu`,
                            `cnpm install -g node-gyp`,
                            `cnpm install -g tsc`,
                            `cnpm install -g ts-node`,
                            `cnpm install -g typings`,
                            `cnpm install -g webpack`,
                            `cnpm install -g webpack-cli`,
                            `cnpm install -g yarn`
                        ]
                    }
                }
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
module.exports = configSystemBak;