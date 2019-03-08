import StartPage from '../pages/start-page'
import GamePage from '../pages/game-page'
import GameOverPage from '../pages/game-over-page'

class GameView {
  constructor () {

  }

  showGameOverPage () {
    this.gamePage.hide()
    this.gameOverPage.show()
  }

  showGamePage () {
    this.gameOverPage.hide()
    this.startPage.hide()
    this.gamePage.restart()
    this.gamePage.show()
  }

  restartGame () {
    this.gamePage.restart()
  }

  initStartPage (callbacks) {
    this.startPage = new StartPage(callbacks)
    this.startPage.init({
      camera: this.gamePage.scene.camera.instance
    })
  }

  initGameOverPage (callbacks) {
    this.gameOverPage = new GameOverPage(callbacks)
    this.gameOverPage.init({
      camera: this.gamePage.scene.camera.instance
    })
  }

  initGamePage (callbacks) {
    this.gamePage = new GamePage(callbacks)
    this.gamePage.init()
  }
}

export default new GameView()