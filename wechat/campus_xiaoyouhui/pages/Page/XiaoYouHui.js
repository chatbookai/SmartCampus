var util = require("../../utils/util.js");
var bmap = require('../../libs/bmap-wx.min.js');
var MyApp = getApp();

Page({
  data: {
  },

  点击单个图标跳转: function(e) {
    let that = this;
    var url = e.currentTarget.dataset.url;
    console.log("url", url)
    wx.switchTab({
      url: url,
    })
  },

  BindTapButtonView: function (e) {
    let that = this;
    var url = e.currentTarget.dataset.url;
    console.log("BindTapButtonView URL:", url)
    wx.navigateTo({
      url: url,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //显示加载中
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    var that = this;

    wx.request({
        url: getApp().globalData.SYSTEM_URL + getApp().globalData.MainSummaryList,
        method: 'POST',
        data: {
            LOGIN_SCHOOL_ID: getApp().globalData.LOGIN_SCHOOL_ID,
            SYSTEM_IS_CLOUD: getApp().globalData.SYSTEM_IS_CLOUD,
            SYSTEM_APPSTORE_ID: getApp().globalData.SYSTEM_APPSTORE_ID,
            SYSTEM_APPSTORE_TYPE: getApp().globalData.SYSTEM_APPSTORE_TYPE,
            LOGIN_USER_OPENID: getApp().globalData.openid,
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
            //--init data        
            var data = res.data;
            that.setData({
                Header: data.Header,
                IconList: data.IconList,
                ZiXun: data.ZiXun,
                Activity: data.Activity,
                LastActivityUser: data.LastActivityUser,
                Album: data.Album,
                SYSTEM_URL: getApp().globalData.SYSTEM_URL
            });
            //关闭加载中
            wx.hideLoading();
        },
        fail(res) {
            console.log('MainDataUpdate 请求失败')
        }
    });


  },

  onRefresh: function () {
    var that = this;
    that.onLoad();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})