// Array to store active MIDI notes
let activeNotes = [];
let particles = [];
let channelColors = [];
let channelActivity = []; // Track activity level per channel
let currentNote = null; // Current active note for center display
let centerRotation = 0;
let energyWaves = []; // Ripple effects
let moons = []; // Orbiting moons
let planetTransition = 1.0; // Smooth color transition
let previousColor = null;

// Web Audio API for pipe organ synthesis
let audioContext = null;
let masterGain = null;
let reverbNode = null;
let activeOscillators = new Map(); // Track active notes for note-off

// Speech Synthesis API for reading dream texts
let activeSpeech = new Map(); // Track active speech for each MIDI note
let speechEndTimes = new Map(); // Track when speech ends for looping
let speechUtterances = new Map(); // Store utterances for each note
let currentlySpeakingNote = null; // Track which note is currently being spoken

// Tangerine dream titles for each MIDI note (60-75) - short evocative names
const satelliteNames = [
  "Golden Cities",           // Note 60
  "Ancestral Rivers",        // Note 61
  "Liberation Songs",         // Note 62
  "Unity Gardens",           // Note 63
  "Hope Harvests",           // Note 64
  "Resilient Roots",         // Note 65
  "Freedom Networks",        // Note 66
  "Future Memories",         // Note 67
  "Wisdom Trees",            // Note 68
  "Power Seeds",             // Note 69
  "Tomorrow's Sun",          // Note 70 
  "Harmonic Worlds",         // Note 71
  "Connected Realms",        // Note 72
  "Memory Archives",         // Note 73
  "Infinite Possibilities",  // Note 74
  "Collective Voices"        // Note 75
];

// Dreams from wise tangerines of the future, looking back to the past - Afro-futuristic visions with absurd dreamlike imagery
const satelliteMessages = [
  "I dream of golden cities where buildings are made of crystallized honey and the streets are rivers of liquid starlight. In this dream, the spires sing lullabies in forgotten languages, and the windows are eyes that blink slowly, watching us remember. People float through these cities on clouds of their own making, carrying baskets woven from time itself. The air tastes of tangerines and possibility, and every door opens to a different yesterday.",
  
  "I dream of ancestral rivers that flow upward into the sky, their waters made of liquid memory that tastes like your grandmother's voice. In this dream, the riverbanks are lined with flowers that bloom into faces—faces of those who came before, singing their names in colors we've never seen. Fish swim through the air above us, their scales showing moving pictures of futures not yet written. We drink from these waters and remember what we have not yet forgotten, and the current flows both ways, connecting all moments into one impossible stream.",
  
  "I dream of liberation songs that take physical form—they become bridges made of sound, stairways of melody that spiral into freedom. In this dream, every voice that was silenced becomes a bell that rings forever, and the songs build structures of pure harmony that float above oppression. When we sing together, the very fabric of reality unravels and reweaves itself into something new. Liberation becomes not a destination but a frequency we tune ourselves to, and our bodies become instruments playing the music of tomorrow.",
  
  "I dream of unity gardens where the plants speak in colors instead of words, where flowers bloom into geometric patterns that spell out messages of connection. In this dream, the trees have roots that reach into other dimensions, and the soil is made of crushed stars that glow softly. Every plant knows its neighbor's name because they share the same dream. The garden teaches us that strength comes not from sameness but from the intricate dance of difference, and we tend these gardens with hands that have learned to grow light.",
  
  "I dream of hope harvests where we gather fruits that contain entire galaxies within their flesh, fruits that taste like the feeling of a perfect moment remembered. In this dream, the trees are planted upside down, their roots reaching into the sky, and we harvest by climbing upward into clouds. Each fruit contains a vision—bite into one and taste a future where justice flows like water and flows backward through time to water the seeds of the past. We share these fruits freely, and when we do, new trees sprout from the seeds we didn't know we were planting.",
  
  "I dream of resilient roots that are made of pure will, roots that grow through solid rock and concrete and the hardest of hearts. In this dream, these roots connect to a network that spans not just space but time itself, and when you touch one root, you can feel the pulse of ancestors and descendants simultaneously. The roots remember everything—they remember the songs, the struggles, the moments of pure joy. When storms come, the roots become flexible like water, bending impossibly without breaking, because they are anchored in truth that cannot be uprooted.",
  
  "I dream of freedom networks that exist in the spaces between thoughts, networks made of light and intention that connect every being who has ever yearned for liberation. In this dream, the network pulses with messages written in the language of resistance, messages that travel faster than light because they move through dimensions we can't perceive. Each connection strengthens the whole—when one link breaks, others form instantly, because freedom is not a thing but a pattern that replicates itself. The network proves that isolation is an illusion, that we are never truly alone in our struggle.",
  
  "I dream of future memories that arrive before the events they remember, memories that come to us like letters from tomorrow. In this dream, we remember the world we will build, the justice we will create, the love we will share—and these memories feel more real than the present moment. The memories guide us like stars that haven't been born yet, showing us paths through darkness we haven't entered. We carry them forward in pockets made of time itself, and they shape our present actions like a sculptor shapes clay. The future remembers us, and we remember the future, and in this circular remembering, we create both.",
  
  "I dream of wisdom trees whose bark is made of compressed stories, whose leaves are pages that turn themselves, revealing knowledge written in languages that don't exist yet. In this dream, the trees grow upside down and right-side up simultaneously, and their fruit is made of crystallized understanding that dissolves on your tongue into pure knowing. We sit beneath these trees and listen, and the trees speak in voices that are many voices speaking as one. The trees grow from seeds planted by elders we've never met, and we plant seeds for trees that will shelter descendants who haven't been born. Wisdom flows through us like sap, connecting past and future in an impossible loop.",
  
  "I dream of power seeds that are smaller than atoms but contain entire universes within their shells, seeds that glow with their own inner light. In this dream, we plant these seeds in the cracks of oppression, and they grow into structures made of pure possibility—buildings that shift and change, bridges that appear where they're needed, doors that open to liberation. Each seed knows exactly what it needs to become, drawing strength from the soil of our collective will. When we nurture these seeds together, they sprout into realities we dared not imagine alone, realities that exist in multiple dimensions simultaneously. Power grows from the ground up, and also from the sky down, and from all directions at once.",
  
  "I dream of tomorrow's sun that rises in the middle of the night, a sun made of compressed hope that illuminates paths we are still discovering. In this dream, the sun remembers all the dawns that came before and all the dawns yet to come, and it shines them all at once in a light that makes everything possible. The sun's warmth melts the ice of despair, and the ice becomes rivers that water the seeds of tomorrow. We bask in this light, and our shadows become doorways to other possibilities. Even in darkness, the sun is always rising somewhere—in fact, it's rising everywhere, in all times at once.",
  
  "I dream of harmonic worlds where every voice finds its place in a symphony that exists in four dimensions, where dissonance resolves into understanding that tastes like honey. In this dream, we learn to listen not just to what is said but to the spaces between words, spaces that are filled with meaning we can only perceive in dreams. The harmony is not uniformity but the beautiful complexity of many notes creating one song that exists as both sound and light and feeling. When we find our note and sing it true, the whole composition shifts toward beauty, and the universe itself harmonizes with us.",
  
  "I dream of connected realms where the boundaries between past, present, and future dissolve like mist in morning light, where time flows in all directions at once. In this dream, we move freely between times, learning from ancestors and teaching descendants in the same moment, and the moment expands to contain all moments. The connections form a web of being that holds us all, a web made of threads of possibility that shimmer with their own inner light. We are nodes in this network, receiving and transmitting wisdom across dimensions we can't perceive when awake. Isolation becomes impossible when we remember our connections, connections that exist in the spaces between atoms and in the spaces between thoughts.",
  
  "I dream of memory archives where every story is preserved in crystalline structures that refract light into new colors we've never seen, colors that exist only in dreams. In this dream, memories are not static but living things that grow and change, that speak to us in voices we recognize from deep within ourselves. The archives exist in a building that has no walls, a library that exists in multiple dimensions simultaneously. The archives protect what others tried to erase, ensuring that our narratives survive and multiply, and when we visit these archives, the memories rearrange themselves to show us what we need to remember. Memory becomes a form of resistance, and the resistance becomes memory, in an endless loop of remembering and resisting.",
  
  "I dream of infinite possibilities branching like a tree whose every branch splits into new branches, creating a canopy that shades all potential futures in a light made of pure potential. In this dream, we walk among these branches, and the branches are also paths, and the paths are also rivers, and the rivers are also songs. We choose paths that lead to worlds we want to inhabit, and the choosing itself creates the worlds. The tree reminds us that we are not limited to one future, that our choices matter, that we can shape what comes next. Possibility is not abstract—it is the very ground we walk on, ground that shifts and changes with every step, ground that remembers where we've been and anticipates where we're going.",
  
  "I dream of collective voices rising in a chorus that shakes the foundations of injustice, voices that become visible as streams of light that converge into a river of sound. In this dream, every voice matters, every story contributes to the song, and the song itself becomes a force that can move mountains and reshape reality. When we sing together, our individual notes combine into harmonies that exist in dimensions beyond sound, harmonies that can be seen and felt and tasted. The chorus grows as more voices join, until it becomes a force that cannot be ignored, a force that creates new foundations of justice made of pure harmony. Together, we are a song that creates the world, and the world sings back to us in a language we're only beginning to understand."
];

// Channel colors for visualization (16 tangerine and citrus colors - explosions of flavor)
function initializeColors() {
  channelColors = [
    color(255, 140, 0),     // Channel 1 - Deep Tangerine
    color(255, 165, 0),     // Channel 2 - Bright Orange
    color(255, 200, 50),    // Channel 3 - Golden Tangerine
    color(255, 220, 100),   // Channel 4 - Light Tangerine
    color(255, 180, 60),    // Channel 5 - Warm Orange
    color(255, 150, 30),    // Channel 6 - Rich Tangerine
    color(255, 190, 80),    // Channel 7 - Juicy Orange
    color(255, 170, 40),    // Channel 8 - Vibrant Tangerine
    color(255, 160, 20),    // Channel 9 - Deep Orange
    color(255, 175, 55),    // Channel 10 - Citrus Orange
    color(255, 145, 15),    // Channel 11 - Bold Tangerine
    color(255, 195, 70),    // Channel 12 - Sunny Orange
    color(255, 155, 25),    // Channel 13 - Fresh Tangerine
    color(255, 185, 65),    // Channel 14 - Zesty Orange
    color(255, 135, 10),    // Channel 15 - Intense Tangerine
    color(255, 210, 90)     // Channel 16 - Light Citrus
  ];
  
  // Initialize activity levels for each channel
  for (let i = 0; i < 16; i++) {
    channelActivity[i] = 0;
  }
}

