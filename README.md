# Tangerine Dreams

An interactive MIDI experience that explores speculative Afro-futuristic visions through the dreams of wise tangerines from the future, looking back to the past.

## Overview

**Tangerine Dreams** is a generative audiovisual installation that combines MIDI input, procedural visuals, synthesized sound, and text-to-speech to create an immersive experience. Each of the 16 MIDI notes (60-75) triggers a unique dream vision—vivid, absurd, and prophetic narratives told from the perspective of future tangerines reflecting on speculative futures.

## Features

### 🎹 MIDI Interaction
- **16 Dream Triggers**: MIDI notes 60-75 each activate a unique dream vision
- **Real-time Response**: Instant visual and audio feedback on note press
- **Continuous Looping**: Hold a note to loop the dream's speech and visuals

### 🎨 Generative Visuals
- **Tangerine-Themed Animations**: All visuals are themed around tangerines and citrus fruits
- **Color Explosions**: Vibrant tangerine and citrus color palettes create "explosions of color as flavor"
- **Dynamic Effects**: 
  - Juice droplets and citrus sparkles
  - Flavor bursts and ripple patterns
  - Orbiting citrus segments
  - Pulsing flavor auras
  - Peel segments and juice streams

### 🔊 Audio Synthesis
- **Pipe Organ Sound**: Web Audio API synthesizes pipe organ tones for each MIDI note
- **Reverb Effects**: Spatial audio processing creates an immersive soundscape
- **Text-to-Speech**: Web Speech API reads each dream text aloud
  - Speech loops continuously while the note is held
  - Stops immediately when the note is released

### 📖 Dream Narratives
Each dream is a rich, vivid narrative exploring themes of:
- Liberation and freedom
- Ancestral connections
- Collective memory
- Speculative futures
- Afro-futuristic perspectives
- Absurd, dreamlike imagery

The 16 dreams include titles such as:
- Golden Cities
- Ancestral Rivers
- Liberation Songs
- Unity Gardens
- Hope Harvests
- And 11 more unique visions...

## Technical Stack

- **p5.js**: Generative visual rendering and animation
- **WebMidi.js**: MIDI input handling
- **Web Audio API**: Pipe organ sound synthesis with reverb
- **Web Speech API**: Text-to-speech for dream narration
- **HTML/CSS/JavaScript**: Frontend framework

## Setup

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser (Chrome, Firefox, Safari, Edge)
3. **Connect Platron** (or any MIDI device with 16 inputs mapped to notes 60-75)
4. **Click "Enter the Dreams"** to begin
5. **Allow MIDI access** when prompted by your browser

**Note:** This installation is optimized for **Platron** by **Platronica**, which provides 16 MIDI inputs corresponding to the 16 dream visions.

## Usage

1. **Start the Experience**: Click the "Enter the Dreams" button on the welcome screen
2. **Connect Platron**: Ensure your Platron device (or MIDI controller) is connected and recognized by the browser
3. **Trigger Dreams**: Press MIDI notes 60-75 on Platron to activate different dream visions
4. **Hold Notes**: Keep a note pressed to loop the dream's speech and maintain the visual state
5. **Release Notes**: Release a note to stop the speech and transition to the next state

**Platron Device:** The 16 inputs on Platron directly map to the 16 dream visions, creating an intuitive interface for exploring the tangerine dreams.

### Instructions
- **Touch the tangerines in the baskets and one of the 16 tangerines on the edge of the table at the same time to receive the dream. Keep touching to receive the whole dream.**
- **To get another dream, touch another tangerine outside the basket.**
- **You may take one of the tangerines to eat them later. And the dream will be part of you.**

## Browser Requirements

- Modern browser with Web MIDI API support
- Web Audio API support
- Web Speech API support
- JavaScript enabled

### Audio Note
- Make sure your system volume is up and the browser tab is not muted
- **On macOS**: Check System Settings > Sound > "System Voice" volume (this is separate from media volume)

## Project Structure

```
Tangerine Dreams/
├── index.html          # Main HTML file with welcome screen and MIDI setup
├── sketch.js           # p5.js sketch with all visuals, audio, and speech logic
└── README.md           # This file
```

## Key Functions

- **`handleNoteOn(e)`**: Processes MIDI note-on events, starts visuals and speech
- **`handleNoteOff(e)`**: Processes MIDI note-off events, stops audio and speech
- **`startDreamSpeech(midiNote, text)`**: Initiates text-to-speech for dream narration
- **`stopDreamSpeech(midiNote)`**: Stops speech synthesis
- **`drawCenterTangerine()`**: Renders the central tangerine visualization
- **`drawFlavorEffects()`**: Creates tangerine-themed visual effects
- **`updateParticles()`**: Manages juice droplet animations

## Development Notes

- Speech synthesis requires user interaction (button click) to initialize
- MIDI access requires user permission in most browsers
- Visual effects are optimized for smooth 60fps performance
- Color palettes are carefully curated tangerine and citrus shades

## Credits

**Created by:** Marlon Barrio Solano

**Premiere:** Afrofuturism Week  
Organized by the Center of Art, Migration and Entrepreneurship  
University of Florida  
January 31st, 2026

Created as an interactive art installation exploring Afro-futurism, speculative fiction, and generative media.

## Device

This installation is designed for use with **Platron** from **Platronica**, a MIDI controller featuring 16 MIDI inputs (notes 60-75), each corresponding to one of the 16 dream visions.

## License

MIT License

Copyright (c) 2026 Marlon Barrio Solano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
