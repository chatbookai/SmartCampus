var util = require("../../utils/util.js");
var bmap = require('../../libs/bmap-wx.min.js');
var MyApp = getApp();

Page({
  data: {
    BMapAK: "Hx1cMSuB2dMPyF7zGBU35Udx40cgkarb", //填写申请到的ak   
    BMapShow: true,
    location: "",
    nickName: "",
    userInfoAvatar: "",
    avatarUrl: "",
    gender: "",
    sex: "",
    openid: "",
    localCacheVersion: '',
    remoteServerVersion: '',
    DANDIAN_SYSTEM_CACHE: '',
    userInfo: '',
    DANDIAN_SYSTEM_QIYEWEIXIN_USERID:'',
  },

  onLoad()            {
    //显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    //如果缓存的数据是完整的,则从缓存中读取相关的数据,不然就重新获取.
    var DANDIAN_SYSTEM_USER_RESOURCE = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (DANDIAN_SYSTEM_USER_RESOURCE.userInfo != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.openid != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.LOGIN_USER_EDUID != ''
    ) {
      getApp().globalData = DANDIAN_SYSTEM_USER_RESOURCE;
    }

    //企业微信中已经认证过的用户名和用户类型 如果是已经认证过的用户并且得到用户类型的用户,则直接进行登录,不需要再次输入用户名和密码
    var DANDIAN_SYSTEM_QIYEWEIXIN_USERID ='';
    var DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE ='';
    var DANDIAN_SYSTEM_QIYEWEIXIN_USER = wx.getStorageSync('DANDIAN_SYSTEM_QIYEWEIXIN_USER') || [];
    if (DANDIAN_SYSTEM_QIYEWEIXIN_USER != undefined
      && DANDIAN_SYSTEM_QIYEWEIXIN_USER.data != undefined
      && DANDIAN_SYSTEM_QIYEWEIXIN_USER.data.userid != ''
    ) {
      DANDIAN_SYSTEM_QIYEWEIXIN_USERID = DANDIAN_SYSTEM_QIYEWEIXIN_USER.data.userid;
      DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE = DANDIAN_SYSTEM_QIYEWEIXIN_USER.data.数字化校园系统用户类型;
      that.data.DANDIAN_SYSTEM_QIYEWEIXIN_USERID = DANDIAN_SYSTEM_QIYEWEIXIN_USERID;
      console.log("DANDIAN_SYSTEM_QIYEWEIXIN_USERID:"+DANDIAN_SYSTEM_QIYEWEIXIN_USERID);
      console.log("DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE:"+DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE);
      if(DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE=="老师"||DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE=="校友") {
        var NEWPASSWORD = util.base64encode(util.base64encode('企业微信已经认证过的用户'));
        that.绑定用户名或学号进行验证_远程服务器校验密码(DANDIAN_SYSTEM_QIYEWEIXIN_USERID,NEWPASSWORD,DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE,'QIYEWEIXIN',DANDIAN_SYSTEM_QIYEWEIXIN_USERID);
      }
      if(DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE=="做过二次关联的老师AA"||DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE=="做过二次关联的学生AA") {
        var NEWPASSWORD = util.base64encode(util.base64encode('企业微信已经认证过的用户'));
        var 数字化校园系统用户名 = DANDIAN_SYSTEM_QIYEWEIXIN_USER.data.数字化校园系统用户名;
        that.绑定用户名或学号进行验证_远程服务器校验密码(数字化校园系统用户名,NEWPASSWORD,DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE,'QIYEWEIXIN',DANDIAN_SYSTEM_QIYEWEIXIN_USERID);
      }
    }
    
    var userInfo        = getApp().globalData.userInfo;
    that.data.userInfo  = getApp().globalData.userInfo;

    //从扩展配置中得到学校的ID值以及其它信息,这个信息每个学校可以不一样.
    //判断是单个小学校模式,还是第三方平台模式
    var SYSTEM_IS_CLOUD = getApp().globalData.SYSTEM_IS_CLOUD;
    var SYSTEM_APPSTORE_ID = getApp().globalData.SYSTEM_APPSTORE_ID;
    var SYSTEM_APPSTORE_TYPE = getApp().globalData.SYSTEM_APPSTORE_TYPE;
    var SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS;
    util.log("SYSTEM_IS_CLOUD:" + SYSTEM_IS_CLOUD);
    util.log("SYSTEM_FORCE_TO_BIND_USER_STATUS:" + SYSTEM_FORCE_TO_BIND_USER_STATUS);
    if (SYSTEM_IS_CLOUD == 0) {
      //非第三方平台模式
    }
    else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_ID == 2 && SYSTEM_FORCE_TO_BIND_USER_STATUS == 3) {
      //单点云校小程序     
    }
    else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_TYPE == "SAAS") {
      //单点云校小程序-一个小程序可以登录所有学校的模式.SAAS模式
    }
    else {
      //第三方平台模式 在此处获取LOGIN_SCHOOL_ID的值.
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      getApp().globalData.LOGIN_SCHOOL_ID = extConfig.attr.login_school_id;
      console.log('**************************'); console.log(extConfig);
    }

    wx.request({
      url: getApp().globalData.SYSTEM_URL + getApp().globalData.MainDataUpdate,
      method: 'POST',
      data: {
        LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
        SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
        SYSTEM_APPSTORE_ID: getApp().globalData.SYSTEM_APPSTORE_ID,
        SYSTEM_APPSTORE_TYPE: getApp().globalData.SYSTEM_APPSTORE_TYPE,
        LOGIN_USER_OPENID: getApp().globalData.openid,
        LOGIN_USER_UNIONID: getApp().globalData.unionid,
        LOGIN_USER_NICKNAME: getApp().globalData.userInfo.nickName,
        LOGIN_USER_CITY: getApp().globalData.userInfo.city,
        LOGIN_USER_PROVINCE: getApp().globalData.userInfo.province,
        LOGIN_USER_COUNTRY: getApp().globalData.userInfo.country,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        var 小程序名称 = data['小程序名称'];
        var 小程序LOGO = data['小程序LOGO'];
        var 小程序认证页介绍 = data['小程序认证页介绍'];
        //小程序认证页介绍 = util.base64decode(小程序认证页介绍);
        小程序认证页介绍 = util.decodehtml(小程序认证页介绍);
        var SYSTEM_IS_CLOUD = getApp().globalData.SYSTEM_IS_CLOUD;
        var SYSTEM_APPSTORE_TYPE = getApp().globalData.SYSTEM_APPSTORE_TYPE;
        if (SYSTEM_APPSTORE_TYPE == "SAAS" && SYSTEM_IS_CLOUD == "1") {
          var PleaseInputYourUserNameValue = "请输入您的用户名@您学校的后缀";
          var PleaseInputYourPasswordValue = "请输入您的密码";
          var IS_PASSWORD_TYPE = "password";
        }
        else      {
          var PleaseInputYourUserNameValue = "请输入您的姓名";
          var PleaseInputYourPasswordValue = "请输入您的身份证号码";
          var IS_PASSWORD_TYPE = "text";
        }
        that.setData({
          IndexLogo: true,
          IsUserAvator: true,
          IndexLogo: getApp().globalData.SYSTEM_URL + 小程序LOGO,
          nickName: that.data.nickName,
          PleaseInputYourUserName: PleaseInputYourUserNameValue,
          PleaseInputYourPassword: PleaseInputYourPasswordValue,
          TextMemo: 小程序认证页介绍,
          userInfoAvatar: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          UserType: '校友',
          IS_PASSWORD_TYPE:'text',
        });
        util.log(data);
        //关闭加载中
        wx.hideLoading();
      },
      fail(res) {
          console.log('MainDataUpdate 请求失败')
      }
    });
    
    //默认启用表单 
    let updateData = {};
    updateData['isFormSubmitButtonDisabled']  = false;
    updateData['isFormSubmitButtonValue'] = '用户登录';
    updateData['SYSTEM_AUTO_MAKE_USER'] = getApp().globalData.SYSTEM_AUTO_MAKE_USER;
    this.setData(updateData);

  },

  onRefresh: function () {
    var that = this;
    that.onLoad();
  },

  切换用户类型: function(e) {
    var that = this;
    var 类型 = e.detail.value;
    var PleaseInputYourUserName = '';
    var PleaseInputYourPassword = '';
    var SYSTEM_IS_CLOUD = getApp().globalData.SYSTEM_IS_CLOUD;
    var SYSTEM_APPSTORE_TYPE = getApp().globalData.SYSTEM_APPSTORE_TYPE;
    var IS_PASSWORD_TYPE = "password";
    if (SYSTEM_APPSTORE_TYPE=="SAAS"&&SYSTEM_IS_CLOUD=="1")        {
      //SAAS
      if (类型 == '老师') {
        PleaseInputYourUserName = "请输入您的用户名@您学校的后缀";
        PleaseInputYourPassword = "请输入您的密码";
      }
      if (类型 == '学生') {
        PleaseInputYourUserName = "请输入您的学号@您学校的后缀";
        PleaseInputYourPassword = "请输入您的密码";
      }
      if (类型 == '家长') {
        PleaseInputYourUserName = "请输入您小孩的学号@您学校的后缀";
        PleaseInputYourPassword = "请输入您的密码";
      }
      if (类型 == '毕业生') {
        PleaseInputYourUserName = "请输入您的姓名@您学校的后缀";
        PleaseInputYourPassword = "请输入您的身份证号码";
        IS_PASSWORD_TYPE = "text";
      }
    }
    else    {
      //第三方平台模式
      if (类型 == '老师') {
        PleaseInputYourUserName = "请输入您的用户名";
        PleaseInputYourPassword = "请输入您的密码";
      }
      if (类型 == '学生') {
        PleaseInputYourUserName = "您输入您的姓名";
        PleaseInputYourPassword = "请输入您的身份证号码";
        IS_PASSWORD_TYPE = "text";
      }
      if (类型 == '家长') {
        PleaseInputYourUserName = "请输入您小孩的学号";
        PleaseInputYourPassword = "请输入您的密码";
      }
      if (类型 == 'BiYeSheng') {
        PleaseInputYourUserName = "您输入您的姓名";
        PleaseInputYourPassword = "请输入您的身份证号码";
        IS_PASSWORD_TYPE = "text";
      }
    }
    
    that.setData({
      PleaseInputYourUserName : PleaseInputYourUserName,
      PleaseInputYourPassword : PleaseInputYourPassword,
      UserType: 类型,
      IS_PASSWORD_TYPE: IS_PASSWORD_TYPE,
    });
    util.log(PleaseInputYourUserName);
  },
  
  绑定用户名或学号进行验证_远程服务器校验密码: function (USER_NAME,PASSWORD,UserType,QIYEWEIXIN,QIYE_USERID) {
    var that = this;
    wx.request({  //提交表单数据
      url: getApp().globalData.SYSTEM_URL + getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_LOGINCHECK,//字段列表
      data: {
        action: 'login',
        UserType: UserType,
        username: USER_NAME,
        password: PASSWORD,
        LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
        SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
        SYSTEM_APPSTORE_ID: getApp().globalData.SYSTEM_APPSTORE_ID,
        SYSTEM_APPSTORE_TYPE: getApp().globalData.SYSTEM_APPSTORE_TYPE,
        LOGIN_USER_OPENID: getApp().globalData.openid,
        LOGIN_USER_UNIONID: getApp().globalData.unionid,
        LOGIN_USER_NICKNAME: getApp().globalData.userInfo.nickName,
        LOGIN_USER_CITY: getApp().globalData.userInfo.city,
        LOGIN_USER_PROVINCE: getApp().globalData.userInfo.province,
        LOGIN_USER_COUNTRY: getApp().globalData.userInfo.country,
        SYSTEM_RUNNING_SYSTEM: QIYEWEIXIN,
        QIYE_USERID: QIYE_USERID,
        rememberMe: true
      },     //
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/json'
      },
      success: function (res)                                                     {
        var ress = res.data;
        var RESULT = ress['status'];
        if (RESULT=="OK")           {
          //进行赋值
          getApp().globalData.userInfo = that.data.userInfo;
          getApp().globalData.LOGIN_USER_ID     = ress['userData']['USER_ID'];
          getApp().globalData.LOGIN_USER_UID    = ress['userData']['id'];
          getApp().globalData.LOGIN_USER_EDUID  = ress['userData']['USER_ID'];
          getApp().globalData.LOGIN_USER_NAME   = ress['userData']['USER_NAME'];
          getApp().globalData.LOGIN_USER_TYPE   = ress['userData']['type'];
          getApp().globalData.LOGIN_DEPT_ID     = ress['userData']['DEPT_ID'];
          getApp().globalData.LOGIN_DEPT_NAME   = ress['userData']['DEPT_NAME'];
          getApp().globalData.LOGIN_USER_PRIV   = ress['userData']['USER_PRIV'];
          getApp().globalData.LOGIN_THEME       = 1;
          getApp().globalData.LOGIN_ACCESS_TOKEN  = ress['accessToken'];
          getApp().globalData.LOGIN_PRIV_NAME   = ress['userData']['PRIV_NAME'];
          getApp().globalData.LOGIN_USER_PROFILE = ress['USER_PROFILE'];
          
          //从扩展配置中得到学校的ID值以及其它信息,这个信息每个学校可以不一样.
          //判断是单个小学校模式,还是第三方平台模式
          var SYSTEM_IS_CLOUD = getApp().globalData.SYSTEM_IS_CLOUD;
          var SYSTEM_APPSTORE_ID = getApp().globalData.SYSTEM_APPSTORE_ID;
          var SYSTEM_APPSTORE_TYPE = getApp().globalData.SYSTEM_APPSTORE_TYPE;
          var SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS;
          util.log("SYSTEM_IS_CLOUD:" + SYSTEM_IS_CLOUD);
          util.log("SYSTEM_FORCE_TO_BIND_USER_STATUS:" + SYSTEM_FORCE_TO_BIND_USER_STATUS);
          if (SYSTEM_IS_CLOUD == 0) {
            //私有部署
          }
          else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_ID == 2 && SYSTEM_FORCE_TO_BIND_USER_STATUS == 3) {
            //单点云校小程序     
          }
          else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_TYPE == "SAAS") {
            //单点云校小程序-一个小程序可以登录所有学校的模式.SAAS模式
            //如果用户登录成功,则在此处重置学校ID的值.
            getApp().globalData.LOGIN_SCHOOL_ID = ress['LOGIN_SCHOOL_ID'];
            getApp().globalData.jianjie.LOGIN_SCHOOL_ID = ress['LOGIN_SCHOOL_ID'];
          }
          else {
            //第三方平台模式 在此处获取LOGIN_SCHOOL_ID的值.
            let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
            getApp().globalData.LOGIN_SCHOOL_ID = extConfig.attr.login_school_id;
            console.log('**************************'); console.log(extConfig);
          }
          //console.log('**************************');console.log(extConfig);

          //进行存储
          wx.setStorageSync('DANDIAN_SYSTEM_USER_RESOURCE', getApp().globalData);
          util.log("DANDIAN_SYSTEM_USER_RESOURCE");
          util.log(getApp().globalData);
          //进行提示
          wx.showToast({
            title: '密码验证正确!',
            icon: 'success',
            duration: 2000,
          });
          //数据提交以后,禁用表单操作按钮.防止二次提交
          let updateData = {};
          updateData['isFormSubmitButtonDisabled']  = true;
          updateData['isFormSubmitButtonValue']     = '密码验证正确!';
          that.setData(updateData);
          //进行跳转
          wx.reLaunch({
            url: '/pages/MainData/index',
          });
        }
        else      {
          //密码验证错误.
          wx.showToast({
            title: ress['msg'],
            icon: 'success',
            duration: 2000,
          });
          util.log(ress);
          let updateData = {};
          updateData['YourUserName'] = '';
          updateData['YourUserPassword'] = '';
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['isFormSubmitButtonValue'] = ress['msg'];//'用户名或密码验证错误,请重新输入后提交!';
          that.setData(updateData);
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'success',
          duration: 2000,
        });
        //启用表单
        let updateData = {};
        updateData['isFormSubmitButtonDisabled']  = false;
        updateData['isFormSubmitButtonValue']     = '提交';
        this.setData(updateData);
      },
    })
  },

  绑定用户名或学号进行验证: function (e) {
    var that = this;
    var USER_NAME = e.detail.value.USER_NAME;
    var PASSWORD = e.detail.value.PASSWORD;
    var UserType = e.detail.value.UserType;
    util.log(e);
    util.log("USER_NAME:" + USER_NAME);
    util.log("UserType:" + UserType);

    if(UserType=="校友")      {
      var 用户名不能为空的提示内容 = "姓名不能为空!";
      var 密码不能为空的提示内容 = "身份证号码不能为空!";
    }
    if(UserType=="老师")      {
      var 用户名不能为空的提示内容 = "用户名不能为空!";
      var 密码不能为空的提示内容 = "密码不能为空!如果是空密码,请先在系统中更改密码再来此处登录.";
    }
    if (USER_NAME === '' || USER_NAME == undefined) {
      wx.showToast({
        title: 用户名不能为空的提示内容,
        icon: 'success',
        duration: 2000,
      });
      return false;
    }
    if (PASSWORD === '' || PASSWORD==undefined)    {
      wx.showToast({
        title: 密码不能为空的提示内容,
        icon: 'success',
        duration: 2000,
      });
      return false;
    }
    //PASSWORD = util.base64encode(util.base64encode(PASSWORD));
    util.log("PASSWORD:" + PASSWORD);
    
    //数据提交以后,禁用表单操作按钮.防止二次提交
    let updateData = {};
    updateData['isFormSubmitButtonDisabled'] = true;
    updateData['isFormSubmitButtonValue'] = '正在验证用户名和密码是否正确,请稍等.';
    that.setData(updateData);
    that.绑定用户名或学号进行验证_远程服务器校验密码(USER_NAME,PASSWORD,UserType,'CHECKUSERANDPASSWORD',that.data.DANDIAN_SYSTEM_QIYEWEIXIN_USERID);
  },

  新生报名登记OPENURL: function (e) {
    var that = this;
    //数据提交以后,禁用表单操作按钮.防止二次提交
    let updateData = {};
    updateData['SYSTEM_AUTO_MAKE_USER_DISABLED'] = true;
    updateData['SYSTEM_AUTO_MAKE_USER'] = '正在打开页面,请稍等.';
    that.setData(updateData);
    //构造URL参数
    var d = new Date();
    var n = d.getTime();
    var targetURL = getApp().globalData.SYSTEM_NEW_STUDENT_URL+"?time="+n;
    var url = "/pages/login/webview?url=" + util.base64encode(targetURL);
    wx.navigateTo({
      url: url,
    });
    util.log(targetURL);
    //恢复原始的值
    updateData['SYSTEM_AUTO_MAKE_USER_DISABLED'] = false;
    updateData['SYSTEM_AUTO_MAKE_USER'] = '新生报名登记';
    that.setData(updateData);
  },

  新生报名登记: function (e) {
    var that = this;
    //数据提交以后,禁用表单操作按钮.防止二次提交
    let updateData = {};
    updateData['SYSTEM_AUTO_MAKE_USER_DISABLED'] = true;
    updateData['SYSTEM_AUTO_MAKE_USER'] = '正在登录,请稍等.';
    that.setData(updateData);

    wx.request({  //提交表单数据
      url: getApp().globalData.SYSTEM_URL + getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_LOGINCHECK,//字段列表
      data: {
        action: 'logincheck',
        UserType: '新生',
        UserTypeAsLogin: '新生报名登记',        
        LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
        SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
        SYSTEM_APPSTORE_ID: getApp().globalData.SYSTEM_APPSTORE_ID,
        SYSTEM_APPSTORE_TYPE: getApp().globalData.SYSTEM_APPSTORE_TYPE,
        LOGIN_USER_OPENID: getApp().globalData.openid,
        LOGIN_USER_UNIONID: getApp().globalData.unionid,
        LOGIN_USER_NICKNAME: getApp().globalData.userInfo.nickName,
        LOGIN_USER_CITY: getApp().globalData.userInfo.city,
        LOGIN_USER_PROVINCE: getApp().globalData.userInfo.province,
        LOGIN_USER_COUNTRY: getApp().globalData.userInfo.country,
      },     //
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var ress = res.data;
        //ress = util.stringToJson(util.base64decode(ress));
        //ress = util.stringToJson(ress);
        var RESULT = ress['status'];
        if (RESULT=="OK")           {
          //进行赋值
          getApp().globalData.userInfo = that.data.userInfo;
          //getApp().globalData.userInfo2 = that.data.userInfo;
          getApp().globalData.LOGIN_USER_ID = ress['userData']['LOGIN_USER_ID'];
          getApp().globalData.LOGIN_USER_UID = ress['userData']['LOGIN_USER_UID'];
          getApp().globalData.LOGIN_USER_EDUID = ress['userData']['LOGIN_USER_EDUID'];
          getApp().globalData.LOGIN_USER_NAME = ress['userData']['LOGIN_USER_NAME'];
          getApp().globalData.LOGIN_USER_TYPE = ress['userData']['LOGIN_USER_TYPE'];
          getApp().globalData.LOGIN_DEPT_ID = ress['userData']['LOGIN_DEPT_ID'];
          getApp().globalData.LOGIN_DEPT_NAME = ress['userData']['LOGIN_DEPT_NAME'];
          getApp().globalData.LOGIN_USER_PRIV = ress['userData']['LOGIN_USER_PRIV'];
          getApp().globalData.LOGIN_THEME = ress['userData']['LOGIN_THEME'];
          getApp().globalData.LOGIN_USER_PROFILE = ress['LOGIN_USER_PROFILE'];
          getApp().globalData.LOGIN_ACCESS_TOKEN  = ress['accessToken'];
          getApp().globalData.LOGIN_PRIV_NAME   = ress['userData']['PRIV_NAME'];
          getApp().globalData.LOGIN_USER_PROFILE = ress['USER_PROFILE'];

          //从扩展配置中得到学校的ID值以及其它信息,这个信息每个学校可以不一样.
          //判断是单个小学校模式,还是第三方平台模式
          var SYSTEM_IS_CLOUD = getApp().globalData.SYSTEM_IS_CLOUD;
          var SYSTEM_APPSTORE_ID = getApp().globalData.SYSTEM_APPSTORE_ID;
          var SYSTEM_APPSTORE_TYPE = getApp().globalData.SYSTEM_APPSTORE_TYPE;
          var SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS;
          util.log("SYSTEM_IS_CLOUD:" + SYSTEM_IS_CLOUD);
          util.log("SYSTEM_FORCE_TO_BIND_USER_STATUS:" + SYSTEM_FORCE_TO_BIND_USER_STATUS);
          if (SYSTEM_IS_CLOUD == 0) {
            //非第三方平台模式
          }
          else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_ID == 2 && SYSTEM_FORCE_TO_BIND_USER_STATUS == 3) {
            //单点云校小程序     
          }
          else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_TYPE == "SAAS") {
            //单点云校小程序-一个小程序可以登录所有学校的模式.SAAS模式
            //如果用户登录成功,则在此处重置学校ID的值.
            getApp().globalData.LOGIN_SCHOOL_ID = ress['LOGIN_SCHOOL_ID'];
            getApp().globalData.jianjie.LOGIN_SCHOOL_ID = ress['LOGIN_SCHOOL_ID'];
          }
          else {
            //第三方平台模式 在此处获取LOGIN_SCHOOL_ID的值.
            let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
            getApp().globalData.LOGIN_SCHOOL_ID = extConfig.attr.login_school_id;
            console.log('**************************'); console.log(extConfig);
          }
          //console.log('**************************');console.log(extConfig);

          //进行存储
          wx.setStorageSync('DANDIAN_SYSTEM_USER_RESOURCE', getApp().globalData);
          util.log("DANDIAN_SYSTEM_USER_RESOURCE");
          util.log(getApp().globalData);
          //进行提示
          wx.showToast({
            title: ress['msg'],
            icon: 'success',
            duration: 2000,
          });
          //数据提交以后,禁用表单操作按钮.防止二次提交
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = true;
          updateData['isFormSubmitButtonValue'] = '密码验证正确!';
          that.setData(updateData);
          //进行跳转
          wx.reLaunch({
            url: '/pages/MainData/index',
          });
        }
        else {
          //密码验证错误.
          wx.showToast({
            title: ress['msg'],
            icon: 'success',
            duration: 2000,
          });
          util.log(ress);
          let updateData = {};
          updateData['YourUserName'] = '';
          updateData['YourUserPassword'] = '';
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['isFormSubmitButtonValue'] = ress['msg'];//'用户名或密码验证错误,请重新输入后提交!';
          that.setData(updateData);
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'success',
          duration: 2000,
        });
        //启用表单
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = false;
        updateData['isFormSubmitButtonValue'] = '提交';
        this.setData(updateData);
      },
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util.log('-------------------------')
    util.log(getApp().globalData)
    var UID = getApp().globalData.LOGIN_USER_UID;
    var sharesource = util.base64encode(util.base64encode(openid));
    var nickName = getApp().globalData.userInfo.nickName
    var Title = getApp().globalData.Title+"(来自["+nickName+"]的分享)"
    return {
      title: Title,
      path: 'pages/MainData/index?sharesource=' + sharesource
    }
  }

})