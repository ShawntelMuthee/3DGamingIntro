import "@babylonjs/core/Loading/Plugins/babylonFileLoader"
import { Scene } from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import { Player } from './entities/Player.js'
import { Enemy } from './entities/Enemy.js'

function CreateGround(scene, BABYLON) {
    const {Vector3,Color3, Texture, MeshBuilder, StandardMaterial} = BABYLON
    const ground = MeshBuilder.CreateGround("ground", {
        width: 500,
        height: 1000,
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

async function gameScene(BABYLON, engine, currentScene) {
    const {
        ActionManager,
        Matrix,
        ExecuteCodeAction, 
        SceneLoader, 
        Vector3, 
        StandardMaterial, 
        ArcRotateCamera,
        HemisphericLight
    } = BABYLON

    const scene = new Scene(engine)

    // Create player first
    const playerModel = await SceneLoader.ImportMeshAsync("", "../models/", "character.glb", scene);
    const player = new Player(playerModel.meshes[0], playerModel.animationGroups, scene, BABYLON);

    // Create array to store enemies
    const enemies = [];

    // Create enemies with player reference
    const enemy1Model = await SceneLoader.ImportMeshAsync("", "../models/", "character1.glb", scene);
    const enemy2Model = await SceneLoader.ImportMeshAsync("", "../models/", "character2.glb", scene);

    const enemy1 = new Enemy(enemy1Model.meshes[0], enemy1Model.animationGroups, scene, BABYLON, player);
    const enemy2 = new Enemy(enemy2Model.meshes[0], enemy2Model.animationGroups, scene, BABYLON, player);

    // Position enemies
    enemy1Model.meshes[0].position = new BABYLON.Vector3(5, 0, 5);
    enemy2Model.meshes[0].position = new BABYLON.Vector3(-5, 0, -5);

    // Add enemies to array
    enemies.push(enemy1, enemy2);

    // Load character first
    const rootMesh = playerModel.meshes[0]
    const animations = playerModel.animationGroups

    // Initialize position
    rootMesh.position = new Vector3(0, 0, 0)

    // Camera setup
    const cam = new ArcRotateCamera(
        "camera",
        Math.PI,
        Math.PI/2.5,
        3,
        rootMesh.position,
        scene
    );

    // Camera settings
    cam.lowerRadiusLimit = 2;
    cam.upperRadiusLimit = 4;
    cam.lowerBetaLimit = Math.PI/3;
    cam.upperBetaLimit = Math.PI/1.8;
    cam.inertia = 0.7;
    cam.angularSensibilityX = 1000;
    cam.angularSensibilityY = 1000;
    cam.speed = 0.3;

    const light = new HemisphericLight("light", new Vector3(0, 200, 0), scene)
    light.intensity = 1.2

    // Animation state tracking
    let currentAnimation = 'idle'
    let isAttacking = false
    let isJumping = false
    let isDead = false
    const moveSpeed = 0.01
    const keysPressed = new Set()
    const attackAnimations = ['attack', 'attack1']

    function playAnimation(animationName) {
        const newAnim = animations.find(anim => anim.name.toLowerCase() === animationName.toLowerCase())
        if (!newAnim) return

        // For attack animations
        if (animationName === 'attack') {
            if (!isAttacking) {
                isAttacking = true
                const attackAnim = attackAnimations[Math.floor(Math.random() * attackAnimations.length)]
                const selectedAnim = animations.find(anim => anim.name.toLowerCase() === attackAnim.toLowerCase())
                selectedAnim.play(false)
                selectedAnim.onAnimationEndObservable.addOnce(() => {
                    isAttacking = false
                    playAnimation('idle')
                })
            }
            return
        }

        // For all animations - no looping
        if (currentAnimation !== animationName) {
            if (animationName === 'run' && keysPressed.has('s')) {
                newAnim.play(false)
                newAnim.speedRatio = -1  // Reverse for backwards
            } else {
                newAnim.play(false)
                newAnim.speedRatio = 1  // Normal speed
            }
            currentAnimation = animationName
        }
    }

    // Start with idle animation
    playAnimation('idle')

    CreateGround(scene, BABYLON)

    // Add collision detection to attack
    function checkAttackCollision() {
        if (!isAttacking) return;
        
        const ATTACK_RANGE = 2;
        enemies.forEach(enemy => {
            if (enemy.isDead) return;
            
            const distance = Vector3.Distance(rootMesh.position, enemy.mesh.position);
            if (distance <= ATTACK_RANGE) {
                const isDead = enemy.takeDamage(20);
                if (isDead) {
                    // Handle enemy death
                    enemy.mesh.dispose();
                    enemy.healthBar.dispose();
                }
            }
        });
    }

    // Add enemy attack check
    function checkEnemyAttacks() {
        const ENEMY_ATTACK_RANGE = 2;
        enemies.forEach(enemy => {
            if (enemy.isDead) return;
            
            const distance = Vector3.Distance(rootMesh.position, enemy.mesh.position);
            if (distance <= ENEMY_ATTACK_RANGE && !enemy.isAttacking) {
                enemy.isAttacking = true;
                let playerDied = player.takeDamage(10);
                if (playerDied) {
                    isDead = true;
                    playAnimation('dead');
                }
                setTimeout(() => { enemy.isAttacking = false; }, 1000);
            }
        });
    }

    // Manual camera control - ONLY moves with arrow keys
    window.addEventListener("keydown", e => {
        const key = e.key.toLowerCase()
        keysPressed.add(key)
        
        // Manual camera rotation with arrow keys
        switch(e.key) {
            case "ArrowLeft":
                cam.alpha -= 0.05;
                break;
            case "ArrowRight":
                cam.alpha += 0.05;
                break;
            case "ArrowUp":
                cam.beta -= 0.05;
                break;
            case "ArrowDown":
                cam.beta += 0.05;
                break;
        }
        
        if (key === " ") {
            if (!isAttacking && !isJumping) {
                playAnimation('attack')
            }
        }
    })

    scene.registerAfterRender(() => {
        if (isDead) return

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

            // If no movement keys are pressed, play idle animation
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

        // Smooth camera follow without changing perspective
        const targetPosition = rootMesh.position.clone()
        targetPosition.y += 1.6
        cam.target = Vector3.Lerp(cam.target, targetPosition, 0.05)

        if (isAttacking) {
            checkAttackCollision();
        }
        checkEnemyAttacks();
    })

    window.addEventListener("keyup", e => {
        const key = e.key.toLowerCase()
        keysPressed.delete(key)
        
        if (keysPressed.size === 0 && !isAttacking && !isJumping) {
            playAnimation('idle')
        }
    })

    await scene.whenReadyAsync()
    currentScene.dispose()
    return scene
}

export default gameScene