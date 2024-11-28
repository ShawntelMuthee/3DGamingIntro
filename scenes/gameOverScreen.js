// import "@babylonjs/core/Loading/Plugins/babylonFileLoader"
// import * as GUI from '@babylonjs/gui'

// export function createGameOverScreen(BABYLON, engine, onRestart, onQuit) {
//     const scene = new BABYLON.Scene(engine)
    
//     const guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("gameOverUI")
    
//     // Game Over text
//     const gameOverText = new GUI.TextBlock()
//     gameOverText.text = "GAME OVER"
//     gameOverText.color = "red"
//     gameOverText.fontSize = 48
//     gameOverText.top = "-100px"
//     guiTexture.addControl(gameOverText)
    
//     // Restart button
//     const restartButton = GUI.Button.CreateSimpleButton("restart", "Restart")
//     restartButton.width = "200px"
//     restartButton.height = "40px"
//     restartButton.color = "white"
//     restartButton.background = "green"
//     restartButton.top = "0px"
//     restartButton.onPointerUpObservable.add(() => {
//         onRestart()
//     })
//     guiTexture.addControl(restartButton)
    
//     // Quit button
//     const quitButton = GUI.Button.CreateSimpleButton("quit", "Quit")
//     quitButton.width = "200px"
//     quitButton.height = "40px"
//     quitButton.color = "white"
//     quitButton.background = "red"
//     quitButton.top = "50px"
//     quitButton.onPointerUpObservable.add(() => {
//         onQuit()
//     })
//     guiTexture.addControl(quitButton)
    
//     return scene
// }