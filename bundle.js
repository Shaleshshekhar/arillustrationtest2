// ==========================================
// 8TH WALL IMAGE TARGET CONFIGURATION
// ==========================================
const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [{
      name: 'bear_target',
      type: 'PLANAR',
      imagePath: 'image-targets/bear_target_luminance.jpg',
      properties: {
        top: 320,
        left: 0,
        width: 960,
        height: 1280,
        isRotated: false,
        originalWidth: 960,
        originalHeight: 1920
      }
    }]
  })
}

// Check tracking engine initialization state
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)


// ==========================================
// APPLICATION LIFECYCLE MANAGEMENT
// ==========================================
window.APP = {
  started: false,
  tracking: false
}

window.addEventListener('load', () => {
  const startButton = document.querySelector('#startButton')
  const bearVideo = document.querySelector('#bearVideo')
  const splashScreen = document.querySelector('#splashScreen')
  const statusMessage = document.querySelector('#statusMessage')
  const videoPlane = document.querySelector('#videoPlane')
  const scene = document.querySelector('a-scene')

  // 1. Asset Pipeline Preload Verification
  bearVideo.load()
  bearVideo.addEventListener('loadeddata', () => {
    startButton.disabled = false
    startButton.innerText = 'START EXPERIENCE'
  }, { once: true })

  // 2. Clear Splash Action & Muted Playback Warmup (Bypasses Browser Autoplay Restrictions)
  startButton.addEventListener('click', async () => {
    if (APP.started) return
    APP.started = true

    try {
      await bearVideo.play()
      bearVideo.pause()
      bearVideo.currentTime = 0
    } catch (e) {
      console.log('Video runtime engine initialization warmed up safely.')
    }

    splashScreen.style.display = 'none'
    
    if (!APP.tracking) {
      statusMessage.innerText = 'SCAN THE BEAR TARGET'
      statusMessage.style.display = 'block'
    }
  })

  // 3. Image Tracking Infrastructure Listeners
  scene.addEventListener('xrimagefound', () => {
    APP.tracking = true
    statusMessage.style.display = 'none'
    videoPlane.setAttribute('visible', 'true')
    
    if (APP.started) {
      bearVideo.play()
    }
  })

  scene.addEventListener('xrimagelost', () => {
    APP.tracking = false
    bearVideo.pause()
    
    if (APP.started) {
      statusMessage.innerText = 'RE-SCAN THE BEAR TARGET'
      statusMessage.style.display = 'block'
    }
  })
})