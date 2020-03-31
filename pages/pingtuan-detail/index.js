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
      let num = res.data.setting.numberPersion - res.data.setting.numberDoing
      while (num-- > 0){
        res.data.joiners.push({
          apiExtUserHelp:{
            avatarUrl: "../../../images/defaultAvatarUrl.png"
          },
          uidHelp: num
        })
      }

      let tuanInfo = res.data.tuanInfo;
      let leftTime = dayjs(tuanInfo.dateEnd).valueOf() - dayjs().valueOf();

      this.setData({
        pingtuanInfo: res.data,
        time: leftTime
      })
      console.log(res)
    }
    
  }
})