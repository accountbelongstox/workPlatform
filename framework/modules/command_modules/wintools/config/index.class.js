


class index{
    constructor(common){
        common.get_core("file");
        common.get_core("console");
        common.get_core("func");

        common.get_tools("config");
        common.get_tools("install");

        common.get_config();

        //common.get_support(`webserver`);
    }

    run(callback){
        let
        that = this
        ;
        //所有软件的列表
        that.option.softlist = that.common.tools.install.option.softlist;

        that.option.extendSupport = that.option.conf.extend.support;
        //执行的命令
        that.option.command = that.common.params.contain( that.option.extendSupport );
        //that.option.commandSupport = that.option.extendSupport[that.option.command] ? that.option.extendSupport[that.option.command].support : [];
        //指定的软件名
        that.option.software = that.common.params.contain(that.option.softlist);
        //平台配置
        that.option.platform = that.common.config.platform.base;
        //工作目录
        that.option.workDir = that.option.platform.workDir;
        //资源目录
        that.option.sourceDir = that.option.platform.sourceDir;
        //没有查到的软件名
        if(!that.option.software){
            that.common.core.console.error(`Not find software ${that.option.software}`);
            if(callback)callback(null);
        //查找到软件名
        }else if(that[that.option.software]){
            //取得配置信息
            //that.option.support = that.common.support.webserver[that.option.software];
            //that.option.supportInit = that.option.support.config[that.option.command];
            //软件安装信息
            that.option.softinfo = that.common.tools.install.getSoftInfo(that.option.software);
            //提示
            that.common.core.console.success(`Start config in ${that.option.software} :`);
            that[that.option.software](callback);
            //没有查找到方法
        }else{
            that.common.core.console.error(`Not find config function ${that.option.software}`);
            if(callback)callback(null);

        }
    }

    /*
    配置 php
    */
    php(callback){

        let
            that = this,
            confName = "php.ini",
            tag = "",
            exampleConf = ["php.ini-development","php.ini-production"],
            versions = that.common.tools.config.GetVersionFull(that.option.softinfo.name),
            applicationDir = that.common.node.path.join(that.option.softinfo.applicationDir,`../`)
        ;
        that.common.tools.config.option.SetIniPublic = {
            confName,
            tag,
            exampleConf
        };
        if(that.option.command === "init"){
            (function setIni(len){
                if(len >= versions.length){
                    if(callback)callback();
                }else{
                    let
                        path = versions[len],
                        SetIniList = []
                    ;
                    that.common.tools.config.option.SetIniPublic[`path`]= path;

                    SetIniList.push({
                        key:`extension_dir`,
                        value:that.common.core.file.pathJoin(path,"ext",`"`)
                    });
                    SetIniList.push({
                        valueIsDirAndCreate:true,
                        key:`session.save_path`,
                        value:that.common.core.file.pathJoin(path,"tmp",`"`)
                    });
                    SetIniList.push({
                        valueIsDirAndCreate:true,
                        checkKey:true,
                        key:`XDebug -> xdebug.profiler_output_dir`,
                        value:that.common.core.file.pathJoin(path,"tmp/xdebug",`"`)
                    });
                    SetIniList.push({
                        valueIsDirAndCreate:true,
                        checkKey:true,
                        key:`XDebug -> xdebug.trace_output_dir`,
                        value:that.common.core.file.pathJoin(path,"tmp/xdebug",`"`)
                    });
                    SetIniList.push({
                        valueIsDirAndCreate:true,
                        checkKey:true,
                        key:`eAccelerator -> eaccelerator.cache_dir`,
                        value:that.common.core.file.pathJoin(path,"tmp/eAccelerator",`"`)
                    });
                    SetIniList.push({
                        valueIsDirAndCreate:true,
                        checkKey:true,
                        key:`xcache -> xcache.mmap_path`,
                        value:that.common.core.file.pathJoin(path,"tmp/dev/zero",`"`)
                    });
                    SetIniList.push({
                        checkKey:true,
                        changQuotePath:true,
                        key:`opcache -> zend_extension`,
                        value:that.common.core.file.pathJoin(path,"",`"`)
                    });
                    SetIniList.push({
                        changQuotePath:true,
                        valueDisabled:true,
                        checkKey:true,
                        key:`XDebug -> zend_extension`,
                        value:that.common.core.file.pathJoin(path,"",`"`)
                    });
                    SetIniList.push({
                        changQuotePath:true,
                        valueDisabled:true,
                        checkKey:true,
                        key:`XDebug -> zend_extension_ts`,
                        value:that.common.core.file.pathJoin(path,"ext",`"`)
                    });
                    SetIniList.push({
                        changQuotePath:true,
                        valueDisabled:true,
                        checkKey:true,
                        key:`Zend -> zend_extension_ts`,
                        value:that.common.core.file.pathJoin(path,"",`"`)
                    });
                    SetIniList.push({
                        changQuotePath:true,
                        valueDisabled:true,
                        checkKey:true,
                        key:`ioncube -> zend_extension`,
                        value:that.common.core.file.pathJoin(path,"",`"`)
                    });
                    SetIniList.push({
                        checkKey:true,
                        valueDisabled:true,
                        key:`ZendDebugger -> zend_extension_manager.debug_server_ts`,
                        value:that.common.core.file.pathJoin(path,"ZendDebugger",`"`)
                    });
                    SetIniList.push({
                        checkKey:true,
                        valueDisabled:true,
                        key:`zend_extension_manager.optimizer_ts`,
                        value:that.common.core.file.pathJoin(path,"ZendOptimizer/Optimizer",`"`)
                    });
                    that.common.tools.config.SetIni(SetIniList,()=>{
                        setIni(++len);
                    });
                }
            })(0);
        }
    }

