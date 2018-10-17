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
                    return new Date(thisDate);
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



    //获取当天零点时间戳
    toDayTimestamp(){
        return  new Date(new Date(new Date().toLocaleDateString()).getTime());
    }


    /**
     * @func 获取当前点时间戳
     * @returns {number}
     */
    currentTimestamp(){
        return  (new Date()).getTime();
    }


    /**
     * @func 生成过去 跨度内的时间范围
     * @param timeSpan 时间跨度
     * @param Company
     * @param fmt
     */
    createContinuityTimeStamp(timeSpan="y-10",Company,fmt="yyyy-mm-dd"){
        let
            that = this,
            startData = ( new Date() ),
            endData = ( new Date() ),
            timeSpanType = timeSpan[0].toLowerCase(),
            timeSpanSymbol = timeSpan[1],
            timeSpanNumber = parseInt(timeSpan.replace(/[^\d]/ig,``)),
            timeValue,
            startTime,
            endTime,
            result = [],
            getDate = function (){
                this.o = new Date();
                return this.o;
            }
        ;
        switch (timeSpanType) {
            case "y":
                timeValue = startData.getFullYear();
                if(timeSpanSymbol ==="+"){
                    timeValue+=timeSpanNumber;
                }else{
                    timeValue-=timeSpanNumber;
                }
                startData.setFullYear(timeValue);
                if(!Company)Company = "m";
                break;
            case "m":
                timeValue = startData.getMonth();
                if(timeSpanSymbol ==="+"){
                    timeValue+=timeSpanNumber;
                }else{
                    timeValue-=timeSpanNumber;
                }
                startData.setMonth(timeValue);
                if(!Company)Company = "d";
                break;
            case "d":
                timeValue = startData.getDate();
                if(timeSpanSymbol ==="+"){
                    timeValue+=timeSpanNumber;
                }else{
                    timeValue-=timeSpanNumber;
                }
                startData.setDate(timeValue);
                if(!Company)Company = "h";
                break;
        }
        if(startData.getTime() < endData.getTime()){
            startTime = startData;
            endTime = endData;
        }else{
            console.log(2);
            startTime = endData;
            endTime = startData;
        }

        timeValue = null;

        while( startTime.getTime()  < endTime.getTime() ){
            let
                startTimeFmt = "yyyy-mm-dd",
                startTimeCurrent,
                endTimeFmt = startTime
            ;
            switch (Company) {
                case "y":
                    startTimeCurrent = that.timeFormat(startTimeFmt,startTime);
                    startTime.setFullYear((startTime.getFullYear() + 1));
                    endTimeFmt = that.timeFormat(startTimeFmt,endTimeFmt);
                    break;
                case "m":
                    startTimeCurrent = that.timeFormat(startTimeFmt,startTime);
                    startTime.setMonth((startTime.getMonth() + 1));
                    endTimeFmt = that.timeFormat(startTimeFmt,endTimeFmt);
                    break;
                case "d":
                    startTimeCurrent = that.timeFormat(startTimeFmt,startTime);
                    startTime.setDate((startTime.getDate() + 1));
                    endTimeFmt = that.timeFormat(startTimeFmt,endTimeFmt);
                    break;
                case "h":
                    startTimeFmt = "yyyy-mm-dd hh:mm:ss";
                    startTimeCurrent = that.timeFormat(startTimeFmt,startTime);
                    startTime.setHours((startTime.getHours() + 1));
                    endTimeFmt = that.timeFormat(startTimeFmt,endTimeFmt);
                    break;
            }
            result.push([
                startTimeCurrent,
                endTimeFmt
            ]);
        }
        let
            resultArray = [],
            resultLen = 0
        ;
        result.forEach((resultItem,index)=>{
            if(index % 2 === 0){
                resultLen = index;
                resultArray.push(resultItem);
            }
        });
        //代表还有最后一位
        if(resultLen < (result.length -1)){
            let
                endData = result[result.length -1][1]
            ;
            resultArray.push([endData,endData]);
        }
        return resultArray;
    }

}

module.exports = timeC;