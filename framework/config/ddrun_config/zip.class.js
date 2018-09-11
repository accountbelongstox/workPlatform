class C{
	constructor(common){

	}

	run(){
		let 
		that = this,
		o = {
            description: "解压一个文件",
            mustParamsIsOne: true,//必须的参数 0全部
            mustParams: {//必要的命令参数
                file: {
                    description: "需要解压的zip路径",
                    keyValue: true,//表示是键值对参数,
                    MustBeSatisfied:true,
                    extend: {},
                    mustParams: {}
                },
                x: {
                    description: "解压",
                    keyValue: false,//表示是键值对参数
                    group:`zip`,//命令分组
                    extend: {}
                },
                xtmp: {
                    description: "直接将文件解压到 application 临时文件夹",
                    keyValue: false,//表示是键值对参数
                    group:`zip`,
                    extend: {}
                },
                c: {
                    description: "压缩",
                    keyValue: false,//表示是键值对参数
                    group:`zip`,
                    extend: {}
                }
            },
            additionalParams: {//不必须的附加参数
                target: {
                    description: "解压的目标文件夹",
                    keyValue: true,//表示是键值对参数
                    extend: {}
                },
                password: {
                    description: "解压密码",
                    keyValue: true,//表示是键值对参数
                    extend: {}
                }
            },
            extend:{
                support:{
                    soft:{
                        "7z":{
                            files:{
                                Packing:['7z','XZ','BZIP2','GZIP','TAR','ZIP','WIM'],
                                Unpacking:['AR','ARJ','CAB','CHM','CPIO','CramFS','DMG','EXT','FAT','GPT','HFS','IHEX','ISO','LZH','LZMA','MBR','MSI','NSIS','NTFS','QCOW2','RAR','RPM','SquashFS','UDF','UEFI','VDI','VHD','VMDK','WIM','XAR','Z']
                            }
                        },
                        "node":{
                            files:{
                                Packing:['ZIP'],
                                Unpacking:['ZIP']
                            }
                        }
                    }
                }
            }
        }
		;
		return o;

	}
}

module.exports = C;