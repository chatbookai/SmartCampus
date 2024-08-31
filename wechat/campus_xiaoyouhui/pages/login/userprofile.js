// pages/shuju/index.js
var util = require("../../utils/util.js");
var bmap = require('../../libs/bmap-wx.min.js');
var MyApp = getApp();

Page( {
  data: {
  },
  onChooseNickName(e) {
    const { avatarUrl, nickName } = e.detail 
    console.log(e.detail)
    this.setData({
      avatarUrl,
    })
    var openid = getApp().globalData.openid;
    var unionid = getApp().globalData.unionid;
    wx.request({
      url: getApp().globalData.SYSTEM_URL + getApp().globalData.MainSummaryList,
      header: {
        'content-type': 'multipart/form-data;', 
        'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN
      }, // 设置请求的 header
      formData: {
        action: 'nickName',
        openid: openid,
        nickName: nickName
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        if(res && res.data) {
          var returnJson = util.stringToJson(res.data);
          util.log(returnJson['status'])
          if(returnJson['status']=="OK") {
            wx.showToast({
              title: returnJson['msg'],
              icon: 'success',
              duration: 2000,
            });
          }
        }
      },
      fail: function (res) {
      }
    });

  },
  onChooseAvatar(e) {
    const { avatarUrl, nickName } = e.detail 
    console.log(e.detail)
    this.setData({
      avatarUrl,
    })
    var openid = getApp().globalData.openid;
    var unionid = getApp().globalData.unionid;
    wx.uploadFile({
      url: getApp().globalData.SYSTEM_URL + getApp().globalData.MainSummaryList,
      filePath: avatarUrl,
      name: 'Avatar',
      header: {
        'content-type': 'multipart/form-data;', 
        'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN
      }, // 设置请求的 header
      formData: {
        action: 'Avatar',
        openid: openid,
        nickName: nickName
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        if(res && res.data) {
          var returnJson = util.stringToJson(res.data);
          util.log(returnJson['status'])
          if(returnJson['status']=="OK") {
            wx.showToast({
              title: returnJson['msg'],
              icon: 'success',
              duration: 2000,
            });
          }
        }
      },
      fail: function (res) {
      }
    });

  },

  onLoad: function (options) {
    var that = this;
    getApp().globalData = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (getApp().globalData.userInfo == undefined || getApp().globalData.jianjie == undefined) {
        wx.navigateTo({
            url: '/pages/login/wechatlogin',
        });
        return false;
    }
    var LOGIN_USER_EDUID = getApp().globalData.LOGIN_USER_EDUID;
    if (getApp().globalData.userInfo == undefined || LOGIN_USER_EDUID == '' || LOGIN_USER_EDUID == undefined) {
        wx.navigateTo({
            url: '/pages/login/wechatlogin',
        });
        return false;
    }
    //记录推荐好友过来的参数.
    if(options['action']!=""&&options['action']!=undefined)   {
      wx.setStorageSync('dandian_user_action', options['action']);
    }
    //记录推荐好友过来的参数.
    if(options['sharesource']!=""&&options['sharesource']!=undefined)   {
      wx.setStorageSync('DANDIAN_USER_SHARESOURCE', options['sharesource']);
    }
    //如果缓存的数据是完整的,则从缓存中读取相关的数据,不然就重新获取.
    var DANDIAN_SYSTEM_USER_RESOURCE = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (DANDIAN_SYSTEM_USER_RESOURCE.userInfo != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.openid != undefined
    ) {
      getApp().globalData = DANDIAN_SYSTEM_USER_RESOURCE;
    }
    util.log("globalData:");util.log(getApp().globalData);
    that.setData({
      nickName: getApp().globalData.userInfo['nickName'],
      avatarUrl: getApp().globalData.userInfo['avatarUrl'],
      LOGIN_USER_PROFILE: getApp().globalData.LOGIN_USER_PROFILE,
      VERSION: getApp().globalData.SYSTEM_VERSION,
    });

    //默认启用表单
    let updateData = {};
    updateData['isFormSubmitButtonDisabled']  = false;
    updateData['isFormSubmitButtonValue']     = '注销登录';
    this.setData(updateData);
  },

  注销登录: function (e) {
    var that = this;
    var USER_NAME = e.detail.value.USER_NAME;
    var PASSWORD = e.detail.value.PASSWORD;
    util.log("USER_NAME:" + USER_NAME);


    //数据提交以后,禁用表单操作按钮.防止二次提交
    let updateData = {};
    updateData['isFormSubmitButtonDisabled']  = true;
    updateData['isFormSubmitButtonValue']     = '正在注销登录中,请稍等.';
    this.setData(updateData);

    wx.showToast({
      title: '注销登录成功!',
      icon: 'success',
      duration: 2000,
    });

    //清空关键数据,不能全部清空
    getApp().globalData.userInfo = {};
    getApp().globalData.nickName = '';
    getApp().globalData.userInfoAvatar = '';
    getApp().globalData.avatarUrl = '';
    getApp().globalData.gender = '';
    getApp().globalData.sex = '';
    getApp().globalData.sessionkey = '';
    getApp().globalData.session_key = '';
    getApp().globalData.usercode = ''; 
    getApp().globalData.openid = '';
    getApp().globalData.unionid = '';
    getApp().globalData.remoteServerVersion = '';
    getApp().globalData.localCacheVersion = '';
    getApp().globalData.DANDIAN_SYSTEM_CACHE = '';
    getApp().globalData.LOGIN_USER_ID = '';
    getApp().globalData.LOGIN_USER_EDUID = '';
    getApp().globalData.LOGIN_USER_NAME = '';
    getApp().globalData.LOGIN_DEPT_ID = '';
    getApp().globalData.LOGIN_DEPT_NAME = '';
    getApp().globalData.LOGIN_USER_PRIV = '';
    getApp().globalData.LOGIN_THEME = '';
    getApp().globalData.LOGIN_ACCESS_TOKEN = '';
    getApp().globalData.LOGIN_PRIV_NAME = '';
    getApp().globalData.LOGIN_USER_PROFILE = [];
    wx.setStorageSync('DANDIAN_SYSTEM_USER_RESOURCE', getApp().globalData);

    //数据提交以后,禁用表单操作按钮.防止二次提交
    updateData['isFormSubmitButtonValue'] = '注销登录成功,正在为您跳转中...';
    this.setData(updateData);

    //需要延时执行两秒,不然数据会同步不上来.
    setTimeout(function () {
      //回到首页,目前机制不需要强制绑定用户
      wx.reLaunch({
        url: '/pages/Page/ZhuanYe',
      })
    }, 2000); 

  },

  查看HTML文本: function (e) {
    var that      = this;
    var 显示标题  = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/login/htmlview?action=' + 显示标题,
    });
  },

  我的小程序二维码: function (e) {
    var that      = this;
    var 查看我的小程序二维码  = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/login/getqrcode',
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util.log('-------------------------')
    util.log(getApp().globalData)
    var UID = getApp().globalData.LOGIN_USER_UID;
    var sharesource = util.base64encode(UID);
    var nickName = getApp().globalData.userInfo.nickName
    var Title = getApp().globalData.Title+"(来自["+nickName+"]的分享)"
    return {
      title: Title,
      path: 'pages/MainData/index?sharesource=' + sharesource
    }
  }

})
