import { APP_SHARE_URL } from '@/configs/constants'

export type SocialMedia = 'x' | 'facebook' | 'whatsapp' | 'telegram' | 'copy'

/**
 * Handles social media sharing functionality.
 * Supported platforms: Twitter, Facebook, WhatsApp, Telegram, LinkedIn, and copy to clipboard.
 */
export function useSocialShare() {
  const ENCODED_SHARE_URL = encodeURIComponent(APP_SHARE_URL)

  /**
   * Copy share url to clipboard
   */
  function copyToClipboard() {
    navigator.clipboard.writeText(APP_SHARE_URL)
  }

  /**
   * Share to X
   *
   * @param text - The text to share
   */
  function shareToX(text: string) {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${ENCODED_SHARE_URL}`, '_blank')
  }

  /**
   * Share to Facebook
   */
  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${ENCODED_SHARE_URL}`, '_blank')
  }

  /**
   * Share to WhatsApp
   *
   * @param text - The text to share
   */
  function shareToWhatsApp(text: string) {
    const message = encodeURIComponent(`${text}\n${ENCODED_SHARE_URL}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  /**
   * Share to Telegram
   *
   * @param text - The text to share
   */
  function shareToTelegram(text: string) {
    const message = encodeURIComponent(text)
    window.open(`https://t.me/share/url?url=${ENCODED_SHARE_URL}&text=${message}`, '_blank')
  }

  /**
   * Share to LinkedIn
   *
   * @param text - The text to share
   */
  function shareToLinkedIn(text: string) {
    const summary = encodeURIComponent(text)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${ENCODED_SHARE_URL}&summary=${summary}`,
      '_blank',
    )
  }

  return {
    copyToClipboard,
    shareToX,
    shareToFacebook,
    shareToWhatsApp,
    shareToTelegram,
    shareToLinkedIn,
  }
}
