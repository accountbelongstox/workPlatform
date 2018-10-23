class DC{

    constructor(o){
        o.get(`file`,`tool`);
    }

    run(){
        let
            that = this
        ;
        if(!that.option.databaseName){
            that.option.databaseName = "json";
        }
        if(!that.option.dataDir){
            that.option.dataDir = that.o.tool.file.pathFormat(that.o.path.data , `data.json`);
        }
        if(!that.option.data){
            let
                initData = {}
            ;
            if(that.o.tool.file.isFileSync(that.option.dataDir)){
                initData = require(that.option.dataDir);
            }
            that.o.option.database = {
                json : initData
            };
            that.option.data = that.o.option.database.json;
        }
    }

    /**
     * @func 查看是否有该表格
     * @param table
     * @param callback
     * @param callbackOrCreateTable
     */
    isTable(table,callback=null,callbackOrCreateTable=null){
        let
            that = this,
            createTable = false,
            isTable = that.option.data[table]
        ;
        if(that.o.tool.array.isBoolean(callback)){
            createTable = callback;
            callback = callbackOrCreateTable;
        }
        if(isTable && createTable){
            that.createTable(table,()=>{
                if(callback)callback(true);
            });
        }else{
            if(callback)callback(true);
        }
    }

    /**
     * @func
     * @param tables
     * @param callback
     */
    createTable(tables,callback){
        let
            that = this,
            defaultValue = that.o.support.datainstall.default,
            tableNameParse = (function tableNameParse(){
                let
                    r = []
                ;
                //字符时,提取安装表
                if(typeof tables === "string"){
                    let
                        install = that.o.support.datainstall.install,
                        supportInstall = install[tables],
                        tableInstall = {}
                    ;
                    if(supportInstall){
                        tableInstall[ tables ] = supportInstall;
                        for(let p in defaultValue){
                            if(!(p in tableInstall[ tables ])){
                                tableInstall[ tables ][ p ] = defaultValue[ p ];
                            }
                        }
                        r.push(tableInstall);
                    }else{
                        let
                            table = {}
                        ;
                        table[tables] = defaultValue;
                        r.push(table);
                    }
                }else if(that.o.tool.array.isObject(tables)){
                    for(let p in defaultValue){
                        if(!(p in tables)){
                            tables[ p ] = defaultValue[ p ];
                        }
                    }
                    r.push(tables);
                }else if(that.o.tool.array.isArray(tables)){
                    tables.forEach((table)=>{
                        r = r.concat(tableNameParse(table));
                    });
                }
                return r;
            })(),
            tableArr = that.o.func.sqlite.sqlObjectParse(tableNameParse)
        ;
        tableArr.forEach( (table)=>{
            if( !(table in that.option.data) ){
                that.option.data[ table ] = [];
            }
        });
        that.saveData(()=>{
            if(callback)callback();
        });
    }
/*-
    /**
     * @func 查询
     * @param table
     * @param wheres
     * @param selects
     * @param callback
     */
    query(table,wheres,selects,callback){
        if(selects instanceof Function){
            callback = selects;
            selects = null;
        }
        let
            that = this,
            data = that.option.data[table],
            where = that.o.func.sqlite.sqlWhereParse(wheres),
            select = selects ? that.o.func.sqlite.sqlSelectParse(selects) : `*`,
            sql = ``
        ;
        if(false && !data /* || !data.length */){
            if(callback)callback([]);
        }else{
            let
                whereArr = (function (){
                    let
                        arr = where.split(/\s+and\s+/i),
                        o = {}
                    ;
                    arr.forEach((item)=>{
                        let
                            items = item.split(/\=/),
                            k = that.o.tool.string.trim(items[0],'`'),
                            v = that.o.tool.string.trim(items[1],'`')
                        ;
                        o[ k ] = v;
                    });
                    return o;
                })(),
                selectArr = (function (){
                    let
                        arr = select.split(/,/i)
                    ;
                    arr.forEach((item,index)=>{
                        arr[index] = that.o.tool.string.trim(item,'`');
                    });
                    return arr;
                })(),
                result = []
            ;
            console.log(that.option.data,data,324324);
            //where 过滤
            data.forEach((dataItem)=>{
                let
                    is = true
                ;
   +            for(let p in dataItem){
                    for(let o in whereArr){
                        let
                            whereItem = whereArr[o]
                        ;
                        if( !(dataItem[ o ] && dataItem[o] == whereItem) ){
                            //条件不符合
                            is = false;
                        }
                    }
                }
                if(is){//查找存在
                    result.push(dataItem);
                }
            });
            if(selectArr.length){//selectArr 过滤
                selectArr.forEach((selectItem)=>{
                    result.forEach((resultItem)=>{

                    });
                });
            }

            console.log(whereArr,selectArr);
            return
            sql += `SELECT ${select} FROM \`${that.option.prefix}${table}\`${where}`;
            that.option.data.all(sql, (err,result)=>{
                if(result.length === 0){
                    result = null;
                }
                if(callback){
                    callback(result);
                }
            });
        }
    }

    /**
     * @func
     * @param tableName
     * @param values
     * @param callback
     */
    add(tableName, values, callback){
        let
            that = this,
            tableValue = that.o.func.sqlite.addValueParse(values),
            SQL = `INSERT INTO ${that.option.prefix+tableName} ${tableValue}`
        ;
/*        that.option.data.run(SQL,(error)=>{
            that.o.tool.console.info(`add table ${tableName} success.`,6);
            if (error){
                util.log('FAIL on add ' + error);
            }
            if(callback)callback(error);
        });*/
    }

    //保存数据库到本地文件
    saveData(callback){
        let
            that = this
        ;
        that.o.file.writeFileSync(that.option.dataDir,JSON.stringify(that.option.data));
        if(callback)callback();
    }
}

module.exports = DC;