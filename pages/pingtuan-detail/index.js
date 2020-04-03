const WXAPI = require('apifm-wxapi')
import dayjs from '../../utils/dayjs.min.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pingtuanId: '',
    pingtuanInfo: {},
    goodInfo: {},
    tags: [],
    time: dayjs().format()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.tuanId = options.tuanId;
    this.queryPingtuanInfo(this.data.tuanId)
  },
  async queryPingtuanInfo(tuanId) {
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const res = await WXAPI.pingtuanInfo({
      tuanId: tuanId
    })
    if (res.code == 0) {
      while (res.data.joiners.length < res.data.setting.numberPersion){
        res.data.joiners.push({
          apiExtUserHelp:{
            avatarUrl: "../../../images/defaultAvatarUrl.png"
          },
          uidHelp: res.data.joiners.length
        })
      }
      let tuanInfo = res.data.tuanInfo;
      let leftTime = dayjs(tuanInfo.dateEnd).valueOf() - dayjs().valueOf();
      this.setData({
        pingtuanInfo: res.data,
        time: leftTime
      })
      this.queryGoodInfo(res.data.tuanInfo.goodsId)
    }
  },
  async queryGoodInfo(goodId){
    const res = await WXAPI.goodsDetail(goodId)
    if (res.code == 0) {
      console.log(res)
      this.setData({
        goodInfo: res.data
      })
    }
  },
  toGoodsDetail() {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + this.data.goodInfo.basicInfo.id
    })
  },  
  onShareAppMessage: function (options) {
    console.log(options)
    let _data = {
      title: '您的好友邀请您一起拼团',
      path: '/pages/goods-details/index?id=' + this.data.goodInfo.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid') + '&pingtuanId=' + this.data.pingtuanInfo.tuanInfo.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
    return _data
  },
  onChange(e) {
    this.setData({
      timeData: e.detail
    });
  }
})