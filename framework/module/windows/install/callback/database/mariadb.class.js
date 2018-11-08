class _mariadbC{

	constructor(load){
		
        
        

        
	}

	run(callback){
		let
			that = this,
			MySQLService = `MySQL`,
			tmpDir = that.load.module.file.getTmpDir(`.mariadb`),
            mysqlDirPath = that.load.node.path.join(that.option.softinfo.environmentVariableX.MYSQL_HOME,"/bin"),
            mysqldPath = that.load.node.path.join(mysqlDirPath,`mysqld.exe`),
            mysqlPath = that.load.node.path.join(mysqlDirPath,`mysql.exe`),
			installSql = [
                `${mysqldPath}  --install "${MySQLService}"`,
				`net start mysql`
			],
            resetMysqlSQLPath = that.load.node.path.join(tmpDir,`resetRootPwd.sql`),
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
		that.load.module.console.info(`start config software in ${that.option.softinfo.name}`,4);
		//需要先检测编程平台PHP是否安装
        that.load.module.func.exec(installSql,(exeInfo)=>{
        	that.load.module.console.info(exeInfo,4);
            that.load.module.file.writeFileSync(resetMysqlSQLPath,resetMysqlRootPwd);
            that.load.module.func.execSync(resetSQL);
            that.load.module.func.execSync(restartMySQL);
            that.load.module.console.success(`Software ${that.option.softinfo.name} installed successfully`);
            if(callback){
                callback();
            }
        });
	}
}

module.exports = _mariadbC;
        	