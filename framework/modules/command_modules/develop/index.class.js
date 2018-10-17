class developC{
	constructor(o){
        
        
        
        
        

        
        

        
        
    }

    run(){
        let
            that = this
        ;
        that.o.node.readLine = that.o.node.readline.createInterface({
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
            domain = that.o.params.get(`domain`),
            isDomain = /[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\-\_]+/i
        ;
        if(!domain){
            domain = that.o.params.get(2)
        }
        if(!domain){
            (function inputDomain(){
                that.o.node.readLine.question(`Please enter a domain name. (www.xxx.com) : `, (domainInput) => {
                    if(isDomain.test(domainInput)){
                        domain = domainInput;
                        addWebDomain(domain);
                    }else{
                        that.o.tool.console.error(`The domain name entered is incorrect, example: www.xxx.com .`);
                        inputDomain();
                    }
                });
            })();
        }else{
            addWebDomain(domain);
        }

        function addWebDomain(domainSource){
            (function phpVersion(){
                that.o.node.readLine.question(`Input PHP version. [default:PHP70] : `, (phpVersion) => {
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
            //that.o.node.readLine.close();
            function addHttpConf(phpVersion){
                let
                    domainParse = that.o.func.develop.parseDomain(domainSource),
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
                that.o.tool.sqlite.run();
                that.o.tool.sqlite.isTable(tableName,true,(exists)=>{
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
                    that.o.tool.sqlite.query(tableName,queryDomain,(result)=>{
                        if(!result){
                            let
                                addDomain = {
                                    domain:domains.domain,
                                    dir:domains.dir,
                                    php:domains.php,
                                    java:``
                                }
                            ;
                            that.o.tool.sqlite.add(tableName,addDomain,(info)=>{
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
                            wwwroot = that.o.tool.file.pathFormat(oneWeb.dir),
                            confVHosts = `# Created At, ${that.o.tool.time.format()}
<VirtualHost *:80>
    Include ${oneWeb.phpConf}
    DirectoryIndex index.php index.html index.htm
    DocumentRoot "${wwwroot}"
    ServerName ${oneWeb.domain}
    ServerAlias ${oneWeb.domains.join(` `)}
</VirtualHost>`,
                            httpdConfDir = that.o.node.path.join(oneWeb.apacheDir,`conf/vhosts/${oneWeb.domain}.conf`)
                        ;
                        that.o.tool.console.info(`create conffile => ${httpdConfDir}`,5);
                        if(!that.o.tool.file.isDirSync(wwwroot)){
                            that.o.tool.file.mkdirSync(wwwroot);
                        }
                        that.o.tool.file.writeFileSync(httpdConfDir,confVHosts);
                        oneWeb.domains.unshift(domain);
                        oneWeb.domains.forEach((domain)=>{
                            that.o.tool.windows.setHosts(`127.0.0.1`,domain,true);
                        });
                    }

                    that.o.node.readLine.close();
                    that.o.tool.windows.restartService("httpd",(err)=>{
                        that.o.node.readLine.close();
                    });
                }
            }
        }
    }
}

module.exports =  developC;