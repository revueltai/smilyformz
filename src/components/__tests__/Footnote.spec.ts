import { describe, it, expect } from 'vitest'
import { mount as shallowMount } from '@vue/test-utils'
import Footnote from '@/components/shared/Footnote/index.vue'

describe('Footnote', () => {
  it('should not render when no props are provided', () => {
    const wrapper = shallowMount(Footnote)
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('should render footnote text with default color', () => {
    const wrapper = shallowMount(Footnote, {
      props: {
        footnote: 'This is a footnote',
      },
    })

    const footnoteText = wrapper.find('p')
    expect(footnoteText.text()).toBe('This is a footnote')
    expect(footnoteText.classes()).toContain('text-slate-400')
  })

  it('should render footnote text with custom color', () => {
    const wrapper = shallowMount(Footnote, {
      props: {
        footnote: 'This is a footnote',
        footnoteColor: 'blue-500',
      },
    })

    const footnoteText = wrapper.find('p')
    expect(footnoteText.text()).toBe('This is a footnote')
    expect(footnoteText.classes()).toContain('text-blue-500')
  })

  it('should render error message', () => {
    const wrapper = shallowMount(Footnote, {
      props: {
        error: 'This is an error',
      },
    })

    const errorText = wrapper.find('p')
    expect(errorText.text()).toBe('This is an error')
    expect(errorText.classes()).toContain('text-rose-600')
  })

  it('should render both error and footnote when provided', () => {
    const wrapper = shallowMount(Footnote, {
      props: {
        footnote: 'This is a footnote',
        footnoteColor: 'blue-500',
        error: 'This is an error',
      },
    })

    const texts = wrapper.findAll('p')
    expect(texts).toHaveLength(2)

    // Error should be first
    expect(texts[0].text()).toBe('This is an error')
    expect(texts[0].classes()).toContain('text-rose-600')

    // Footnote should be second
    expect(texts[1].text()).toBe('This is a footnote')
    expect(texts[1].classes()).toContain('text-blue-500')
  })

  it('should have correct base styles', () => {
    const wrapper = shallowMount(Footnote, {
      props: {
        footnote: 'This is a footnote',
      },
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('gap-0.5')
    expect(container.classes()).toContain('text-xs')
    expect(container.classes()).toContain('text-start')
  })
})
