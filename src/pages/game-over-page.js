import sceneConf from '../../confs/scene-conf'

export default class GameOverPage {
  constructor (callbacks) {
    this.callbacks = callbacks
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  init (options) {
    this.initGameoverCanvas(options)
  }

  initGameoverCanvas (options) {
    const openDataContext = wx.getOpenDataContext()
    const aspect = window.innerHeight / window.innerWidth
    this.region = [
      (window.innerWidth - 200) / 2,
      (window.innerWidth - 200) / 2 + 200,
      (window.innerHeight - 100) / 2 + 230,
      (window.innerHeight - 100) / 2 + 308
    ]
    this.camera = options.camera
    this.texture = new THREE.Texture(openDataContext.canvas)
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true });
    this.geometry = new THREE.PlaneGeometry(sceneConf.frustumSize * 2, aspect * sceneConf.frustumSize * 2)
    this.obj = new THREE.Mesh(this.geometry, this.material)
    this.obj.visible = false
    this.obj.position.z = 60
    this.obj.visible = false
    this.camera.add(this.obj)
  }

  show () {
    const openDataContext = wx.getOpenDataContext()
    this.obj.visible = true
    let count = 0
    const t = setInterval(() => {
      count ++
      if (count <= 30) {
        this.texture.needsUpdate = true
      } else {
        clearInterval(t)
      }
    }, 1000)
    this.bindTouchEvent()
  }

  hide () {
    this.obj.visible = false
    this.removeTouchEvent()
  }

  onTouchEnd = (e) => {
    const pageX = e.changedTouches[0].pageX
    const pageY = e.changedTouches[0].pageY
    if (pageX > this.region[0] && pageX < this.region[1] && pageY > this.region[2] && pageY < this.region[3]) {
      this.callbacks.gameRestart()
    }
  }

  bindTouchEvent () {
    canvas.addEventListener('touchend', this.onTouchEnd)
  }

  removeTouchEvent () {
    canvas.removeEventListener('touchend', this.onTouchEnd)
  }
}