// Function to handle MIDI note on events (called from WebMidi listener)
function handleNoteOn(e) {
  const midiNote = e.note.number;
  
  // Map MIDI notes 60-75 to visual channels 1-16
  // MIDI note 60 = visual channel 1, MIDI note 61 = visual channel 2, etc.
  const visualChannel = midiNote - 59; // 60 becomes 1, 61 becomes 2, etc.
  
  // Only process notes 60-75 (16 notes)
  if (midiNote < 60 || midiNote > 75) {
    console.log(`Note ${midiNote} out of range (60-75), skipping`);
    return;
  }
  
  // Debug: Log note information
  console.log(`[handleNoteOn] MIDI Note: ${midiNote} (${e.note.name}${e.note.octave}) -> Visual Channel: ${visualChannel}`);
  
  // Get tangerine dream for this MIDI note (must be defined before use)
  const satelliteMessage = satelliteMessages[visualChannel - 1] || "A dream awaits.";
  
  // Use the short dream title from satelliteNames array
  let satelliteName = satelliteNames[visualChannel - 1] || "A dream awaits.";
  
  // Play pipe organ sound
  playPipeOrganNote(midiNote, e.rawVelocity);
  
  // Start reading the dream text with voice synthesis
  startDreamSpeech(midiNote, satelliteMessage);
  
  // Increase channel activity
  channelActivity[visualChannel - 1] = 1.0;
  
  // Calculate position based on visual channel (4x4 grid)
  // Check if width/height are available (canvas might not be initialized yet)
  const sectionWidth = (typeof width !== 'undefined' && width > 0) ? width / 4 : 200;
  const sectionHeight = (typeof height !== 'undefined' && height > 0) ? height / 4 : 200;
  const gridCol = (visualChannel - 1) % 4;
  const gridRow = Math.floor((visualChannel - 1) / 4);
  const centerX = sectionWidth * gridCol + sectionWidth / 2;
  const centerY = sectionHeight * gridRow + sectionHeight / 2;
  
  // Set current note for center display
  currentNote = {
    note: e.note.name + e.note.octave,
    midiNumber: midiNote,
    channel: visualChannel,
    velocity: e.rawVelocity,
    timestamp: millis(),
    color: channelColors.length > 0 ? channelColors[visualChannel - 1] : color(255, 255, 255),
    satelliteName: satelliteName,
    satelliteMessage: satelliteMessage
  };
  
  // Debug: Log visual state update
  console.log(`[Visual] Updated currentNote: ${satelliteName}, Channel: ${visualChannel}, Activity: ${channelActivity[visualChannel - 1]}`);
  
  // Create main note visual
  activeNotes.push({
    note: e.note.name + e.note.octave,
    midiNumber: midiNote,
    channel: visualChannel, // Use visual channel for display
    velocity: e.rawVelocity,
    timestamp: millis(),
    x: centerX + random(-sectionWidth * 0.25, sectionWidth * 0.25),
    y: centerY + random(-sectionHeight * 0.25, sectionHeight * 0.25),
    color: channelColors.length > 0 ? channelColors[visualChannel - 1] : color(255, 255, 255),
    rotation: random(TWO_PI),
    rotationSpeed: random(-0.05, 0.05)
  });
  
  // Create intense juice droplet burst around center tangerine - match tangerine position
  const noteColor = channelColors[visualChannel - 1];
  const numParticles = map(e.rawVelocity, 0, 127, 25, 60); // More juice droplets
  const tangerineCenterX = width / 2;
  const tangerineCenterY = height * 0.28; // Match tangerine position
  
  for (let i = 0; i < numParticles; i++) {
    const angle = (TWO_PI / numParticles) * i + random(-0.3, 0.3);
    const speed = random(4, 10); // Juice droplet speed
    particles.push({
      x: tangerineCenterX,
      y: tangerineCenterY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      color: noteColor,
      size: random(8, 20), // Larger juice droplets
      life: 1.0,
      decay: random(0.006, 0.015), // Slower decay for juicy effect
      type: random() > 0.5 ? 'droplet' : 'segment' // Different particle types
    });
  }
  
  // Create flavor burst wave/ripple - fluid scaling with window
  let maxWaveRadius = min(width, height) * 0.9; // Larger flavor bursts
  energyWaves.push({
    x: tangerineCenterX,
    y: tangerineCenterY,
    radius: 0,
    maxRadius: maxWaveRadius,
    speed: map(min(width, height), 500, 2000, 3, 8), // Faster on larger screens
    color: noteColor,
    alpha: 180 // More vibrant flavor bursts
  });
  
  // Add or update citrus segments (up to 3 segments) - scale with window
  if (moons.length < 3) {
    let baseDistance = min(width, height) * 0.25;
    let segmentSize = map(min(width, height), 500, 2000, 15, 35);
    moons.push({
      angle: random(TWO_PI),
      distance: baseDistance + random(-50, 50),
      speed: random(0.01, 0.03),
      size: segmentSize,
      color: noteColor
    });
  }
  
  // Update transition for smooth color change
  if (previousColor) {
    planetTransition = 0;
  }
  previousColor = noteColor;
  
  // Log to console
  console.log(`Channel ${visualChannel}: Note ${e.note.name}${e.note.octave} (MIDI ${e.note.number}), Velocity: ${e.rawVelocity}`);
}

// Function to handle MIDI note off events
function handleNoteOff(e) {
  const midiNote = e.note.number;
  
  // Map MIDI notes 60-75 to visual channels 1-16
  const visualChannel = midiNote - 59;
  
  // Only process notes 60-75
  if (midiNote < 60 || midiNote > 75) {
    return;
  }
  
  // Stop pipe organ sound
  stopPipeOrganNote(midiNote);
  
  // Stop reading the dream text when note is released
  stopDreamSpeech(midiNote);
  
  // Remove note from active notes array (match by MIDI number)
  activeNotes = activeNotes.filter(note => 
    note.midiNumber !== midiNote
  );
  
  // Clear current note if it was the one released
  if (currentNote && currentNote.midiNumber === midiNote) {
    currentNote = null;
  }
}

// Speech Synthesis Functions for reading dream texts
let speechSynthesisEnabled = false;
let speechSynthesisInitialized = false;

// Test function - call this from browser console to test speech
window.testSpeech = function() {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis not supported');
    return;
  }
  console.log('[Test] Starting speech test...');
  const testUtterance = new SpeechSynthesisUtterance('Hello, this is a test of speech synthesis. Can you hear me?');
  testUtterance.volume = 1.0;
  testUtterance.rate = 0.9;
  testUtterance.lang = 'en-US';
  testUtterance.onstart = () => {
    console.log('✅ Test speech STARTED! You should hear it now.');
    alert('Speech started! Check if you can hear it.');
  };
  testUtterance.onend = () => {
    console.log('✅ Test speech ENDED');
  };
  testUtterance.onerror = (e) => {
    console.error('❌ Test speech error:', e.error);
    alert('Speech error: ' + e.error);
  };
  
  // Cancel any existing speech
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    setTimeout(() => {
      speechSynthesis.speak(testUtterance);
      console.log('[Test] Test speech called after cancel');
    }, 100);
  } else {
    speechSynthesis.speak(testUtterance);
    console.log('[Test] Test speech called directly');
  }
  
  setTimeout(() => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      console.log('[Test] ✅ Speech is playing!');
    } else {
      console.error('[Test] ❌ Speech did NOT start!');
      console.error('[Test] Check: 1) Browser volume 2) System volume 3) Page is in focus');
    }
  }, 500);
};

// Initialize speech synthesis (call this after user interaction)
// Make it globally accessible so HTML can call it
window.initializeSpeechSynthesis = function() {
  if (!('speechSynthesis' in window)) {
    console.warn('[Speech] Speech synthesis not supported in this browser');
    return false;
  }
  
  // Try to get voices to initialize the API
  const voices = speechSynthesis.getVoices();
  console.log(`[Speech] Found ${voices.length} voices available`);
  
  if (voices.length > 0) {
    speechSynthesisInitialized = true;
    console.log('[Speech] Speech synthesis initialized successfully');
    // Log available voices for debugging
    voices.forEach((voice, index) => {
      if (index < 5) { // Only log first 5 to avoid spam
        console.log(`[Speech] Voice ${index}: ${voice.name} (${voice.lang})`);
      }
    });
    return true;
  } else {
    // Wait for voices to load
    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      console.log(`[Speech] Voices loaded: ${voices.length} voices available`);
      speechSynthesisInitialized = true;
      // Log available voices for debugging
      voices.forEach((voice, index) => {
        if (index < 5) { // Only log first 5 to avoid spam
          console.log(`[Speech] Voice ${index}: ${voice.name} (${voice.lang})`);
        }
      });
      speechSynthesis.onvoiceschanged = null;
    };
    return true;
  }
};

function startDreamSpeech(midiNote, text) {
  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.error('[Speech] ❌ Speech synthesis not supported in this browser');
    alert('Speech synthesis is not supported in this browser. Please try Chrome, Edge, or Safari.');
    return;
  }
  
  console.log(`[Speech] 🎤 Attempting to speak note ${midiNote} with text length: ${text.length}`);
  console.log(`[Speech] Text preview: "${text.substring(0, 100)}..."`);
  
  // Only stop speech if it's for a DIFFERENT note
  // Don't stop speech for the same note (allows restarting/looping)
  if (currentlySpeakingNote !== null && currentlySpeakingNote !== midiNote) {
    console.log(`[Speech] Stopping speech for different note (${currentlySpeakingNote})`);
    stopDreamSpeech(currentlySpeakingNote);
  } else if (currentlySpeakingNote === midiNote) {
    console.log(`[Speech] Note ${midiNote} is already speaking - will restart it`);
    // Cancel current speech so we can start fresh
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
  }
  
  // Create new speech utterance - MUST be created fresh each time
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure voice settings - try to use a pleasant voice
  utterance.rate = 0.85; // Slightly slower for dream-like quality
  utterance.pitch = 1.0;
  utterance.volume = 1.0; // Full volume to ensure it's audible
  utterance.lang = 'en-US'; // Explicitly set language
  
  // Force volume to maximum (some browsers ignore volume property)
  // Try setting it multiple ways
  try {
    utterance.volume = 1.0;
    Object.defineProperty(utterance, 'volume', { value: 1.0, writable: true });
  } catch (e) {
    // Ignore if we can't set it
  }
  
  // Function to set voice (voices may not be loaded immediately)
  const setVoice = () => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prefer voices with "female" or "woman" in name, or default to a pleasant one
      let preferredVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('susan')
      );
      
      if (!preferredVoice) {
        // Fallback to any non-robotic sounding voice
        preferredVoice = voices.find(v => 
          !v.name.toLowerCase().includes('robotic') &&
          !v.name.toLowerCase().includes('microsoft david') &&
          !v.name.toLowerCase().includes('microsoft mark')
        ) || voices[0];
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log(`Using voice: ${preferredVoice.name}`);
      }
    }
  };
  
  // Try to set voice immediately
  setVoice();
  
  // If voices aren't loaded yet, wait for them
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      setVoice();
      speechSynthesis.onvoiceschanged = null; // Remove listener after first call
    };
  }
  
  // Store utterance and mark as active
  const noteKey = midiNote.toString();
  speechUtterances.set(noteKey, utterance);
  activeSpeech.set(noteKey, {
    midiNote: midiNote,
    text: text,
    isWaitingToLoop: false,
    startTime: millis()
  });
  
  // Mark this note as currently speaking
  currentlySpeakingNote = midiNote;
  
  // Note: onend handler is now set above with other event listeners
  
  // Add ALL event listeners BEFORE speaking
  utterance.onstart = () => {
    console.log(`[Speech] ✅ Speech STARTED for note ${midiNote}`);
    console.log(`[Speech] Currently speaking: ${speechSynthesis.speaking}, Pending: ${speechSynthesis.pending}`);
  };
  
  utterance.onend = () => {
    console.log(`[Speech] ✅ Speech ENDED for note ${midiNote}`);
    // Reset currently speaking note
    if (currentlySpeakingNote === midiNote) {
      currentlySpeakingNote = null;
    }
    
    const noteKey = midiNote.toString();
    speechEndTimes.set(noteKey, millis());
    
    // Check if note is still active - if so, mark for looping
    const isNoteActive = activeNotes.some(note => note.midiNumber === midiNote);
    if (isNoteActive) {
      // Note is still held - loop the speech
      activeSpeech.set(noteKey, {
        midiNote: midiNote,
        text: text,
        isWaitingToLoop: true,
        endTime: millis()
      });
    } else {
      // Note was released, but speech finished naturally - just clean up tracking
      // Don't delete immediately - let it stay in memory briefly in case user wants to restart
      console.log(`[Speech] Note ${midiNote} speech finished (note was released)`);
      // Keep speechUtterances for a bit in case user presses note again
      // Clean up after a delay
      setTimeout(() => {
        activeSpeech.delete(noteKey);
        speechUtterances.delete(noteKey);
      }, 1000);
    }
  };
  
  utterance.onerror = (event) => {
    // 'canceled' is not a real error - ignore it
    if (event.error === 'canceled') {
      console.log(`[Speech] ℹ️ Speech canceled for note ${midiNote} (this is normal)`);
      return; // This is normal when switching dreams
    }
    
    // Log real errors
    console.error(`[Speech] ❌ ERROR for note ${midiNote}:`, event);
    console.error(`[Speech] Error type: ${event.error}`);
    console.error(`[Speech] Error charIndex: ${event.charIndex}`);
    
    if (event.error === 'not-allowed') {
      console.error('[Speech] ❌ Speech not allowed. User interaction required!');
      alert('Speech synthesis requires user interaction. Please click "Enter the Dreams" button first, then try again.');
    } else if (event.error === 'synthesis-failed') {
      console.error('[Speech] ❌ Synthesis failed. Check browser settings.');
    } else if (event.error === 'synthesis-unavailable') {
      console.error('[Speech] ❌ Synthesis unavailable. Check browser settings.');
    }
    
    if (currentlySpeakingNote === midiNote) {
      currentlySpeakingNote = null;
    }
    const noteKey = midiNote.toString();
    activeSpeech.delete(noteKey);
    speechEndTimes.delete(noteKey);
    speechUtterances.delete(noteKey);
  };
  
  utterance.onpause = () => {
    console.log(`[Speech] ⏸ Speech paused for note ${midiNote}`);
  };
  
  utterance.onresume = () => {
    console.log(`[Speech] ▶ Speech resumed for note ${midiNote}`);
  };
  
  // Note: noteKey, utterance storage, and currentlySpeakingNote are already set above
  
  // Start speaking - simplified and more reliable approach
  try {
    // Always cancel any existing speech first to ensure clean state
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      console.log('[Speech] ⏹ Canceling any existing speech...');
      speechSynthesis.cancel();
      // Wait for cancellation using setTimeout
      setTimeout(() => {
        console.log('[Speech] 🎤 Speaking after cancel...');
        speechSynthesis.speak(utterance);
        console.log(`[Speech] 📢 speak() called for note ${midiNote}`);
        console.log(`[Speech] Volume: ${utterance.volume}, Rate: ${utterance.rate}, Lang: ${utterance.lang}`);
        console.log(`[Speech] Voice: ${utterance.voice ? utterance.voice.name : 'default'}`);
        
        // Check status
        setTimeout(() => {
          const isSpeaking = speechSynthesis.speaking || speechSynthesis.pending;
          console.log(`[Speech] Status: speaking=${speechSynthesis.speaking}, pending=${speechSynthesis.pending}`);
          if (isSpeaking) {
            console.log('[Speech] ✅ Speech is playing!');
          } else {
            console.error('[Speech] ❌ Speech did NOT start! Check browser/system volume.');
          }
        }, 300);
      }, 200);
    } else {
      // No existing speech - speak directly
      console.log('[Speech] 🎤 Speaking directly...');
      speechSynthesis.speak(utterance);
      console.log(`[Speech] 📢 speak() called for note ${midiNote}`);
      console.log(`[Speech] Volume: ${utterance.volume}, Rate: ${utterance.rate}, Lang: ${utterance.lang}`);
      console.log(`[Speech] Voice: ${utterance.voice ? utterance.voice.name : 'default'}`);
      
      // Check status after a moment
      setTimeout(() => {
        const isSpeaking = speechSynthesis.speaking || speechSynthesis.pending;
        console.log(`[Speech] Status: speaking=${speechSynthesis.speaking}, pending=${speechSynthesis.pending}`);
        if (isSpeaking) {
          console.log('[Speech] ✅ Speech is playing!');
        } else {
          console.error('[Speech] ❌ Speech did NOT start!');
          console.error('[Speech] Try: testSpeech() in console to test if speech works at all');
        }
      }, 300);
    }
    
  } catch (error) {
    console.error('[Speech] ❌ Exception:', error);
  }
}

