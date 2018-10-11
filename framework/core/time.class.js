class timeC{

    /**
     * @tools 创建格式化时间
     */
    format(fmt = "yyyy-mm-dd hh:mm:ss",thisDate=new Date()){
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
        return fmt;
    }

}

module.exports = timeC;