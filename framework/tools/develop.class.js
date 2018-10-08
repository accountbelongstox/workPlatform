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
     * @param domain
     */
    parseDomain(domain){
        let
            that = this,
            wwwroot = that.common.config.platform.base.workDir.wwwroot,
            webDir = that.common.node.path.join(wwwroot,domain),
            EOL = that.common.core.windows.os().EOL,
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
                    domain,
                    dir:webDir,
                    php:p,
                    phpConf:PHP.sourceConf,
                    phpConfDir:PHP.conf,
                    phpIni:PHP.ini,
                    hosts:`127.0.0.1 ${domain} #Add in [ddweb develop addweb] ${that.common.core.time.format()}${EOL}localhost ${domain} #Add in [ddweb develop addweb] ${that.common.core.time.format()}`
                }
            }
        });
        return o;
    }
}