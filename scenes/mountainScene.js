import { Scene } from "@babylonjs/core"

async function CreatePlatform(scene, BABYLON) {
    const {MeshBuilder, StandardMaterial, Color3, Texture, Vector3} = BABYLON
    
    // Create main platform for characters
    const platform = MeshBuilder.CreateCylinder("platform", {
        height: 0.5,
        diameter: 30,
        tessellation: 48
    }, scene)
    
    // Create decorative steps around the platform
    const stairs = MeshBuilder.CreateCylinder("stairs", {
        height: 0.2,
        diameter: 35,
        tessellation: 48
    }, scene)
    stairs.position.y = -0.3
    
    // Materials
    const platformMat = new StandardMaterial("platformMat", scene)
    platformMat.diffuseTexture = new Texture("../textures/marble_diffuse.jpg", scene)
    platformMat.bumpTexture = new Texture("../textures/marble_normal.jpg", scene)
    platformMat.diffuseTexture.uScale = 4
    platformMat.diffuseTexture.vScale = 4
    platformMat.specularColor = new Color3(0.3, 0.3, 0.3)
    platformMat.specularPower = 32
    
    platform.material = platformMat
    stairs.material = platformMat
    
    // Create decorative pillars
    const pillars = []
    const pillarCount = 8
    const radius = 20
    
    for (let i = 0; i < pillarCount; i++) {
        const angle = (i / pillarCount) * Math.PI * 2
        const pillar = MeshBuilder.CreateCylinder(`pillar${i}`, {
            height: 15,
            diameter: 2,
            tessellation: 12
        }, scene)
        
        pillar.position = new Vector3(
            Math.cos(angle) * radius,
            7,
            Math.sin(angle) * radius
        )
        
        const pillarMat = new StandardMaterial(`pillarMat${i}`, scene)
        pillarMat.diffuseTexture = new Texture("../textures/column_diffuse.jpg", scene)
        pillarMat.bumpTexture = new Texture("../textures/column_normal.jpg", scene)
        pillar.material = pillarMat
        
        pillars.push(pillar)
    }
    
    return { platform, stairs, pillars }
}

async function mountainScene(BABYLON, engine, currentScene) {
    const {Vector3, ArcRotateCamera, HemisphericLight, SceneLoader, Color3, DirectionalLight, ShadowGenerator, MeshBuilder, StandardMaterial, Texture} = BABYLON
    
    if (currentScene) {
        engine.stopRenderLoop()
        currentScene.dispose()
    }
    
    const scene = new Scene(engine)
    
    // Create black skybox
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene)
    const skyboxMaterial = new StandardMaterial("skyBox", scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
    skyboxMaterial.specularColor = new Color3(0, 0, 0)
    skyboxMaterial.emissiveColor = new Color3(0, 0, 0)
    skybox.material = skyboxMaterial
    skybox.infiniteDistance = true

    // Create platform and environment
    const { platform, stairs, pillars } = await CreatePlatform(scene, BABYLON)

    // Bottom platform to block view
    const bottomPlatform = BABYLON.MeshBuilder.CreateCylinder("bottomPlatform", {
        height: 10,
        diameter: 35,
        tessellation: 48
    }, scene)
    bottomPlatform.position.y = -5

    // Enhanced lighting
    const mainLight = new DirectionalLight("mainLight", new Vector3(-1, -2, 1), scene)
    mainLight.intensity = 1.5
    mainLight.position = new Vector3(20, 40, -20)

    const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), scene)
    ambientLight.intensity = 0.4
    ambientLight.groundColor = new Color3(0.2, 0.2, 0.3)

    try {
        // Load main character
        const playerModel = await SceneLoader.ImportMeshAsync("", "../models/", "character.glb", scene)
        const mainChar = playerModel.meshes[0]
        mainChar.position = new Vector3(0, 0.5, 0)
        mainChar.scaling = new Vector3(1.5, 1.5, 1.5)

        // Add first NPC
        const npcModel = await SceneLoader.ImportMeshAsync("", "../models/", "character1.glb", scene)
        const npc = npcModel.meshes[0]
        npc.position = new Vector3(6, 0.5, -2)
        npc.scaling = new Vector3(1.5, 1.5, 1.5)
        npc.lookAt(mainChar.position)

        // Add second NPC
        const npc2Model = await SceneLoader.ImportMeshAsync("", "../models/", "character2.glb", scene)
        const npc2 = npc2Model.meshes[0]
        npc2.position = new Vector3(-4, 0.5, -3)  // Positioned on the other side
        npc2.scaling = new Vector3(1.5, 1.5, 1.5)
        npc2.lookAt(mainChar.position)

        // Shadow generator
        const shadowGenerator = new ShadowGenerator(1024, mainLight)
        shadowGenerator.useBlurExponentialShadowMap = true
        shadowGenerator.blurScale = 2
        shadowGenerator.addShadowCaster(mainChar)
        shadowGenerator.addShadowCaster(npc)
        shadowGenerator.addShadowCaster(npc2)  // Add shadows for second NPC
        platform.receiveShadows = true

        // Camera setup
        const camera = new ArcRotateCamera(
            "camera",
            Math.PI / 2,
            Math.PI / 2.2,
            15,
            new Vector3(0, 1, 0),
            scene
        )
        
        // Lock camera controls
        camera.inputs.clear();
        camera.lowerBetaLimit = Math.PI / 2.5
        camera.upperBetaLimit = Math.PI / 2.1
        camera.lowerRadiusLimit = 15
        camera.upperRadiusLimit = 15

        // Smooth automatic rotation
        let rotationSpeed = 0.0005;
        scene.registerBeforeRender(() => {
            camera.alpha += rotationSpeed;
        })

        await scene.whenReadyAsync()

        engine.runRenderLoop(() => {
            if (scene && !scene.isDisposed) {
                scene.render()
            }
        })

        return scene
        
    } catch (error) {
        console.error("Error loading mountain scene:", error)
        return null
    }
}

export default mountainScene