// 王纪云 20190823
App({
  globalData: {
    isLog:true,
    openid: '',
    unionid: '',
    session_key:"",
    userInfo: null,
    usercode:"",
    sessionkey: '',
    schoolCode: '',
    schoolName: '',
    Title: '新生报名缴费',
    LOGIN_SCHOOL_ID: '0',
    LOGIN_USER_ID: '',
    LOGIN_USER_UID: '',
    LOGIN_USER_EDUID: '',
    LOGIN_USER_NAME: '',
    LOGIN_USER_TYPE: '',
    LOGIN_USER_PROFILE: [],
    LOGIN_DEPT_ID: '',
    LOGIN_DEPT_NAME: '',
    LOGIN_USER_PRIV: '',
    LOGIN_PRIV_NAME: '',
    LOGIN_THEME: '',
    LOGIN_ACCESS_TOKEN: '',
    
    SYSTEM_IS_CLOUD: "0",//固定值,基于云端模式的,而不是单个学校.因为云端模式的系统会调用不同的用户表和部门表.0代表单个学校 1代表基于云端的模式
    SYSTEM_APPSTORE_ID: "1",//一个学校可以拥有多个微信小程序,这个ID就是微信小程序记录表里面记录的ID
    SYSTEM_APPSTORE_TYPE: "私有部署",//需要修改 修改为此处来判断是否为SAAS模式
    SYSTEM_URL: "https://wx.dandian.net/api",//需要修改: https://wx.dandian.net http://localhost/api
    SYSTEM_AUTO_MAKE_USER: "新生报名登记",//像录取迎新之类的,可以自动生成一个用户出来.
    SYSTEM_NEW_STUDENT_URL: "https://wx.dandian.net/apps/342/",//像录取迎新之类的,打开一个HTML页面.
    SYSTEM_VERSION: "20230805",//需要修改:
    SYSTEM_RUNNING_SYSTEM: "WEIXIN",//需要修改:QIYEWEIXIN

    MainDataList: "/wechat/wechat.campus_zhaoshengjiaofei.php?action=maindata",//需要修改:
    MainDataUpdate: "/wechat/wechat.campus_zhaoshengjiaofei.php?action=update",//需要修改:
    PayMentInterface: "/wechat/wechat.campus_zhaoshengjiaofei.payment.php",//需要修改:
    PayMentInterface_xuefei: "/wechat/wechat.campus_zhaoshengjiaofei_xuefei_gaozhong.payment.php",//需要修改:
    PayMentInterface_qita: "/wechat/wechat.campus_zhaoshengjiaofei_qita_gaozhong.payment.php",//需要修改:
    SYSTEM_LOGO_DEDEAULT_URL: "",//从掊口中获取,然后存到了缓存中.
    SYSTEM_FORCE_TO_BIND_USER_STATUS: "1",//3代表所有的模块不要求强制用户名和密码登录
    SYSTEM_FORCE_TO_BIND_USER_LOGINCHECK: "/jwt.php?action=login",//需要修改:
    //此链接为云端模式下面的校验地址,如果是单用户模式,请换用:wechat.icampus.logincheck.php
    statusBarHeight: '20px', //px单位
    navigationBarHeight: '44px', //px自定义单位
    headBarHeight: "64px",
  },
  
  onLaunch: function ()                           {   
    wx.getSystemInfo({
      success: res => {
        this.globalData.statusBarHeight = res.statusBarHeight + 'px';
        this.globalData.headBarHeight = (res.statusBarHeight + 44) + 'px';
      },
    }) 
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

});