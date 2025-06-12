interface ShareOptions {
  title: string
  text: string
  url: string
}

export function shareToTwitter({ title, text, url }: ShareOptions) {
  const tweetText = encodeURIComponent(`${title}\n${text}`)
  const tweetUrl = encodeURIComponent(url)
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank')
}

export function shareToFacebook({ title, text, url }: ShareOptions) {
  const fbUrl = encodeURIComponent(url)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}`, '_blank')
}

export function shareToWhatsApp({ title, text, url }: ShareOptions) {
  const message = encodeURIComponent(`${title}\n${text}\n${url}`)
  window.open(`https://wa.me/?text=${message}`, '_blank')
}

export function shareToTelegram({ title, text, url }: ShareOptions) {
  const message = encodeURIComponent(`${title}\n${text}\n${url}`)
  window.open(`https://t.me/share/url?url=${url}&text=${message}`, '_blank')
}

export function shareToLinkedIn({ title, text, url }: ShareOptions) {
  const linkedInUrl = encodeURIComponent(url)
  const summary = encodeURIComponent(text)
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}&summary=${summary}`,
    '_blank',
  )
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}
