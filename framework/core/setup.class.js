class setupC{


    /*
    @func 读取ini配置文件
    */

    readINI(iniFile,tag){

        let
            that = this,
            reg = new RegExp(`(^|\\n)\\s*${that.common.core.string.strToRegText(tag)}\\s*\\=\\s*(.+)`,'i'),
            data = that.common.node.fs.readFileSync(iniFile,'utf8')
        ;

        data = data.toString();

        let
            r = data.match(reg)
        ;
        if(r){
            if(r.length > 1){
                return that.common.core.string.trim(r[2]);
            }
        }
        return null;
    }


    /*
    @func 写入ini配置文件
    */

    writeINI(iniFile,tag,value=""){
        let
            that = this,
            reg = new RegExp(`(^|\\n)\\s*${that.common.core.string.strToRegText(tag)}\\s*\\=\\s*(.+)`,'i'),
            data = that.common.node.fs.readFileSync(iniFile,'utf8'),
            kv = `${tag} = ${value}`
        ;

        data = data.toString();

        let
            r = data.match(reg)
        ;
        if(r){
            data.replace(r[0],kv);
        }else{
            data+=`\n${kv}`
        }
        that.common.node.fs.wirteFileSync(iniFile,'utf8',data);
    }

}


module.exports = setupC;