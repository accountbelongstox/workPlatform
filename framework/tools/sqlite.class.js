class sqliteC{
    constructor(common){
        common.get_core(`array`);

        common.get_config();
    }


    table(table){
        let
            that = this,
            databaseConfig = that.common.config.platform.core.database,
            prefix = databaseConfig.prefix
        ;
        return `${prefix}${table}`;
    }
    /**
     * @func 解析一个SQL 对像为SQL语句
     * @param tables
     * @returns {Array}
     */
    sqlObjectParse(tables){
        let
            that = this,
            tableArr = []
        ;
        if(that.common.core.array.isObject(tables)){
            for(let p in tables){
                tableArr.push({
                    name : p,
                    value : tables[p]
                });
            }
        }else if(typeof tables === "string"){
            tableArr.push({
                name : tables,
                value : ``
            });
        }else if(that.common.core.array.isArray(tables)){
            tables.forEach((table)=>{
                tableArr = tableArr.concat(that.sqlObjectParse(table));
            });
        }
        return tableArr;
    }


    /**
     * @func 将SQL对象解析为SQL语句
     * @param valueArr
     */
    sqlValueParse(valueArr){
        let
            that = this,
            tableValues = (function valueParse(values){
                let
                    valuesArr = []
                ;
                if(that.common.core.array.isObject(values)){
                    for(let p in values){
                        let
                            value = values[p]
                        ;
                        if(!value)value="TEXT";
                        valuesArr.push(`\`${p}\` ${value}`);
                    }
                }else if(typeof values === "string"){
                    if(values){
                        let
                            valueParam = `TEXT`
                        ;
                        if(values === "id"){
                            valueParam = `int unsigned not null primary key`;
                        }
                        valuesArr.push(`\`${values}\` ${valueParam}`);
                    }
                }else if(that.common.core.array.isArray(values)){
                    values.forEach((table)=>{
                        valuesArr.push(valueParse(table));
                    });
                }
                return valuesArr;
            })(valueArr),
            tableText = tableValues.join(`,`)
        ;
        if(tableText){
            tableText = `( ${tableText} )`;
        }else{
            tableText = `( id int unsigned not null primary key )`;
        }
        return tableText;
    }

    /**
     * @func 将SQL条件解析为SQL语句
     * @param arr
     */
    sqlWhereParse(arr){
        let
            that = this,
            tableValues = (function valueParse(values){
                let
                    valuesArr = []
                ;
                if(that.common.core.array.isObject(values)){
                    for(let p in values){
                        let
                            value = values[p]
                        ;
                        if(!value)value=``;
                        value = that.common.core.string.sqlParse(value);
                        valuesArr.push(`\`${p}\`='${value}'`);
                    }
                }else if(typeof values === "string"){
                    if(values){
                        valuesArr.push(values);
                    }
                }else if(that.common.core.array.isArray(values)){
                    values.forEach((table)=>{
                        valuesArr.push(valueParse(table));
                    });
                }
                return valuesArr;
            })(arr),
            tableText = tableValues.join(` and `)
        ;
        return tableText;
    }

    /**
     * @func
     * @param arr
     */
    sqlSelectParse(arr){
        let
            that = this,
            tableValues = (function valueParse(values){
                let
                    valuesArr = []
                ;
                if(that.common.core.array.isObject(values)){
                    for(let p in values){
                        valuesArr.push(p);
                    }
                }else if(typeof values === "string"){
                    if(values){
                        valuesArr.push(values);
                    }
                }else if(that.common.core.array.isArray(values)){
                    values.forEach((table)=>{
                        valuesArr.push(valueParse(table));
                    });
                }
                return valuesArr;
            })(arr),
            tableText = tableValues.join("`,`")
        ;
        if(tableText){
            tableText = "`"+tableText+"`";
        }
        return tableText;
    }


    /**
     * @func
     * @param arr
     */
    addValueParse(arr){
        let
            that = this,
            tableValues = (function valueParse(values){
                let
                    valuesArr = []
                ;
                if(that.common.core.array.isObject(values)){
                    for(let p in values){
                        valuesArr.push({
                            key:p,
                            value:values[p]
                        });
                    }
                }else if(typeof values === "string"){
                    values = values.split(`=`);
                    if(values){
                        let
                            key = values[0],
                            value = (values.length > 1) ? values[1] : ``
                        ;
                        value = that.common.core.string.trimX(value);
                        valuesArr.push({
                            key,
                            value
                        });
                    }
                }else if(that.common.core.array.isArray(values)){
                    values.forEach((table)=>{
                        valuesArr.push(valueParse(table));
                    });
                }
                return valuesArr;
            })(arr),
            tableText = ``,
            keys = [],
            values = []
        ;
        tableValues.forEach((table)=>{
            keys.push(table.key);
            values.push(table.value);
        });

        keys = keys.join("`,`");

        if(keys){
            keys = "(`"+keys+"`)";
        }

        values.forEach((value,index)=>{
            values[index] = that.common.core.string.sqlParse(value);
        });

        values = values.join("','");

        if(values){
            values = "VALUES ('"+values+"')";
        }
        return `${keys} ${values}`;
    }
}


module.exports = sqliteC;