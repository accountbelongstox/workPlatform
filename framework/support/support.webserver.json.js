module.exports = {
	httpd:{
		//支持 Apache 安装的扩展模块
		installModule:{
			mod_fcgid :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_fcgid-2.3.9-win64-VC15.zip`]
			},
			mod_security :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_security-2.9.2-win64-VC15.zip`]
			},
			mod_jk :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_jk-1.2.43-win64-VC15.zip`]
			},
			isapi_redirect :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/isapi_redirect.dll-1.2.43-VC15.zip`]
			},
			mod_xsendfile :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_xsendfile-1.0-P1-win64-VC15.zip`]
			},
			mod_log_rotate :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_log_rotate-1.00a-win64-VC15.zip`]
			},
			dbd_modules :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/dbd_modules-1.0.6-win64-VC15.zip`]
			},
			mod_bw :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_bw-0.92-win64-VC15.zip`]
			},
			mod_view :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_view-2.2-win64-VC15.zip`]
			},
			mod_watch :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_watch-4.3-win64-VC15.zip`]
			},
			mod_evasive :{
				remoteUrls :[`https://www.apachelounge.com/download/VC15/modules/mod_evasive2-1.10.2-win64-VC15.zip`]
			}
		},
		config:{
			init:{

			}
		}
	},
	mariadb:{
        installModule:{

		},
		extend:{
            confName:``,
            exampleConf :``,
			tag:``
		},
		config:{
			init:[]
		}
	}
}