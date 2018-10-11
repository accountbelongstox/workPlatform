class developC{
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
                    tableName = `addweb`
                ;
                if(!domainConf){
                    for(let p in domainParse){
                        if( p.includes(phpVersion) || phpVersion.includes(p)){
                            domainConf = domainParse[ p ];
                            break
                        }
                    }
                }
                //运行SQLITE数据库
                that.common.core.sqlite.run();
                that.common.core.sqlite.isTable(tableName,true,(exists)=>{
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
                    that.common.core.sqlite.query(tableName,queryDomain,(result)=>{
                        if(!result){
                            let
                                addDomain = {
                                    domain:domains.domain,
                                    dir:domains.dir,
                                    php:domains.php,
                                    java:``
                                }
                            ;
                            that.common.core.sqlite.add(tableName,addDomain,(info)=>{
                                addConfigFile();
                            });
                        }else{
                            addConfigFile();
                        }
                    });
                });
                function addConfigFile(){
                    for(let p in domainConf){
                        let
                            oneWeb = domainConf[p]
                        ;
                        let
                            wwwroot = that.common.core.file.pathFormat(oneWeb.dir),
                            confVHosts = `
# Created At, ${that.common.core.time.format()}
<VirtualHost *:80>
    Include ${oneWeb.phpConf}
    DirectoryIndex index.php index.html index.htm
    DocumentRoot "${wwwroot}"
    ServerName ${domain}
    ServerAlias ${alias}
</VirtualHost>`,
                            domainConfName = domain.replace(/[^a-zA-Z0-9]+/ig,`_`),
                            httpdConfDir = that.common.node.path.join(oneWeb.apacheDir,`conf/vhosts/${domainConfName}.conf`)
                        ;
                        if(!that.common.core.file.isDirSync(wwwroot)){
                            that.common.core.file.mkdirSync(wwwroot);
                        }
                        that.common.core.file.writeFileSync(httpdConfDir,confVHosts);
                    }

                    that.common.node.readLine.close();
                    that.common.core.windows.restartService("httpd",(err)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }
        }
    }
}

module.exports =  developC;