class timeC{

    /**
     * @tools 创建格式化时间
     * @params fmt false/转为时间戳  string/转为对应格式
     */
    format(fmt,thisDate=new Date()){
        let
            timestamp = false
        ;
        if(fmt === false){//全等false时生成时间戳
            timestamp = true;
        }else if(!fmt){
            fmt = "yyyy-mm-dd-hh-mm-ss";
        }
        let
            thisDataType = typeof thisDate
        ;
        if(thisDataType === "string"){
            thisDate = (function (){
                if(/^\s*\d+\s*$/.test(thisDate)){
                    return new Date(thisDate * 1000);
                }else{
                    return new Date(thisDate );
                }
            })();
        }else if(thisDataType === "number"){
            thisDate =  new Date(thisDate * 1000);
        }
        if(timestamp){
            fmt = thisDate.getTime()/1000;
        }else{
            var o = {
                "M+": thisDate.getMonth() + 1, //月份
                "d+": thisDate.getDate(), //日
                "h+": thisDate.getHours(), //小时
                "m+": thisDate.getMinutes(), //分
                "s+": thisDate.getSeconds(), //秒
                "q+": Math.floor((thisDate.getMonth() + 3) / 3), //季度
                "S": thisDate.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)){
                fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o){
                if (new RegExp("(" + k + ")","i").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
        }
        return fmt;
    }


    /*
     * @func 生成当日零时起的时间戳
     * @returns {Date}
     */
    toDayFirstTimestamp(){
        return  new Date(new Date(new Date().toLocaleDateString()).getTime());
    }

}

module.exports = timeC;