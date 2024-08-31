//以下为通用代码.
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    Infor:{},
    list: []
  },

  初始化页面()                        {
    let that = this;
    //如果缓存的数据是完整的,则从缓存中读取相关的数据,不然就重新获取.
    var DANDIAN_SYSTEM_USER_RESOURCE = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
    if (DANDIAN_SYSTEM_USER_RESOURCE.userInfo != undefined
      && DANDIAN_SYSTEM_USER_RESOURCE.openid != undefined
    ) {
      getApp().globalData = DANDIAN_SYSTEM_USER_RESOURCE;
    }
    util.log("globalData:");util.log(getApp().globalData);

    console.log(that.data.headBarHeight);
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    //getApp().globalData.SYSTEM_URL + 
    var UrltojsonJson = {};
    UrltojsonJson['T'] = "T"; 
    UrltojsonJson['JSON'] = "1";
    UrltojsonJson['openid']   = getApp().globalData.openid;
    UrltojsonJson['unionid']  = getApp().globalData.unionid;
    UrltojsonJson['DATETIME'] = new Date().getTime();
    UrltojsonJson['APPSOURCE'] = "WECHAT_INIT";
    UrltojsonJson['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    UrltojsonJson['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    UrltojsonJson['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;
    UrltojsonJson['LOGIN_ACCESS_TOKEN'] = getApp().globalData.LOGIN_ACCESS_TOKEN;
    UrltojsonJson['SYSTEM_RUNNING_SYSTEM'] = getApp().globalData.SYSTEM_RUNNING_SYSTEM;
    var DATA = util.base64encode(util.jsonToString(UrltojsonJson));
    util.log(UrltojsonJson);
    util.log("DATA:" + DATA);

    wx.request({
      url: getApp().globalData.SYSTEM_URL+'/general/EDU/Interface/TDFORMDATA/data_middle_newstudent_shoufeidan_1792_3.php?action=search',
      method: 'POST',
      data: {
        DATA:DATA,
        stutype:"new",
        stucode:getApp().globalData.LOGIN_USER_EDUID,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res)                 {
        //判断学生状态
        if(res['data']['学生信息']['学生状态']!="录取成功" && res['data']['学生信息']['学生状态']!="正常状态" && res['data']['学生信息']['学生状态']!="休学状态")      {
          //util.showModal("消息提示", res['data']['RESULT']);
          wx.hideLoading();
          util.showModal("消息提示", "您还没有被录取,录取成功以后即可缴费.",'goback');
          return '';
        }
        //关闭加载中
        wx.hideLoading();
        if(res['data']['CODE']=="ERROR")      {
          util.showModal("消息提示", res['data']['RESULT']);
          //返回到上一个页面
          var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
          var currentPage = pages[pages.length - 1]  // 获取当前页面
          var prevPage = pages[pages.length - 2]    //获取上一个页面
          if (prevPage!= undefined)       {
            // 设置上一个页面的数据（可以修改，也可以新增）
            var PageGetUrl = prevPage.data.PageGetUrl;
            util.log("prevPage.data.PageGetUrl:"+prevPage.data.PageGetUrl);
            prevPage.onLoadData(PageGetUrl, 'goback');
            //返回成功,不需要延时
            wx.navigateBack({
              delta: 1
            });
          }
        }
        that.data.list = res['data']['学期应缴费'];
        that.data.Infor = res['data']['学生信息'];
        util.log(res['data']['CODE']);
        //计算应缴费部分
        that.data.list.map(item=>{
          let totalPayable = 0;
          let totalSurplus = 0;
          item.每个学期应缴费.map(subItem=>{
            totalPayable += Number(subItem['应缴']);
            if(subItem['是否启用']=="是")   {
              totalSurplus += Number(subItem['欠费']);
            }
          })
          item['学期应缴合计'] = Number(totalPayable);
          item['学期欠费合计'] = Number(totalSurplus);
          item['学期本次缴费'] = Number(totalSurplus);
          that.data.list.item = item;
          util.log(item);
        })
        that.setData({
          avatarUrl: getApp().globalData.userInfo['avatarUrl'],
          list: that.data.list,
          Infor: that.data.Infor,
        })
        //end success
      },
      fail(res) {
          console.log('jiaofei 请求失败')
      }
    });

    
  },

  修改缴费金额后重新计算总缴费(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let subId = e.currentTarget.dataset.subid;
    let val = e.detail.value;
    that.data.list.map(item=>{
      if(item.编号 == id){
        item.每个学期应缴费.map(subItem=>{
          //console.log(subItem);
          if(subItem.编号 == subId){
            if(Number(val)>subItem['欠费']) {
              val = subItem['欠费'];
            }
            //console.log("Val:"+Number(val));
            if(isNaN(Number(val))) {
              val = 0;
            }
            //console.log("Val:"+val);            
            subItem['计划缴费'] = val;
            that.data.list.item.每个学期应缴费.subItem = subItem;
          }
        })
      }
    })
    //计算应缴费部分
    that.data.list.map(item=>{
      let totalPayable = 0;
      let totalSurplus = 0;
      item.每个学期应缴费.map(subItem=>{
        totalPayable += Number(subItem['应缴']);
        totalSurplus += Number(subItem['计划缴费']);
      })
      //item['学期应缴合计'] = totalPayable.toFixed(2);
      //item['学期欠费合计'] = totalSurplus.toFixed(2);
      item['学期本次缴费'] = totalSurplus.toFixed(2);
      that.data.list.item = item;
      util.log(item);
    })
    that.setData({
      list: that.data.list
    })
    
  },

  确认缴费操作: function (e) {
    var that = this;
    var triptitle = e.currentTarget.dataset.triptitle;
    var tripcontent = e.currentTarget.dataset.tripcontent;
    wx.showModal({
      title: triptitle,
      content: tripcontent,
      success: function (res) {
        util.log(res);
        if (res.confirm) {
          that.确认缴费操作_实际执行(e);
          util.log('用户点击确定');
        } 
        else if (res.cancel) {
          util.log('用户点击取消');
        }
      }
    });
  },

  确认缴费操作_实际执行(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    util.log(dataset);

    var 表单所有字段值 = {};
    表单所有字段值['T'] = "T";
    表单所有字段值['JSON'] = "1"; 
    表单所有字段值['SYSTEM_FORCE_TO_BIND_USER_STATUS'] = getApp().globalData.jianjie.SYSTEM_FORCE_TO_BIND_USER_STATUS;
    表单所有字段值['openid'] = getApp().globalData.openid;
    表单所有字段值['unionid'] = getApp().globalData.unionid;
    表单所有字段值['APPSOURCE'] = "WECHAT_INIT";
    表单所有字段值['DATETIME'] = new Date().getTime();
    表单所有字段值['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    表单所有字段值['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    表单所有字段值['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;
    表单所有字段值['LOGIN_ACCESS_TOKEN'] = getApp().globalData.LOGIN_ACCESS_TOKEN;
    表单所有字段值['LOGIN_USER_EDUID'] = getApp().globalData.LOGIN_USER_EDUID;
    表单所有字段值['ACTIONENCODE'] = "UTF8TOGBK";
    表单所有字段值['stucode'] = getApp().globalData.LOGIN_USER_EDUID;
    表单所有字段值['stutype'] = "new";
    表单所有字段值['JIAOFEI_DATASET'] = util.base64encode(util.jsonToString(dataset));
    var DATA = util.base64encode(util.jsonToString(表单所有字段值));
    var 表单提交字段 = {};
    表单提交字段['DataSource'] = "MiniProgram";
    表单提交字段['JSON'] = "1";
    表单提交字段['APPSOURCE'] = "WECHAT_INIT";
    表单提交字段['ACTIONENCODE'] = "UTF8TOGBK";
    表单提交字段['DATA'] = DATA;

    var 学期本次缴费 = dataset['item']['学期本次缴费'];
    util.log("学期本次缴费:"+学期本次缴费);
    //表单支付
    util.log('开始支付-----------------------------------------------------');
    util.log(表单所有字段值);
    if (学期本次缴费<0) {
      let updateData = {};
      updateData['isFormSubmitButtonDisabled'] = false;
      updateData['submitaction'] = "进行支付";
      updateData['isFormSubmitButtonValue'] = "点击重新支付";
      that.setData(updateData);
      util.showModal("错误提示", "您输入的支付金额为零!");
      return false;
    }
    //第一步:申请预支付操作,同时返回下面所需要的操作.
    表单所有字段值['action'] = "prepay";
    wx.request({  //getApp().globalData.SYSTEM_URL
      url:  getApp().globalData.SYSTEM_URL +  getApp().globalData.PayMentInterface_xuefei,//字段列表
      data: 表单所有字段值,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        util.log('prepay submit success----------------------------------');
        util.log(res);
        var ress = res.data;
        if (ress['return_code'] == "SUCCESS" && ress['result_code'] == "SUCCESS")         {
          //第二步,发起支付
          wx.requestPayment(
            {
              'timeStamp': ress['paydata']['timeStamp'],
              'nonceStr': ress['paydata']['nonceStr'],
              'package': ress['paydata']['package'],
              'signType': ress['paydata']['signType'],
              'paySign': ress['paydata']['paySign'],
              'success': function (res) { 
                //成功,禁用表单
                let updateData = {}; 
                updateData['isFormSubmitButtonDisabled'] = true;
                updateData['submitaction'] = "进行支付";
                updateData['isFormSubmitButtonValue'] = "支付成功";
                that.setData(updateData);
                wx.showToast({
                  title: "支付成功",
                  icon: 'success',
                  duration: 2000,
                });
                //再次向服务器发起一个请求,来存储到数据库里面.
                表单所有字段值['action'] = "successpay";
                表单所有字段值['ORDERID'] = ress['ORDERID'];
                wx.request({  //
                  url: getApp().globalData.SYSTEM_URL + getApp().globalData.PayMentInterface_xuefei,//字段列表
                  data: 表单所有字段值,
                  method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {// 设置请求的 header
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    util.log('再次向服务器发起一个请求,来存储到数据库里面----------------------------------');
                    util.log(res);
                    that.onLoad();//支付成功以后,重新刷新页面,以获取最新的缴费状态.
                  },
                  fail(res) {
                      console.log('requestPayment 请求失败')
                  }
                });
                //返回到上一个页面-开始
                var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
                var currentPage = pages[pages.length - 1]  // 获取当前页面
                var prevPage = pages[pages.length - 2]    //获取上一个页面
                if (prevPage != undefined) {
                  // 设置上一个页面的数据（可以修改，也可以新增）
                  var PageGetUrl = prevPage.data.PageGetUrl;
                  if(PageGetUrl!=undefined)       {
                    util.log("prevPage.data.PageGetUrl:"+prevPage.data.PageGetUrl);
                    prevPage.onLoadData(PageGetUrl, 'goback');
                    //返回成功,不需要延时
                    wx.navigateBack({
                      delta: 1
                    });
                  }
                }
                //返回到上一个页面-结束
              },
              'fail': function (res) {
                let updateData = {};
                updateData['isFormSubmitButtonDisabled'] = false;
                updateData['submitaction'] = "进行支付";
                updateData['isFormSubmitButtonValue'] = "进行支付";
                that.setData(updateData);
                util.showModal("支付失败", "您已经取消支付.");
              },
              'complete': function (res) { }
            })
          //end 表单支付
        }
        else if (ress['return_code'] == "FAIL") {
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['submitaction'] = "进行支付";
          updateData['isFormSubmitButtonValue'] = "进行支付";
          that.setData(updateData);
          util.showModal("支付失败", "您已经取消支付.");
          return false;
        }
        else if (ress['result_code'] == "FAIL") {
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['submitaction'] = "进行支付";
          updateData['isFormSubmitButtonValue'] = "进行支付";
          that.setData(updateData);
          util.showModal("支付失败", ress['err_code_des']);
          return false;
        }
        else {
          //let updateData = {};
          //updateData['isFormSubmitButtonDisabled'] = false;
          //updateData['isFormSubmitButtonValue'] = "点击重新支付";
          //that.setData(updateData);
          //换另外一种消息输出方式,以方便用户来查看提示和处理数据.
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['submitaction'] = "进行支付";
          updateData['isFormSubmitButtonValue'] = "进行支付";
          that.setData(updateData);
          util.showModal("支付失败", "服务器异常!预支付操作失败!");
          return false;
          //需要延时执行两秒,以便于充分时间来显示提示信息
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
        updateData['submitaction'] = "进行支付";
        updateData['isFormSubmitButtonValue'] = "进行支付";
        that.setData(updateData);
      },
    })//end repay 
    util.log('结束支付-----------------------------------------------------');


    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.初始化页面()
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