    /*
    配置 mariadb
    */
    mariadb(callback){

        let
            that = this,
            dataDir =that.option.workDir.dataDir,
            confName = "my.ini",
            tag = "",
            exampleConf = ["my-innodb-heavy-4G.ini","my-huge.ini","my-large.ini","my-medium.ini"],
            port = `3306`,
            versions = that.common.tools.config.GetVersionFull(that.option.softinfo.name),
            applicationDir = that.common.node.path.join(that.option.softinfo.applicationDir,`../`)
        ;
        that.common.tools.config.option.SetIniPublic = {
            confName,
            tag,
            exampleConf
        };
        if(that.option.command === "init"){
            (function setIni(len){
                if(len >= versions.length){
                    if(callback)callback();
                }else{
                    let
                        path = versions[len],
                        SetIniList = []
                    ;
                    that.common.tools.config.option.SetIniPublic[`path`]= path;
                    SetIniList.push({
                        key:`mysqld -> port`,
                        value:port
                    });
                    SetIniList.push({
                        key:`client -> port`,
                        value:port
                    });
                    SetIniList.push({
                        key:`mysqld -> basedir`,
                        value:that.common.core.file.pathJoin(path,``,`"`)
                    });
                    SetIniList.push({
                        key:`mysqld -> character-set-server`,
                        value:`utf8`
                    });
                    SetIniList.push({
                        key:`mysqld -> sql-mode`,
                        value:`"NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"`
                    });
                    SetIniList.push({
                        key:`mysqld -> tmp_table_size`,
                        value:`64M`
                    });
                    SetIniList.push({
                        key:`mysqldump -> max_allowed_packet`,
                        value:`512M`
                    });
                    SetIniList.push({
                        key:`mysqld -> `,
                        value:`skip-grant-tables`
                    });
                    SetIniList.push({
                        valueIsDirAndCreate:true,//值是目录且要创建
                        key:`mysqld -> datadir`,
                        value:that.common.core.file.pathJoin(dataDir,that.option.softinfo.name,`"`)
                    });
                    SetIniList.push({
                        valueIsFileAndCreateDir:true,//值是文件且要创建上级目录
                        key:`mysqld -> log-bin`,
                        value:that.common.core.file.pathJoin(path,"logs/logbin.log",`"`)
                    });
                    SetIniList.push({
                        valueIsDirAndCreate:true,//值是目录且要创建
                        key:`mysqld -> tmpdir`,
                        value:that.common.core.file.pathJoin(path,"tmp",`"`)
                    });
                    SetIniList.push({
                        key:`mysqld -> myisam_max_sort_file_size`,
                        value:`2G`
                    });
                    SetIniList.push({
                        key:`client -> socket`,
                        value:that.common.core.file.pathJoin(path,"tmp/mysql.sock",`"`)
                    });
                    SetIniList.push({
                        key:`mysqld -> socket`,
                        value:that.common.core.file.pathJoin(path,"tmp/mysql.sock",`"`)
                    });
                    that.common.tools.config.SetIni(SetIniList,()=>{
                        setIni(++len);
                    });
                }
            })(0);
        }
    }


