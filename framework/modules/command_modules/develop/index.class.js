const fs = require('fs');
const path = require('path');
const url = require('url');
const appPath = require('../../core/app.path.class').get();
const func = require(appPath.func);
const { spawn } = require('child_process');


class index{
	
	constructor(){
        this.server_name = "httpd";
        this.www_root = path.join("D:","www_root");
        this.platform = {
			/*支持的编程平台*/
            "php": ["php52", "php53", "php54", "php55", "php56", "php70", "php71", "php72"]
        }
        this.template = path.join(appPath.command_modules,"./httpd/template/");
    }

    /**
     * @tools 添加一个本地网站
     * @param web_url
     */
    run(domain,platform="php70"){
        let conf = path.join(appPath.httpd,"./conf/extra/httpd-vhosts.conf");
        domain = domain.toLowerCase();
        if(!domain.match(/(?<=[^www\.])\.[a-z0-9]+$/)){
            domain = domain+".locahost"
        }
        let alias="";
        if(!domain.match(/^www\./i)){
            alias = "www."+domain;
        }else{
            alias = domain.replace(/\.[a-z0-9]+$/,"");
        }

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

module.exports = new index