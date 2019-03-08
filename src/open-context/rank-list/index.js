class RankListRenderer {
  constructor() {
    this.init()
    this.key = ''
  }

  init() {
    wx.getUserInfo({
      openIdList: ['selfOpenId'],
      lang: 'zh_CN',
      success: res => {
        if (res.data) {
          if (
            res.data[0].nickName != undefined &&
            res.data[0].avatarUrl != undefined
          ) {
            this.key = res.data[0].nickName + res.data[0].avatarUrl
          }
        }
      }
    })
    this.initCanvas()
  }

  initCanvas() {
    this.sharedCanvas = wx.getSharedCanvas()
    // this.sharedCanvas.width = window.innerWidth
    // this.sharedCanvas.height = window.innerHeight

    const res = wx.getSystemInfoSync()
    this.width = res.windowWidth
    this.height = res.windowHeight

    this.context = this.sharedCanvas.getContext('2d')
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = 'rgba(0,0,0,0.3)'
    this.context.fillRect(0, 0, this.width, this.height)
    this.context.fillStyle = '#fff'
    this.context.font = '23px sans-serif'
    this.context.fillText('好友排行榜', 126, 140, 300, 30)
    this.context.fillStyle = 'rgb(88, 88, 88)'
    this.context.fillRect(60, 170, this.width - 120, this.height - 340)
    const startImage = wx.createImage()
    startImage.src = 'res/images/replay.png'
    startImage.onload = () => {
      this.context.drawImage(
        startImage,
        (this.width - 200) / 2,
        this.height - 150,
        200,
        78
      )
    }
  }

  updateMaxScore(currentScore) {
    return new Promise((resolve, reject) => {
      wx.getUserCloudStorage({
        keyList: ['maxScore'],
        success: res => {
          let maxScore = 0
          if (res.KVDataList) {
            maxScore = res.KVDataList.length > 0 ? res.KVDataList[0].value : 0
            if (currentScore > maxScore) {
              wx.setUserCloudStorage({
                KVDataList: [{ key: 'maxScore', value: String(currentScore) }],
                success: res => {
                  resolve()
                }
              })
            } else {
              resolve()
            }
          }
        }
      })
    })
  }

  sortData(data) {
    const retData = []
    for (let i = 0; i < data.length; i++) {
      const username = data[i].nickname
      const score = parseInt(data[i].KVDataList[0].value)
      const avatarUrl = data[i].avatarUrl
      retData.push({
        username: username,
        score: score,
        avatarUrl: avatarUrl
      })
    }
    retData.sort((a, b) => {
      return b.score - a.score
    })

    return retData
  }

  drawRankList(dataList) {
    dataList = this.sortData(dataList)
    for (let i = 0; i < dataList.length; i++) {
      this.drawItem(dataList[i], i)
    }
  }

  drawItem(data, index) {
    const username = data.username
    const score = data.score
    const avatarUrl = data.avatarUrl
    const key = username + avatarUrl
    if (key == this.key) {
      this.context.fillStyle = '#00ff00'
    } else {
      this.context.fillStyle = '#fff'
    }
    this.context.font = '14px sans-serif'
    this.context.fillText(username, 130, 210 + 50 * index, 100, 20)
    this.context.fillText(score, this.width - 100, 210 + 50 * index, 100, 20)
    const avatar = wx.createImage()
    avatar.src = avatarUrl
    avatar.onload = () => {
      this.context.drawImage(avatar, 80, 190 + 50 * index, 30, 30)
    }
  }

  getFriendData() {
    return new Promise((resolve, reject) => {
      wx.getFriendCloudStorage({
        keyList: ['maxScore'],
        success: res => {
          const data = res.data
          resolve(data)
        }
      })
    })
  }

  listen() {
    wx.onMessage(msg => {
      const type = msg.type
      const currentScore = parseInt(msg.score)
      this.initCanvas()
      if (type == 'updateMaxScore') {
        this.updateMaxScore(currentScore).then(() => {
          this.getFriendData().then(dataList => {
            this.drawRankList(dataList)
          })
        })
      }
    })
  }
}

const rankList = new RankListRenderer()
rankList.listen()
