//以下为通用代码.
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
  },

  MobileEndNewsLeftImage放大: function (e) {
    util.log(e); 
    var url            = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,     //当前MobileEndNewsLeftImage地址
      urls: url,               //所有要预览的MobileEndNewsLeftImage的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  onLoad: function (options) {
    var that = this;

    //显示加载中
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //如果缓存的数据是完整的,则从缓存中读取相关的数据,不然就重新获取.
    var DANDIAN_SYSTEM_USER_RESOURCE = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (DANDIAN_SYSTEM_USER_RESOURCE.userInfo != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.openid != undefined
    ) {
      getApp().globalData = DANDIAN_SYSTEM_USER_RESOURCE;
    }
    
    var LOGIN_USER_UID  = getApp().globalData.LOGIN_USER_UID;
    
    wx.request({
      url: getApp().globalData.SYSTEM_URL +'/general/EDU/Interface/TDFORMWECHAT/system_get_miniqrcode.php',
      method: "POST",
      data: { UID: util.base64encode(LOGIN_USER_UID),SYSTEM_APPSTORE_ID: util.base64encode(SYSTEM_APPSTORE_ID) },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        that.setData({
          qrcode: res.data["info"],
          qrcodeurl: res.data["qrcodeurl"],
          qrcodetext: res.data["qrcodetext"],
        })
        console.log(res);
        wx.hideLoading();
      },
      fail(res) {
          console.log('system_get_miniqrcode.php 请求失败')
      }
    })

  },

})