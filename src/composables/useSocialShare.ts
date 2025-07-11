import { APP_SHARE_URL } from '@/configs/constants'

export type SocialMedia = 'x' | 'facebook' | 'whatsapp' | 'telegram' | 'copy'

/**
 * Handles social media sharing functionality.
 * Supported platforms: Twitter, Facebook, WhatsApp, Telegram, LinkedIn, and copy to clipboard.
 */
export function useSocialShare() {
  /**
   * Format text with platform-specific formatting
   */
  function formatTextForPlatform(text: string, platform: SocialMedia): string {
    switch (platform) {
      case 'x':
      case 'facebook':
        return text.replace(/{score}/g, '🔥 {score} 🔥')

      case 'whatsapp':
      case 'telegram':
        return text.replace(/{score}/g, '🔥 *{score}* 🔥')

      default:
        return text
    }
  }

  /**
   * Copy share url to clipboard
   */
  function copyToClipboard(text: string) {
    const formattedText = formatTextForPlatform(text, 'copy')
    navigator.clipboard.writeText(`${formattedText}\n\n${APP_SHARE_URL}`)
  }

  /**
   * Share to X
   *
   * @param text - The text to share
   */
  function shareToX(text: string) {
    const formattedText = formatTextForPlatform(text, 'x')
    const message = encodeURIComponent(`${formattedText}\n\n${APP_SHARE_URL}`)
    window.open(`https://twitter.com/intent/tweet?text=${message}&url=${APP_SHARE_URL}`, '_blank')
  }

  /**
   * Share to Facebook
   *
   * @param text - The text to share (not used in URL but kept for consistency)
   */
  function shareToFacebook(text?: string) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${APP_SHARE_URL}`, '_blank')
  }

  /**
   * Share to WhatsApp
   *
   * @param text - The text to share
   */
  function shareToWhatsApp(text: string) {
    const formattedText = formatTextForPlatform(text, 'whatsapp')
    const message = encodeURIComponent(`${formattedText}\n\n${APP_SHARE_URL}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  /**
   * Share to Telegram
   *
   * @param text - The text to share
   */
  function shareToTelegram(text: string) {
    const formattedText = formatTextForPlatform(text, 'telegram')
    const message = encodeURIComponent(`${formattedText}\n\n${APP_SHARE_URL}`)
    window.open(`https://t.me/share/url?url=${APP_SHARE_URL}&text=${message}`, '_blank')
  }

  /**
   * Share to LinkedIn
   *
   * @param text - The text to share
   */
  function shareToLinkedIn(text: string) {
    const formattedText = formatTextForPlatform(text, 'copy') // LinkedIn uses similar formatting
    const summary = encodeURIComponent(formattedText)
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