    /*
    配置 mongodb
    */
    mongodb(callback){

        let
            that = this,
            dataDir = that.option.workDir.dataDir,
            confName = `${that.option.softinfo.name}.config`,
            tag = "",
            port = `27017`,
            exampleConf = [],
            versions = that.common.tools.config.GetVersionFull(that.option.softinfo.name),
            applicationDir = that.common.node.path.join(that.option.softinfo.applicationDir,`../`),
            SetIniListAll = []
        ;
        that.common.tools.config.option.SetIniPublic = {
            confName,
            tag,
            exampleConf
        };
        if(that.option.command === "init"){
            (function setIni(len){
                if(len >= versions.length){
                    if(callback)callback(SetIniListAll);
                }else{
                    let
                        path = versions[len],
                        SetIniList = []
                    ;
                    that.common.tools.config.option.SetIniPublic[`path`]= path;
                    SetIniList.push({
                        valueIsDirAndCreate:true,//值是目录且要创建
                        key:`dbpath`,
                        value:that.common.core.file.pathJoin(dataDir,that.option.softinfo.name,``)
                    });
                    SetIniList.push({
                        valueIsFileAndCreateDir:true,//值是文件且要创建上级目录
                        key:`logpath`,
                        value:that.common.core.file.pathJoin(path,"logs/MongoDB.log",``)
                    });
                    SetIniList.push({
                        key:`logappend`,
                        value:`true`
                    });
                    SetIniList.push({
                        key:`journal`,
                        value:`true`
                    });
                    SetIniList.push({
                        key:`quiet`,
                        value:`true`
                    });
                    SetIniList.push({
                        key:`port`,
                        value:port
                    });
                    SetIniListAll.push(SetIniList);
                    that.common.tools.config.SetIni(SetIniList,()=>{
                        setIni(++len);
                    });
                }
            })(0);
        }
    }

