import { APP_SHARE_URL } from '@/configs/constants'

export type SocialMedia = 'x' | 'facebook' | 'whatsapp' | 'telegram' | 'copy'

/**
 * Handles social media sharing functionality.
 * Supported platforms: Twitter, Facebook, WhatsApp, Telegram, LinkedIn, and copy to clipboard.
 */
export function useSocialShare() {
  /**
   * Copy share url to clipboard
   */
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(`${text}\n\n${APP_SHARE_URL}`)
  }

  /**
   * Share to X
   *
   * @param text - The text to share
   */
  function shareToX(text: string) {
    const message = encodeURIComponent(`${text}\n\n${APP_SHARE_URL}`)
    window.open(`https://twitter.com/intent/tweet?text=${message}&url=${APP_SHARE_URL}`, '_blank')
  }

  /**
   * Share to Facebook
   */
  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${APP_SHARE_URL}`, '_blank')
  }

  /**
   * Share to WhatsApp
   *
   * @param text - The text to share
   */
  function shareToWhatsApp(text: string) {
    const message = encodeURIComponent(`${text}\n\n${APP_SHARE_URL}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  /**
   * Share to Telegram
   *
   * @param text - The text to share
   */
  function shareToTelegram(text: string) {
    const message = encodeURIComponent(`${text}\n\n${APP_SHARE_URL}`)
    window.open(`https://t.me/share/url?url=${APP_SHARE_URL}&text=${message}`, '_blank')
  }

  /**
   * Share to LinkedIn
   *
   * @param text - The text to share
   */
  function shareToLinkedIn(text: string) {
    const summary = encodeURIComponent(text)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${APP_SHARE_URL}&summary=${summary}`,
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
