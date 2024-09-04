import { config, global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

export function validateCurrentForm() {
  let valid = true
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach((form) => {
    if (!form.checkValidity()) valid = false

    form.classList.add('was-validated')
  })

  return valid
}

export function tempToF(c) {
  return c * 1.8 + 32.0
}

export function tempToC(f) {
  return (f - 32.0) / 1.8
}

export function isValidJson(s) {
  try {
    JSON.stringify(JSON.parse(s))
    return true
  } catch (e) {
    logDebug('utils.isValidJson()')
  }

  return false
}

export function isValidFormData(s) {
  if (s.startsWith('?')) return true

  return false
}

export function isValidMqttData(s) {
  if (s.indexOf('|') >= 0) return true

  return false
}

export function restart() {
  global.clearMessages()
  global.disabled = true
  fetch(global.baseURL + 'api/restart', {
    headers: { Authorization: global.token },
    signal: AbortSignal.timeout(global.fetchTimout)
  })
    .then((res) => res.json())
    .then((json) => {
      logDebug('utils.restart()', json)
      if (json.status == true) {
        global.messageSuccess =
          json.message + ' Redirecting to http://' + config.mdns + '.local in 8 seconds.'
        logInfo('utils.restart()', 'Scheduling refresh of UI')
        setTimeout(() => {
          location.href = 'http://' + config.mdns + '.local'
        }, 8000)
      } else {
        global.messageError = json.message
        global.disabled = false
      }
    })
    .catch((err) => {
      logError('utils.restart()', err)
      global.messageError = 'Failed to do restart'
      global.disabled = false
    })
}
