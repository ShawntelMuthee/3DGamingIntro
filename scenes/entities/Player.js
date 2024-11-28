export class Player {
    constructor(mesh, animations, scene, BABYLON) {
        this.mesh = mesh;
        this.animations = animations;
        this.scene = scene;
        this.health = 100;
        this.isAttacking = false;
        this.isDead = false;
        
        // Create health bar
        const healthBar = BABYLON.MeshBuilder.CreatePlane("healthBar", {width: 1, height: 0.1}, scene);
        healthBar.parent = mesh;
        healthBar.position.y = 2;
        
        const healthMat = new BABYLON.StandardMaterial("healthMat", scene);
        healthMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        healthMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        healthBar.material = healthMat;
        
        this.healthBar = healthBar;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        this.healthBar.scaling.x = this.health / 100;
        
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            return true; // Indicates death
        }
        return false;
    }
}
