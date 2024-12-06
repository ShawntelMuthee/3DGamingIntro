import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import { Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import * as GUI from '@babylonjs/gui';

async function earthPortalScene(BABYLON, engine, currentScene) {
    const scene = new Scene(engine);
    
    // Set black background
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Add ambient light
    const ambientLight = new BABYLON.HemisphericLight("light", 
        new BABYLON.Vector3(0, 1, 0), 
        scene
    );
    ambientLight.intensity = 1;
    
    // Create sphere for Earth
    const earthSphere = BABYLON.MeshBuilder.CreateSphere("earth", {
        diameter: 2,
        segments: 32
    }, scene);

    // Create materials with correct texture paths
    const earthMaterial = new BABYLON.StandardMaterial("earthMat", scene);
    earthMaterial.diffuseTexture = new BABYLON.Texture("../textures/earthmap.jpg", scene);
    earthMaterial.bumpTexture = new BABYLON.Texture("../textures/earthbump.jpg", scene);
    earthMaterial.specularTexture = new BABYLON.Texture("../textures/earthspec.jpg", scene);
    earthMaterial.emissiveTexture = new BABYLON.Texture("../textures/earthlights.jpg", scene);
    earthSphere.material = earthMaterial;

    // Cloud layer
    const cloudLayer = BABYLON.MeshBuilder.CreateSphere("clouds", {
        diameter: 2.05,
        segments: 32
    }, scene);
    const cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
    cloudMaterial.diffuseTexture = new BABYLON.Texture("../textures/earthclouds.jpg", scene);
    cloudMaterial.opacityTexture = new BABYLON.Texture("../textures/earthcloudstrans.jpg", scene);
    cloudMaterial.alpha = 0.5;
    cloudLayer.material = cloudMaterial;

    // Atmosphere glow effect
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 0.2;

    // Camera setup
    const camera = new BABYLON.ArcRotateCamera("camera", 
        0, Math.PI / 2, 5,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.lowerRadiusLimit = 2.1;
    camera.upperRadiusLimit = 10;
    camera.attachControl(true);
    scene.activeCamera = camera;

    // Stars background
    const starsDome = BABYLON.MeshBuilder.CreateSphere("stars", {
        diameter: 100,
        segments: 16
    }, scene);
    const starsMaterial = new BABYLON.StandardMaterial("starsMat", scene);
    starsMaterial.emissiveTexture = new BABYLON.Texture("textures/stars/circle.png", scene);
    starsMaterial.backFaceCulling = false;
    starsMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    starsDome.material = starsMaterial;
    starsDome.infiniteDistance = true;

    // Add zoom instruction text
    const guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const instructionText = new GUI.TextBlock();
    instructionText.text = "Zoom in to enter the simulation";
    instructionText.color = "black";
    instructionText.fontSize = 24;
    instructionText.fontFamily = "Cinzel";
    instructionText.top = "30px";
    instructionText.outlineWidth = 2;
    instructionText.outlineColor = "black";
    guiTexture.addControl(instructionText);

    // Add transition trigger when zoomed in close
    let isTransitioning = false;
    scene.registerBeforeRender(() => {
        // Rotate clouds slowly
        cloudLayer.rotation.y += 0.0003;
        earthSphere.rotation.y += 0.0002;

        if (!isTransitioning && camera.radius <= 2.2) {
            isTransitioning = true;
            startTransition(scene, engine, camera, earthSphere);
        }

        // Fade instruction text based on zoom level
        if (instructionText) {
            const zoomRange = camera.upperRadiusLimit - camera.lowerRadiusLimit;
            const currentZoom = camera.radius - camera.lowerRadiusLimit;
            const alpha = Math.min(currentZoom / zoomRange, 1);
            instructionText.alpha = alpha;
        }
    });

    async function startTransition(scene, engine, camera, earthSphere) {
        // Disable camera control
        camera.detachControl();

        // Create black screen for fade transition
        const fadeScreen = new GUI.Rectangle();
        fadeScreen.width = 1;
        fadeScreen.height = 1;
        fadeScreen.background = "black";
        fadeScreen.alpha = 0;
        guiTexture.addControl(fadeScreen);

        // Create fade out animation
        const fadeOut = new BABYLON.Animation(
            "fadeOut",
            "alpha",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const fadeKeys = [
            { frame: 0, value: 0 },
            { frame: 60, value: 1 }
        ];
        fadeOut.setKeys(fadeKeys);

        // Apply fade animation to the black screen
        fadeScreen.animations = [];
        fadeScreen.animations.push(fadeOut);

        scene.beginAnimation(fadeScreen, 0, 60, false, 1, async () => {
            try {
                // Import and create the game scene
                const gameScene = await import("./gameScene.js").then(module => {
                    return module.default(BABYLON, engine, scene);
                });
                
                // Dispose of current scene
                scene.dispose();
                
                // Update the engine's current scene
                engine.runRenderLoop(() => {
                    gameScene.render();
                });
            } catch (error) {
                console.error("Failed to load game scene:", error);
            }
        });
    }

    await scene.whenReadyAsync();
    if (currentScene) currentScene.dispose();
    return scene;
}

export default earthPortalScene;