function stopDreamSpeech(midiNote) {
  if (!('speechSynthesis' in window)) {
    return;
  }
  
  const noteKey = midiNote.toString();
  
  // Cancel speech immediately when note is released
  if (currentlySpeakingNote === midiNote) {
    console.log(`[Speech] ⏹ Stopping speech for note ${midiNote} (note released)`);
    speechSynthesis.cancel();
    currentlySpeakingNote = null;
  }
  
  // Remove from active speech tracking
  activeSpeech.delete(noteKey);
  speechEndTimes.delete(noteKey);
  speechUtterances.delete(noteKey);
  
  console.log(`[Speech] Note ${midiNote} released - speech stopped`);
}

function updateDreamSpeechLooping() {
  if (!('speechSynthesis' in window)) {
    return;
  }
  
  const currentTime = millis();
  
  // Check all active speech entries
  for (let [noteKey, speechData] of activeSpeech.entries()) {
    const midiNote = speechData.midiNumber;
    
    // Check if note is still active
    const isNoteActive = activeNotes.some(note => note.midiNumber === midiNote);
    
    // Check if speech is currently speaking
    const utterance = speechUtterances.get(noteKey);
    const isCurrentlySpeaking = (currentlySpeakingNote === midiNote) && 
                                (speechSynthesis.speaking || speechSynthesis.pending);
    
    if (!isNoteActive && !isCurrentlySpeaking && speechData.isWaitingToLoop === false) {
      // Note is no longer active AND speech has finished - clean up after a delay
      // Don't clean up if speech is still playing
      const endTime = speechEndTimes.get(noteKey);
      if (endTime && (currentTime - endTime) > 2000) { // Wait 2 seconds after speech ends
        activeSpeech.delete(noteKey);
        speechEndTimes.delete(noteKey);
        speechUtterances.delete(noteKey);
        continue;
      }
    }
    
    // If speech has ended and note is still active, restart it (loop)
    if (isNoteActive && speechData.isWaitingToLoop) {
      const endTime = speechEndTimes.get(noteKey);
      if (endTime && (currentTime - endTime) > 100) { // Small delay before looping
        // Restart speech
        const text = speechData.text;
        startDreamSpeech(midiNote, text);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10);
  initializeColors();
  colorMode(RGB, 255);
  frameRate(60); // Smooth 60fps
  
  // Initialize Web Audio API for pipe organ
  initPipeOrgan();
  
  // Note: Speech synthesis will be initialized after user clicks "Enter the Dreams" button
  // This is required by browser security policies
  console.log('[Speech] Speech synthesis will be initialized after user interaction');
}

function initPipeOrgan() {
  try {
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Make audioContext available globally for enableAudio function
    window.audioContext = audioContext;
    
    // Create master gain node
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.3; // Overall volume
    masterGain.connect(audioContext.destination);
    
    // Create reverb using ConvolverNode (simplified reverb)
    reverbNode = audioContext.createConvolver();
    reverbNode.connect(masterGain);
    
    // Create simple impulse response for reverb
    const impulseLength = audioContext.sampleRate * 2;
    const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
      }
    }
    reverbNode.buffer = impulse;
    
    console.log("Pipe organ synthesizer initialized");
  } catch (error) {
    console.error("Error initializing audio:", error);
  }
}

// Convert MIDI note number to frequency
function midiToFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Create pipe organ sound for a note
function playPipeOrganNote(midiNote, velocity) {
  if (!audioContext || audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  if (!audioContext || !masterGain) {
    console.warn("Audio context not initialized");
    return;
  }
  
  const frequency = midiToFrequency(midiNote);
  const noteKey = midiNote.toString();
  
  // Create multiple oscillators for pipe organ harmonics
  const oscillators = [];
  const gains = [];
  
  // Create tremolo multiplier gain node (shared for all oscillators)
  const tremoloMultiplier = audioContext.createGain();
  tremoloMultiplier.gain.value = 1.0;
  
  // Fundamental frequency (sine wave)
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = frequency;
  gain1.gain.value = 1.0;
  osc1.connect(gain1);
  gain1.connect(tremoloMultiplier);
  oscillators.push(osc1);
  gains.push(gain1);
  
  // Second harmonic (octave)
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = frequency * 2;
  gain2.gain.value = 0.3;
  osc2.connect(gain2);
  gain2.connect(tremoloMultiplier);
  oscillators.push(osc2);
  gains.push(gain2);
  
  // Third harmonic (fifth)
  const osc3 = audioContext.createOscillator();
  const gain3 = audioContext.createGain();
  osc3.type = 'sine';
  osc3.frequency.value = frequency * 3;
  gain3.gain.value = 0.15;
  osc3.connect(gain3);
  gain3.connect(tremoloMultiplier);
  oscillators.push(osc3);
  gains.push(gain3);
  
  // Connect tremolo multiplier to reverb
  tremoloMultiplier.connect(reverbNode);
  
  // Velocity affects volume
  const velocityGain = velocity / 127;
  
  // Apply attack envelope (pipe organ has slow attack)
  const attackTime = 0.1; // 100ms attack
  const releaseTime = 0.5; // 500ms release
  
  const now = audioContext.currentTime;
  
  // Start all oscillators
  oscillators.forEach(osc => {
    osc.start(now);
  });
  
  // Apply attack envelope
  gains.forEach(gain => {
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gain.gain.value * velocityGain, now + attackTime);
  });
  
  // Create complex modulation LFOs for sustained notes - multiple layers for rich modulation
  const vibratoLFO1 = audioContext.createOscillator();
  const vibratoGain1 = audioContext.createGain();
  const vibratoLFO2 = audioContext.createOscillator();
  const vibratoGain2 = audioContext.createGain();
  const vibratoMixer = audioContext.createGain();
  
  const tremoloLFO1 = audioContext.createOscillator();
  const tremoloGain1 = audioContext.createGain();
  const tremoloLFO2 = audioContext.createOscillator();
  const tremoloGain2 = audioContext.createGain();
  const tremoloMixer = audioContext.createGain();
  
  // Complex vibrato: dual LFOs with different rates and phases for rich modulation
  vibratoLFO1.type = 'sine';
  vibratoLFO1.frequency.value = 4.5; // Primary vibrato rate
  vibratoGain1.gain.value = frequency * 0.008; // Base depth
  
  vibratoLFO2.type = 'triangle'; // Different wave shape for complexity
  vibratoLFO2.frequency.value = 7.2; // Secondary, faster vibrato
  vibratoGain2.gain.value = frequency * 0.005; // Subtle secondary depth
  
  vibratoMixer.gain.value = 1.0;
  
  // Complex tremolo: dual LFOs for more interesting amplitude modulation
  tremoloLFO1.type = 'sine';
  tremoloLFO1.frequency.value = 5.5; // Primary tremolo rate
  tremoloGain1.gain.value = 0.06; // Base depth
  
  tremoloLFO2.type = 'sawtooth'; // Different wave shape
  tremoloLFO2.frequency.value = 3.2; // Slower secondary tremolo
  tremoloGain2.gain.value = 0.04; // Secondary depth
  
  tremoloMixer.gain.value = 1.0;
  
  // Connect modulation LFOs through mixers
  vibratoLFO1.connect(vibratoGain1);
  vibratoGain1.connect(vibratoMixer);
  vibratoLFO2.connect(vibratoGain2);
  vibratoGain2.connect(vibratoMixer);
  
  tremoloLFO1.connect(tremoloGain1);
  tremoloGain1.connect(tremoloMixer);
  tremoloLFO2.connect(tremoloGain2);
  tremoloGain2.connect(tremoloMixer);
  
  // Apply complex vibrato to frequency (modulate oscillator frequency directly)
  oscillators.forEach((osc, index) => {
    const baseFreq = index === 0 ? frequency : (index === 1 ? frequency * 2 : frequency * 3);
    // Set base frequency
    osc.frequency.setValueAtTime(baseFreq, now);
    // Connect combined vibrato modulation to frequency parameter
    vibratoMixer.connect(osc.frequency);
  });
  
  // Apply complex tremolo to amplitude (modulate the tremolo multiplier gain)
  tremoloMixer.connect(tremoloMultiplier.gain);
  
  // Start all modulation LFOs
  vibratoLFO1.start(now);
  vibratoLFO2.start(now);
  tremoloLFO1.start(now);
  tremoloLFO2.start(now);
  
  // Store oscillators and modulation for note-off
  activeOscillators.set(noteKey, {
    oscillators: oscillators,
    gains: gains,
    releaseTime: releaseTime,
    vibratoLFO1: vibratoLFO1,
    vibratoGain1: vibratoGain1,
    vibratoLFO2: vibratoLFO2,
    vibratoGain2: vibratoGain2,
    vibratoMixer: vibratoMixer,
    tremoloLFO1: tremoloLFO1,
    tremoloGain1: tremoloGain1,
    tremoloLFO2: tremoloLFO2,
    tremoloGain2: tremoloGain2,
    tremoloMixer: tremoloMixer,
    tremoloMultiplier: tremoloMultiplier,
    startTime: now,
    baseFrequency: frequency
  });
  
  return noteKey;
}

// Stop pipe organ note
function stopPipeOrganNote(midiNote) {
  const noteKey = midiNote.toString();
  const noteData = activeOscillators.get(noteKey);
  
  if (noteData) {
    const now = audioContext.currentTime;
    
    // Stop all modulation LFOs
    if (noteData.vibratoLFO1) {
      noteData.vibratoLFO1.stop(now);
    }
    if (noteData.vibratoLFO2) {
      noteData.vibratoLFO2.stop(now);
    }
    if (noteData.tremoloLFO1) {
      noteData.tremoloLFO1.stop(now);
    }
    if (noteData.tremoloLFO2) {
      noteData.tremoloLFO2.stop(now);
    }
    
    // Disconnect tremolo multiplier if it exists
    if (noteData.tremoloMultiplier) {
      noteData.tremoloMultiplier.disconnect();
    }
    
    // Apply release envelope
    noteData.gains.forEach(gain => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + noteData.releaseTime);
    });
    
    // Stop oscillators after release
    noteData.oscillators.forEach(osc => {
      osc.stop(now + noteData.releaseTime);
    });
    
    activeOscillators.delete(noteKey);
  }
}

