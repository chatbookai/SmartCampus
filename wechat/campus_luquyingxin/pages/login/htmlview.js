//以下为通用代码.
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;

    //显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    //如果缓存的数据是完整的,则从缓存中读取相关的数据,不然就重新获取.
    var DANDIAN_SYSTEM_USER_RESOURCE = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (DANDIAN_SYSTEM_USER_RESOURCE.userInfo != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.openid != undefined
    ) {
      getApp().globalData = DANDIAN_SYSTEM_USER_RESOURCE;
    }
    //util.log("globalData:"); util.log(getApp().globalData);
    var 参数      = util.getCurrentPageUrlWithArgs();
    var 显示标题  = 参数['options']['action'];
    
    var 缓存内容  = getApp().globalData.jianjie;
    var 显示内容  = 缓存内容[显示标题];
    //显示内容 = util.base64decode(显示内容);
    显示内容 = util.decodehtml(显示内容);

    that.setData({
      TextMemo: 显示内容,
    });

    //关闭加载中
    wx.hideLoading();
    //util.log(显示内容);
  },

})