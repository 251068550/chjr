import { HOST } from '../../config.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  getData() {
    wx.request({
      url: HOST + '/api/company/info',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let { code, result } = res.data;

        if (code == 1) {
          
          this.setData(result)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
    this.getData();
  },
  handleJmup(event) {
    wx.navigateTo({
      url: `../webview/webview?url=${this.data.about_url}`
    })
  }
});