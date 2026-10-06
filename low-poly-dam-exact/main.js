const scene = document.getElementById('scene')
const stack = document.getElementById('depthStack')
const layers = [...document.querySelectorAll('.layer')]

let dragging = false
let startX = 0
let startY = 0
let rx = 0
let ry = 0
let zoom = 1
let returnTimer = 0

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function applyTransform() {
  document.documentElement.style.setProperty('--rx', `${rx}deg`)
  document.documentElement.style.setProperty('--ry', `${ry}deg`)
  document.documentElement.style.setProperty('--zoom', zoom)

  // Depth translations are intentionally restrained: the goal is to preserve
  // the reference composition, not replace it with invented geometry.
  layers.forEach((layer) => {
    const depth = Number(layer.dataset.depth || 0)
    layer.style.transform = `translateZ(${depth}px)`
  })
}

function beginInteraction(clientX, clientY, pointerId) {
  clearTimeout(returnTimer)
  dragging = true
  startX = clientX
  startY = clientY
  scene.classList.remove('returning')
  scene.classList.add('interacting')
  if (pointerId !== undefined && scene.setPointerCapture) scene.setPointerCapture(pointerId)
}

function moveInteraction(clientX, clientY) {
  if (!dragging) return
  const dx = clientX - startX
  const dy = clientY - startY
  startX = clientX
  startY = clientY

  ry = clamp(ry + dx * 0.055, -9.5, 9.5)
  rx = clamp(rx - dy * 0.045, -6.5, 6.5)
  applyTransform()
}

function endInteraction(pointerId) {
  if (!dragging) return
  dragging = false
  if (pointerId !== undefined && scene.releasePointerCapture) {
    try { scene.releasePointerCapture(pointerId) } catch {}
  }

  // Return to the exact camera-matched front view after interaction.
  scene.classList.add('returning')
  rx = 0
  ry = 0
  applyTransform()
  returnTimer = window.setTimeout(() => {
    scene.classList.remove('interacting', 'returning')
  }, 540)
}

scene.addEventListener('pointerdown', (e) => beginInteraction(e.clientX, e.clientY, e.pointerId))
scene.addEventListener('pointermove', (e) => moveInteraction(e.clientX, e.clientY))
scene.addEventListener('pointerup', (e) => endInteraction(e.pointerId))
scene.addEventListener('pointercancel', (e) => endInteraction(e.pointerId))
scene.addEventListener('lostpointercapture', () => endInteraction())

scene.addEventListener('wheel', (e) => {
  e.preventDefault()
  zoom = clamp(zoom * Math.exp(-e.deltaY * 0.0008), 0.84, 1.18)
  applyTransform()
}, { passive: false })

scene.addEventListener('dblclick', () => {
  zoom = 1
  rx = 0
  ry = 0
  scene.classList.remove('interacting', 'returning')
  applyTransform()
})

applyTransform()