// Update modulation for sustained notes (called in draw loop)
function updateSustainedNoteModulation() {
  const now = audioContext.currentTime;
  
  activeOscillators.forEach((noteData, noteKey) => {
    if (noteData.startTime && noteData.vibratoLFO1 && noteData.tremoloLFO1) {
      const sustainTime = now - noteData.startTime;
      
      // Progressive modulation that becomes more complex and dramatic over time
      if (sustainTime > 0.3) { // Start modulation after 300ms
        // Calculate progressive modulation depth (more dramatic over time)
        const modulationDepth = Math.min(1.0, (sustainTime - 0.3) / 3.0); // Ramp up over 3 seconds
        const modulationIntensity = Math.pow(modulationDepth, 0.7); // Non-linear curve for more interesting progression
        
        // Complex vibrato: dual LFOs with increasing depth and varying rates
        const vibratoDepth1 = noteData.baseFrequency * (0.008 + modulationIntensity * 0.025); // 0.8-3.3% primary
        const vibratoDepth2 = noteData.baseFrequency * (0.005 + modulationIntensity * 0.015); // 0.5-2% secondary
        
        // Dynamic vibrato rates that change over time
        const vibratoRate1 = 4.5 + Math.sin(sustainTime * 0.3) * 1.2 + modulationIntensity * 1.5; // 4.5-7.2 Hz, varying
        const vibratoRate2 = 7.2 + Math.cos(sustainTime * 0.4) * 2.0 + modulationIntensity * 2.5; // 7.2-11.7 Hz, varying
        
        // Update vibrato depths and rates
        if (noteData.vibratoGain1) {
          noteData.vibratoGain1.gain.setValueAtTime(vibratoDepth1, now);
        }
        if (noteData.vibratoGain2) {
          noteData.vibratoGain2.gain.setValueAtTime(vibratoDepth2, now);
        }
        if (noteData.vibratoLFO1) {
          noteData.vibratoLFO1.frequency.setValueAtTime(vibratoRate1, now);
        }
        if (noteData.vibratoLFO2) {
          noteData.vibratoLFO2.frequency.setValueAtTime(vibratoRate2, now);
        }
        
        // Complex tremolo: dual LFOs with increasing depth
        const tremoloDepth1 = 0.06 + modulationIntensity * 0.18; // 6-24% primary tremolo
        const tremoloDepth2 = 0.04 + modulationIntensity * 0.12; // 4-16% secondary tremolo
        
        // Dynamic tremolo rates
        const tremoloRate1 = 5.5 + Math.sin(sustainTime * 0.25) * 1.0 + modulationIntensity * 1.2; // 5.5-7.7 Hz
        const tremoloRate2 = 3.2 + Math.cos(sustainTime * 0.35) * 0.8 + modulationIntensity * 0.6; // 3.2-4.6 Hz
        
        // Update tremolo depths and rates
        if (noteData.tremoloGain1) {
          noteData.tremoloGain1.gain.setValueAtTime(tremoloDepth1, now);
        }
        if (noteData.tremoloGain2) {
          noteData.tremoloGain2.gain.setValueAtTime(tremoloDepth2, now);
        }
        if (noteData.tremoloLFO1) {
          noteData.tremoloLFO1.frequency.setValueAtTime(tremoloRate1, now);
        }
        if (noteData.tremoloLFO2) {
          noteData.tremoloLFO2.frequency.setValueAtTime(tremoloRate2, now);
        }
        
        // Add subtle phase modulation for even more complexity (after 2 seconds)
        if (sustainTime > 2.0) {
          const phaseMod = Math.sin(sustainTime * 0.2) * 0.3;
          // Slightly shift the phase relationship between LFOs
          if (noteData.vibratoLFO2) {
            noteData.vibratoLFO2.frequency.setValueAtTime(vibratoRate2 + phaseMod, now);
          }
        }
      }
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Warm tangerine dream background with citrus gradient
  for (let y = 0; y < height; y++) {
    let darkness = map(y, 0, height, 15, 35);
    // Add warm tangerine and citrus color variations
    let r = darkness + 20 + sin(y * 0.01 + millis() * 0.0001) * 8;
    let g = darkness + 10 + cos(y * 0.015 + millis() * 0.0001) * 5;
    let b = darkness + sin(y * 0.012 + millis() * 0.0001) * 3;
    stroke(r, g, b);
    line(0, y, width, y);
  }
  
  // Draw stars
  drawStars();
  
  // Update rotation - smooth and fluid
  centerRotation += 0.015;
  
  // Update transition - smoother
  planetTransition = min(1.0, planetTransition + 0.03);
  
  // Update and decay channel activity
  for (let i = 0; i < 16; i++) {
    channelActivity[i] *= 0.95;
  }
  
  // Update modulation for sustained notes
  updateSustainedNoteModulation();
  
  // Check and loop speech for held notes
  updateDreamSpeechLooping();
  
  // Update and draw flavor bursts (energy waves)
  updateEnergyWaves();
  
  // Update and draw juice droplets (particles)
  updateParticles();
  
  // Update and draw citrus segments (moons)
  updateMoons();
  
  // Draw tangerine fruit in center that changes based on input
  drawCenterTangerine();
  
  // Draw note information
  drawNoteInfo();
}

function drawStars() {
  // Draw twinkling citrus sparkles with tangerine colors - scale with window size
  let numStars = floor((width * height) / 5000); // More sparkles on larger screens
  const starColors = [
    [255, 200, 100], // Golden Tangerine
    [255, 180, 60],  // Warm Orange
    [255, 220, 120], // Light Citrus
    [255, 160, 40],  // Rich Orange
    [255, 190, 80],  // Juicy Tangerine
    [255, 140, 20],  // Deep Orange
    [255, 210, 90],  // Bright Citrus
    [255, 170, 50]   // Vibrant Tangerine
  ];
  
  for (let i = 0; i < numStars; i++) {
    let x = (i * 137.5) % width;
    let y = (i * 237.7) % height;
    let brightness = sin(millis() * 0.001 + i) * 127 + 128;
    let starSize = map(min(width, height), 500, 2000, 1, 3);
    
    // Random colorful stars
    let starColor = starColors[i % starColors.length];
    fill(starColor[0], starColor[1], starColor[2], brightness * 0.7);
    noStroke();
    ellipse(x, y, starSize, starSize);
    
    // Occasional bright colorful stars
    if (i % 20 === 0) {
      let brightColor = starColors[(i * 3) % starColors.length];
      fill(brightColor[0], brightColor[1], brightColor[2], brightness);
      ellipse(x, y, starSize * 2.5, starSize * 2.5);
      // Add glow
      fill(brightColor[0], brightColor[1], brightColor[2], brightness * 0.3);
      ellipse(x, y, starSize * 4, starSize * 4);
    }
  }
}

function updateEnergyWaves() {
  for (let i = energyWaves.length - 1; i >= 0; i--) {
    let wave = energyWaves[i];
    wave.radius += wave.speed * 1.5; // Faster flavor burst expansion
    wave.alpha *= 0.93; // Slower fade for juicy impact
    
    // Draw multiple flavorful concentric waves - like citrus juice splashes
    noFill();
    let waveCount = 5; // More waves for more flavor
    for (let w = 0; w < waveCount; w++) {
      let waveOffset = w * 25;
      let waveAlpha = wave.alpha * (1 - w * 0.2);
      let waveSize = wave.radius * 2 + waveOffset;
      
      // Warm tangerine color variation - explosions of flavor
      let r = red(wave.color);
      let g = green(wave.color);
      let b = blue(wave.color);
      // Add warm glow to outer waves
      let warmMix = w * 0.15;
      r = min(255, r + warmMix * 20);
      g = min(255, g + warmMix * 15);
      
      stroke(r, g, b, waveAlpha);
      strokeWeight(6 - w);
      ellipse(wave.x, wave.y, waveSize, waveSize);
    }
    
    // Add juicy flavor beams radiating from center - like citrus spray
    for (let beam = 0; beam < 20; beam++) {
      let angle = (TWO_PI / 20) * beam;
      let beamLength = wave.radius * 1.4;
      
      // Vibrant tangerine beams
      let r = red(wave.color);
      let g = green(wave.color);
      let b = blue(wave.color);
      
      stroke(r, g, b, wave.alpha * 0.8);
      strokeWeight(4);
      line(wave.x, wave.y, wave.x + cos(angle) * beamLength, wave.y + sin(angle) * beamLength);
      
      // Add juicy sparkle at beam end
      fill(r, g, b, wave.alpha * 0.9);
      noStroke();
      ellipse(wave.x + cos(angle) * beamLength, wave.y + sin(angle) * beamLength, 6, 6);
      
      // Add smaller flavor droplets along beam
      for (let drop = 1; drop <= 3; drop++) {
        let dropDist = (beamLength / 4) * drop;
        fill(r, g, b, wave.alpha * 0.6);
        ellipse(wave.x + cos(angle) * dropDist, wave.y + sin(angle) * dropDist, 3, 3);
      }
    }
    
    // Remove old waves
    if (wave.radius > wave.maxRadius || wave.alpha < 5) {
      energyWaves.splice(i, 1);
    }
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Update position with smooth interpolation
    p.x += p.vx;
    p.y += p.vy;
    
    // Apply gentle gravity toward center (match tangerine position)
    let centerX = width / 2;
    let centerY = height * 0.28;
    let dx = centerX - p.x;
    let dy = centerY - p.y;
    let dist = sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      let gravityStrength = map(min(width, height), 500, 2000, 0.0003, 0.001);
      p.vx += dx * gravityStrength;
      p.vy += dy * gravityStrength;
    }
    
    // Apply friction (juice droplets slow down)
    p.vx *= 0.98;
    p.vy *= 0.98;
    
    // Update life
    p.life -= p.decay;
    
    // Draw juice droplet with juicy, flavorful glow
    let alpha = p.life * 255;
    let r = red(p.color);
    let g = green(p.color);
    let b = blue(p.color);
    
    // Outer juicy glow - warm citrus aura
    fill(r, g, b, p.life * 40);
    noStroke();
    ellipse(p.x, p.y, p.size * p.life * 5, p.size * p.life * 5);
    
    // Middle glow - vibrant tangerine
    fill(r, g, b, p.life * 100);
    ellipse(p.x, p.y, p.size * p.life * 3, p.size * p.life * 3);
    
    // Core juice droplet - bright and juicy
    if (p.type === 'droplet') {
      // Draw as teardrop/juice droplet
      push();
      translate(p.x, p.y);
      rotate(atan2(p.vy, p.vx));
      fill(r, g, b, alpha);
      beginShape();
      vertex(0, -p.size * p.life * 0.5);
      bezierVertex(p.size * p.life * 0.3, -p.size * p.life * 0.2, 
                   p.size * p.life * 0.3, p.size * p.life * 0.2, 
                   0, p.size * p.life * 0.5);
      bezierVertex(-p.size * p.life * 0.3, p.size * p.life * 0.2, 
                   -p.size * p.life * 0.3, -p.size * p.life * 0.2, 
                   0, -p.size * p.life * 0.5);
      endShape(CLOSE);
      // Highlight on droplet
      fill(255, 240, 200, alpha * 0.6);
      ellipse(-p.size * p.life * 0.15, -p.size * p.life * 0.2, 
              p.size * p.life * 0.3, p.size * p.life * 0.25);
      pop();
    } else {
      // Draw as citrus segment
      fill(r, g, b, alpha);
      ellipse(p.x, p.y, p.size * p.life, p.size * p.life);
      // Segment highlight
      fill(255, 240, 200, alpha * 0.7);
      ellipse(p.x - p.size * p.life * 0.2, p.y - p.size * p.life * 0.2, 
              p.size * p.life * 0.4, p.size * p.life * 0.4);
    }
    
    // Add juicy trail
    if (p.life > 0.3) {
      stroke(r, g, b, alpha * 0.5);
      strokeWeight(2);
      let trailLength = p.size * 2;
      let trailAngle = atan2(p.vy, p.vx);
      line(p.x, p.y, p.x - cos(trailAngle) * trailLength, p.y - sin(trailAngle) * trailLength);
      // Add sparkle at trail end
      fill(255, 240, 200, alpha * 0.8);
      noStroke();
      ellipse(p.x - cos(trailAngle) * trailLength, p.y - sin(trailAngle) * trailLength, 
              p.size * 0.25, p.size * 0.25);
    }
    
    // Remove dead particles
    if (p.life <= 0 || p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100) {
      particles.splice(i, 1);
    }
  }
}

function updateMoons() {
  const centerX = width / 2;
  // Match tangerine position - move citrus segments up with tangerine
  const centerY = height * 0.28;
  const baseDistance = min(width, height) * 0.25; // Scale with window size
  
  for (let moon of moons) {
    moon.angle += moon.speed;
    
    // Scale segment distance with window size
    let moonDistance = baseDistance + (moon.distance - 250);
    let moonX = centerX + cos(moon.angle) * moonDistance;
    let moonY = centerY + sin(moon.angle) * moonDistance;
    
    // Draw citrus segment orbit trail (subtle)
    noFill();
    stroke(255, 180, 60, 15);
    strokeWeight(1);
    ellipse(centerX, centerY, moonDistance * 2, moonDistance * 2);
    
    // Scale segment size with window
    let moonSize = map(min(width, height), 500, 2000, moon.size * 0.7, moon.size * 1.3);
    
    // Draw citrus segment (tangerine slice)
    push();
    translate(moonX, moonY);
    rotate(moon.angle);
    
    // Main segment body
    fill(red(moon.color), green(moon.color), blue(moon.color), 220);
    noStroke();
    beginShape();
    vertex(0, -moonSize * 0.5);
    bezierVertex(moonSize * 0.3, -moonSize * 0.3, moonSize * 0.4, 0, moonSize * 0.3, moonSize * 0.3);
    vertex(0, moonSize * 0.5);
    bezierVertex(-moonSize * 0.3, moonSize * 0.3, -moonSize * 0.4, 0, -moonSize * 0.3, -moonSize * 0.3);
    endShape(CLOSE);
    
    // Segment highlight (juice glisten)
    fill(255, 240, 200, 180);
    ellipse(-moonSize * 0.15, -moonSize * 0.2, moonSize * 0.3, moonSize * 0.25);
    
    // Segment membrane lines
    stroke(255, 200, 100, 150);
    strokeWeight(1);
    line(0, -moonSize * 0.5, 0, moonSize * 0.5);
    
    pop();
  }
}

function drawCenterTangerine() {
  const centerX = width / 2;
  // Better spatial balance - tangerine at 28% from top for better hierarchy
  const centerY = height * 0.28;
  
  push();
  translate(centerX, centerY);
  
  // Determine which note is currently active (most recent)
  let activeIndex = -1;
  let maxActivity = 0;
  for (let i = 0; i < 16; i++) {
    if (channelActivity[i] > maxActivity) {
      maxActivity = channelActivity[i];
      activeIndex = i;
    }
  }
  
  // Get tangerine size - better proportioned for spatial design
  let baseTangerineSize = min(width, height) * 0.12;
  // Scale tangerine size fluidly based on aspect ratio
  const aspectRatio = width / height;
  baseTangerineSize *= map(aspectRatio, 0.5, 2.0, 0.85, 1.05);
  
  let tangerineColor;
  let tangerineSize = baseTangerineSize;
  let tangerineType = 0; // 0-15 for different tangerine designs
  
  if (currentNote && activeIndex >= 0) {
    // Smooth color transition
    if (previousColor && planetTransition < 1.0) {
      tangerineColor = lerpColor(previousColor, currentNote.color, planetTransition);
    } else {
      tangerineColor = currentNote.color;
    }
    tangerineType = activeIndex; // Use index to determine tangerine type
    
    // More intense dynamic pulse based on velocity and activity - juicy pulsing
    let pulseScale = min(width, height) * 0.03;
    let basePulse = sin(millis() * 0.08 + tangerineType * 0.5) * pulseScale * 1.5;
    let activityPulse = maxActivity * pulseScale * 2.5;
    let impactPulse = pow(maxActivity, 2) * pulseScale * 2; // Quadratic for more impact
    tangerineSize = baseTangerineSize + basePulse + activityPulse + impactPulse;
  } else {
    // Default tangerine color when no note is active
    tangerineColor = color(255, 180, 60);
    tangerineSize = baseTangerineSize * 0.8;
  }
  
  // Gentle rotation - like a tangerine floating
  const rotationSpeed = map(tangerineType, 0, 15, 0.01, 0.04);
  const rotationMultiplier = 1 + tangerineType * 0.1 + (currentNote ? maxActivity * 0.2 : 0);
  rotate(centerRotation * rotationMultiplier);
  
  // Draw unique tangerine design based on type
  drawUniqueTangerine(tangerineType, tangerineColor, tangerineSize, maxActivity);
  
  pop();
}

function drawUniqueTangerine(type, color, size, activity) {
  const time = millis() * 0.001;
  const r = red(color);
  const g = green(color);
  const b = blue(color);
  
  // Draw flavor aura - unique pattern for each
  if (currentNote) {
    drawFlavorAura(type, r, g, b, size, activity, time);
  }
  
  // Draw main tangerine body - different segment patterns for each type
  drawTangerineBody(type, r, g, b, size, time);
  
  // Draw unique flavor effects for each tangerine
  drawFlavorEffects(type, r, g, b, size, activity, time);
}

function drawFlavorAura(type, r, g, b, size, activity, time) {
  noStroke();
  
  switch(type % 4) {
    case 0: // Intense pulsing citrus flavor bursts - explosions of color
      for (let layer = 1; layer <= 8; layer++) {
        let pulse = sin(time * 3 + layer * 0.5) * 0.4 + 1;
        let alpha = (70 / layer) * activity;
        let fieldSize = size * (1.5 + layer * 0.25) * pulse;
        
        // Warm tangerine color mixing - explosions of flavor
        let warmMix = (layer / 8) * 0.3;
        let layerR = min(255, r + warmMix * 30);
        let layerG = min(255, g + warmMix * 20);
        let layerB = b;
        
        fill(layerR, layerG, layerB, alpha);
        ellipse(0, 0, fieldSize, fieldSize);
      }
      // Add juicy flavor beams radiating outward
      for (let beam = 0; beam < 20; beam++) {
        let angle = (TWO_PI / 20) * beam + time;
        let beamLength = size * (2.5 + sin(time * 2 + beam) * 0.5);
        
        // Vibrant tangerine beams
        stroke(r, g, b, activity * 200);
        strokeWeight(5);
        line(0, 0, cos(angle) * beamLength, sin(angle) * beamLength);
        
        // Add juicy sparkle at beam end
        fill(r, g, b, activity * 220);
        noStroke();
        ellipse(cos(angle) * beamLength, sin(angle) * beamLength, size * 0.1, size * 0.1);
        
        // Add smaller flavor droplets along beam
        for (let drop = 1; drop <= 4; drop++) {
          let dropDist = (beamLength / 5) * drop;
          fill(r, g, b, activity * 150);
          ellipse(cos(angle) * dropDist, sin(angle) * dropDist, size * 0.04, size * 0.04);
        }
        stroke(r, g, b, activity * 200);
        strokeWeight(5);
      }
      noStroke();
      break;
      
    case 1: // Rotating citrus segments - flavor spirals
      for (let layer = 1; layer <= 6; layer++) {
        push();
        rotate(time * 0.8 * (layer % 2 === 0 ? 1 : -1));
        let alpha = (60 / layer) * activity;
        let fieldSize = size * (1.5 + layer * 0.3);
        
        // Draw citrus segment shapes
        let segmentCount = 6;
        for (let seg = 0; seg < segmentCount; seg++) {
          let segAngle = (TWO_PI / segmentCount) * seg;
          fill(r, g, b, alpha);
          beginShape();
          vertex(0, 0);
          for (let i = 0; i <= 10; i++) {
            let t = i / 10;
            let angle = segAngle + t * (TWO_PI / segmentCount);
            let radius = fieldSize * 0.5;
            vertex(cos(angle) * radius, sin(angle) * radius);
          }
          endShape(CLOSE);
        }
        pop();
      }
      // Radiating juice sprays
      stroke(r, g, b, activity * 220);
      strokeWeight(5);
      for (let spray = 0; spray < 12; spray++) {
        let angle = (TWO_PI / 12) * spray + time;
        let sprayLength = size * (2.2 + sin(time * 3) * 0.5);
        line(0, 0, cos(angle) * sprayLength, sin(angle) * sprayLength);
        // Add juice droplet at spray end
        fill(r, g, b, activity * 250);
        noStroke();
        ellipse(cos(angle) * sprayLength, sin(angle) * sprayLength, size * 0.12, size * 0.12);
        stroke(r, g, b, activity * 220);
        strokeWeight(5);
      }
      noStroke();
      break;
      
    case 2: // Intense radiating flavor grid - citrus spray pattern
      stroke(r, g, b, 80 * activity);
      strokeWeight(3);
      let gridSize = size * 3;
      let gridSteps = 12;
      for (let i = -gridSteps; i <= gridSteps; i++) {
        let pulse = sin(time * 2 + i * 0.2) * 0.1 + 1;
        // Draw flavor grid lines
        stroke(r, g, b, 60 * activity);
        line(-gridSize * pulse, i * gridSize / gridSteps, gridSize * pulse, i * gridSize / gridSteps);
        line(i * gridSize / gridSteps, -gridSize * pulse, i * gridSize / gridSteps, gridSize * pulse);
        // Add juice droplets at intersections
        fill(r, g, b, activity * 150);
        noStroke();
        ellipse(i * gridSize / gridSteps, i * gridSize / gridSteps, size * 0.03, size * 0.03);
        stroke(r, g, b, 80 * activity);
        strokeWeight(3);
      }
      // Add radiating flavor bursts from corners
      stroke(r, g, b, activity * 200);
      strokeWeight(5);
      for (let corner = 0; corner < 8; corner++) {
        let angle = (TWO_PI / 8) * corner + PI / 8;
        let burstLength = size * 2.5;
        line(0, 0, cos(angle) * burstLength, sin(angle) * burstLength);
        // Add juice droplet at end
        fill(r, g, b, activity * 250);
        noStroke();
        ellipse(cos(angle) * burstLength, sin(angle) * burstLength, size * 0.1, size * 0.1);
        stroke(r, g, b, activity * 200);
        strokeWeight(5);
      }
      noStroke();
      break;
      
    case 3: // Intense pulsing flavor rings - citrus juice ripples
      noFill();
      stroke(r, g, b, 100 * activity);
      strokeWeight(4);
      for (let ring = 1; ring <= 10; ring++) {
        let ringSize = size * (1.3 + ring * 0.25);
        let pulse = sin(time * 4 + ring * 0.5) * 0.2 + 1;
        ellipse(0, 0, ringSize * pulse, ringSize * pulse);
        // Add flavor droplets on rings
        if (ring % 2 === 0) {
          for (let i = 0; i < 12; i++) {
            let angle = (TWO_PI / 12) * i + time * 0.5;
            let patternX = cos(angle) * ringSize * 0.5 * pulse;
            let patternY = sin(angle) * ringSize * 0.5 * pulse;
            fill(r, g, b, activity * 150);
            noStroke();
            ellipse(patternX, patternY, size * 0.06, size * 0.06);
            noFill();
            stroke(r, g, b, 100 * activity);
            strokeWeight(4);
          }
        }
      }
      // Add radiating flavor sprays
      stroke(r, g, b, activity * 220);
      strokeWeight(6);
      for (let spray = 0; spray < 20; spray++) {
        let angle = (TWO_PI / 20) * spray;
        let sprayLength = size * (2.2 + sin(time * 2 + spray) * 0.4);
        line(0, 0, cos(angle) * sprayLength, sin(angle) * sprayLength);
        // Add juice burst at spray end
        fill(r, g, b, activity * 250);
        noStroke();
        ellipse(cos(angle) * sprayLength, sin(angle) * sprayLength, size * 0.12, size * 0.12);
        stroke(r, g, b, activity * 220);
        strokeWeight(6);
      }
      noStroke();
      break;
  }
}

function drawTangerineBody(type, r, g, b, size, time) {
  // Draw tangerine fruit with segments - warm citrus colors
  const segmentCount = 8 + (type % 5); // 8-12 segments
  
  // Draw outer peel with texture
  noStroke();
  
  // Main tangerine body - warm orange sphere
  for (let layer = 0; layer < 3; layer++) {
    let layerSize = size * (1.0 - layer * 0.05);
    let layerAlpha = 240 - layer * 20;
    fill(r, g, b, layerAlpha);
    ellipse(0, 0, layerSize, layerSize);
  }
  
  // Draw tangerine segments
  for (let seg = 0; seg < segmentCount; seg++) {
    let angle = (TWO_PI / segmentCount) * seg;
    let segmentAngle = TWO_PI / segmentCount;
    
    push();
    rotate(angle);
    
    // Segment outline
    stroke(r * 0.9, g * 0.9, b * 0.9, 200);
    strokeWeight(2);
    noFill();
    
    // Draw segment arc
    beginShape();
    for (let i = 0; i <= 20; i++) {
      let t = i / 20;
      let segAngle = -segmentAngle/2 + t * segmentAngle;
      let radius = size * 0.5;
      vertex(cos(segAngle) * radius, sin(segAngle) * radius);
    }
    endShape();
    
    // Segment highlight (juice glisten)
    noStroke();
    fill(255, 240, 200, 100);
    ellipse(0, -size * 0.2, size * 0.3, size * 0.2);
    
    // Segment membrane lines
    stroke(r * 0.85, g * 0.85, b * 0.85, 150);
    strokeWeight(1);
    line(0, 0, 0, size * 0.5);
    
    pop();
  }
  
  // Draw center core (navel)
  fill(r * 0.7, g * 0.7, b * 0.7, 180);
  noStroke();
  ellipse(0, 0, size * 0.15, size * 0.15);
  
  // Draw peel texture (small dots)
  for (let dot = 0; dot < 30; dot++) {
    let dotAngle = (TWO_PI / 30) * dot;
    let dotDist = size * (0.3 + random(0.1, 0.4));
    let dotX = cos(dotAngle) * dotDist;
    let dotY = sin(dotAngle) * dotDist;
    fill(r * 0.95, g * 0.95, b * 0.95, 150);
    ellipse(dotX, dotY, size * 0.02, size * 0.02);
  }
  
  // Draw highlight (light reflection on peel)
  fill(255, 250, 230, 120);
  ellipse(-size * 0.25, -size * 0.25, size * 0.3, size * 0.3);
}

// Draw prominent Adinkra symbols in tangerine cores
function drawAdinkraSymbol(type, r, g, b, size, time) {
  const symbolType = type % 16; // 16 different symbols for 16 tangerines
  const symbolSize = size * 0.25;
  
  push();
  rotate(time * 0.1); // Slow rotation for dynamism
  
  // Colorful symbol with silver accents
  let silverMix = 0.3;
  let symbolR = r * (1 - silverMix) + 192 * silverMix;
  let symbolG = g * (1 - silverMix) + 192 * silverMix;
  let symbolB = b * (1 - silverMix) + 192 * silverMix;
  
  stroke(symbolR, symbolG, symbolB, 240);
  strokeWeight(4);
  noFill();
  
  switch(symbolType) {
    case 0: // Sankofa - bird looking back
      drawSankofaSymbol(r, g, b, symbolSize);
      break;
    case 1: // Gye Nyame - except God
      drawGyeNyameSymbol(r, g, b, symbolSize);
      break;
    case 2: // Adinkrahene - king of Adinkra
      drawAdinkraheneSymbol(r, g, b, symbolSize);
      break;
    case 3: // Akoma - heart
      drawAkomaSymbol(r, g, b, symbolSize);
      break;
    case 4: // Dwennimmen - ram's horns
      drawDwennimmenSymbol(r, g, b, symbolSize);
      break;
    case 5: // Epa - handcuffs
      drawEpaSymbol(r, g, b, symbolSize);
      break;
    case 6: // Fihankra - house
      drawFihankraSymbol(r, g, b, symbolSize);
      break;
    case 7: // Nkyinkyim - twisted
      drawNkyinkyimSymbol(r, g, b, symbolSize);
      break;
    case 8: // Osram ne Nsoromma - moon and star
      drawOsramSymbol(r, g, b, symbolSize);
      break;
    case 9: // Duafe - wooden comb
      drawDuafeSymbol(r, g, b, symbolSize);
      break;
    case 10: // Mpatapo - knot of reconciliation
      drawMpatapoSymbol(r, g, b, symbolSize);
      break;
    case 11: // Nyame Biribi Wo Soro - God is in the heavens
      drawNyameBiribiSymbol(r, g, b, symbolSize);
      break;
    case 12: // Odo Nnyew Fie Kwan - love never loses its way
      drawOdoSymbol(r, g, b, symbolSize);
      break;
    case 13: // Wawa Aba - seed of the wawa tree
      drawWawaAbaSymbol(r, g, b, symbolSize);
      break;
    case 14: // Akofena - sword of war
      drawAkofenaSymbol(r, g, b, symbolSize);
      break;
    case 15: // Nsoromma - star
      drawNsorommaSymbol(r, g, b, symbolSize);
      break;
  }
  
  pop();
}

function drawSankofaSymbol(r, g, b, size) {
  // Sankofa - mythical bird with head turned backward, facing its tail
  // Body (facing forward/right)
  beginShape();
  vertex(size * 0.1, -size * 0.3); // Top of body
  vertex(size * 0.3, -size * 0.1);
  vertex(size * 0.35, 0);
  vertex(size * 0.3, size * 0.1);
  vertex(size * 0.1, size * 0.3); // Bottom of body
  vertex(-size * 0.1, size * 0.2); // Tail
  vertex(-size * 0.2, size * 0.1);
  vertex(-size * 0.15, 0);
  vertex(-size * 0.1, -size * 0.1);
  endShape(CLOSE);
  
  // Head turned backward (facing left/tail)
  push();
  translate(-size * 0.15, size * 0.15);
  rotate(PI * 0.3); // Slight rotation to show it's looking back
  // Head shape
  ellipse(0, 0, size * 0.2, size * 0.15);
  // Beak pointing backward
  beginShape();
  vertex(size * 0.05, 0);
  vertex(size * 0.15, -size * 0.05);
  vertex(size * 0.15, size * 0.05);
  endShape(CLOSE);
  pop();
  
  // Egg in mouth or on back - representing precious knowledge from the past
  fill(255, 255, 255, 200);
  noStroke();
  ellipse(-size * 0.2, size * 0.1, size * 0.12, size * 0.15);
  stroke(255, 255, 255, 220);
  strokeWeight(3);
  noFill();
  
  // Alternative: Stylized heart-like shape with symmetrical spirals (variation)
  // This can be shown as a secondary element or used for some satellites
  push();
  translate(0, size * 0.25);
  scale(0.6);
  // Heart-like base
  beginShape();
  vertex(0, size * 0.2);
  bezierVertex(-size * 0.15, size * 0.05, -size * 0.2, -size * 0.1, 0, -size * 0.2);
  bezierVertex(size * 0.2, -size * 0.1, size * 0.15, size * 0.05, 0, size * 0.2);
  endShape(CLOSE);
  // Symmetrical spirals
  for (let dir = -1; dir <= 1; dir += 2) {
    beginShape();
    noFill();
    for (let i = 0; i <= 15; i++) {
      let t = i / 15;
      let angle = t * TWO_PI * 1.5 * dir;
      let radius = size * (0.1 + t * 0.15);
      vertex(cos(angle) * radius * dir, sin(angle) * radius);
    }
    endShape();
  }
  pop();
}

function drawGyeNyameSymbol(r, g, b, size) {
  // Gye Nyame - circular pattern with radiating lines
  ellipse(0, 0, size, size);
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    line(0, 0, cos(angle) * size * 0.4, sin(angle) * size * 0.4);
  }
  ellipse(0, 0, size * 0.5, size * 0.5);
}

function drawAdinkraheneSymbol(r, g, b, size) {
  // Adinkrahene - king pattern with concentric circles
  ellipse(0, 0, size, size);
  ellipse(0, 0, size * 0.7, size * 0.7);
  ellipse(0, 0, size * 0.4, size * 0.4);
  // Cross pattern
  line(-size * 0.5, 0, size * 0.5, 0);
  line(0, -size * 0.5, 0, size * 0.5);
}

function drawAkomaSymbol(r, g, b, size) {
  // Akoma - heart shape
  beginShape();
  vertex(0, size * 0.3);
  bezierVertex(0, size * 0.1, -size * 0.3, size * 0.1, -size * 0.3, 0);
  bezierVertex(-size * 0.3, -size * 0.2, 0, -size * 0.3, 0, -size * 0.1);
  bezierVertex(0, -size * 0.3, size * 0.3, -size * 0.2, size * 0.3, 0);
  bezierVertex(size * 0.3, size * 0.1, 0, size * 0.1, 0, size * 0.3);
  endShape(CLOSE);
}

function drawDwennimmenSymbol(r, g, b, size) {
  // Dwennimmen - ram's horns (spiral)
  for (let i = 0; i < 2; i++) {
    let direction = i === 0 ? 1 : -1;
    beginShape();
    for (let j = 0; j <= 20; j++) {
      let t = j / 20;
      let angle = t * TWO_PI * direction;
      let radius = size * (0.2 + t * 0.3);
      vertex(cos(angle) * radius * direction, sin(angle) * radius);
    }
    endShape();
  }
}

function drawEpaSymbol(r, g, b, size) {
  // Epa - handcuffs (interlocking circles)
  ellipse(-size * 0.2, 0, size * 0.4, size * 0.4);
  ellipse(size * 0.2, 0, size * 0.4, size * 0.4);
  // Connecting link
  rect(0, -size * 0.1, size * 0.15, size * 0.2);
}

function drawFihankraSymbol(r, g, b, size) {
  // Fihankra - house (square with triangle roof)
  rectMode(CENTER);
  rect(0, size * 0.1, size * 0.6, size * 0.4);
  // Roof
  beginShape();
  vertex(-size * 0.3, size * 0.1);
  vertex(0, -size * 0.2);
  vertex(size * 0.3, size * 0.1);
  endShape(CLOSE);
}

function drawNkyinkyimSymbol(r, g, b, size) {
  // Nkyinkyim - twisted pattern
  beginShape();
  for (let i = 0; i <= 20; i++) {
    let t = i / 20;
    let angle = t * TWO_PI * 3;
    let radius = size * (0.2 + sin(t * TWO_PI * 2) * 0.1);
    vertex(cos(angle) * radius, sin(angle) * radius);
  }
  endShape(CLOSE);
}

function drawOsramSymbol(r, g, b, size) {
  // Osram ne Nsoromma - moon and star
  // Moon (crescent)
  arc(0, 0, size * 0.6, size * 0.6, -PI/4, PI + PI/4);
  // Star
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = (TWO_PI / 5) * i - HALF_PI;
    let radius = i % 2 === 0 ? size * 0.3 : size * 0.15;
    vertex(cos(angle) * radius, sin(angle) * radius);
  }
  endShape(CLOSE);
}

