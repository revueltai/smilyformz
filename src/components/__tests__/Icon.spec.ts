import { describe, it, expect } from 'vitest'
import { mount as shallowMount } from '@vue/test-utils'
import Icon from '@/components/shared/Icon/index.vue'

describe('Icon', () => {
  it('renders properly with default props', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('does not render when name is "none"', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'none',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('applies correct size classes', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
        size: 'lg',
      },
    })

    expect(wrapper.classes()).toContain('w-8')
    expect(wrapper.classes()).toContain('h-8')
  })

  it('applies stroke classes when type is stroke', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
        type: 'stroke',
      },
    })

    expect(wrapper.classes()).toContain('icon-stroke')
    expect(wrapper.classes()).toContain('stroke-current')
  })

  it('applies fill class when type is fill', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
        type: 'fill',
      },
    })

    expect(wrapper.classes()).toContain('fill-current')
    expect(wrapper.classes()).not.toContain('icon-stroke')
  })

  it('applies both fill and stroke classes when type is both', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
        type: 'both',
      },
    })

    expect(wrapper.classes()).toContain('fill-current')
    expect(wrapper.classes()).toContain('icon-stroke')
  })

  it('applies correct color class', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
        color: 'slate-700',
      },
    })

    expect(wrapper.classes()).toContain('text-slate-700')
  })

  it('applies correct stroke width', () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
        strokeWidth: 4,
      },
    })

    expect(wrapper.classes()).toContain('stroke-4')
  })

  it('uses correct iconset path', () => {
    const iconset = `/custom-iconset.svg?v=1234`
    const wrapper = shallowMount(Icon, {
      props: {
        name: 'search',
        iconset,
      },
    })

    const use = wrapper.find('use')
    const href = use.attributes('href')
    expect(href).toBe(`${iconset}#search`)
  })
})
