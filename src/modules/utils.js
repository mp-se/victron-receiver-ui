export function saveAs(content, filename, mimeType = 'text/plain') {
  const a = document.createElement('a')
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  a.click()
  URL.revokeObjectURL(url) // Clean up the blob URL
}

export function copyToClipboard(data) {
  const input = document.createElement('textarea')
  input.value = typeof data === 'string' ? data : JSON.stringify(data)
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

// EOF
