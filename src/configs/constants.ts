
export const UI: {
  animationClasses: {
    named: Record<string, string>
    timed: Record<string, string>
  }
  modalStates: Record<OverlayState, OverlayState>
} = {
  animationClasses: {
    named: {
      scaleIn: 'anim-scale-in-named',
      scaleOut: 'anim-scale-out-named',
      fadeIn: 'anim-fade-in-named',
      fadeOut: 'anim-fade-out-named',
      slideInTop: 'anim-slide-in-top-named',
      slideInBottom: 'anim-slide-in-bottom-named',
      beat: 'anim-beat-named',
      highlight: 'anim-highlight-named',
    },
    timed: {
      scaleIn: 'anim-scale-in-timed',
      scaleOut: 'anim-scale-out-timed',
      fadeIn: 'anim-fade-in-timed',
      fadeOut: 'anim-fade-out-timed',
      slideInTop: 'anim-slide-in-top-timed',
      slideInOutTop: 'anim-slide-in-out-top-timed',
      slideInBottom: 'anim-slide-in-bottom-timed',
      beat: 'anim-beat-timed',
      highlight: 'anim-highlight-timed',
    },
  },
  modalStates: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    visible: 'visible',
    hidden: 'hidden',
  },
}
