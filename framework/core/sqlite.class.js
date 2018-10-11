class spliteC{
    constructor(common){
        common.get_node(`path`);
        common.get_node('sqlite3');

        common.get_core(`func`);
        common.get_core(`file`);
        common.get_core(`console`);

        common.get_tools(`sqlite`);
        common.get_support(`datainstall`);
    }

    /**
     * @func
     * @param callback
     */
    run(callback){
        let
            that = this
        ;
        if(typeof callback === "string"){
            that.option.dataname =callback;
            callback = null;
        }
        //dataname 数据库名称默认使用系统数据库,如果设置为  :memory:  则表示暂存于内存
        if(!that.option.dataname){
            that.option.dataname = "data";
        }
        if(!that.option.prefix){
            that.option.prefix = "ddrun_";
        }
        try{
            that.option.dataDir = that.common.core.appPath.data;
            that.option.sqlite = that.common.node.sqlite3;
            let
                dataname = (function dataNameFn(){
                    let
                        dataName = that.option.dataname.replace(/\..+/i)
                    ;
                    dataName += ".db";
                    dataName = that.common.core.file.pathFormat(that.option.dataDir , dataName);
                    return dataName;
                })()
            ;
            that.option.data = new that.option.sqlite.Database(dataname, function(err){
                if (err){
                    console.log(err);
                }
                if(callback){
                    callback(that,that.option.data,err);
                }
            });
        }catch(err){
            let
                errInfo = [
                    `The splite3 model does not exist.`,`install command:`,`# cd /d ${that.common.core.appPath.root}`,`# ${that.common.node.path.join(that.common.core.appPath.apps,`nodejs/cnpm`)} install sqlite3 --target_arch=x64`
                ]
            ;
            that.common.core.console.error(errInfo[0],errInfo[1],errInfo[2],errInfo[3]);
            if(callback){
                callback(errInfo);
            }else{
                return null;
            }
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
            sql = `select * from sqlite_master where type='table' and name='${that.common.tools.sqlite.table(table)}'`,
            createTable = false
        ;
        if(that.common.core.array.isBoolean(callback)){
            createTable = callback;
            callback = callbackOrCreateTable;
        }
        that.option.data.all(sql, (err,result)=>{
            if(!that.common.core.func.exists(result) && createTable){
                that.createTable(table,(err)=>{
                    callback(!err);
                });
            }else{
                if(callback){
                    callback(result,err);
                }
            }
        });
    }

    /**
     * @func
     * @param tables
     * @param callback
     */
    createTable(tables,callback){
        let
            that = this,
            defaultValue = that.common.support.datainstall.default,
            tableNameParse = (function tableNameParse(){
                let
                    r = []
                ;
                //字符时,提取安装表
                if(typeof tables === "string"){
                    let
                        install = that.common.support.datainstall.install,
                        supportInstall = install[tables],
                        tableInstall = {}
                    ;
                    if(supportInstall){
                        tableInstall[tables] = supportInstall;
                        for(let p in defaultValue){
                            if(!(p in tableInstall[tables])){
                                tableInstall[tables][p] = defaultValue[p];
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
                }else if(that.common.core.array.isObject(tables)){
                    for(let p in defaultValue){
                        if(!(p in tables)){
                            tables[p] = defaultValue[p];
                        }
                    }
                    r.push(tables);
                }else if(that.common.core.array.isArray(tables)){
                    tables.forEach((table)=>{
                        r = r.concat(tableNameParse(table));
                    });
                }
                return r;
            })(),
            tableArr = that.common.tools.sqlite.sqlObjectParse(tableNameParse),
            SQLs = [],
            result = []
        ;
        tableArr.forEach((table)=>{
            let
                sqlA = "CREATE TABLE IF NOT EXISTS `"+that.option.prefix+""+table.name+"`",
                values = table.value,
                sqlB = that.common.tools.sqlite.sqlValueParse(values),
                sql = `${sqlA} ${sqlB}`
            ;
            sql = that.common.core.string.trim(sql);
            SQLs.push(sql);
        });
        (function exeSql(len){
            if(len >= SQLs.length){
                if(callback){
                    if(result.length === 1){
                        result = result[0];
                    }
                    callback(result);
                }
            }else{
                let
                    sql = SQLs[len]
                ;
                that.option.data.run(sql,(err)=>{
                    if(err){
                        console.log(err,sql);
                    }
                    result.push(err);
                    exeSql(++len);
                });
            }
        })(0);
    }

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
            where = that.common.tools.sqlite.sqlWhereParse(wheres),
            select = selects ? that.common.tools.sqlite.sqlSelectParse(selects) : `*`,
            sql = ``
        ;
        if(where){
            where = ` where ${where}`;
        }
        sql = `SELECT ${select} FROM \`${that.option.prefix}${table}\`${where}`;
        that.option.data.all(sql, (err,result)=>{
            if(result.length === 0){
                result = null;
            }
            if(callback){
                callback(result);
            }
        });
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
            tableValue = that.common.tools.sqlite.addValueParse(values),
            SQL = `INSERT INTO ${that.option.prefix+tableName} ${tableValue}`
        ;
        console.log(SQL);
        that.option.data.run(SQL,(error)=>{
            if (error){
                util.log('FAIL on add ' + error);
            }
            if(callback)callback(error);
        });
    }
}
module.exports = spliteC;