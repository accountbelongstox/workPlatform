class C{
    constructor(load){

    }

    run(){
        let
            that = this,
            ip = that.load.params.get("ip"),
            domain = that.load.params.get("domain"),
            value3 = that.load.params.get(3),
            value4 = that.load.params.get(4),
            isIPReg = /^\d+\.\d+\.\d+\.\d+\s*$/
        ;
        if(!ip){
            ip = isIPReg.test(value3) ? value3 : ( isIPReg.test(value4) ? value4 : null );
        }
        if(!domain){
            domain = (!isIPReg.test(value3)) ? value3 : ( (!isIPReg.test(value4)) ? value4 : null );
        }
        if(ip){
            that.option.ip = ip;
        }
        if(domain){
            that.option.domain = domain;
        }

    }

    /*
    @func 设置一个hots
     */
    sethost(){
        let
            that = this
        ;
        if(that.option.ip && that.option.domain){
            let
                hostsText = `${that.option.ip} ${that.option.domain}`
            ;
            that.load.module.windows.setHosts(hostsText);
        }else if(!that.option.ip && !that.option.domain){
            that.load.module.console.error(`nod exists ip address and domain. [127.xx.xx.xx www.xxx.com]`);
        }else if(!that.option.ip){
            that.load.module.console.error(`nod exists ip address. (127.xx.xx.xx)`);
        }else{
            that.load.module.console.error(`fail ! nod exists domain. (www.xxx.com)`);
        }
    }

    /*
    @func 删除一个hots
     */
    delhost(){
        let
            that = this
        ;
        if(that.option.ip && that.option.domain){
            let
                hostsText = `${that.option.ip} ${that.option.domain}`
            ;
            that.load.module.windows.setHosts(hostsText,false);
        }else if(!that.option.ip && !that.option.domain){
            that.load.module.console.error(`nod exists ip address and domain. [127.xx.xx.xx www.xxx.com]`);
        }else if(!that.option.ip){
            that.load.module.console.error(`nod exists ip address. (127.xx.xx.xx)`);
        }else{
            that.load.module.console.error(`fail ! nod exists domain. (www.xxx.com)`);
        }
    }

}
module.exports = C;