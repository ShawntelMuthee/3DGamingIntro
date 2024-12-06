# Game Intro Simulation with Earth Portal

A WebGL-based 3D game application simulation that features an immersive Earth visualization portal leading to an interactive gaming environment.

## Overview

This web application creates an engaging user experience by replicating a Google Earth-like interface that transitions into a gaming world. Players begin with an interactive Earth view, zoom in to enter the game, and can explore a 3D environment with their character before entering a portal that leads to the game lobby.

## Technical Stack

- **Engine**: WebGL
- **Framework**: Babylon.js
- **Build Tool**: Vite
- **Language**: JavaScript

## Features

- Interactive 3D Earth visualization
- Smooth transition animations between scenes
- Character movement controls (WASD)
- Portal-based scene transitions
- Dynamic lighting and particle effects
- Character lobby system
- Realistic textures and materials

## Game Flow

1. **Earth Portal Scene**
   - Interactive Earth view with cloud layers
   - Zoom-in functionality to enter the game
   - Smooth fade transition effects

2. **Main Game Scene**
   - Controllable character
   - Interactive environment
   - Portal to lobby area
   - Dynamic lighting and shadows

3. **Mountain Lobby Scene**
   - Display of available game characters
   - Atmospheric environment with pillars
   - Rotating camera view
   - Multiple NPC characters

## Installation

1. Clone the repository:
   
git clone https://github.com/ShawntelMuthee/3dgame.git

2. Install dependencies:

npm install

3. Run the development server:
   
npm run dev


## Controls

- **W**: Move forward
- **S**: Move backward
- **A**: Move left
- **D**: Move right
- **Mouse**: Camera control
- **Scroll**: Zoom in/out (Earth scene)

## Development

This project is built using Vite for fast development and optimal production builds. The 3D rendering is handled by Babylon.js, providing powerful WebGL capabilities.

### Project Structure

├── src/
│ ├── main.js
│ └── style.css
├── scenes/
│ ├── earthPortalScene.js
│ ├── gameScene.js
│ └── mountainScene.js
├── models/
│ ├── character.glb
│ ├── character1.glb
│ └── character2.glb
└── textures/
├── earth/
└── environment/


## Building for Production

To create a production build:

npm run build


## Requirements

- Modern web browser with WebGL support
- Node.js and npm installed
- Minimum recommended resolution: 1920x1080

## License

[MIT License](LICENSE)

## Acknowledgments

- Babylon.js team for the powerful 3D engine
- Earth textures sourced from PolyHaven


