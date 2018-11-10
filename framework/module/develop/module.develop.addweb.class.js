class DevelopAddWebC{
    /**
     * @func 添加一个网站
     */
    run(args,callback){
        let
            that = this,
            domain = that.load.params.get(`domain`)
        ;
        if(!domain){
            domain = that.load.params.get(2)
        }
        if(!domain){
            that.inputDomain(args,callback);
        }else{
            that.selectPHPVersionAndSetDomain(domain,args,callback);
        }
    }

    //输入一个域名
    inputDomain(args,callback){
        let
            that = this
        ;
        that.load.node.readLine = that.load.node.readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        that.load.node.readLine.question(`Please enter a domain name. (www.xxx.com) : `, (domain) => {
            if(that.load.module_func.develop.is_domain(domain)){
                that.selectPHPVersionAndSetDomain(domain,args,callback);
            }else{
                that.load.module.console.error(`The domain name entered is incorrect, example: www.xxx.com .`);
                that.inputDomain(args,callback);//继续监听输入
            }
        });
    }

    //添加域名到网站
    selectPHPVersionAndSetDomain(domain,args,callback){
        let
            that = this
        ;

        that.option.domain = domain;
        that.option.domain_source = domain;

        that.load.node.readLine.question(`Input PHP version. [default:PHP70] : `, (phpVersion) => {
            phpVersion = "php70";
            phpVersion = phpVersion.replace(/^\s*php/i,``);
            if(phpVersion){
                if(phpVersion.length  === 1){
                    phpVersion = phpVersion+"0";//  php 70
                }
                that.checkTheWebsiteIsExistesOrAddTheWebsite(phpVersion,args,callback);
            }else{
                that.selectPHPVersionAndSetDomain(domain, args,callback);
            }
        });
    }

    //判断是否有该网站的存在
    checkTheWebsiteIsExistesOrAddTheWebsite(phpVersion,args,callback){
        let
            that = this,
            domainParse = that.load.module_func.develop.parseDomain(that.option.domain_source),
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
        /*
        * 判断是否有该数据库
        * 如果没有,则创建 JSON 数据库
        */
        that.load.module.database_json.isTable(tableName,true,(exists)=>{
            let
                domains = null
            ;
            for( let p in domainConf ){
                domains = domainConf[ p ];
            }
            //查找该网站是否已经存在
            that.load.module.database_json.query(tableName,{
                domain:domains.domain
            },[],(result)=>{
                if(!result){
                    let
                        addDomain = {
                            domain : domains.domain,
                            dir : domains.dir,
                            php : domains.php,
                            java : ``
                        }
                    ;
                    that.load.module.database_json.add(tableName,addDomain,(info)=>{
                        that.createConfigContent(domainConf,args,callback);
                    });
                }else{
                    that.createConfigContent(domainConf,args,callback);
                }
            });
        });
    }

    //生成配置文件
    createConfigContent(domainConf,args,callback){
        let
            that = this,
            domainConfs = (()=>{
                let
                    a = []
                ;
                for(let p in domainConf) {
                    a.push(domainConf[p]);
                }
                return a;
            })(),
            restart_apache = false
        ;
        (function createThis(len,apache_restart_token){
            if(!restart_apache) restart_apache = apache_restart_token;
            if(len >= domainConfs.length ){
                that.addWebsiteEnd(args,restart_apache,callback);
            }else{
                let
                    oneWeb = domainConfs[len]
                ;
                let
                    wwwroot = that.load.module.file.pathFormat(oneWeb.dir,"public_html"),
                    confVHosts = `# Created At, ${that.load.module.time.format()}
<VirtualHost *:80>
    Include ${oneWeb.phpConf}
    DirectoryIndex index.php index.html index.htm
    DocumentRoot "${wwwroot}"
    ServerName ${oneWeb.domain}
    ServerAlias ${oneWeb.domains.join(` `)}
</VirtualHost>`,
                    httpdConfDir = that.load.node.path.join(oneWeb.apacheDir,`conf/vhosts/${oneWeb.domain}.conf`)
                ;
                that.createDefaultIndexHTML(wwwroot);
                if(that.load.module.file.isFileSync(httpdConfDir)){
                    that.load.node.readLine.question(`Website is exists, force add (Y|N)? (default N): `, (force) => {
                        if(force.toLowerCase() === "y"){
                            that.addWebsiteToHttpdConf(httpdConfDir,wwwroot,oneWeb,confVHosts,()=>{
                                createThis(++len,true);
                            });
                        }else{
                            createThis(++len,false);
                        }
                    });
                }else{
                    that.addWebsiteToHttpdConf(httpdConfDir,wwwroot,oneWeb,confVHosts,()=>{
                        createThis(++len,true);
                    });
                }
            }
        })(0,false);
    }

    //添加网站到CONF文件
    addWebsiteToHttpdConf(httpdConfDir,wwwroot,oneWeb,confVHosts,callback){
        let
            that = this
        ;
        that.load.module.console.info(`create conffile => ${httpdConfDir}`,5);
        if(!that.load.module.file.isDirSync(wwwroot)){
            that.load.module.file.mkdirSync(wwwroot);
        }
        that.load.module.file.writeFileSync(httpdConfDir,confVHosts);
        oneWeb.domains.unshift(that.option.domain_source);
        (function setHosts(len){
            if(len >= oneWeb.domains.length){
                if(callback)callback();
            }else{
                let
                    domain = oneWeb.domains[len]
                ;
                that.load.module.windows.setHosts(`127.0.0.1`,domain,true,()=>{
                    setHosts(++len);
                });
            }
        })(0);
    }

    //创建一个默认首页
    createDefaultIndexHTML(wwwroot_dir){
        let
            that = this
        ;
        that.load.module.file.mkdirSync(wwwroot_dir);
        let
            HTML_content = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
 <head>
  <title>index page!</title>
 </head>
 <body>
<h1> success !</h1>
  <table>
   <tr>
   <th><a href="javascript:;">DDWEB.com.cn</a></th>
   </tr>
   <tr><th colspan="5"><hr></th></tr>
   <tr><th colspan="5"><hr></th></tr>
</table>
</body></html>
`           ,
            www_root_default_page = that.load.node.path.join(wwwroot_dir,`index.html`),
            www_root_files = that.load.node.fs.readdirSync(wwwroot_dir)
        ;
        if(!www_root_files.length){
            that.load.module.file.writeFileSync(www_root_default_page,HTML_content);
        }
    }

    //结束网站添加
    addWebsiteEnd(args,restart_apache,callback){
        let
            that = this
        ;
        that.load.node.readLine.close();
        if(restart_apache){
            that.load.module.windows.restartService("httpd",(err)=>{
                that.load.node.readLine.close();
                that.option.domain_source = null;
                that.end_info();
                if(callback)callback();
            });
        }else{
            that.end_info();
            if(callback)callback();
        }
    }

    //结束提示
    end_info(){
        let
            that = this
        ;
        that.load.module.console.success(`the website add success!`);
    }
}

module.exports = DevelopAddWebC;