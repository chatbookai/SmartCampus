// pages/test2/test2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowFrame: false, //是否显示多选框
    isShowDeleteStudent: false, //是否显示删除弹框
    total: 0, //选中的学生的总数
    selectedStudent: [], //选中的学生的列表
    remainArr: [],
    classList: [],
    showFieldId:0,//前一个页面里面弹出窗口所在的索引值.
  },

  // 切换班级展开学生信息
  showToggle(e) {
    let that = this;
    let classid = e.currentTarget.dataset.classid;
    let classList1 = that.data.classList;
    classList1.forEach(function(item) {
      if (item.classid == classid) {
        item.open = item.open ? false : true
      }
    })
    that.setData({
      classList: classList1
    })
  },
  // 点击全选
  bindSelectAll(e) {
    let that = this;
    let total = that.data.total;
    let classid = e.currentTarget.dataset.classid;
    let classList = that.data.classList;
    classList.forEach(function(item) {
      if (item.classid == classid) {
        if (item.selected) {
          item.selected = false;
          item.studentList.forEach(function(itm) {
            if (itm.selected) {
              total--;
            }
            itm.selected = false;
          })
          item.selectedNum = 0;
        } else {
          item.selected = true;
          item.studentList.forEach(function(itm) {
            console.log("aaa  " + itm.selected)
            if (!itm.selected) {
              total++;
            }
            itm.selected = true;
          })
          item.selectedNum = item.totalNum
        }
      }
    })

    that.setData({
      classList: classList,
      total: total
    })
  },
  // 点击某个学生
  bindCheckbox(e) {
    this.commonFun(e.currentTarget.dataset);
  },
  commonFun(option){
    let that = this;
    let total = that.data.total;
    let classid = option.classid;
    let studentid = option.studentid;
    let classList1 = that.data.classList;
    classList1.forEach(function (item) {
      if (item.classid == classid || classid == 999999) {
        let tag = true;
        item.studentList.forEach(function (itm) {
          if (itm.studentid == studentid) {
            if (itm.selected) {
              total -= 1
            } else {
              total += 1
            }
            itm.selected = !itm.selected;
            if (itm.selected) {
              item.selectedNum++
            } else {
              item.selectedNum--
            }
          }
          if (!itm.selected) {
            tag = false
          }
        })
        item.selected = tag
      }
    })
    //重置某个学生的按钮为是
    that.setData({
      classList: classList1,
      total: total
    })
  },
  // 重置某个学生的按钮为是
  resetSingleItemCheckbox(e) {
    let that = this;
    this.commonFun(e);
  },
  // 点击确认
  confirm()                                 {
    let that = this;
    let selectedStudent = [];
    let 微信小程序_弹出多选高度 = 100;
    let classList1 = that.data.classList;
    let showFieldId = that.data.showFieldId;
    var 用户答案ID列表 = '';
    var 用户答案NAME列表 = '';
    classList1.forEach(function(item) {
      item.studentList.forEach(function(itm) {
        if (itm.selected) {
          itm.classid = item.classid;
          selectedStudent.push(itm);
          用户答案ID列表 = 用户答案ID列表 + itm.studentid + ',';
          用户答案NAME列表 = 用户答案NAME列表 + itm.studentname + ',';
          微信小程序_弹出多选高度  = 微信小程序_弹出多选高度 + 52;//加52的值来源来include_addedit.wxss中.section .multi-selected-name定义的高度.
        }
      })
    })
    console.log("selectedStudent:");console.log(selectedStudent);

    //得到上一个页面的信息
    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    var currentPage = pages[pages.length - 1]  // 获取当前页面
    var prevPage = pages[pages.length - 2]    //获取上一个页面
    //同步数据到上一个页面.
    let updateData = {}; 
    updateData['liebiao[' + showFieldId + '].DisabledJumpMultiChoice'] = false;
    updateData['liebiao[' + showFieldId + '].微信小程序_已选数组结构'] = selectedStudent;
    updateData['liebiao[' + showFieldId + '].微信小程序_弹出多选高度'] = 微信小程序_弹出多选高度;
    updateData['liebiao[' + showFieldId + '].用户答案ID列表'] = 用户答案ID列表;
    updateData['liebiao[' + showFieldId + '].用户答案NAME列表'] = 用户答案NAME列表;
    prevPage.setData(updateData);
    //返回上一个页面
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    //console.log(options);
    var 前一个页面点中记录的索引值 = options['id'];
    //弹出窗口的时候,初始化数据的选中部分.
    //得到上一个页面的信息
    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    var currentPage = pages[pages.length - 1]  // 获取当前页面
    var prevPage = pages[pages.length - 2]    //获取上一个页面
    var liebiao               = prevPage.data.liebiao;
    var 弹出多选的所有数据      = liebiao[前一个页面点中记录的索引值];
    that.data.classList       = 弹出多选的所有数据['微信小程序_全部数组结构'];
    that.data.selectedStudent = 弹出多选的所有数据['微信小程序_已选数组结构'];
    that.data.total           = 0;
    that.data.showFieldId     = 前一个页面点中记录的索引值;

    console.log(that.data.selectedStudent);
    
    
    var selectedStudent = that.data.selectedStudent;
    if (selectedStudent.length > 0)               {  
      //重置所有选项为空
      let classList1 = that.data.classList;
      classList1.forEach(function (item) {
        item.studentList.forEach(function (itm) {
          itm.selected = false;
        })
        item.selected = false;
        item.selectedNum = 0;
      });
      //遍历选中项的记录
      selectedStudent.forEach(function (item) {
        //that.bindCheckbox(null, item)
        that.resetSingleItemCheckbox(item);
      });
    }
    that.setData({
      classList: that.data.classList,
      selectedStudent: that.data.selectedStudent,
      total: that.data.total,//记录弹出窗口中的右下角的确定按钮中的数字
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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