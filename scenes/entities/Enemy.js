export class Enemy {
    constructor(mesh, animations, scene, BABYLON, player) {
        this.mesh = mesh;
        this.animations = animations;
        this.scene = scene;
        this.BABYLON = BABYLON;
        this.player = player;
        this.health = 100;
        this.isAttacking = false;
        this.isDead = false;
        this.attackRange = 2;
        
        this.createHealthBar();
    }

    createHealthBar() {
        this.healthBar = this.BABYLON.MeshBuilder.CreatePlane("enemyHealthBar", {width: 1, height: 0.1}, this.scene);
        this.healthBar.parent = this.mesh;
        this.healthBar.position.y = 2;
        
        const healthMat = new this.BABYLON.StandardMaterial("enemyHealthMat", this.scene);
        healthMat.diffuseColor = new this.BABYLON.Color3(1, 0, 0);
        healthMat.emissiveColor = new this.BABYLON.Color3(1, 0, 0);
        this.healthBar.material = healthMat;
    }

    attack() {
        if (this.isAttacking || this.isDead) return;
        
        this.isAttacking = true;
        const attackAnim = Math.random() < 0.5 ? 'attack' : 'attack1';
        this.playAnimation(attackAnim);
        
        // Deal damage to player
        if (this.BABYLON.Vector3.Distance(this.mesh.position, this.player.mesh.position) <= this.attackRange) {
            this.player.takeDamage(20);
        }
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 1000);
    }

    playAnimation(animationName) {
        const anim = this.animations.find(a => a.name.toLowerCase() === animationName.toLowerCase());
        if (anim) {
            anim.play(animationName === 'run');
        }
    }

    die() {
        this.isDead = true;
        this.playAnimation('dead');
        setTimeout(() => {
            this.mesh.dispose();
            this.healthBar.dispose();
        }, 2000);
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
