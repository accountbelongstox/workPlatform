class arrayC{
	
    //数组功能 -----------------------------------------------------------------------------------------------------------------------------------

    /*
    @func 数组去重复
    */
    unique(arr){
        let
            sourceArr = arr
        ;
        arr.forEach((item,index)=>{
           if(typeof item === "string"){
               arr[index] = item.toLowerCase();
           }
        });
        let
            newArr = Array.from(new Set(arr))
        ;
        newArr.forEach((item1,index1)=>{
            sourceArr.forEach((item2)=>{
                if(typeof item1 === "string" && typeof item2 === "string" && item1.toLowerCase() === item2.toLowerCase()){
                    newArr[index1] = item2;
                }
            });
        });
        return newArr;
    }

    /*
    @func 数组去空  
    */
    filter(arr){
        arr = arr.filter(item=>item);
        arr.forEach((arrOne,index)=>{
            if(/[\r\n]+$/.test(arrOne)){
                arr.splice(index,1);
            }
        });
        return arr;
    }


    /**
     * @tools 判断一个数组是否包含另一个数组,并返回起始到结束位置
     * @param inArr
     * @param arr
     * @returns {null|[int start,int end]}
     */
    arrInArrAtContinue(inArr,arr){
        let 
        a,b,_inArr
        ;

        if(arr.length > inArr.length)return null;
        for(let i = 0;i < inArr.length;i++){
            a = inArr[i]
            b = arr[0]
            if(a == b){
                _inArr = inArr.slice(i,arr.length+i);
                if(this.arrEquals(_inArr, arr)){
                    return [i,arr.length+i]
                }
            }
        }

        return null
    }

    /**
     * @tools  判断两个数组是不是相等.(长度,顺序)
     * @param arra
     * @param arrb
     * @returns {boolean}
     */
    arrEquals(arra,arrb){
        if(arra.length != arrb.length)return false
        for(let i=0;i<arra.length;i++){
            if( arra[i] !== arrb[i])return false
        }
        return true
    }



    /**
     * @tools 是否包含数组
     */
    in_array(arr,v){
        if( !(arr instanceof Array) ) return false;
        for (let i=0;i<arr.length;i++){
            if( v == arr[i] ){
                return true;
            }
        }
        return false;
    }

    iterator(arr){
        function iteratorFun(a){
            let i =(function(_a){
                    return _a[Symbol.iterator]();
                })(a);
            return i;
        }
        let iterator = new iteratorFun(arr);
        return iterator;
    }

    /*
    @func 在数组中查找
    */
    find(arr,str,symbol=false/*不区分大小写*/){
        let 
        resulte = null,
        tmpItem = null
        ;
        arr.forEach((item,index)=>{
            if(symbol){
                tmpItem = item;
                item = item.toLowerCase();
                str = str.toLowerCase();
            }
            if(item == str){
                resulte = tmpItem;
                return;
            }
        })
        return resulte;
    }

    /*
    @func 在数组中查找 不区分大小写
    */
    findX(arr,str/*不区分大小写*/){
        let 
        resulte = null,
        tmpItem = null
        ;
        arr.forEach((item,index)=>{
            tmpItem = item;
            item = item.toLowerCase();
            str = str.toLowerCase();
            if(item == str){
                resulte = tmpItem;
                return;
            }
        })
        return resulte;
    }

    /*
    @func 将一个对象转为数组
    */
    toArray(obj){
        let 
        objtype = (typeof obj)
        ;
        if(objtype === "string" || objtype === "boolean")return [obj];
        if(obj instanceof Array)return obj;
        if(objtype === "object")return Object.keys(obj).map(key=> obj[key]);

    }

    sort(arr,sortFn=function(){}){
        let
            that = this
        ;
        if(typeof arr != "object"){
            that.comon.core.console.error(`Param not is an array or object`);
            return [];
        }else{
            let
                isObject = (!(arr instanceof Array)),
                newArr = [],
                objToArr = [],
                arrayToObject = {}
            ;
            if( isObject ){
                for(let p in arr){
                    let
                        tmpObject = {
                            list:arr[p]
                        }
                    ;
                    tmpObject[`title`] = p;
                    objToArr.push(tmpObject);
                }
                newArr = objToArr;
            }else{
                newArr = arr;
            }
            newArr.sort(sortFn);
            if(isObject){
                newArr.forEach((newArrOne)=>{
                    let
                        p = newArrOne[`title`]
                    ;
                    arrayToObject[p] = newArrOne.list;
                });
                newArr = arrayToObject;
            }
            return newArr;
        }
    }

    /**
     * @func 判断是否是一个数组
     * @param arr
     * @returns {boolean}
     */
    isArray(arr){
        let
            r = false
        ;
        if(arr instanceof Array){
            r = true;
        }
        return r;
    }

    /**
     * @func
     * @param json
     * @returns {boolean}
     */
    isJson(json){
        let
            that = this
        ;
        return that.isObject(json);
    }

    /**
     * @func 判断是否是一个对象
     * @param arr
     * @returns {boolean}
     */
    isObject(arr){
        let
            r = false,
            that = this
        ;
        if(arr instanceof Object){
            if(!arr.length){
                r = true;
            }
        }
        return r;
    }

    /**
     * @func 获取一个元素的真值
     * @param obj
     */
    getObjectTrue(obj,getKey = false){
        let
            that = this,
            r = []
        ;
        for(let p in obj){
            let
                item = obj[p]
            ;
            if(item){
                getKey ? r.push(p) : r.push(item);
            }
        }
        return r;
    }
}

module.exports = arrayC;