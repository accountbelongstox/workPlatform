module.exports =  class developC{
	constructor(common){
        common.get_node(`fs`);
        common.get_node(`path`);
        common.get_node(`url`);
        common.get_node(`child_process`);
        common.get_node("readline");

        common.get_tools(`install`);
        common.get_tools(`develop`);

        common.get_core(`console`);
        common.get_core(`sqlite`,null,false);
    }

    run(){
        let
            that = this
        ;
        that.common.node.readLine = that.common.node.readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    /**
     * @func 添加一个网站
     */
    addweb(){
        let
            that = this,
            httpInfo = that.common.tools.install.getSoftInfo(`httpd`),
            conf = that.common.node.path.join(httpInfo.applicationDir,"./conf/extra/httpd-vhosts.conf"),
            domain = that.common.params.get(`domain`),
            isDomain = /[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\-\_]+/i
        ;
        if(!domain){
            domain = that.common.params.get(2)
        }
        if(!domain){
            (function inputDomain(){
                that.common.node.readLine.question(`Please enter a domain name. (www.xxx.com) : `, (domainInput) => {
                    domainInput = "www.baidu.com";
                    if(isDomain.test(domainInput)){
                        domain = domainInput;
                        addWebDomain(domain);
                    }else{
                        that.common.core.console.error(`The domain name entered is incorrect, example: www.xxx.com .`);
                        inputDomain();
                    }
                });
            })();
        }else{
            addWebDomain(domain);
        }

        function addWebDomain(domain){

            domain = domain.toLowerCase();
            domain = domain.replace(/^\s*http\:\/\//ig,``);
            domain = domain.replace(/^\s*www\./i,``);

            let
                alias = domain
            ;

            domain = "www."+domain;

            (function phpVersion(){
                that.common.node.readLine.question(`Input PHP version. [default:PHP70] : `, (phpVersion) => {
                    phpVersion = "php70";
                    phpVersion = phpVersion.replace(/^\s*php/i,``);
                    if(phpVersion){
                        if(phpVersion.length  === 1){
                            phpVersion = phpVersion+"0";//  php 70
                        }
                        addHttpConf(phpVersion);
                    }else{
                        phpVersion();
                    }
                });
            })();
            //that.common.node.readLine.close();
            function addHttpConf(phpVersion){
                let
                    domainParse = that.common.tools.develop.parseDomain(domain),
                    domainConf = domainParse[ phpVersion ],
                    tableName = `addweb`,
                    createTable = {}
                ;
                if(!domainConf){
                    for(let p in domainParse){
                        if( p.includes(phpVersion) || phpVersion.includes(p)){
                            domainConf = domainParse[ p ];
                            break
                        }
                    }
                }
                createTable[tableName] = {
                    domain:"text",
                    dir:"text",
                    php:"varchar(20)",
                    java:"varchar(20)"
                };
                that.common.core.sqlite.run((sqlite)=>{
                    sqlite.createTable(createTable,(err)=>{
                        if(err)console.log(err);
                        let
                            domains = null
                        ;
                        for( let p in domainConf ){
                            domains = domainConf[ p ];
                        }
                        let
                            queryDomain = {
                                domain:domains.domain
                            }
                        ;
                        sqlite.query(tableName,queryDomain,(result)=>{
                            if(!result.length){
                                let
                                    addDomain = {
                                        domain:domains.domain,
                                        dir:domains.dir,
                                        php:domains.php,
                                        java:``
                                    }
                                ;
                                sqlite.add(tableName,addDomain,(info)=>{
                                    addConfigFile();
                                });
                            }else{
                                addConfigFile();
                            }
                        });
                    });
                });

                function addConfigFile(){
                    for(let p in domainConf){
                        let
                            oneWeb = domainConf[p]
                        ;
                        let
                            confVHosts = `
# Created At, ${that.common.core.time.format()}
<VirtualHost *:80>
    Include ${oneWeb.phpConf}
    DirectoryIndex index.php index.html index.htm
    DocumentRoot "${that.common.core.file.pathFormat(oneWeb.dir)}/"
    ServerName ${domain}
    ServerAlias ${alias}
</VirtualHost>`;
                        console.log(oneWeb);
                    }
                }
            }
            return;
            let platform_template = "";
            if( !platform.match(/.+/ig) ){
                platform = "php70";
            }

            let platform_match = platform.match(/^php(.+)$/i);
            if( platform_match ){
                if(platform_match.length > 1){
                    platform_template = platform_match[1];
                }
                if(!platform_template) platform_template ="70";
                switch (platform_template){
                    case "52":
                        platform_template =`Include conf/extra/httpd-php-sapi52.conf`
                        break;
                    case "53":
                        platform_template =`Include conf/extra/httpd-php-fcgid53.conf`
                        break;
                    case "54":
                        platform_template =`Include conf/extra/httpd-php-fcgid54.conf`
                        break;
                    case "55":
                        platform_template =`Include conf/extra/httpd-php-fcgid55.conf`
                        break;
                    case "56":
                        platform_template =`Include conf/extra/httpd-php-fcgid56.conf`
                        break;
                    case "71":
                        platform_template =`Include conf/extra/httpd-php-fcgid71.conf`
                        break;
                    case "72":
                        platform_template =`Include conf/extra/httpd-php-fcgid72.conf`
                        break;
                    default:
                        platform_template =`Include conf/extra/httpd-php-fcgid70.conf`
                        break
                }
            }
            let conf_content = fs.readFileSync(conf,"utf8");
            let domain_path = path.join(this.www_root,domain+"/");
            let public_html_path = path.join(domain_path,"/public_html");
            if(conf_content.indexOf(public_html_path) != -1 && conf_content.indexOf(`${domain} ${alias}`) != -1 ){
                console.log(`domain exists!`);
                return;
            }
            let vhosts_conf_path = path.join(this.template,"httpd/vhosts.conf");
            let vhosts =  fs.readFileSync(vhosts_conf_path,"utf-8");
            //,public_html_path,
            let domain_template = vhosts.replace(/\%time\%/ig,func.formatTime());
            domain_template = domain_template.replace(/\%wwwroot\%/ig,public_html_path);
            domain_template = domain_template.replace(/\%domain\%/ig,domain);
            domain_template = domain_template.replace(/\%alias\%/ig,alias);
            domain_template = domain_template.replace(/\%platform_template\%/ig,platform_template);
            domain_template = "\r\n\r\n"+domain_template;
            fs.appendFile(conf, domain_template, function (err) {
                if(err)console.log(err)
                if(!fs.existsSync(public_html_path)){
                    func.mkdir(public_html_path);
                    setTimeout(function(){
                        spawn("explorer",[public_html_path]);
                    },1000)
                }
            });
            //添加本地hosts
            let hosts = appPath.hosts();
            let hosts_point = `\r\n# Time ${func.formatTime()}\r\n127.0.0.1 ${domain}\r\n127.0.0.1 ${alias}`
            fs.appendFile(hosts, hosts_point, function (err) {
                if(err)console.log(err)
            });
            this.server("restart");
            // `
            // # Created At, ${tools.formatTime()}
            // <VirtualHost *:80>
            //     ${platform_template}
            //     DirectoryIndex index.php index.html index.htm
            //     DocumentRoot "${public_html_path}"
            //     ServerName ${domain} ${alias}
            // </VirtualHost>`;
        }

    }

    /**
     * @tools 服务函数.
     * @param type string
     */
    server(type,fn) {
        let cmd=[];
        switch (type){
            case "stop":
                cmd.push(`net stop ${this.server_name}`);
                break;
            case "start":
                cmd.push(`net start ${this.server_name}`);
                break;
            case "restart":
                cmd.push(`net stop ${this.server_name}`);
                cmd.push(`net start ${this.server_name}`);
                break;
        }
        func.exec(cmd);
    }


}