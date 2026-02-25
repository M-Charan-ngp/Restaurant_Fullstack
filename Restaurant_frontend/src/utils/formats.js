export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const formatTime = (time) => {
  if (!time) return ''
  return time.split(':').slice(0, 2).join(':')
}