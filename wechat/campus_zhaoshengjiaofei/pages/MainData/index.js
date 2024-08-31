// pages/shuju/index.js
var util = require("../../utils/util.js");
var bmap = require('../../libs/bmap-wx.min.js');
var MyApp = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    BMapAK: "Hx1cMSuB2dMPyF7zGBU35Udx40cgkarb", //填写申请到的ak   
    BMapShow: false,
    location: "",
    nickName:"",
    userInfoAvatar: "",
    avatarUrl: "",
    gender: "",
    sex: "", 
    openid: "",
    unionid: "",
    localCacheVersion:'',
    remoteServerVersion:'',
    DANDIAN_SYSTEM_CACHE:'',
  },

  //调转到微信用户授权页面.
  toLogin: function () {
    wx.navigateTo({
      url: '/pages/login/wechatlogin',
    })
    return false;
  },

  //点击图标对应的事件,具体的URL地址是在WXML里面定义.
  点击单个图标跳转:function(e)   {
    let that = this;
    var url = e.currentTarget.dataset.url;
    var ForceLogin = e.currentTarget.dataset.ForceLogin;
    var nickName = that.data.nickName;
    var LOGIN_USER_EDUID = getApp().globalData.LOGIN_USER_EDUID;
    if (getApp().globalData.userInfo == undefined)              {
      wx.navigateTo({
        url: '/pages/login/wechatlogin',
      });
      return false;
    }
    else if (ForceLogin=="1" && (LOGIN_USER_EDUID == '' || LOGIN_USER_EDUID == undefined) ) {
      util.log(url);
      wx.navigateTo({
        url: '/pages/login/logincheck',
      });
      return false;
    }
    else if (nickName!='')     {
      var urlUserDefine = e.currentTarget.dataset.urluserdefine;
      if(urlUserDefine!=undefined && urlUserDefine!="" && urlUserDefine!="undefined")   {
        url = urlUserDefine;
      }
      wx.navigateTo({
        url: url,
      });
      return false;
    }
    else      {
      //没有用户头像时,不能点击图标.
    }
  },

  点击单个图标跳转WEBPAGE:function(e)   {
    let that = this;
    var targetURL = getApp().globalData.SYSTEM_URL + e.currentTarget.dataset.url;
    util.log("targetURL:"+targetURL);
    targetURL = targetURL+"?"+ that.生成WEBPAGE的URL参数(e);
    var ForceLogin = e.currentTarget.dataset.ForceLogin;
    var url = "/pages/login/webview?url=" + util.base64encode(targetURL);
    wx.navigateTo({
      url: url,
    });

  },

  //生成掌上校园使用的参数($TYPE="老师");
  生成WEBPAGE的URL参数:function(e)   {
    var LOGIN_USER_EDUID = getApp().globalData.LOGIN_USER_EDUID;
    var LOGIN_USER_TYPE = getApp().globalData.LOGIN_USER_TYPE;
    var LOGIN_ACCESS_TOKEN = getApp().globalData.LOGIN_ACCESS_TOKEN;
	  var URL = "ASDFSDFSDF&USER_ID="+LOGIN_ACCESS_TOKEN+"&USER_TYPE="+LOGIN_USER_TYPE+"&USER_TIME="+new Date().getTime()+"&LOGIN_SCHOOL_ID=0&USER_CHECK=&T=registersession&TT=wechat&&adsfad";
	  URL = util.base64encode(URL);
	  return URL;
  },


  点击进入用户信息页面: function (e) {
    let that = this;
    var nickName = that.data.nickName;
    var LOGIN_USER_EDUID = getApp().globalData.LOGIN_USER_EDUID;
    var SYSTEM_FORCE_TO_BIND_USER_STATUS = 0;
    if (getApp().globalData.jianjie != undefined) {
      SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.jianjie.SYSTEM_FORCE_TO_BIND_USER_STATUS;
    }
    if (SYSTEM_FORCE_TO_BIND_USER_STATUS!=3)                        {
      if (getApp().globalData.userInfo == undefined) {
        wx.navigateTo({
          url: '/pages/login/wechatlogin',
        });
        return false;
      }
      else if (LOGIN_USER_EDUID != '' && LOGIN_USER_EDUID != undefined) {
        wx.navigateTo({
          url: '/pages/login/userprofile',
        });
        return false;
      }
      else if (nickName != '' && nickName != undefined) {
        wx.navigateTo({
          url: '/pages/login/logincheck',
        });
        return false;
      }
      else {
        //没有用户头像时,不能点击图标.
      }
    }
    else if (SYSTEM_FORCE_TO_BIND_USER_STATUS == 3 && getApp().globalData.SYSTEM_APPSTORE_ID ==2)  {
      //单点云校小程序,特殊处理.
      wx.navigateTo({
        url: '/pages/login/userprofile',
      });
      return false;
    }
  },

  getUserInfo: function (cb)                         {
    var that = this;
    //如果缓存的数据是完整的,则从缓存中读取相关的数据,不然就重新获取.
    var DANDIAN_SYSTEM_USER_RESOURCE = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (DANDIAN_SYSTEM_USER_RESOURCE.userInfo != undefined 
        && DANDIAN_SYSTEM_USER_RESOURCE.openid != undefined 
        )     {
      getApp().globalData = DANDIAN_SYSTEM_USER_RESOURCE;
    }
    util.log("---------------------------------------");
    util.log(getApp().globalData);
    var SYSTEM_FORCE_TO_BIND_USER_STATUS = 0;
    if (getApp().globalData.jianjie!=undefined)     {
      SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.jianjie.SYSTEM_FORCE_TO_BIND_USER_STATUS;
    }
    else    {
      SYSTEM_FORCE_TO_BIND_USER_STATUS = getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS;
    }
    //判断是否有值,有值则直接显示,无值则进行跳转.
    if (getApp().globalData.userInfo != undefined && getApp().globalData.openid != '' && getApp().globalData.LOGIN_USER_ID == '' && SYSTEM_FORCE_TO_BIND_USER_STATUS==1)           {
      wx.navigateTo({
        url: '/pages/login/logincheck',
      });
      return false;
    }
    else if (getApp().globalData.userInfo == undefined && getApp().globalData.openid == '' && getApp().globalData.LOGIN_USER_ID == '' && (SYSTEM_FORCE_TO_BIND_USER_STATUS == 2 || SYSTEM_FORCE_TO_BIND_USER_STATUS == 3) && getApp().globalData.SYSTEM_APPSTORE_ID == 2 )           {
      //第一次打开,未有任何用户的数据的时候,允许打开一些新闻和通知模块.
      //单点云校小程序使用过,先显示菜单,再提示用户来登录认证.
      that.letShowUserImage();
      that.getUserMainDataList(getApp().globalData.openid);
    }
    else if (getApp().globalData.userInfo != undefined && getApp().globalData.openid != '' && getApp().globalData.LOGIN_USER_ID != '')    {
      that.letShowUserImage();
      that.getUserMainDataList(getApp().globalData.openid);
    } 
    else {
      //如果当前缓存里面没有用户信息,则直接调转用户授权页面
      wx.navigateTo({
        url: '/pages/login/wechatlogin',
      });
      return false;
    }
    //设置标题
    if (getApp().globalData.jianjie != undefined)    {
      wx.setNavigationBarTitle({
        title: getApp().globalData.jianjie.APP_SELF_NAME
      })
    }
  },

  GetLocation:function(e)       {
    let that = this;
    //涉及到网络请求异步的问题,所以这个地理位置获取的代码,只能等能上一个网络请求有结果以后,才能进行判断是否要进行请求.
    if (true) {
      var BMap = new bmap.BMapWX({
        ak: that.data.BMapAK
      });
      var BMapSuccess = function (data) {
            //获取当前设备信息
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

            //返回数据内，已经包含经纬度    
            util.log("/general/EDU/Interface/TDFORMWECHAT/system_location.php");
            wx.request({
              url: getApp().globalData.SYSTEM_URL + '/general/EDU/Interface/TDFORMWECHAT/system_location.php',
              method: 'post',
              data: {
                location: JSON.stringify(data.originalData.result),
                currentDeviceInfo: JSON.stringify(currentDeviceInfo),
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                //提交到服务器记录地理位置接口的返回状态      
                //util.log("提交到服务器记录地理位置接口的返回状态");util.log(res.data);
              },
              fail(res) {
                  console.log('请求失败',"system_location")
              }
            });
            //util.log(data);
      };
      var BMapFail = function (data) {
        //util.log(data);
      };
      // 发起regeocoding检索请求     
      BMap.regeocoding({
        success: BMapSuccess,
        fail: BMapFail,
      });
    }//end BMapShow === true
  },

  letShowUserImage:function(cb)    {
    var that      = this;
    var userInfo  = getApp().globalData.userInfo;
    //util.log("userInfo:");util.log(userInfo);
    if (userInfo!=undefined)      {
      that.setData({
        userInfoAvatar: userInfo.avatarUrl,
        nickName: userInfo.nickName,
      });
    }
  },

  getUserMainDataList: function (openid) {
    var that = this;
    //缓存图标等数据信息.一直缓存在本地,如果有变化,则重新加载新的数据
    //获取当前系统最近一次的更新时间,根据更新时间来判断是否需要重新更新本地缓存数据.
    util.log("getUserMainDataList-openid:" + openid);
    //第一步:如果本地有缓存,则先加载本地缓存的内容,然后再在后台刷新最新的菜单数据.
    //版本号一致,直接使用本地缓存数据
    var DANDIAN_SYSTEM_CACHE = wx.getStorageSync('DANDIAN_SYSTEM_CACHE') || [];
    var localCacheVersion = DANDIAN_SYSTEM_CACHE.version;
    util.log(DANDIAN_SYSTEM_CACHE);
    util.log(DANDIAN_SYSTEM_CACHE.length);    
    if (localCacheVersion != '' 
      && localCacheVersion != undefined 
      && DANDIAN_SYSTEM_CACHE.data.MainDataGroup != undefined 
      && DANDIAN_SYSTEM_CACHE.data.MainDataGroup.length>0
      )      {
      var IndexLogo = [];
      if (util.isArray(DANDIAN_SYSTEM_CACHE.data.IndexLogo) && DANDIAN_SYSTEM_CACHE.data.IndexLogo[0]!=undefined) {
        IndexLogo[0] = getApp().globalData.SYSTEM_URL + DANDIAN_SYSTEM_CACHE.data.IndexLogo[0];
      }
      that.setData({
        indexmenu: DANDIAN_SYSTEM_CACHE.data.MainDataList,
        indexmenuGroup: DANDIAN_SYSTEM_CACHE.data.MainDataGroup,
        IsSearch: DANDIAN_SYSTEM_CACHE.data.IsSearch,
        IndexLogo: IndexLogo,
        IsUserAvator: DANDIAN_SYSTEM_CACHE.data.IsUserAvator,
        nickName: that.data.nickName,
        SYSTEM_URL: getApp().globalData.SYSTEM_URL,
      });
      if(DANDIAN_SYSTEM_CACHE.data.MainImageList!=undefined)  {
        that.setData({
          MainImageList: DANDIAN_SYSTEM_CACHE.data.MainImageList,
          SYSTEM_URL: getApp().globalData.SYSTEM_URL,
        });
      }
      //关闭加载中
      wx.hideLoading();
      util.log("----------------------加载本地缓存菜单数据------");
    }

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

    //第二步:服务器端校验版本号,以便于决定是否从服务器上面下载新的图标列表.
    wx.request({
      url: getApp().globalData.SYSTEM_URL + getApp().globalData.MainDataUpdate,
      method: 'POST',
      data: {
        LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
        SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
        SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var remoteServerVersion = res.data.version
        var isUseCacheDataOrGetDataFromServer = 1;//默认从服务器下载数据
        if (remoteServerVersion === localCacheVersion) {
          isUseCacheDataOrGetDataFromServer = 0;//直接使用本地缓存数据
          var MenuArrayMap = DANDIAN_SYSTEM_CACHE.data.MainDataList;
          var MenuArrayCount = util.array_keys(MenuArrayMap);
          util.log("缓存数据菜单数量:" + MenuArrayCount.length);
          if (MenuArrayCount.length === 0) {
            //缓存数据中菜单数量为0,则重新需要下载数据
            isUseCacheDataOrGetDataFromServer = 1;//从服务器下载数据
          }
          //关闭加载中
          wx.hideLoading();
        }
        else {
          isUseCacheDataOrGetDataFromServer = 1;//从服务器下载数据
        }

        if (isUseCacheDataOrGetDataFromServer === 1) {
          //本地缓存版本号跟服务器版本号不一样,需要重新下载数据,并进行缓存.
          util.log("本地缓存版本号跟服务器版本号不一样,需要重新下载数据,并进行缓存.");
          var UID = getApp().globalData.LOGIN_USER_UID;;
          //获得我的校园菜单的图标信息.
          wx.request({
            url: getApp().globalData.SYSTEM_URL + getApp().globalData.MainDataList,
            method: 'POST',
            data: {
              LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
              SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
              SYSTEM_APPSTORE_ID: getApp().globalData.SYSTEM_APPSTORE_ID,
              SYSTEM_APPSTORE_TYPE: getApp().globalData.SYSTEM_APPSTORE_TYPE,
              SYSTEM_FORCE_TO_BIND_USER_STATUS: getApp().globalData.SYSTEM_FORCE_TO_BIND_USER_STATUS,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN
            },
            success: function (res) {
              //关闭加载中
              wx.hideLoading();

              var MainDataLists = res.data.MainDataList;
              var MainDataGroups = res.data.MainDataGroup;
              var IsSearch = res.data.IsSearch;
              var IsUserAvator = res.data.IsUserAvator;
              if (MainDataLists == '' || MainDataLists==undefined) {
                IsUserAvator = true;
              }
              if(res.data.MainImageList!=undefined)   {
                var MainImageList = res.data.MainImageList;
                that.setData({
                  MainImageList: MainImageList,
                  SYSTEM_URL: getApp().globalData.SYSTEM_URL,
                });
              }
              var IndexLogo = [];
              if (util.isArray(res.data.IndexLogo))     {
                IndexLogo[0] = getApp().globalData.SYSTEM_URL + res.data.IndexLogo[0];
              }
              that.setData({
                indexmenu: MainDataLists,
                indexmenuGroup: MainDataGroups,
                IsSearch: IsSearch,
                IndexLogo: IndexLogo,
                IsUserAvator: IsUserAvator,
                nickName: that.data.nickName,
                SYSTEM_URL: getApp().globalData.SYSTEM_URL,
              });

              if (res.statusCode === 200) {
                var DANDIAN_SYSTEM_CACHE = new Object();
                DANDIAN_SYSTEM_CACHE.data = res.data;
                DANDIAN_SYSTEM_CACHE.date = util.js_date(Date.now());
                DANDIAN_SYSTEM_CACHE.version = remoteServerVersion;
                wx.setStorageSync('DANDIAN_SYSTEM_CACHE', DANDIAN_SYSTEM_CACHE);
                util.log("设置本地版本号为:" + DANDIAN_SYSTEM_CACHE.version);
                util.log(getApp().globalData.SYSTEM_URL + getApp().globalData.MainDataList);
                util.log("获取最新菜单数据:");
                util.log(res.data);
              }
            },
            fail(res) {
                console.log('请求失败',getApp().globalData.MainDataList)
            }
          })
        }
        util.log("本地版本号:" + localCacheVersion);
        util.log("远程版本号:" + remoteServerVersion);
      },
      fail(res) {
          console.log('请求失败',getApp().globalData.MainDataUpdate)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //记录推荐好友过来的参数.
    if(options['action']!=""&&options['action']!=undefined)   {
      wx.setStorageSync('dandian_user_action', options['action']);
    }
    //记录推荐好友过来的参数.
    if(options['sharesource']!=""&&options['sharesource']!=undefined)   {
      wx.setStorageSync('DANDIAN_USER_SHARESOURCE', options['sharesource']);
    }
    //显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.getUserInfo();
    //获取当前用户的地理位置信息 延迟5秒执行 以便于不和主线程抢CPU资源
    //setTimeout(function () {
    //  that.GetLocation();
    //}, 50000);
        
  },
  //unload结束

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
 * 生命周期函数--用户点击取消以后,进行刷新页面.
 */
  onRefresh: function () {
    var that = this;
    that.onLoad();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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