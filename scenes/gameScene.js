import "@babylonjs/core/Loading/Plugins/babylonFileLoader"
import { Scene } from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import { Player } from './entities/Player.js'
import { NPC } from './entities/NPC.js'
import mountainScene from './mountainScene.js'

function CreateGround(scene, BABYLON) {
    const {Vector3,Color3, Texture, MeshBuilder, StandardMaterial} = BABYLON
    const ground = MeshBuilder.CreateGround("ground", {
        width: 400,
        height: 400,
        subdivisions: 200
    }, scene)

    const groundMat = new StandardMaterial("groundMat", scene)
    const diffuseTex = new Texture("../textures/terrain1.jpg", scene)
    const normalTex = new Texture("../textures/terrainnormal.jpg", scene)
    diffuseTex.uScale = 200
    diffuseTex.vScale = 200
    normalTex.uScale = 200
    normalTex.vScale = 200
    
    groundMat.diffuseTexture = diffuseTex
    groundMat.normalTexture = normalTex
    groundMat.specularColor = new Color3(0,0,0)
    groundMat.roughness = 1.0

    ground.material = groundMat
    ground.receiveShadows = true

    return ground
}

function CreatePortal(scene, BABYLON) {
    const {MeshBuilder, StandardMaterial, Color3, Vector3, ParticleSystem, Texture, PointLight} = BABYLON
    
    // Create portal ring
    const portalRing = MeshBuilder.CreateTorus("portalRing", {
        diameter: 3,
        thickness: 0.3,
        tessellation: 64
    }, scene)
    portalRing.position = new Vector3(10, 1.5, 10)
    
    // Create portal surface (slightly smaller than the ring)
    const portalSurface = MeshBuilder.CreateDisc("portalSurface", {
        radius: 1.4,
        tessellation: 64
    }, scene)
    portalSurface.position = new Vector3(10, 1.5, 10)
    
    // Create glowing materials
    const ringMaterial = new StandardMaterial("ringMat", scene)
    ringMaterial.emissiveColor = new Color3(0.2, 0.5, 1)  // Blue glow
    ringMaterial.specularColor = new Color3(0.2, 0.5, 1)
    portalRing.material = ringMaterial

    const portalMaterial = new StandardMaterial("portalMat", scene)
    portalMaterial.emissiveColor = new Color3(0.1, 0.3, 0.9)  // Darker blue for depth
    portalMaterial.alpha = 0.7
    portalSurface.material = portalMaterial

    // Add multiple point lights for dramatic effect
    const centerLight = new PointLight("centerLight", new Vector3(10, 1.5, 10), scene)
    centerLight.intensity = 0.7
    centerLight.diffuse = new Color3(0.2, 0.5, 1)
    centerLight.specular = new Color3(0.2, 0.5, 1)

    // Create particle system for the portal effect
    const portalParticles = new ParticleSystem("portalParticles", 2000, scene)
    portalParticles.particleTexture = new Texture("../textures/flare.png", scene)
    portalParticles.emitter = new Vector3(10, 1.5, 10)
    portalParticles.minEmitBox = new Vector3(-1.4, 0, -1.4)
    portalParticles.maxEmitBox = new Vector3(1.4, 0, 1.4)
    
    // Particle properties
    portalParticles.color1 = new Color3(0.7, 0.8, 1)
    portalParticles.color2 = new Color3(0.2, 0.5, 1)
    portalParticles.colorDead = new Color3(0, 0, 0.2)
    portalParticles.minSize = 0.05
    portalParticles.maxSize = 0.15
    portalParticles.minLifeTime = 0.3
    portalParticles.maxLifeTime = 1.5
    portalParticles.emitRate = 100
    portalParticles.blendMode = ParticleSystem.BLENDMODE_ADD
    portalParticles.gravity = new Vector3(0, 0, 0)
    portalParticles.minAngularSpeed = 0
    portalParticles.maxAngularSpeed = Math.PI
    portalParticles.minEmitPower = 0.5
    portalParticles.maxEmitPower = 1
    portalParticles.updateSpeed = 0.01

    // Start particles
    portalParticles.start()

    // Add rotating animation
    scene.registerBeforeRender(() => {
        portalRing.rotation.y += 0.01
        portalSurface.rotation.y -= 0.005
    })

    return {
        ring: portalRing,
        surface: portalSurface,
        position: portalRing.position,
        particles: portalParticles,
        light: centerLight
    }
}

function CreatePortalMenu(advancedTexture) {
    // Create main container
    const mainContainer = new GUI.Rectangle("mainContainer")
    mainContainer.width = "600px"
    mainContainer.height = "400px"
    mainContainer.thickness = 2
    mainContainer.color = "#4a4a4a"
    mainContainer.cornerRadius = 20
    mainContainer.background = "rgba(0, 0, 0, 0.7)"
    mainContainer.alpha = 0
    advancedTexture.addControl(mainContainer)

    // Create title text
    const titleText = new GUI.TextBlock()
    titleText.text = "TRAVEL TO LOBBY"
    titleText.color = "goldenrod"
    titleText.fontSize = 48
    titleText.height = "100px"
    titleText.fontFamily = "Cinzel"
    titleText.top = "-100px"
    mainContainer.addControl(titleText)

    // Create message text
    const messageText = new GUI.TextBlock()
    messageText.text = "We are taking you to the lobby"
    messageText.color = "white"
    messageText.fontSize = 24
    messageText.height = "50px"
    messageText.fontFamily = "Cinzel"
    messageText.top = "-20px"
    mainContainer.addControl(messageText)

    // Create decorative line
    const line = new GUI.Rectangle()
    line.width = "400px"
    line.height = "2px"
    line.top = "-50px"
    line.background = "goldenrod"
    mainContainer.addControl(line)

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
    const yesButton = createStyledButton("yesButton", "PROCEED")
    const noButton = createStyledButton("noButton", "STAY HERE")
    
    buttonContainer.addControl(yesButton)
    buttonContainer.addControl(noButton)

    return {
        container: mainContainer,
        yesButton,
        noButton,
        titleText
    }
}

