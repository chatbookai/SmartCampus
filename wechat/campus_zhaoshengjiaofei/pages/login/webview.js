//以下为通用代码.
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    web_src: "http://www.dandian.net", //webview内嵌的url
  },
  onLoad: function (options) {
    let that = this;
    var url = options['url'];
    url = util.base64decode(url);
    util.log("WEBVIEW跳转到:"+url);
    that.setData({
      url: url, //获取数据数组
    });
  },
})