function drawDuafeSymbol(r, g, b, size) {
  // Duafe - wooden comb
  // Handle
  rect(0, -size * 0.3, size * 0.15, size * 0.4);
  // Teeth
  for (let i = -2; i <= 2; i++) {
    line(i * size * 0.08, size * 0.1, i * size * 0.08, size * 0.3);
  }
}

function drawMpatapoSymbol(r, g, b, size) {
  // Mpatapo - knot of reconciliation (interlaced pattern)
  for (let i = 0; i < 4; i++) {
    let angle = (TWO_PI / 4) * i;
    push();
    translate(cos(angle) * size * 0.15, sin(angle) * size * 0.15);
    rotate(angle);
    rect(0, 0, size * 0.2, size * 0.1);
    pop();
  }
  ellipse(0, 0, size * 0.3, size * 0.3);
}

function drawNyameBiribiSymbol(r, g, b, size) {
  // Nyame Biribi Wo Soro - God is in the heavens (star and crescent)
  // Crescent
  arc(0, size * 0.1, size * 0.5, size * 0.5, -PI/3, PI + PI/3);
  // Star above
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = (TWO_PI / 5) * i - HALF_PI;
    let radius = i % 2 === 0 ? size * 0.25 : size * 0.12;
    vertex(cos(angle) * radius, sin(angle) * radius - size * 0.2);
  }
  endShape(CLOSE);
}

