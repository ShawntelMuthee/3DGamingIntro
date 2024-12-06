export class Player {
    constructor(mesh, animations, scene, BABYLON) {
        this.mesh = mesh;
        this.animations = animations;
        this.scene = scene;
        this.BABYLON = BABYLON;
        
        // Set initial rotation
        this.mesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
        
        // Adjust player scale if needed
        // this.mesh.scaling = new BABYLON.Vector3(1, 1, 1);
    }

    // Method to rotate player based on movement direction
    rotateFromMovement(moveVector) {
        if (!moveVector.equals(BABYLON.Vector3.Zero())) {
            const angle = Math.atan2(moveVector.x, moveVector.z);
            this.mesh.rotation.y = angle + Math.PI;
        }
    }

    // Method to update player position
    update() {
        // Add any per-frame updates here if needed
    }
}
