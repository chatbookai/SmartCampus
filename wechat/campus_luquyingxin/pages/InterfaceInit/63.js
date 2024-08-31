//页面的ID标识通过URL中的文件名来判断区分,不需要再此再写入值.

//以下为通用代码.
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');

var wxMarkerData = [];

var app = getApp();

var handler = require('../../utils/Enginee_control.js');

Page(handler.handler);