function drawOdoSymbol(r, g, b, size) {
  // Odo Nnyew Fie Kwan - love never loses its way (heart with path)
  // Heart
  beginShape();
  vertex(0, size * 0.2);
  bezierVertex(-size * 0.2, 0, -size * 0.3, -size * 0.2, 0, -size * 0.3);
  bezierVertex(size * 0.3, -size * 0.2, size * 0.2, 0, 0, size * 0.2);
  endShape(CLOSE);
  // Path lines
  for (let i = 0; i < 3; i++) {
    let y = -size * 0.1 + i * size * 0.1;
    line(-size * 0.2, y, size * 0.2, y);
  }
}

function drawWawaAbaSymbol(r, g, b, size) {
  // Wawa Aba - seed of the wawa tree (diamond with lines)
  beginShape();
  vertex(0, -size * 0.4);
  vertex(size * 0.3, 0);
  vertex(0, size * 0.4);
  vertex(-size * 0.3, 0);
  endShape(CLOSE);
  // Internal lines
  line(0, -size * 0.4, 0, size * 0.4);
  line(-size * 0.3, 0, size * 0.3, 0);
}

function drawAkofenaSymbol(r, g, b, size) {
  // Akofena - sword of war
  // Blade
  rect(0, -size * 0.2, size * 0.1, size * 0.5);
  // Handle
  rect(0, size * 0.15, size * 0.2, size * 0.15);
  // Cross guard
  rect(0, -size * 0.2, size * 0.3, size * 0.05);
}

function drawNsorommaSymbol(r, g, b, size) {
  // Nsoromma - star (child of the heavens)
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i - HALF_PI;
    let radius = i % 2 === 0 ? size * 0.4 : size * 0.2;
    vertex(cos(angle) * radius, sin(angle) * radius);
  }
  endShape(CLOSE);
  // Central circle
  ellipse(0, 0, size * 0.15, size * 0.15);
}

// African-inspired pattern functions
function drawAdinkraPattern(type, r, g, b, size, time) {
  stroke(r, g, b, 200);
  strokeWeight(2);
  noFill();
  
  // Draw "Gye Nyame" inspired pattern (except God)
  let patternSize = size * 0.3;
  push();
  rotate(time * 0.2);
  // Central circle
  ellipse(0, 0, patternSize, patternSize);
  // Radiating lines
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    line(0, 0, cos(angle) * patternSize * 0.5, sin(angle) * patternSize * 0.5);
  }
  pop();
}

function drawKentePattern(type, r, g, b, size, time) {
  noStroke();
  // Draw horizontal and vertical stripes (Kente-inspired)
  let stripeWidth = size * 0.1;
  for (let i = -2; i <= 2; i++) {
    // Horizontal stripes
    fill(r, g, b, 180 + i * 20);
    rect(-size * 0.4, i * stripeWidth, size * 0.8, stripeWidth * 0.5);
    // Vertical stripes
    fill(r, g, b, 200 - i * 20);
    rect(i * stripeWidth, -size * 0.4, stripeWidth * 0.5, size * 0.8);
  }
}

function drawShieldPattern(type, r, g, b, size, time) {
  stroke(r, g, b, 180);
  strokeWeight(2);
  noFill();
  
  // Draw shield-inspired radial pattern
  push();
  rotate(time * 0.15);
  for (let layer = 1; layer <= 4; layer++) {
    let layerSize = size * (0.2 + layer * 0.1);
    // Draw curved segments (shield-like)
    for (let seg = 0; seg < 4; seg++) {
      let startAngle = (TWO_PI / 4) * seg;
      arc(0, 0, layerSize, layerSize, startAngle, startAngle + PI / 2);
    }
  }
  pop();
}

function drawGeometricPattern(type, r, g, b, size, time) {
  stroke(r, g, b, 200);
  strokeWeight(2);
  noFill();
  
  // Draw interlocking geometric shapes
  let patternSize = size * 0.25;
  push();
  rotate(time * 0.25);
  // Draw diamond grid
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      push();
      translate(x * patternSize, y * patternSize);
      beginShape();
      vertex(0, -patternSize * 0.3);
      vertex(patternSize * 0.3, 0);
      vertex(0, patternSize * 0.3);
      vertex(-patternSize * 0.3, 0);
      endShape(CLOSE);
      pop();
    }
  }
  pop();
}

function drawRadialPattern(type, r, g, b, size, time) {
  stroke(r, g, b, 220);
  strokeWeight(2);
  noFill();
  
  // Draw radial pattern inspired by African sun symbols
  push();
  rotate(time * 0.3);
  let centerSize = size * 0.2;
  ellipse(0, 0, centerSize, centerSize);
  
  // Radiating spokes
  for (let i = 0; i < 12; i++) {
    let angle = (TWO_PI / 12) * i;
    let startRadius = centerSize * 0.5;
    let endRadius = size * 0.35;
    line(cos(angle) * startRadius, sin(angle) * startRadius,
         cos(angle) * endRadius, sin(angle) * endRadius);
  }
  pop();
}

