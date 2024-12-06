import * as BABYLON from "@babylonjs/core"
import '@babylonjs/loaders'
import '@babylonjs/gui'
import './style.css'
import mainMenuScene from "../scenes/mainMenuScene.js"
import mountainScene from "../scenes/mountainScene.js"

const canvas = document.createElement("canvas")
document.body.appendChild(canvas)
const engine = new BABYLON.Engine(canvas, true)
let currentScene = null

const setScene = async (newScene) => {
    if (currentScene) {
        engine.stopRenderLoop()
        currentScene.dispose()
    }
    currentScene = newScene
}

const startGame = async () => {
    try {
        currentScene = await mainMenuScene(BABYLON, engine, null)
        
        window.addEventListener("keydown", async (e) => {
            if (e.key === "m") {
                engine.stopRenderLoop()
                const mountainSceneInstance = await mountainScene(BABYLON, engine, currentScene)
                await setScene(mountainSceneInstance)
            }
        })
        
        engine.runRenderLoop(() => {
            if (currentScene && !currentScene.isDisposed) {
                currentScene.render()
            }
        })
    } catch (error) {
        console.error("Failed to start game:", error)
    }
}

startGame()

window.addEventListener("resize", () => {
    engine.resize()
})

export { engine, setScene }