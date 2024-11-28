import gameScene from "./gameScene.js"

let scene = undefined

async function main(BABYLON, engine, currentScene) {
    scene = await gameScene(BABYLON, engine, currentScene)

    engine.runRenderLoop(() => {
        scene.render()
    })
}

export default main