function drawOrganicPattern(type, r, g, b, size, time) {
  stroke(r, g, b, 200);
  strokeWeight(2);
  noFill();
  
  // Draw organic flowing patterns
  push();
  rotate(time * 0.2);
  let patternSize = size * 0.3;
  // Draw flowing curves
  for (let i = 0; i < 3; i++) {
    let angle = (TWO_PI / 3) * i;
    beginShape();
    for (let j = 0; j <= 20; j++) {
      let t = j / 20;
      let curveAngle = angle + sin(t * TWO_PI + time) * 0.3;
      let radius = patternSize * (0.3 + t * 0.4);
      vertex(cos(curveAngle) * radius, sin(curveAngle) * radius);
    }
    endShape();
  }
  pop();
}

function drawInterlockingPattern(type, r, g, b, size, time) {
  stroke(r, g, b, 200);
  strokeWeight(2);
  noFill();
  
  // Draw interlocking geometric pattern
  let patternSize = size * 0.25;
  push();
  rotate(time * 0.2);
  for (let i = 0; i < 5; i++) {
    let angle = (TWO_PI / 5) * i;
    push();
    translate(cos(angle) * patternSize * 0.5, sin(angle) * patternSize * 0.5);
    rotate(angle);
    // Draw interlocking shape
    beginShape();
    vertex(0, -patternSize * 0.3);
    vertex(patternSize * 0.2, -patternSize * 0.1);
    vertex(patternSize * 0.3, 0);
    vertex(patternSize * 0.2, patternSize * 0.1);
    vertex(0, patternSize * 0.3);
    vertex(-patternSize * 0.2, patternSize * 0.1);
    vertex(-patternSize * 0.3, 0);
    vertex(-patternSize * 0.2, -patternSize * 0.1);
    endShape(CLOSE);
    pop();
  }
  pop();
}

function drawSankofaPattern(type, r, g, b, size, time) {
  stroke(r, g, b, 220);
  strokeWeight(3);
  noFill();
  
  // Draw Sankofa-inspired pattern (bird looking back)
  let patternSize = size * 0.3;
  push();
  rotate(time * 0.15);
  // Draw stylized bird shape
  beginShape();
  vertex(0, -patternSize * 0.4);
  vertex(patternSize * 0.3, -patternSize * 0.2);
  vertex(patternSize * 0.4, 0);
  vertex(patternSize * 0.3, patternSize * 0.2);
  vertex(0, patternSize * 0.4);
  vertex(-patternSize * 0.2, patternSize * 0.1);
  vertex(-patternSize * 0.3, 0);
  vertex(-patternSize * 0.2, -patternSize * 0.1);
  endShape(CLOSE);
  // Add head looking back
  ellipse(-patternSize * 0.25, -patternSize * 0.15, patternSize * 0.15, patternSize * 0.15);
  pop();
}

function drawFlavorEffects(type, r, g, b, size, activity, time) {
  const effectType = type % 4;
  
  switch(effectType) {
    case 0: // Intense radiating citrus peel segments - flavor explosions
      stroke(r, g, b, 250 * activity);
      strokeWeight(4);
      noFill();
      for (let i = 0; i < 8; i++) {
        let angle = (TWO_PI / 8) * i + time * 0.2;
        let peelLength = size * 1.2;
        let startX = cos(angle) * size * 0.5;
        let startY = sin(angle) * size * 0.5;
        let endX = cos(angle) * peelLength;
        let endY = sin(angle) * peelLength;
        
        // Draw peel segment
        line(startX, startY, endX, endY);
        push();
        translate(endX, endY);
        rotate(angle);
        // Draw peel texture
        noStroke();
        fill(r, g, b, 220);
        ellipse(0, 0, size * 0.3, size * 0.2);
        // Add peel highlights
        fill(255, 240, 200, 180);
        ellipse(-size * 0.08, -size * 0.06, size * 0.15, size * 0.1);
        pop();
        // Radiating flavor bursts from peel
        stroke(r, g, b, activity * 200);
        strokeWeight(4);
        let burstLength = size * (2.0 + sin(time * 3 + i) * 0.5);
        line(endX, endY, cos(angle) * burstLength, sin(angle) * burstLength);
        // Add flavor droplets
        fill(r, g, b, activity * 250);
        noStroke();
        ellipse(cos(angle) * burstLength, sin(angle) * burstLength, size * 0.1, size * 0.1);
      }
      noStroke();
      break;
      
    case 1: // Intense radiating juice streams - flavor sprays
      stroke(r, g, b, 250 * activity);
      strokeWeight(4);
      for (let i = 0; i < 12; i++) {
        let angle = (TWO_PI / 12) * i;
        let streamLength = size * 1.4;
        let startX = cos(angle) * size * 0.5;
        let startY = sin(angle) * size * 0.5;
        let endX = cos(angle) * streamLength;
        let endY = sin(angle) * streamLength;
        
        // Draw juice stream
        line(startX, startY, endX, endY);
        // Add juice droplets along stream
        for (let drop = 0; drop < 4; drop++) {
          let dropX = lerp(startX, endX, (drop + 1) / 5);
          let dropY = lerp(startY, endY, (drop + 1) / 5);
          fill(r, g, b, activity * 220);
          noStroke();
          ellipse(dropX, dropY, size * 0.06, size * 0.06);
        }
        // Pulsing juice burst at stream end
        let pulse = sin(time * 4 + i) * 0.3 + 0.7;
        fill(r, g, b, activity * 250 * pulse);
        noStroke();
        ellipse(endX, endY, size * 0.2 * pulse, size * 0.2 * pulse);
        // Add flavor aura around burst
        stroke(r, g, b, activity * 200);
        strokeWeight(2);
        noFill();
        ellipse(endX, endY, size * 0.3 * pulse, size * 0.3 * pulse);
        // Radiating flavor sprays from burst
        stroke(r, g, b, activity * 180);
        strokeWeight(3);
        for (let spray = 0; spray < 4; spray++) {
          let sprayAngle = angle + (spray - 1.5) * 0.3;
          let sprayLength = size * (1.6 + sin(time * 2 + i + spray) * 0.4);
          line(endX, endY, cos(sprayAngle) * sprayLength, sin(sprayAngle) * sprayLength);
        }
      }
      break;
      
    case 2: // Intense radiating citrus slice - flavor explosion
      noStroke();
      // Draw large citrus slice above tangerine
      fill(r, g, b, activity * 220);
      push();
      translate(0, -size * 0.6);
      rotate(time * 0.3);
      beginShape();
      for (let i = 0; i < 12; i++) {
        let angle = (TWO_PI / 12) * i;
        let radius = i % 2 === 0 ? size * 0.4 : size * 0.25;
        vertex(cos(angle) * radius, sin(angle) * radius);
      }
      endShape(CLOSE);
      // Add segment lines
      stroke(r * 0.8, g * 0.8, b * 0.8, activity * 200);
      strokeWeight(2);
      for (let i = 0; i < 6; i++) {
        let angle = (TWO_PI / 6) * i;
        line(0, 0, cos(angle) * size * 0.35, sin(angle) * size * 0.35);
      }
      pop();
      // Radiating flavor bursts from slice
      stroke(r, g, b, activity * 240);
      strokeWeight(6);
      for (let burst = 0; burst < 20; burst++) {
        let burstAngle = -HALF_PI + (burst - 10) * 0.12;
        let burstLength = size * (2.4 + sin(time * 3 + burst) * 0.6);
        line(0, -size * 0.6, cos(burstAngle) * burstLength, sin(burstAngle) * burstLength);
        // Add juice droplet at burst end
        fill(r, g, b, activity * 250);
        noStroke();
        ellipse(cos(burstAngle) * burstLength, sin(burstAngle) * burstLength, size * 0.12, size * 0.12);
        stroke(r, g, b, activity * 240);
        strokeWeight(6);
      }
      noStroke();
      break;
      
    case 3: // Intense radiating flavor droplets - juice explosion
      stroke(r, g, b, activity * 220);
      strokeWeight(4);
      for (let i = 0; i < 16; i++) {
        let angle = (TWO_PI / 16) * i;
        let streamLength = size * (1.8 + sin(time * 3 + i) * 0.5);
        let startX = cos(angle) * size * 0.5;
        let startY = sin(angle) * size * 0.5;
        let endX = cos(angle) * streamLength;
        let endY = sin(angle) * streamLength;
        
        // Draw juice stream
        line(startX, startY, endX, endY);
        // Pulsing juice droplets
        let dropPulse = sin(time * 5 + i) * 0.4 + 0.6;
        fill(r, g, b, activity * 250 * dropPulse);
        noStroke();
        // Draw as teardrop shape
        push();
        translate(endX, endY);
        rotate(angle);
        beginShape();
        vertex(0, -size * 0.08 * dropPulse);
        bezierVertex(size * 0.05 * dropPulse, -size * 0.04 * dropPulse,
                     size * 0.05 * dropPulse, size * 0.04 * dropPulse,
                     0, size * 0.08 * dropPulse);
        bezierVertex(-size * 0.05 * dropPulse, size * 0.04 * dropPulse,
                     -size * 0.05 * dropPulse, -size * 0.04 * dropPulse,
                     0, -size * 0.08 * dropPulse);
        endShape(CLOSE);
        pop();
        // Additional radiating flavor sprays from droplets
        stroke(r, g, b, activity * 180);
        strokeWeight(3);
        for (let spray = 0; spray < 3; spray++) {
          let sprayAngle = angle + (spray - 1) * 0.3;
          let sprayLength = size * 0.5;
          line(endX, endY, cos(sprayAngle) * sprayLength, sin(sprayAngle) * sprayLength);
        }
        stroke(r, g, b, activity * 220);
        strokeWeight(4);
      }
      noStroke();
      break;
  }
  
  // Flavor waves - unique patterns
  if (currentNote && activity > 0.2) {
    drawFlavorWaves(type, r, g, b, size, activity, time);
  }
  
  // Flavor glisten - different patterns
  if (currentNote) {
    drawFlavorGlisten(type, r, g, b, size, time);
  }
}

function drawFlavorWaves(type, r, g, b, size, activity, time) {
  noFill();
  strokeWeight(4);
  
  const waveType = type % 3;
  
  switch(waveType) {
    case 0: // Intense radiating concentric circles
      for (let wave = 1; wave <= 6; wave++) {
        let waveSize = size * (1.8 + wave * 0.5);
        let waveAlpha = activity * (300 / wave);
        let pulse = sin(time * 4 + wave * 0.8) * 0.3 + 1;
        stroke(r, g, b, waveAlpha);
        ellipse(0, 0, waveSize * pulse, waveSize * pulse);
      }
      // Add radiating beams between waves
      stroke(r, g, b, activity * 200);
      strokeWeight(5);
      for (let beam = 0; beam < 16; beam++) {
        let angle = (TWO_PI / 16) * beam + time * 0.5;
        let beamLength = size * (2.5 + sin(time * 3 + beam) * 0.4);
        line(0, 0, cos(angle) * beamLength, sin(angle) * beamLength);
      }
      break;
      
    case 1: // Intense radiating spiral waves
      stroke(r, g, b, activity * 250);
      strokeWeight(4);
      for (let wave = 0; wave < 5; wave++) {
        beginShape();
        for (let i = 0; i < 80; i++) {
          let angle = (TWO_PI / 80) * i * 4 + time * 2 + wave;
          let radius = size * (1.5 + i * 0.03);
          vertex(cos(angle) * radius, sin(angle) * radius);
        }
        endShape();
      }
      // Add radiating spikes from center
      stroke(r, g, b, activity * 220);
      strokeWeight(6);
      for (let spike = 0; spike < 12; spike++) {
        let angle = (TWO_PI / 12) * spike + time;
        let spikeLength = size * (2.2 + sin(time * 4 + spike) * 0.5);
        line(0, 0, cos(angle) * spikeLength, sin(angle) * spikeLength);
      }
      break;
      
    case 2: // Intense radiating radial beams
      strokeWeight(6);
      for (let beam = 0; beam < 20; beam++) {
        let angle = (TWO_PI / 20) * beam + time * 0.8;
        let beamLength = size * (2 + sin(time * 3 + beam * 0.5) * 0.6);
        let beamAlpha = activity * (200 + sin(time * 2 + beam) * 55);
        stroke(r, g, b, beamAlpha);
        line(0, 0, cos(angle) * beamLength, sin(angle) * beamLength);
      }
      // Add pulsing circles at beam ends
      for (let beam = 0; beam < 20; beam++) {
        let angle = (TWO_PI / 20) * beam + time * 0.8;
        let beamLength = size * (2 + sin(time * 3 + beam * 0.5) * 0.6);
        let pulse = sin(time * 5 + beam) * 0.3 + 0.7;
        fill(r, g, b, activity * 200 * pulse);
        noStroke();
        ellipse(cos(angle) * beamLength, sin(angle) * beamLength, size * 0.2 * pulse, size * 0.2 * pulse);
      }
      break;
  }
  
  noStroke();
}

