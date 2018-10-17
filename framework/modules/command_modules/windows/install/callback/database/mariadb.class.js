class _mariadbC{

	constructor(o){
		
        
        

        
	}

	run(callback){
		let
			that = this,
			MySQLService = `MySQL`,
			tmpDir = that.o.tool.file.getTmpDir(`.mariadb`),
            mysqlDirPath = that.o.node.path.join(that.option.softinfo.environmentVariableX.MYSQL_HOME,"/bin"),
            mysqldPath = that.o.node.path.join(mysqlDirPath,`mysqld.exe`),
            mysqlPath = that.o.node.path.join(mysqlDirPath,`mysql.exe`),
			installSql = [
                `${mysqldPath}  --install "${MySQLService}"`,
				`net start mysql`
			],
            resetMysqlSQLPath = that.o.node.path.join(tmpDir,`resetRootPwd.sql`),
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
		that.o.tool.console.info(`start config software in ${that.option.softinfo.name}`,4);
		//需要先检测编程平台PHP是否安装
        that.o.tool.func.exec(installSql,(exeInfo)=>{
        	that.o.tool.console.info(exeInfo,4);
            that.o.tool.file.writeFileSync(resetMysqlSQLPath,resetMysqlRootPwd);
            that.o.tool.func.execSync(resetSQL);
            that.o.tool.func.execSync(restartMySQL);
            that.o.tool.console.success(`Software ${that.option.softinfo.name} installed successfully`);
            if(callback){
                callback();
            }
        });
	}
}

module.exports = _mariadbC;
        	