const fs = require('fs');
const path = require('path'),
    func = require("../../core/func/func.class")


class index{

    run(opt){
        if(opt.length > 1){
            let filePath = path.resolve(opt[0]);//需要查找的路径
            let str = opt[1];//关键字
            let re_str = (opt[2]) ? opt[2] : "";//被替换后的关键字
            this.fileDisplay(filePath,str,re_str);
        }else{
            console.log("Parameter require > 3!")
        }
    }


    /**
     * 文件遍历方法
     * @param filePath 需要遍历的文件路径
     */
    fileDisplay(filePath,str_reg,re_str=""){
        if(func.stringUnicodeHas(filePath,str_reg)){
            let __newDir = func.replaceToUnicode(filePath,str_reg,re_str);
            __newDir = path.normalize(__newDir);
            fs.renameSync(filePath,__newDir)
            filePath = __newDir;
            console.log("Rename dir success ! => "+filePath)
        }
        let _this = this;
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath,function(err,files){
            if(err){
                console.warn(err)
            }else{
                //遍历读取到的文件列表
                files.forEach(function(filename){
                    //获取当前文件的绝对路径
                    let filedir = path.join(filePath,filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir,function(eror,stats){
                        let isDir = false;
                        if(eror){
                            console.warn('get file stats fail');
                        }else{
                            var isFile = stats.isFile();//是文件
                            isDir = stats.isDirectory();//是文件夹
                            if(isFile){
                                let file_match = func.stringUnicodeHas(str_reg,re_str);
                                if(file_match != null)
                                {
                                    let path_parse = path.parse(filedir);
                                    let new_file_name = func.replaceToUnicode(path_parse.base,str_reg,re_str);
                                    let new_path = path.join(path_parse.dir,new_file_name);
                                    fs.rename(filedir,new_path,(e)=>{
                                        if(e){
                                            console.log(e);
                                        }else{
                                            console.log(`Rename file success ! => ${new_file_name}`)
                                        }
                                    });
                                }
                            }
                        }
                        if(isDir){
                            _this.fileDisplay(filedir,str_reg);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    })
                });
            }
        });
    }

}

module.exports = index