async function gameScene(BABYLON, engine, currentScene) {
    const {
        SceneLoader, 
        Vector3, 
        ArcRotateCamera,
        HemisphericLight,
        MeshBuilder,
        StandardMaterial,
        Color3
    } = BABYLON

    const scene = new Scene(engine)

    // Create dark skybox with subtle color
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene)
    const skyboxMaterial = new StandardMaterial("skyBox", scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.diffuseColor = new Color3(0.05, 0.05, 0.08)
    skyboxMaterial.specularColor = new Color3(0, 0, 0)
    skyboxMaterial.emissiveColor = new Color3(0.02, 0.02, 0.04)
    skybox.material = skyboxMaterial
    skybox.infiniteDistance = true

    // Adjust fog
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP
    scene.fogDensity = 0.01
    scene.fogColor = new BABYLON.Color3(0.05, 0.05, 0.08)  // Match skybox color

    // Create player first
    const playerModel = await SceneLoader.ImportMeshAsync("", "../models/", "character.glb", scene)
    const player = new Player(playerModel.meshes[0], playerModel.animationGroups, scene, BABYLON)
    const rootMesh = playerModel.meshes[0]
    rootMesh.position = new Vector3(0, 0, 0)

    CreateGround(scene, BABYLON)
    const portal = CreatePortal(scene, BABYLON)

    // Camera setup
    const cam = new ArcRotateCamera(
        "camera",
        Math.PI,
        Math.PI/2.5,
        3,
        rootMesh.position,
        scene
    )

    // Camera settings
    cam.lowerRadiusLimit = 2
    cam.upperRadiusLimit = 4
    cam.lowerBetaLimit = Math.PI/3
    cam.upperBetaLimit = Math.PI/1.8
    cam.inertia = 0.7
    cam.angularSensibilityX = 1000
    cam.angularSensibilityY = 1000
    cam.speed = 0.3

    const light = new HemisphericLight("light", new Vector3(0, 200, 0), scene)
    light.intensity = 1.2

    // Player animation and movement code
    let currentAnimation = 'idle'
    let isAttacking = false
    let isJumping = false
    const moveSpeed = 0.01
    const keysPressed = new Set()

    function playAnimation(animationName) {
        const newAnim = playerModel.animationGroups.find(anim => 
            anim.name.toLowerCase() === animationName.toLowerCase()
        )
        if (!newAnim) return

        if (currentAnimation !== animationName) {
            if (animationName === 'run' && keysPressed.has('s')) {
                newAnim.play(false)
                newAnim.speedRatio = -1
            } else {
                newAnim.play(false)
                newAnim.speedRatio = 1
            }
            currentAnimation = animationName
        }
    }

    // Start with idle animation
    playAnimation('idle')

    // Keyboard controls
    window.addEventListener("keydown", e => {
        const key = e.key.toLowerCase()
        keysPressed.add(key)
        
        switch(e.key) {
            case "ArrowLeft":
                cam.alpha -= 0.05
                break
            case "ArrowRight":
                cam.alpha += 0.05
                break
            case "ArrowUp":
                cam.beta -= 0.05
                break
            case "ArrowDown":
                cam.beta += 0.05
                break
        }
    })

    scene.registerBeforeRender(() => {
        const deltaTime = engine.getDeltaTime()
        let moveVector = Vector3.Zero()

        if (!isAttacking && !isJumping) {
            if (keysPressed.has('w')) {
                moveVector.z = 1
                playAnimation('run')
            } else if (keysPressed.has('s')) {
                moveVector.z = -1
                playAnimation('run')
            } else if (keysPressed.has('a')) {
                moveVector.x = -1
                playAnimation('run')
            } 
            if (keysPressed.has('d')) {
                moveVector.x = 1
                playAnimation('run')
            }

            if (moveVector.equals(Vector3.Zero())) {
                playAnimation('idle')
            }
        }

        // Apply movement
        if (!moveVector.equals(Vector3.Zero())) {
            moveVector.normalize()
            rootMesh.position.addInPlace(new Vector3(
                moveVector.x * moveSpeed * deltaTime,
                0,
                moveVector.z * moveSpeed * deltaTime
            ))
        }

        // Camera follow
        const targetPosition = rootMesh.position.clone()
        targetPosition.y += 1.6
        cam.target = Vector3.Lerp(cam.target, targetPosition, 0.05)

        // Update portal collision check
        const distance = Vector3.Distance(rootMesh.position, portal.position)
        if (distance < 3) {
            import("../src/main.js").then(({ setScene }) => {
                mountainScene(BABYLON, engine, scene).then(async newScene => {
                    await setScene(newScene)
                    engine.runRenderLoop(() => newScene.render())
                })
            })
        }
    })

    window.addEventListener("keyup", e => {
        const key = e.key.toLowerCase()
        keysPressed.delete(key)
        
        if (keysPressed.size === 0 && !isAttacking && !isJumping) {
            playAnimation('idle')
        }
    })

    await scene.whenReadyAsync()
    if (currentScene) currentScene.dispose()
    return scene
}

export default gameScene