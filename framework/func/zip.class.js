class zipC{
    constructor(o) {
        

        
        

        
    }

    /*
    * @func 根据文件获取压缩软件
    * */
    getSoft(file,target,type){
        let
            that = this,
            fileExt = "",
            supportExt = null,
            softName = "",
            files = []
        ;


        switch (type) {
            case "c":
                fileExt = that.o.node.path.parse(target).ext;
                break;
            default:
                //x xtmp
                fileExt = that.o.node.path.parse(file).ext;

        }

        fileExt = fileExt.replace(/^\s*\.+/ig,"");

        for(let p in that.option.conf.extend.support.soft){
            let
                soft = that.option.conf.extend.support.soft[p]
            ;

            switch (type) {
                case "c":
                    supportExt = soft.files.Packing;
                    break;
                default:
                    //x xtmp
                    supportExt = soft.files.Unpacking.concat(soft.files.Packing);
            }
            if(softName)break;
            supportExt.forEach((item)=>{
                if(item.toUpperCase() == fileExt.toUpperCase()){
                    softName = p;
                    return;
                }
            });
        }
        return softName;
    }
}

module.exports = zipC;