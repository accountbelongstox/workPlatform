class _mariadbC{

	constructor(common){
		common.get_core("console");
        common.get_core("module");
        common.get_core("func");

        common.get_node("path");
	}

	run(callback){
		let
			that = this,
			MySQLService = `MySQL`,
			tmpDir = that.common.core.file.getTmpDir(`.mariadb`),
            mysqlDirPath = that.common.node.path.join(that.option.softinfo.environmentVariableX.MYSQL_HOME,"/bin"),
            mysqldPath = that.common.node.path.join(mysqlDirPath,`mysqld.exe`),
            mysqlPath = that.common.node.path.join(mysqlDirPath,`mysql.exe`),
			installSql = [
                `${mysqldPath}  --install "${MySQLService}"`,
				`net start mysql`
			],
            resetMysqlSQLPath = that.common.node.path.join(tmpDir,`resetRootPwd.sql`),
			//重置 MySQL 密码
            resetMysqlRootPwd = `use mysql;
update user set password=password("root") where user="root";
flush privileges;`,
			resetSQL = `${mysqlPath} -uroot -proot < ${resetMysqlSQLPath}`,
			restartMySQL = [
				`net stop ${MySQLService}`,
				`net start ${MySQLService}`
			]
		;
		that.common.core.console.info(`start config software in ${that.option.softinfo.name}`,4);
		//需要先检测编程平台PHP是否安装
        that.common.core.func.exec(installSql,(exeInfo)=>{
        	that.common.core.console.info(exeInfo,4);
            that.common.core.file.writeFileSync(resetMysqlSQLPath,resetMysqlRootPwd);
            that.common.core.func.execSync(resetSQL);
            that.common.core.func.execSync(restartMySQL);
            that.common.core.console.success(`Software ${that.option.softinfo.name} installed successfully`);
            if(callback){
                callback();
            }
        });
	}
}

module.exports = _mariadbC;
        	