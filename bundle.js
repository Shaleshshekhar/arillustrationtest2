// ==========================================
// 8TH WALL 8-TARGET CONFIGURATION ARRAY
// ==========================================
const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      {
        name: 'bear_target',
        type: 'PLANAR',
        imagePath: 'image-targets/bear_target_luminance.jpg',
        properties: { top: 320, left: 0, width: 960, height: 1280, isRotated: false, originalWidth: 960, originalHeight: 1920 }
      },
      {
        name: 'crow_target',
        type: 'PLANAR',
        imagePath: 'image-targets/crow_target_luminance.jpg',
        properties: { top: 320, left: 0, width: 960, height: 1280, isRotated: false, originalWidth: 960, originalHeight: 1920 }
      },
      {
        name: 'donkey_target',
        type: 'PLANAR',
        imagePath: 'image-targets/donkey_target_luminance.jpg',
        properties: { top: 320, left: 0, width: 960, height: 1280, isRotated: false, originalWidth: 960, originalHeight: 1920 }
      },
      {
        name: 'Football',
        type: 'PLANAR',
        imagePath: 'image-targets/Football_luminance.jpg',
        properties: { top: 214, left: 0, width: 640, height: 853, isRotated: false, originalWidth: 640, originalHeight: 1280 }
      },
      {
        name: 'Bookshop',
        type: 'PLANAR',
        imagePath: 'image-targets/Bookshop_luminance.jpg',
        properties: { top: 320, left: 0, width: 960, height: 1280, isRotated: false, originalWidth: 960, originalHeight: 1920 }
      },
      {
        name: 'sign',
        type: 'PLANAR',
        imagePath: 'image-targets/Bookshop_luminance.jpg', // Sign dynamic mapping fallback target
        properties: { top: 320, left: 0, width: 960, height: 1280, isRotated: false, originalWidth: 960, originalHeight: 1920 }
      },
      {
        name: 'crows',
        type: 'PLANAR',
        imagePath: 'image-targets/crows_luminance.jpg',
        properties: { top: 320, left: 0, width: 960, height: 1280, isRotated: false, originalWidth: 960, originalHeight: 1920 }
      },
      {
        name: 'television',
        type: 'PLANAR',
        imagePath: 'image-targets/television_luminance.jpg',
        properties: { top: 320, left: 0, width: 960, height: 1280, isRotated: false, originalWidth: 960, originalHeight: 1920 }
      }
    ]
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)


// ==========================================
// PIPELINE RUNTIME ENGINE
// ==========================================
window.APP = {
  started: false,
  activeTargets: 0
}

window.addEventListener('load', () => {
  const startButton = document.querySelector('#startButton')
  const splashScreen = document.querySelector('#splashScreen')
  const statusMessage = document.querySelector('#statusMessage')
  const scene = document.querySelector('a-scene')
  
  // Track all video elements dynamically
  const videoElements = Array.from(document.querySelectorAll('video'))

  // 1. Monitor media element loading across all assets concurrently
  Promise.all(
    videoElements.map(video => {
      return new Promise(resolve => {
        if (video.readyState >= 2) {
          resolve()
        } else {
          video.addEventListener('loadeddata', resolve, { once: true })
        }
      })
    })
  ).then(() => {
    startButton.disabled = false
    startButton.innerText = 'START EXPERIENCE'
  })

  // 2. Click Handling and Global Audio Unlock Routines
  startButton.addEventListener('click', async () => {
    APP.started = true
    
    // Warm up and prime all audio pipelines to prevent browser autoplay blocks
    for (const video of videoElements) {
      try {
        await video.play()
        video.pause()
        video.currentTime = 0
      } catch (e) {
        console.log('Audio pipeline cleared safely.')
      }
    }

    splashScreen.style.display = 'none'
    updateStatusHUD()
  })

  const updateStatusHUD = () => {
    if (!APP.started) return
    
    if (APP.activeTargets === 0) {
      statusMessage.innerText = 'POINT CAMERA AT AN IMAGE TARGET'
      statusMessage.style.display = 'block'
    } else {
      statusMessage.style.display = 'none'
    }
  }

  // 3. Multi-tracking Event Subscriptions
  scene.addEventListener('xrimagefound', () => {
    APP.activeTargets++
    updateStatusHUD()
  })

  scene.addEventListener('xrimagelost', () => {
    APP.activeTargets = Math.max(0, APP.activeTargets - 1)
    updateStatusHUD()
  })
})