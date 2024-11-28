// Create new file: menuScene.js
import { Scene, Color4, Vector3, Color3 } from "@babylonjs/core"

async function menuScene(BABYLON, engine, currentScene) {
    const scene = new Scene(engine)
    scene.clearColor = new Color4(0, 0, 0, 1) // Black background

    // Create GUI
    const guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")

    // Create title
    const titleText = new BABYLON.GUI.TextBlock()
    titleText.text = "YOUR GAME TITLE"
    titleText.color = "white"
    titleText.fontSize = 64
    titleText.top = "-200px"
    titleText.fontFamily = "Arial"
    guiTexture.addControl(titleText)

    // Create Start button
    const startBtn = BABYLON.GUI.Button.CreateSimpleButton("start", "START GAME")
    startBtn.width = "200px"
    startBtn.height = "60px"
    startBtn.color = "white"
    startBtn.background = "#4CAF50"
    startBtn.fontSize = 24
    startBtn.cornerRadius = 10
    startBtn.thickness = 2
    startBtn.top = "0px"
    guiTexture.addControl(startBtn)

    // Create Options button
    const optionsBtn = BABYLON.GUI.Button.CreateSimpleButton("options", "OPTIONS")
    optionsBtn.width = "200px"
    optionsBtn.height = "60px"
    optionsBtn.color = "white"
    optionsBtn.background = "#2196F3"
    optionsBtn.fontSize = 24
    optionsBtn.cornerRadius = 10
    optionsBtn.thickness = 2
    optionsBtn.top = "100px"
    guiTexture.addControl(optionsBtn)

    // Create Credits button
    const creditsBtn = BABYLON.GUI.Button.CreateSimpleButton("credits", "CREDITS")
    creditsBtn.width = "200px"
    creditsBtn.height = "60px"
    creditsBtn.color = "white"
    creditsBtn.background = "#9C27B0"
    creditsBtn.fontSize = 24
    creditsBtn.cornerRadius = 10
    creditsBtn.thickness = 2
    creditsBtn.top = "200px"
    guiTexture.addControl(creditsBtn)

    // Add hover effects
    const buttons = [startBtn, optionsBtn, creditsBtn]
    buttons.forEach(btn => {
        btn.onPointerEnterObservable.add(() => {
            btn.background = Color3.FromHexString(btn.background).scale(1.2).toHexString()
        })
        btn.onPointerOutObservable.add(() => {
            btn.background = Color3.FromHexString(btn.background).scale(0.8333).toHexString()
        })
    })

    // Button actions
    startBtn.onPointerClickObservable.add(async () => {
        const gameScene = (await import('./gameScene.js')).default
        const newScene = await gameScene(BABYLON, engine, scene)
        newScene.attachControl()
    })

    optionsBtn.onPointerClickObservable.add(() => {
        // Create options menu
        showOptionsMenu(guiTexture)
    })

    creditsBtn.onPointerClickObservable.add(() => {
        // Create credits screen
        showCredits(guiTexture)
    })

    return scene
}

// Options menu function
function showOptionsMenu(parentGUI) {
    const optionsPanel = new BABYLON.GUI.StackPanel()
    optionsPanel.width = "300px"
    optionsPanel.background = "#333333"
    optionsPanel.paddingTop = "20px"
    optionsPanel.paddingBottom = "20px"
    parentGUI.addControl(optionsPanel)

    // Add options controls here
    const volumeSlider = new BABYLON.GUI.Slider()
    volumeSlider.width = "200px"
    volumeSlider.height = "20px"
    volumeSlider.minimum = 0
    volumeSlider.maximum = 100
    volumeSlider.value = 50
    optionsPanel.addControl(volumeSlider)

    // Back button
    const backBtn = BABYLON.GUI.Button.CreateSimpleButton("back", "BACK")
    backBtn.width = "100px"
    backBtn.height = "40px"
    backBtn.color = "white"
    backBtn.background = "#f44336"
    backBtn.onPointerClickObservable.add(() => {
        parentGUI.removeControl(optionsPanel)
    })
    optionsPanel.addControl(backBtn)
}

// Credits screen function
function showCredits(parentGUI) {
    const creditsPanel = new BABYLON.GUI.StackPanel()
    creditsPanel.width = "400px"
    creditsPanel.height = "600px"
    creditsPanel.background = "#333333"
    parentGUI.addControl(creditsPanel)

    const creditsText = new BABYLON.GUI.TextBlock()
    creditsText.text = "Created by: Your Name\n\nSpecial Thanks:\n- Person 1\n- Person 2"
    creditsText.color = "white"
    creditsText.fontSize = 24
    creditsPanel.addControl(creditsText)

    const backBtn = BABYLON.GUI.Button.CreateSimpleButton("back", "BACK")
    backBtn.width = "100px"
    backBtn.height = "40px"
    backBtn.color = "white"
    backBtn.background = "#f44336"
    backBtn.onPointerClickObservable.add(() => {
        parentGUI.removeControl(creditsPanel)
    })
    creditsPanel.addControl(backBtn)
}

export default menuScene