class DC{

    constructor(load){
        load.get_class(`module/file`);
        load.get_class(`module/string`);
    }

    run(){
        let
            that = this
        ;
        if(!that.option.databaseName){
            that.option.databaseName = "json";
        }
        if(!that.option.dataDir){
            that.option.dataDir = that.load.module.file.pathFormat(that.load.path.data , `data.json`);
        }
        if(!that.option.data){
            let
                initData = {}
            ;
            if(that.load.module.file.isFileSync(that.option.dataDir)){
                try{
                    initData = require(that.option.dataDir);
                }catch(err){
                    that.load.module.console.error(`The data table has been damaged.`);
                    that.dataBackup();
                    that.deleteDatabase(true);
                }
            }
            that.load.option.database = {
                json : initData
            };
            that.option.data = that.load.option.database.json;
        }
    }

    /**
     * @func 查看是否有该表格
     * @param table
     * @param callback
     * @param callbackOrCreateTable 若表不存在则创建
     */
    isTable(table,callback=null,callbackOrCreateTable=null){
        let
            that = this,
            createTable = false,
            isTable = that.option.data[table]
        ;
        if(that.load.module.array.isBoolean(callback)){
            createTable = callback;
            callback = callbackOrCreateTable;
        }
        if(!isTable && createTable){
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
            defaultValue = that.load.support.datainstall.default,
            tableNameParse = (function tableNameParse(){
                let
                    r = []
                ;
                //字符时,提取安装表
                if(typeof tables === "string"){
                    let
                        install = that.load.support.datainstall.install,
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
                }else if(that.load.module.array.isObject(tables)){
                    for(let p in defaultValue){
                        if(!(p in tables)){
                            tables[ p ] = defaultValue[ p ];
                        }
                    }
                    r.push(tables);
                }else if(that.load.module.array.isArray(tables)){
                    tables.forEach((table)=>{
                        r = r.concat(tableNameParse(table));
                    });
                }
                return r;
            })(),
            tableArr = that.load.module_func.sqlite.sqlObjectParse(tableNameParse)
        ;
        tableArr.forEach( (table)=>{
            let
                data_name = table.name
            ;
            if( !(data_name in that.option.data) ){
                that.option.data[ data_name ] = [];
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
            where = that.load.module_func.sqlite.sqlWhereParse(wheres),
            select = selects ? that.load.module_func.sqlite.sqlSelectParse(selects) : `*`,
            sql = ``
        ;

        let
            whereArr = (function (){
                let
                    arr = where.split(/\s+and\s+/i),
                    o = {}
                ;
                arr.forEach((item)=>{
                    let
                        items = item.split(/\=/),
                        k = that.load.module.string.trim(items[0],'`'),
                        v = that.load.module.string.trim(items[1],'`')
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
                    arr[index] = that.load.module.string.trim(item,'`');
                });
                return arr;
            })(),
            result = []
        ;
        //where 过滤
        data.forEach((dataItem)=>{
            let
                is = true
            ;
            for(let p in dataItem){
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
        //当有 select 过滤时
        //由 select 数组执行过滤
        if(selectArr.length){
            let
                select_array = []
            ;
            selectArr.forEach((selectKey)=>{
                selectKey = selectKey.toLowerCase();
                result.forEach((resultItem,index)=>{
                    let
                        _tmp_o =null
                    ;
                    for(let p in resultItem){
                        let
                            resultItemOne = resultItem[p]
                        ;
                        if(p.toLowerCase() === selectKey || selectKey === "*"){
                            if(!_tmp_o)_tmp_o = {};
                            _tmp_o[p] = resultItemOne;
                        }
                    }
                    if(_tmp_o){
                        select_array.push(_tmp_o);
                    }
                });
            });
            result = null;
            result = select_array;
        }
        if(!result.length) result = null;
        if(callback)callback(result);
    }

    /**
     * @func
     * @param tableName
     * @param values
     * @param callback
     */
    add(table, values, callback){
        let
            that = this,
            result
        ;
        try{
            that.option.data[table].push(values);
            result = that.option.data[table].length;
        }catch (e) {
            result = false;
        }
        that.saveData(()=>{
            if(callback)callback(result);
        });
    }

    //保存数据库到本地文件
    saveData(callback){
        let
            that = this
        ;
        that.load.module.file.writeFileSync(that.option.dataDir,JSON.stringify(that.option.data));
        if(callback)callback();
    }

    //备份数据表
    dataBackup(){
        let
            that = this,
            database_content = that.load.module.file.readFileSync(that.option.dataDir),
            new_database_name = that.load.module.string.createFileName(that.option.dataDir)
        ;
        that.load.module.file.writeFileSync(new_database_name,database_content);
    }

    //删除表
    deleteDatabase(force){
        let
            that = this
        ;
        if(force){
            that.load.module.file.deleteFileSync(that.option.dataDir);
        }
    }
}

module.exports = DC;