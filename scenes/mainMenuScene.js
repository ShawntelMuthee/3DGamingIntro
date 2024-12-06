// Create new file: menuScene.js
import "@babylonjs/core/Loading/Plugins/babylonFileLoader"
import { Scene } from "@babylonjs/core"
import * as GUI from "@babylonjs/gui"

async function mainMenuScene(BABYLON, engine) {
    const scene = new Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

    // Create camera
    const camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(false)

    // Add ambient light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    // Create starfield background
    const starsDome = BABYLON.MeshBuilder.CreateSphere("stars", {
        diameter: 100,
        segments: 16
    }, scene)
    const starsMaterial = new BABYLON.StandardMaterial("starsMat", scene)
    starsMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1)
    starsMaterial.backFaceCulling = false
    starsDome.material = starsMaterial

    // Create GUI
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")

    // Create main container
    const mainContainer = new GUI.Rectangle("mainContainer")
    mainContainer.width = "600px"
    mainContainer.height = "800px"
    mainContainer.thickness = 2
    mainContainer.color = "#4a4a4a"
    mainContainer.cornerRadius = 20
    mainContainer.background = "rgba(0, 0, 0, 0.7)"
    advancedTexture.addControl(mainContainer)

    // Create title text
    const titleText = new GUI.TextBlock()
    titleText.text = "KOMBATT"
    titleText.color = "goldenrod"
    titleText.fontSize = 48
    titleText.height = "100px"
    titleText.fontFamily = "Cinzel"
    titleText.top = "-200px"
    mainContainer.addControl(titleText)

    // Create subtitle
    const subtitleText = new GUI.TextBlock()
    subtitleText.text = "Game Intro Simulation"
    subtitleText.color = "white"
    subtitleText.fontSize = 24
    subtitleText.height = "50px"
    subtitleText.fontFamily = "Cinzel"
    subtitleText.top = "-130px"
    mainContainer.addControl(subtitleText)

    // Create button container
    const buttonContainer = new GUI.StackPanel()
    buttonContainer.top = "50px"
    buttonContainer.spacing = 20
    mainContainer.addControl(buttonContainer)

    // Function to create styled buttons
    const createStyledButton = (name, text) => {
        const button = GUI.Button.CreateSimpleButton(name, text)
        button.width = "250px"
        button.height = "50px"
        button.color = "white"
        button.fontSize = 20
        button.fontFamily = "Cinzel"
        button.cornerRadius = 20
        button.background = "rgba(74, 74, 74, 0.5)"
        button.thickness = 2

        // Hover effects
        button.onPointerEnterObservable.add(() => {
            button.background = "rgba(218, 165, 32, 0.5)"
            button.scaleX = 1.1
            button.scaleY = 1.1
        })
        button.onPointerOutObservable.add(() => {
            button.background = "rgba(74, 74, 74, 0.5)"
            button.scaleX = 1
            button.scaleY = 1
        })

        return button
    }

    // Create buttons
    const startButton = createStyledButton("startButton", "START SIMULATION")
    buttonContainer.addControl(startButton)

    // Create decorative line
    const line = new GUI.Rectangle()
    line.width = "400px"
    line.height = "2px"
    line.top = "-50px"
    line.background = "goldenrod"
    mainContainer.addControl(line)

    // Add floating animation to title
    const titleAnimation = new BABYLON.Animation(
        "titleAnimation",
        "top", 
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const keys = [
        { frame: 0, value: -200 },
        { frame: 30, value: -195 },
        { frame: 60, value: -200 }
    ]
    titleAnimation.setKeys(keys)
    titleText.animations = []
    titleText.animations.push(titleAnimation)
    scene.beginAnimation(titleText, 0, 60, true)

    // Button actions
    startButton.onPointerUpObservable.add(async () => {
        // Fade out animation
        const fadeOut = new BABYLON.Animation(
            "fadeOut",
            "alpha",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        )

        const fadeKeys = [
            { frame: 0, value: 1 },
            { frame: 30, value: 0 }
        ]
        fadeOut.setKeys(fadeKeys)
        mainContainer.animations = []
        mainContainer.animations.push(fadeOut)

        scene.beginAnimation(mainContainer, 0, 30, false, 1, async () => {
            try {
                // Import and create the Earth scene
                const earthPortal = await import("./earthPortalScene.js")
                const earthScene = await earthPortal.default(BABYLON, engine, scene)
                
                // Dispose of the menu scene
                scene.dispose()
                
                // Update the engine's current scene
                engine.runRenderLoop(() => {
                    earthScene.render()
                })
            } catch (error) {
                console.error("Failed to load Earth scene:", error)
            }
        })
    })

    await scene.whenReadyAsync()
    return scene
}

export default mainMenuScene