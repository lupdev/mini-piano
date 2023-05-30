const audioContext = new AudioContext()

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },

  { note: "Db", key: "S", frequency: 277.183, active: false },

  { note: "D", key: "X", frequency: 293.665, active: false },

  { note: "Eb", key: "D", frequency: 311.127, active: false },

  { note: "E", key: "C", frequency: 329.628, active: false },

  { note: "F", key: "V", frequency: 349.228, active: false },

  { note: "Gb", key: "G", frequency: 369.994, active: false },

  { note: "G", key: "B", frequency: 391.995, active: false },

  { note: "Ab", key: "H", frequency: 415.305, active: false },

  { note: "A", key: "N", frequency: 440, active: false },

  { note: "Bb", key: "J", frequency: 466.164, active: false },

  { note: "B", key: "M", frequency: 493.883, active: false },
]

document.addEventListener("keydown", (e) => {
  audioContext.resume().then(() => {
    if (e.repeat) return

    const keyboardKey = e.code

    const noteDetail = getNoteDetail(keyboardKey)

    if (noteDetail == null) return

    noteDetail.active = true

    playNotes()
  })
})

document.addEventListener("keyup", (e) => {
  const keyboardKey = e.code

  const noteDetail = getNoteDetail(keyboardKey)

  if (noteDetail == null) return

  noteDetail.active = false

  playNotes()
})

function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey)
}

function playNotes() {
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`)

    keyElement.classList.toggle("active", n.active)

    if (n.oscilliator != null) {
      n.oscilliator.stop()

      n.oscilliator.disconnect()
    }
  })

  const activeNotes = NOTE_DETAILS.filter((n) => n.active)

  const gain = 1 / activeNotes.length

  activeNotes.forEach((n) => {
    startNote(n, gain)
  })
}

function startNote(noteDetail, gain) {
  const gainNode = audioContext.createGain()

  gainNode.gain.value = gain

  const oscilliator = audioContext.createOscillator()

  oscilliator.frequency.value = noteDetail.frequency

  oscilliator.type = "square"

  oscilliator.connect(gainNode).connect(audioContext.destination)

  oscilliator.start()

  noteDetail.oscilliator = oscilliator
}
