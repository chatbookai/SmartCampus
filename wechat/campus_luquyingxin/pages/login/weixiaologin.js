// pages/shuju/index.js
var util = require("../../utils/util.js");
var bmap = require('../../libs/bmap-wx.min.js');
var MyApp = getApp();
var globalDataConst = getApp().globalData;

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    BMapAK: "Hx1cMSuB2dMPyF7zGBU35Udx40cgkarb", //填写申请到的ak   
    BMapShow: true,
    location: "",
    nickName: "",
    userInfoAvatar: "",
    avatarUrl: "",
    gender: "",
    sex: "",
    openid: "",
    unionid:"",
    localCacheVersion: '',
    remoteServerVersion: '',
    DANDIAN_SYSTEM_CACHE: '',
    userInfo: '',
    SYSTEM_FORCE_TO_BIND_USER_STATUS:'',
    isClick: 0,
    appKey:"E8641859B941D643",
  },

  onLoad() {

    var that = this;
    that.setData({
      isFormSubmitButtonDisabled: true,
      IntroHiddenPriv: true,
      ShouQuanDengLu: '授权登录',
      chooseSchool: false,
      weixiaoLogin: true,
      schoolCode: "",
      openid: "oRnlt5YYANtHKTqFltsF0O4wcKqY",
      appSecret: "AA700C2489702FD4BD05C1531BC73B2F",
      appKey: that.data.appKey,
    });

    //如果缓存的数据是完整的,则从缓存中读取相关的数据,不然就重新获取.
    var DANDIAN_SYSTEM_USER_RESOURCE = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (DANDIAN_SYSTEM_USER_RESOURCE.userInfo != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.openid != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.LOGIN_USER_EDUID != ''
    ) {
      //从缓存中获取
      getApp().globalData = DANDIAN_SYSTEM_USER_RESOURCE;
    }
    else {
      //从页面最顶部的变量中获取.
      getApp().globalData = globalDataConst;      
    }

    var userInfo = getApp().globalData.userInfo;
    that.data.userInfo = getApp().globalData.userInfo;

  },

  选择学校_得到信息: function (e) {
    var that = this;
    var detail = e.detail;
    var schoolCode = detail.schoolCode;
    var schoolName = detail.schoolName;
    getApp().globalData.schoolCode = schoolCode;
    getApp().globalData.schoolName = schoolName;

    var openid = 'oRnlt5YYANtHKTqFltsF0O4wcKqY';
    getApp().globalData.openid = openid;
    var appKey = that.data.appKey;

    wx.setStorageSync('DANDIAN_SYSTEM_USER_RESOURCE', getApp().globalData);
    util.log(e);
  },

  选择学校_取消: function (e) {
    util.log(e);
  },

  选择学校_错误: function (e) {
    util.log(e);
  },

  腾讯微卡_校验学生: function (e) {
    util.log(e);
  },

  腾讯微卡_取消登录: function (e) {
    util.log(e);
  },

  腾讯微卡_选择得到信息: function (e) {
    util.log(e);
  },

  腾讯微卡_选择取消: function (e) {
    util.log(e);
  },

  腾讯微卡_选择错误信息: function (e) {
    util.log(e);
  },

  getUserSessionKey_storage: function (code) {
    //得到用户的OPENID并且进行得到用户的菜单信息.
    var that = this;
    var res = wx.getSystemInfoSync();
    var currentDeviceInfo = {};
    currentDeviceInfo.model = res.model;//手机型号
    currentDeviceInfo.pixelRatio = res.pixelRatio;//设备像素比
    currentDeviceInfo.windowWidth = res.windowWidth;//屏幕宽度
    currentDeviceInfo.windowHeight = res.windowHeight;//屏幕高度
    currentDeviceInfo.language = res.language;//微信语言
    currentDeviceInfo.version = res.version;//微信版本号
    currentDeviceInfo.platform = res.platform;//客户端平台
    currentDeviceInfo.system = res.system;//操作系统版本
    currentDeviceInfo.versSDKVersionion = res.SDKVersion;//微信客户端基础库版本

    //每次获取到的CODE都不一样,所以CODE不能进行缓存,经过CODE的中间层转换一次,再来得到OPENID的值.
    //先把CODE的值赋值给全局变量
    getApp().globalData.usercode = code;
    //然后获取用户的信息以及OPENID
    //getApp().globalData.SYSTEM_URL + 
    wx.request({
      url: 'https://wx.dandian.net/general/EDU/Interface/TDFORMWECHAT/system_get_openid_by_code.php',
      method: 'POST',
      data: {
        code: code,
        LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
        SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
        SYSTEM_APPSTORE_ID: getApp().globalData.SYSTEM_APPSTORE_ID,
        SYSTEM_APPSTORE_TYPE: getApp().globalData.SYSTEM_APPSTORE_TYPE,
        SYSTEM_FORCE_TO_BIND_USER_STATUS: getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS,
        userinfo: JSON.stringify(getApp().globalData.userInfo),
        currentDeviceInfo: JSON.stringify(currentDeviceInfo),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if (data.errcode > 0) {
          wx.showToast({
            mask: true,
            icon: 'success',
            title: data.errmsg,
            duration: 2000
          });
          return false;
        }
        //log("OPENID:" + data.openid); //log(getApp().globalData.userInfo); log(currentDeviceInfo);
        //log("code:" + code); //log(getApp().globalData.userInfo); log(currentDeviceInfo);
        //log(data); //log(getApp().globalData.userInfo); log(currentDeviceInfo);
        if (data.session_key != "") {
          getApp().globalData.sessionkey = data.session_key;
        }
        if (data.openid != "") {
          //存储OPENID
          getApp().globalData.openid = data.openid;
          getApp().globalData.unionid = data.unionid;
          getApp().globalData.session_key = data.session_key;
          getApp().globalData.currentDeviceInfo = currentDeviceInfo;
          wx.setStorageSync('DANDIAN_SYSTEM_USER_RESOURCE', getApp().globalData);
          //log("data.openid:" + data.openid);
          //log("data.session_key:" + data.session_key);
          //log(getApp().globalData);
          //当不需要进行用户关联时,自动把unionid转为用户名
          if (getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS == 3 && getApp().globalData.SYSTEM_APPSTORE_ID == 2)      {
            //util.log(getApp().globalData.jianjie.SYSTEM_FORCE_TO_BIND_USER_STATUS);
            getApp().globalData.LOGIN_USER_ID = data._SESSION.LOGIN_USER_ID;
            getApp().globalData.LOGIN_USER_EDUID = data._SESSION.LOGIN_USER_EDUID;
            getApp().globalData.jianjie.LOGIN_SCHOOL_ID = data._SESSION.LOGIN_SCHOOL_ID;
            getApp().globalData.jianjie.学校ID = data._SESSION.LOGIN_SCHOOL_ID;
            getApp().globalData.LOGIN_SCHOOL_ID = data._SESSION.LOGIN_SCHOOL_ID;
            getApp().globalData.LOGIN_ACCESS_TOKEN = data._SESSION.LOGIN_ACCESS_TOKEN;
            getApp().globalData.LOGIN_USER_NAME = data._SESSION.LOGIN_USER_NAME;
            getApp().globalData.LOGIN_THEME = data._SESSION.LOGIN_THEME;
            getApp().globalData.LOGIN_USER_PROFILE = data.LOGIN_USER_PROFILE;
            //进行存储
            wx.setStorageSync('DANDIAN_SYSTEM_USER_RESOURCE', getApp().globalData);
            //util.log("****************************************************");
            //util.log(getApp().globalData);
            //util.log(getApp().globalData.LOGIN_SCHOOL_ID);
            //util.log(data.LOGIN_SCHOOL_ID);
            //util.log(data);
          }
          var SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS;
          var LOGIN_USER_EDUID = getApp().globalData.LOGIN_USER_EDUID;
          if (SYSTEM_FORCE_TO_BIND_USER_STATUS == "1" && (LOGIN_USER_EDUID == '' || LOGIN_USER_EDUID == null || LOGIN_USER_EDUID == undefined)) {
            //需要延时执行两秒,不然数据会同步不上来.
            setTimeout(function () {
              //跳转到用户绑定页面,进行强制用户绑定操作.
              wx.navigateTo({
                url: '/pages/login/logincheck',
              })
            }, 1000);
            return false;
          }
          else {
            //需要延时执行两秒,不然数据会同步不上来.
            setTimeout(function () {
              //回到首页,目前机制不需要强制绑定用户
              wx.reLaunch({
                url: '/pages/MainData/index',
              })
            }, 1000);
            return false;
          }
        }
      },
      fail(res) {
          console.log('getUserSessionKey_storage 请求失败')
      }

    });

  },

  CheckCheckboxProtocolSatus(e) {
    var that = this;
    //点击文字时的处理
    var TextValue         = e.currentTarget.dataset.id;    
    if (TextValue == "agree")   {                     
      that.data.isClick   = that.data.isClick + 1;
      util.log(that.data.isClick % 2);
      //显示或是停用授权登录按钮
      if (that.data.isClick % 2 == 1) {
        that.setData({
          isFormSubmitButtonDisabled: false,
          CheckedBoxIsChecked: true,
        })
      }
      else {
        that.setData({
          isFormSubmitButtonDisabled: true,
          CheckedBoxIsChecked: false,
        })
      }
    }
    else    {
      //点击按钮时的处理
      var ButtonValue = e.detail.value;
      if (ButtonValue != undefined && ButtonValue[0] == "agree") {
        that.data.isClick = that.data.isClick + 1;
        that.setData({
          isFormSubmitButtonDisabled: false,
          CheckedBoxIsChecked: true,
        })
      }
      else {
        that.data.isClick = that.data.isClick + 1;
        that.setData({
          isFormSubmitButtonDisabled: true,
          CheckedBoxIsChecked: false,
        })
      }
    }    
  },

  查看HTML文本: function (e) {
    var that = this;
    var 显示标题 = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/login/htmlview?action=' + 显示标题,
    });
    return false;
  },

  bindGetUserInfo(e)       {
    var that = this;
    that.setData({
      isFormSubmitButtonDisabled: true,
      ShouQuanDengLu: '正在页面授权中...',
    });

    var SYSTEM_FORCE_TO_BIND_USER_STATUS = that.data.SYSTEM_FORCE_TO_BIND_USER_STATUS;
    var LOGIN_USER_EDUID = getApp().globalData.LOGIN_USER_EDUID;
    util.log("SYSTEM_FORCE_TO_BIND_USER_STATUS:" + SYSTEM_FORCE_TO_BIND_USER_STATUS);
    util.log("LOGIN_USER_EDUID:" + LOGIN_USER_EDUID);
    
    //如果有值,则进入下一步.
    if (e.detail.userInfo != undefined) {
      //按钮文字修改.
      that.setData({
        isFormSubmitButtonDisabled: true,
        ShouQuanDengLu: '正在为您跳转页面中...',
      });
      //进行存储
      getApp().globalData.userInfo = e.detail.userInfo;
      var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
      var currentPage = pages[pages.length - 1]  // 获取当前页面
      var prevPage = pages[pages.length - 2]    //获取上一个页面
      // 设置上一个页面的数据（可以修改，也可以新增）
      if (prevPage!=undefined)        {
        prevPage.setData({
          userInfoAvatar: getApp().globalData.userInfo.avatarUrl,
          nickName: getApp().globalData.userInfo.nickName,
        })
      }
      wx.login({
        success: function (res) {
          var code = res.code;
          that.getUserSessionKey_storage(code);
        }
      });
    }
    else      {
      that.setData({
        isFormSubmitButtonDisabled: false,
        ShouQuanDengLu: '授权已取消,再次点击进行授权',
      });
      /*
      //授权登录时,用户点击拒绝.
      var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
      var currentPage = pages[pages.length - 1]  // 获取当前页面
      var prevPage = pages[pages.length - 2]    //获取上一个页面
      // 设置上一个页面的数据（可以修改，也可以新增）
      prevPage.onLoad();
      wx.navigateBack({
        delta: 1
      })
      */
    }
  },

})