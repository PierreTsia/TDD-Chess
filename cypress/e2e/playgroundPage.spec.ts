import { PlaygroundPage } from './Pages/PlaygroundPage'

context('|-> Playground Page', () => {
  let page: PlaygroundPage
  beforeEach(() => {
    page = new PlaygroundPage()
    page.visit()
  })

  it('should display empty chessboard and a start btn that fills it', () => {
    page.verifyUrl()
    page.verifyEmptyChessBoard()
    page.verifyStartGame()
  })

  it('should display a switch pov button', () => {
    page.verifyUrl()
    page.startGame()
    page.verifyWhitePov()
    page.switchPosition()
    page.verifyBlackPov()
  })
})
