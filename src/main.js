import * as BABYLON from "@babylonjs/core"
import '@babylonjs/loaders'
import '@babylonjs/gui' // Add GUI support
import './style.css'
import menuScene from "../scenes/menuScene.js"

const canvas = document.querySelector("canvas")
const engine = new BABYLON.Engine(canvas, true)
let currentScene = new BABYLON.Scene(engine)

// Start with menu scene instead of going directly to game
await menuScene(BABYLON, engine, currentScene)

engine.runRenderLoop(() => {
    currentScene.render()
})

// Handle window resizing
window.addEventListener("resize", () => {
    engine.resize()
})