    /*
    配置 httpd
    焱-木
    */
    httpd(callback){
        let
            that = this,
            confName = `conf/httpd.conf`,
            tag = "",
            versions = that.common.tools.config.GetVersionFull(that.option.softinfo.name),
            exampleConf = [],
            phpCurrent = that.common.tools.config.phpCurrentApplicationDir()
        ;
        that.common.tools.config.option.SetIniPublic = {
            confName,
            tag,
            exampleConf,
            assignmentSymbol:" ",
            filter:false
        };

        if(that.option.command === "init"){
            //配置apache基本目录
            (function startSetHttpd(len){
                if(len >= versions.length){
                    //结束设置
                    if(callback)callback();
                } else {
                    let
                        version = versions[len]
                    ;
                    if(that.common.core.file.isDirSync(version)){
                        let
                            path = version,
                            SetIniList = []
                        ;
                        //将 PHP 的 CIG 添加到配置中
                        that.common.tools.config.GetOrAddMultiPHPsApiAndFCgiDConf(version);

                        that.common.tools.config.option.SetIniPublic[`path`]= path;
                        SetIniList.push({
                            key:`Define SRVROOT`,
                            value:that.common.core.file.pathJoin(path,"",``)
                        });
                        SetIniList.push({
                            key:`DocumentRoot`,
                            value:that.common.config.platform.base.workDir.wwwroot
                        });
                        SetIniList.push({
                            key:`DirectoryIndex`,
                            value:`index.php index.html index.htm`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            multiKey:true,
                            key:`Include`,
                            value:`conf/extra/httpd-vhosts.conf`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            multiKey:true,
                            key:`LoadModule`,
                            value:`rewrite_module modules/mod_rewrite.so`,
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            keyPrefix:`    `,
                            tagLeft:``,
                            tagRight:``,
                            //配置闭合值
                            key:`<Directory /> <-> </Directory> -> Options`,
                            value:`+Indexes +FollowSymLinks +ExecCGI`,
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            keyPrefix:`    `,
                            tagLeft:``,
                            tagRight:``,
                            //配置闭合值
                            key:`<Directory /> <-> </Directory> -> AllowOverride`,
                            value:`All`,
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            keyPrefix:`    `,
                            tagLeft:``,
                            tagRight:``,
                            //配置闭合值
                            key:`<Directory /> <-> </Directory> -> Require`,
                            value:`all granted`,
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`FcgidIOTimeout`,
                            value:`384`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`FcgidConnectTimeout`,
                            value:`360`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`FcgidOutputBufferSize`,
                            value:`128`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`FcgidMaxRequestsPerProcess`,
                            value:`1000`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`FcgidMinProcessesPerClass`,
                            value:`0`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`FcgidMaxProcesses`,
                            value:`16`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`FcgidMaxRequestLen`,
                            value:`268435456`
                        });
                        SetIniList.push({
                            valueSymbol:null,
                            key:`ProcessLifeTime`,
                            value:`360`
                        });
                        SetIniList.push({
                            multiKey:true,
                            valueSymbol:null,
                            key:`FcgidInitialEnv`,
                            value:`PHP_FCGI_MAX_REQUESTS 1000`
                        });
                        SetIniList.push({
                            multiKey:true,
                            valueSymbol:null,
                            key:`FcgidInitialEnv`,
                            value:`PHPRC "${phpCurrent}"`
                        });
                        SetIniList.push({
                            addValue:true,
                            valueSymbol:null,
                            key:`AddHandler`,
                            value:`fcgid-script .php`
                        });
                        SetIniList.push({
                            multiKey:true,
                            valueSymbol:null,
                            key:`FcgidWrapper`,
                            value:`"${phpCurrent}/php-cgi.exe" .php`
                        });
                        that.common.tools.config.SetIni(SetIniList,(ConfigContent)=>{
                            that.common.tools.config.installHttpdModule(version,`mod_fcgid`,()=>{
                                //一劳永逸强制解决 80 被占用问题
                                let
                                    stopMSService = [
                                        `net stop http`,
                                        `Sc config http start=disabled`
                                    ],
                                    httpd = that.common.node.path.join(version,`bin/httpd.exe`),
                                    insatllCmd = [
                                        `${httpd} -k install -n httpd`,
                                        `net start httpd`
                                    ],
                                    cmds = stopMSService.concat(insatllCmd)
                                    /*重新开始http
                                    * net start http
                                    net start Wms
                                    net start WinRM
                                    net start W3SVC
                                    net start Spooler
                                    net start PeerDistSvc
                                    net start IISADMIN
                                    sc config http start=demand & net start http
                                    sc config http start=enabled
                                    */
                                ;
                                that.common.core.func.exec(cmds,()=>{
                                    startSetHttpd(++len);
                                });
                            },ConfigContent);
                        });
                    }else{
                        startSetHttpd(++len);
                    }
                }
            })(0);
        }
    }
}
module.exports = index;