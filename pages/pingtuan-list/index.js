// pages/pingtuan-list/index.js

const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pingtuanList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryPingtuanMyJoined()
  },
  toGoodsDetail(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },  
  toMyPingtuan(e) {
    console.log(e)
    wx.navigateTo({
      url: "/pages/pingtuan-detail/index?tuanId=" + e.currentTarget.dataset.id
    })
  },
  async queryPingtuanMyJoined() {
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const res = await WXAPI.pingtuanMyJoined({
      token: token
    })
    if (res.code == 0) { 
      this.setData({
        pingtuanList: res.data.result
      })
    }
  },

})