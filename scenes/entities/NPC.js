export class NPC {
    constructor(mesh, animations, scene, BABYLON, animationType) {
        this.mesh = mesh;
        this.animations = animations;
        this.scene = scene;
        this.BABYLON = BABYLON;
        this.animationType = animationType; // 'attack', 'attack1', or 'run'
        this.isPlaying = false;

        // Start the assigned animation loop
        this.startAnimation();
    }

    startAnimation() {
        // Find the assigned animation
        const animation = this.animations.find(
            anim => anim.name.toLowerCase() === this.animationType.toLowerCase()
        );

        if (animation) {
            animation.play(true); // true means loop
            this.isPlaying = true;

            // For run animation, add some movement
            if (this.animationType === 'run') {
                this.addMovementBehavior();
            }
        }
    }

    addMovementBehavior() {
        // Only add movement for running NPCs
        if (this.animationType !== 'run') return;

        // Create a simple circular path
        let angle = 0;
        const radius = 5;
        const center = this.mesh.position.clone();

        this.scene.registerBeforeRender(() => {
            // Move in a circle
            angle += 0.001;
            const newX = center.x + radius * Math.cos(angle);
            const newZ = center.z + radius * Math.sin(angle);
            
            // Calculate direction for mesh rotation
            const direction = this.mesh.position.subtract(
                new this.BABYLON.Vector3(newX, center.y, newZ)
            );
            
            // Update position
            this.mesh.position.x = newX;
            this.mesh.position.z = newZ;
            
            // Update rotation to face movement direction
            if (direction.length() > 0.01) {
                const desiredRotation = Math.atan2(direction.x, direction.z);
                this.mesh.rotation.y = desiredRotation;
            }
        });
    }

    // Method to change animation if needed
    changeAnimation(newAnimationType) {
        if (this.isPlaying) {
            const currentAnim = this.animations.find(
                anim => anim.name.toLowerCase() === this.animationType.toLowerCase()
            );
            if (currentAnim) {
                currentAnim.stop();
            }
        }

        this.animationType = newAnimationType;
        this.startAnimation();
    }
}