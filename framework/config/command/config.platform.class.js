class C{
	constructor(load){

	}
	// that.load.config.platform.base.local.tmpDir
	//最终方法,不可再用加载器以免死循环
	run(){
		let 
			that = this,
            application = `D:/application`,
            wwwroot = `D:/wwwroot`,
            softwaresDir = `E:/CompanyFile/Softwares`
		;
		that.base = {
			web:{
				webUrl:"https://www.ddweb.com.cn/",
					srouceUrl:"https://www.ddweb.com.cn/",
					loginUrl:"https://www.ddweb.com.cn/login/",
					apiUrl:"https://www.ddweb.com.cn/api/v1"
			},
			local:{
				debug:true,
					tmpDir:`${application}/.tmp`
			},
			electron:{
				window:{
					template:{
						index:{
							title:`工作平台 - 动点世纪(ddweb.com.cn) v1.0`
						},
						public:{

						}
					}
				},
				globalShortcut:{
					//快捷键注册事件
					"Alt+F4":{
						event:"quit"
					},
					"Alt+Shift+F12":{
						event:"openDevTools"
					},
					"F11":{
						event:"windowmaxmin"
					},
				}
			},
			sourceDir:{
				//软件总目录
				softwareDir : softwaresDir,
					//必须安装的软件资源目录
					softwareSourceDir : `${softwaresDir}/mustInstall`,
					//当前安装的操作系统存放目录
					thisOS : `${softwaresDir}/thisOS`,
					//激活软件路径
					activator : `${softwaresDir}/activation`
			},
			//工作目录的内容都是要做备份
			workDir:{
				//软件安装目录
				application ,
					//程序安装目录
					programFiles :`D:/Program Files/`,
					//工作空间目录
					workroom:`D:/workroom`,
					//网页空间目录
					wwwroot,
					//数据库目录
					dataDir:`${wwwroot}/data/`
			}
		}
		;
		that.core = {
			database:{
				prefix:"ddrun_"
			}
		}

	}
}

module.exports = C;