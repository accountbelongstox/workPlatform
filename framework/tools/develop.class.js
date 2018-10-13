module.exports = class developC{

    constructor(common){
        common.get_config();

        common.get_node(`path`);

        common.get_core(`time`);
        common.get_core(`windows`);
        common.get_tools(`config`);
    }

    /**
     * @func 解析域名到域名列表
     * @param domainSource 源域名
     */
    parseDomain(domainSource){


        let
            that = this,
            domains = (function (){
                let
                    domainTmp = domainSource.toLowerCase(),
                    isFullDomain = /[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\-\_]+/i,
                    isBeforeDomain = /^[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\-\_]+$/i,
                    isPersonDomain = /^[a-zA-Z0-9\-\_]+$/i,
                    domains = [],
                    domainTmpSouce = ``
                ;
                domainTmp = that.common.core.string.trimX(domainTmp,`.`);
                domainTmp = domainTmp.replace(/^\s*http\:\/\//ig,``);
                domainTmpSouce += domainTmp;
                domainTmp = domainTmp.replace(/^\s*www\./i,``);//首先替换掉www.开头

                if(isFullDomain.test(domainTmp)){ //如果替换后还是一个完整的域名,则添加未替换www.前的源域名
                    domains.push(domainTmpSouce);
                }else if(isBeforeDomain.test(domainTmp)){//如果替换后是 xxx.xxx 则前面要加www. 同时生成一个.localhost的域名
                    let
                        localhostDomain = domainTmp.replace(/\..+$/,".localhost"),//xxx.localhost
                        aliasLocalDomain = "www."+localhostDomain,//www.xxx.localhost
                        alias = "www."+domainTmp//www.xxx.xxx
                    ;
                    domains.push(aliasLocalDomain);
                    domains.push(localhostDomain);
                    domains.push(alias);
                }else if(isPersonDomain.test(domainTmp)){//如果替换后只有域名身体部分 xxx ,则要添加前缀www. 和后缀 .hosts
                    let
                        localhostDomain = domainTmp+".localhost",
                        fullDomain = "www."+localhostDomain
                    ;
                    domains.push(fullDomain);
                    domains.push(localhostDomain);
                }
                domains = that.common.core.array.unique(domains);
                that.common.core.console.info(`create domain "${domains.join(` `)}"`,5);
                return domains
            })(),
            domain = domains.splice(0,1)[0],
            wwwroot = that.common.config.platform.base.workDir.wwwroot,
            webDir = that.common.node.path.join(wwwroot,domain),
            apacheVersions = that.common.tools.config.GetVersionFull(`httpd`),
            o = {}
        ;
        apacheVersions.forEach((apache)=>{
            let
                PHPs = that.common.tools.config.GetOrAddMultiPHPsApiAndFCgiDConf(apache,false,false),
                apacheVersion = that.common.tools.config.formatApacheVersion(apache)
            ;
            for(let p in PHPs){
                let
                    PHP = PHPs[p]
                ;
                if(!o[p])o[p] = {};
                o[p][apacheVersion] = {
                    apache:apacheVersion,
                    apacheDir:apache,
                    domains,
                    domain,
                    dir:webDir,
                    php:p,
                    phpConf:PHP.sourceConf,
                    phpConfDir:PHP.conf,
                    phpIni:PHP.ini
                }
            }
        });
        return o;
    }
}