function drawFlavorGlisten(type, r, g, b, size, time) {
  const lightPattern = type % 4;
  
  switch(lightPattern) {
    case 0: // Intense radiating blinking lights
      let blink = sin(time * 6) > 0;
      if (blink) {
        fill(255, 255, 255, 255);
        noStroke();
        ellipse(-size * 0.3, size * 0.3, size * 0.15, size * 0.15);
        ellipse(size * 0.3, size * 0.3, size * 0.15, size * 0.15);
        // Radiating beams from lights
        stroke(255, 255, 255, 200);
        strokeWeight(2);
        for (let beam = 0; beam < 4; beam++) {
          let angle1 = (TWO_PI / 4) * beam;
          let angle2 = (TWO_PI / 4) * beam;
          let beamLength = size * 0.5;
          line(-size * 0.3, size * 0.3, -size * 0.3 + cos(angle1) * beamLength, size * 0.3 + sin(angle1) * beamLength);
          line(size * 0.3, size * 0.3, size * 0.3 + cos(angle2) * beamLength, size * 0.3 + sin(angle2) * beamLength);
        }
      }
      break;
      
    case 1: // Intense radiating rotating lights
      for (let i = 0; i < 6; i++) {
        let angle = (TWO_PI / 6) * i + time * 3;
        let lightX = cos(angle) * size * 0.5;
        let lightY = sin(angle) * size * 0.5;
        let pulse = sin(time * 5 + i) * 0.3 + 0.7;
        fill(r, g, b, 255 * pulse);
        noStroke();
        ellipse(lightX, lightY, size * 0.15 * pulse, size * 0.15 * pulse);
        // Radiating beams from rotating lights
        stroke(r, g, b, 200 * pulse);
        strokeWeight(2);
        let beamLength = size * 0.8;
        line(lightX, lightY, cos(angle) * beamLength, sin(angle) * beamLength);
      }
      noStroke();
      break;
      
    case 2: // Intense radiating pulsing ring
      let pulse = sin(time * 5) * 0.4 + 0.6;
      fill(r, g, b, pulse * 250);
      noStroke();
      ellipse(0, 0, size * 0.5 * pulse, size * 0.5 * pulse);
      // Radiating spikes from pulsing ring
      stroke(r, g, b, pulse * 220);
      strokeWeight(4);
      for (let spike = 0; spike < 8; spike++) {
        let angle = (TWO_PI / 8) * spike;
        let spikeLength = size * (1.2 + sin(time * 3 + spike) * 0.3);
        line(0, 0, cos(angle) * spikeLength, sin(angle) * spikeLength);
      }
      noStroke();
      break;
      
    case 3: // Intense radiating scanning line
      stroke(r, g, b, 250);
      strokeWeight(4);
      let scanAngle = (time * 3) % TWO_PI;
      let scanLength = size * 2.5;
      line(0, 0, cos(scanAngle) * scanLength, sin(scanAngle) * scanLength);
      // Add pulsing circle at scan end
      let scanPulse = sin(time * 8) * 0.3 + 0.7;
      fill(r, g, b, 250 * scanPulse);
      noStroke();
      ellipse(cos(scanAngle) * scanLength, sin(scanAngle) * scanLength, size * 0.2 * scanPulse, size * 0.2 * scanPulse);
      // Add radiating beams perpendicular to scan line
      stroke(r, g, b, 180);
      strokeWeight(2);
      let perpAngle1 = scanAngle + HALF_PI;
      let perpAngle2 = scanAngle - HALF_PI;
      let perpLength = size * 0.6;
      let scanEndX = cos(scanAngle) * scanLength;
      let scanEndY = sin(scanAngle) * scanLength;
      line(scanEndX, scanEndY, scanEndX + cos(perpAngle1) * perpLength, scanEndY + sin(perpAngle1) * perpLength);
      line(scanEndX, scanEndY, scanEndX + cos(perpAngle2) * perpLength, scanEndY + sin(perpAngle2) * perpLength);
      noStroke();
      break;
  }
}

function drawNoteInfo() {
  const centerX = width / 2;
  // Match satellite position - better spatial hierarchy
  const satelliteCenterY = height * 0.28;
  const baseSatelliteSize = min(width, height) * 0.12;
  const satelliteSize = currentNote ? baseSatelliteSize : baseSatelliteSize * 0.8;
  
  // Fluid text scaling - responsive to window size, ensure it fits
  const textScale = map(min(width, height), 500, 2000, 0.8, 1.4);
  
  // Better spatial design: create clear separation between animation and text
  // Satellite name positioned with generous spacing from satellite
  const satelliteBottom = satelliteCenterY + (satelliteSize / 2);
  const titleSpacing = min(width, height) * 0.12; // Reduced spacing to leave more room for message
  const nameY = satelliteBottom + titleSpacing;
  
  // Ensure nameY is within visible bounds with proper margin
  const minY = satelliteBottom + (min(width, height) * 0.06); // Minimum spacing from satellite
  const maxY = height * 0.45; // More room for message text
  const safeNameY = constrain(nameY, minY, maxY);
  
  if (currentNote) {
    // Calculate dream title text size to fit on screen - Oracle style
    const availableWidth = width * 0.9; // Use 90% of width for safety
    const testSize = 80;
    textSize(testSize * textScale);
    const testWidth = textWidth(currentNote.satelliteName);
    const nameTextSize = constrain((availableWidth / testWidth) * testSize * textScale, 40 * textScale, 90 * textScale);
    
    // Oracle message styling - mystical, glowing effect
    const time = millis() * 0.001;
    const glowPulse = sin(time * 2) * 0.3 + 0.7;
    
    // Multiple glow layers for oracle effect
    for (let layer = 5; layer > 0; layer--) {
      let glowAlpha = (30 / layer) * glowPulse;
      let glowSize = nameTextSize * (1 + layer * 0.05);
      fill(red(currentNote.color), green(currentNote.color), blue(currentNote.color), glowAlpha);
      textAlign(CENTER, CENTER);
      textSize(glowSize);
      textStyle(BOLD);
      text(currentNote.satelliteName, centerX, safeNameY);
    }
    
    // Outer glow shadow
    fill(0, 0, 0, 150);
    textAlign(CENTER, CENTER);
    textSize(nameTextSize * 1.1);
    textStyle(BOLD);
    text(currentNote.satelliteName, centerX + 2, safeNameY + 2);
    
    // Main oracle text with pulsing glow
    fill(255, 255, 255, 255); // Bright white for oracle clarity
    textAlign(CENTER, CENTER);
    textSize(nameTextSize);
    textStyle(BOLD);
    
    // Add mystical shimmer effect
    push();
    // Create a subtle gradient-like effect with multiple passes
    for (let pass = 0; pass < 3; pass++) {
      let offset = pass * 0.5;
      let alpha = 255 / (pass + 1);
      fill(red(currentNote.color), green(currentNote.color), blue(currentNote.color), alpha);
      text(currentNote.satelliteName, centerX + offset, safeNameY + offset);
    }
    // Final bright pass
    fill(255, 255, 255, 255);
    text(currentNote.satelliteName, centerX, safeNameY);
    pop();
    
    // Add small decorative stars/sparks around the title
    fill(255, 255, 255, 200 * glowPulse);
    noStroke();
    const starDist = (testWidth * nameTextSize / testSize) / 2 + nameTextSize * 0.3;
    for (let star = 0; star < 8; star++) {
      let angle = (TWO_PI / 8) * star + time;
      let starX = centerX + cos(angle) * starDist * 1.3;
      let starY = safeNameY + sin(angle) * starDist * 0.3;
      let starSize = sin(time * 3 + star) * 0.3 + 0.7;
      ellipse(starX, starY, nameTextSize * 0.05 * starSize, nameTextSize * 0.05 * starSize);
    }
    
    // Visual separator/connector between title and message (subtle)
    const separatorY = safeNameY + (nameTextSize * 0.6);
    stroke(red(currentNote.color), green(currentNote.color), blue(currentNote.color), 100);
    strokeWeight(2);
    line(centerX - width * 0.15, separatorY, centerX + width * 0.15, separatorY);
    noStroke();
    
    // Draw message text below dream title - improved spatial design
    const messageSpacing = min(width, height) * 0.08; // Reduced spacing to fit more text
    const messageY = safeNameY + (nameTextSize * 0.5) + messageSpacing;
    const messageWidth = width * 0.88; // Use 88% of screen width for better flow
    
    // Calculate available height for message text
    const bottomMargin = min(width, height) * 0.08; // Margin from bottom
    const maxAvailableHeight = height - messageY - bottomMargin;
    
    // Ensure message doesn't go off screen - fluid max height
    const safeMessageY = constrain(messageY, safeNameY + (min(width, height) * 0.06), height - bottomMargin);
    
    // Message text - centered, no box, just clean text
    fill(255, 255, 255, 255); // Full opacity white for visibility
    textAlign(CENTER, TOP);
    // Slightly smaller text size to fit more content
    const messageTextSize = map(min(width, height), 500, 2000, 22, 36) * textScale;
    textSize(messageTextSize);
    textStyle(NORMAL);
    // Slightly tighter line height to fit more lines
    const lineHeight = messageTextSize * 1.6;
    textLeading(lineHeight);
    
    // Split text into lines and center each line
    const words = currentNote.satelliteMessage.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let word of words) {
      let testLine = currentLine + (currentLine ? ' ' : '') + word;
      textSize(messageTextSize);
      let testWidth = textWidth(testLine);
      
      if (testWidth > messageWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Calculate how many lines can fit in available space
    const maxLines = floor(maxAvailableHeight / lineHeight);
    const linesToShow = min(lines.length, maxLines);
    
    // Draw each line centered, ensuring we don't go off screen
    let yPos = safeMessageY;
    for (let i = 0; i < linesToShow; i++) {
      // Check if next line would go off screen
      if (yPos + lineHeight > height - bottomMargin) {
        break;
      }
      text(lines[i], centerX, yPos);
      yPos += lineHeight;
    }
    
    // If text was truncated, add ellipsis indicator
    if (lines.length > linesToShow) {
      fill(255, 255, 255, 180);
      textSize(messageTextSize * 0.8);
      text('...', centerX, yPos);
    }
  } else {
    fill(255, 255, 255, 200);
    textAlign(CENTER, CENTER);
    textSize(32 * textScale);
    textStyle(NORMAL);
    
    // Multi-line instruction
    const instructionLines = [
      "Touch the tangerines in the baskets and one of the 16",
      "tangerines on the edge of the table at the same time",
      "to receive the dream. Keep touching to receive the whole dream.",
      "",
      "To get another dream, touch another tangerine outside the basket.",
      "You may take one of the tangerines to eat them later.",
      "And the dream will be part of you."
    ];
    
    const lineHeight = 45 * textScale;
    let yPos = safeNameY - (instructionLines.length * lineHeight) / 2;
    
    for (let line of instructionLines) {
      if (line.trim()) {
        text(line, centerX, yPos);
      }
      yPos += lineHeight;
    }
  }
}


function drawChannelGrid() {
  // Safety check: ensure channelColors is initialized
  if (channelColors.length === 0) {
    return;
  }
  
  const cols = 4;
  const rows = 4;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  
  // Draw channel backgrounds with activity glow
  for (let ch = 1; ch <= 16; ch++) {
    const gridCol = (ch - 1) % 4;
    const gridRow = Math.floor((ch - 1) / 4);
    const x = gridCol * cellWidth;
    const y = gridRow * cellHeight;
    const activity = channelActivity[ch - 1];
    
    // Draw background glow when active
    if (activity > 0.1) {
      fill(red(channelColors[ch - 1]), 
           green(channelColors[ch - 1]), 
           blue(channelColors[ch - 1]), 
           activity * 30);
      noStroke();
      rect(x, y, cellWidth, cellHeight);
    }
    
    // Draw subtle border
    stroke(50, 50, 60, 100);
    strokeWeight(2);
    noFill();
    rect(x, y, cellWidth, cellHeight);
  }
  
  // Draw channel labels with glow effect
  textAlign(CENTER, CENTER);
  textSize(16);
  noStroke();
  
  // Count active notes per channel
  let notesPerChannel = new Array(16).fill(0);
  for (let note of activeNotes) {
    if (note.channel >= 1 && note.channel <= 16) {
      notesPerChannel[note.channel - 1]++;
    }
  }
  
  for (let ch = 1; ch <= 16; ch++) {
    const gridCol = (ch - 1) % 4;
    const gridRow = Math.floor((ch - 1) / 4);
    const x = gridCol * cellWidth + cellWidth / 2;
    const y = gridRow * cellHeight + 25;
    const activity = channelActivity[ch - 1];
    const noteCount = notesPerChannel[ch - 1];
    const midiNote = ch + 59; // Visual channel 1 = MIDI note 60, etc.
    
    // Draw text shadow
    fill(0, 0, 0, 150);
    text(`Note ${midiNote}`, x + 2, y + 2);
    
    // Draw main text with activity-based brightness
    let brightness = 200 + (activity * 55);
    fill(red(channelColors[ch - 1]) * brightness / 255, 
         green(channelColors[ch - 1]) * brightness / 255, 
         blue(channelColors[ch - 1]) * brightness / 255);
    text(`Note ${midiNote}`, x, y);
    
    // Show section number
    fill(255, 255, 255, 150);
    textSize(10);
    text(`Sec ${ch}`, x, y + 18);
    
    // Show active note count
    if (noteCount > 0) {
      fill(255, 255, 255, 200);
      textSize(12);
      text(`●`, x, y + 32);
    }
  }
}

