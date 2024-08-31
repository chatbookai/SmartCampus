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
    isClick:0,
  },

  onLoad: function (options) {
    //初始化getApp().globalData的值.
    //getApp().globalData = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    let schoolCode = decodeURIComponent(options.scene); 
    util.log("schoolCode:"+schoolCode);
    getApp().globalData.schoolCode = schoolCode; 

    //let schoolName = decodeURIComponent(options.schoolName); 
    //util.log("schoolName:"+schoolName);
    //getApp().globalData.schoolName = schoolName; 
    
    //获取当前小程序的appId
    const accountInfo = wx.getAccountInfoSync();
    getApp().globalData.appId = accountInfo.miniProgram.appId;

    //显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    //判断是普通微信还是企业微信
    wx.getSystemInfo({
      success (res) {
        console.log("是否企业微信:"+res.environment);
        if(res.environment=="wxwork")         {
          //企业微信小程序,额外增加的这一部分代码.
          wx.qy.login({
            success: function(res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: getApp().globalData.SYSTEM_URL + '/general/EDU/Interface/TDFORMWECHAT/qiyeweixin_get_openid_by_code.php',
                  method: 'GET',
                  data: {
                    code: res.code,
                    SYSTEM_IS_CLOUD:getApp().globalData.SYSTEM_IS_CLOUD,
                    SYSTEM_APPSTORE_ID:getApp().globalData.SYSTEM_APPSTORE_ID,
                    SYSTEM_RUNNING_SYSTEM:getApp().globalData.SYSTEM_RUNNING_SYSTEM,
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function (res) {
                    //把结果写入本地缓存,供用户名和密码页面来调用
                    wx.setStorageSync('DANDIAN_SYSTEM_QIYEWEIXIN_USER', res);
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          });
        }
      }
    }); //end wx.getSystemInfo

    var that = this;
    that.setData({
      isFormSubmitButtonDisabled: true,
      IntroHiddenPriv:true,
      ShouQuanDengLu:'授权登录',
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

    var userInfo = getApp().globalData.userInfo;
    that.data.userInfo = getApp().globalData.userInfo;

    //util.log(getApp().globalData.SYSTEM_URL + getApp().globalData.SYSTEM_LOGO_DEDEAULT_URL);
    //从扩展配置中得到学校的ID值以及其它信息,这个信息每个学校可以不一样.
    //判断是单个小学校模式,还是第三方平台模式
    var SYSTEM_IS_CLOUD = getApp().globalData.SYSTEM_IS_CLOUD;
    var SYSTEM_APPSTORE_ID = getApp().globalData.SYSTEM_APPSTORE_ID;
    var SYSTEM_APPSTORE_TYPE = getApp().globalData.SYSTEM_APPSTORE_TYPE;
    var SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS;
    util.log("SYSTEM_IS_CLOUD:" + SYSTEM_IS_CLOUD);
    util.log("SYSTEM_FORCE_TO_BIND_USER_STATUS:" + SYSTEM_FORCE_TO_BIND_USER_STATUS);
    if (SYSTEM_IS_CLOUD==0)      {
      //非第三方平台模式
    } 
    else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_ID == 2 && SYSTEM_FORCE_TO_BIND_USER_STATUS == 3) {
      //单点云校小程序     
    }
    else if (SYSTEM_IS_CLOUD == 1 && SYSTEM_APPSTORE_TYPE == "SAAS") {
      //单点云校小程序-一个小程序可以登录所有学校的模式.SAAS模式
    }
    else    {
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
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        var 小程序名称 = data['小程序名称'];
        var 小程序LOGO = data['小程序LOGO'];
        var SYSTEM_FORCE_TO_BIND_USER_STATUS = data['SYSTEM_FORCE_TO_BIND_USER_STATUS'];
        that.data.SYSTEM_FORCE_TO_BIND_USER_STATUS = SYSTEM_FORCE_TO_BIND_USER_STATUS;
        var 小程序首页面介绍 = data['小程序首页面介绍']; 
        //小程序首页面介绍 = util.base64decode(小程序首页面介绍);
        小程序首页面介绍 = util.decodehtml(小程序首页面介绍);
        that.setData({
          IndexLogo: getApp().globalData.SYSTEM_URL + 小程序LOGO,
          TextMemo: 小程序首页面介绍,
          IntroHiddenPriv: false,
        });
        //关闭加载中
        wx.hideLoading();
        //util.log(data);
        //进行缓存
        getApp().globalData.jianjie = data;        
        //重置用户名为空,不然会造成刚登录以后的用户,再次退后后,进行登录的时候,无法到用户名和密码输入的页面.
        getApp().globalData.LOGIN_USER_ID     = '';
        getApp().globalData.LOGIN_USER_EDUID  = '';
        getApp().globalData.LOGIN_USER_NAME   = '';
        wx.setStorageSync('DANDIAN_SYSTEM_USER_RESOURCE', getApp().globalData);
      },

    });

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
      console.log("DANDIAN_SYSTEM_QIYEWEIXIN_USERID:"+DANDIAN_SYSTEM_QIYEWEIXIN_USERID);
      console.log("DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE:"+DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE);
    }

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
        SYSTEM_RUNNING_SYSTEM: getApp().globalData.SYSTEM_RUNNING_SYSTEM,
        LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
        SYSTEM_IS_CLOUD: 1,
        SYSTEM_APPSTORE_ID: getApp().globalData.SYSTEM_APPSTORE_ID,
        SYSTEM_APPSTORE_TYPE: getApp().globalData.SYSTEM_APPSTORE_TYPE,
        SYSTEM_FORCE_TO_BIND_USER_STATUS: getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS,
        userinfo: JSON.stringify(getApp().globalData.userInfo),
        currentDeviceInfo: JSON.stringify(currentDeviceInfo),
        DANDIAN_SYSTEM_QIYEWEIXIN_USERID: DANDIAN_SYSTEM_QIYEWEIXIN_USERID,
        DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE: DANDIAN_SYSTEM_QIYEWEIXIN_USERTYPE,
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
                url: '/pages/login/weixiaologin',
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