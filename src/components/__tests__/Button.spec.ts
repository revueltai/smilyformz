import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Button from '@/components/shared/Button/index.vue'
import Icon from '@/components/shared/Icon/index.vue'

describe('Button', () => {
  it('renders properly with default props', () => {
    const wrapper = shallowMount(Button, {
      global: {
        components: { Icon },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders as a router link when "to" prop is provided', () => {
    const wrapper = shallowMount(Button, {
      props: {
        to: '/some-route',
      },
      global: {
        components: { Icon },
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(true)
  })

  it('renders as an external link when "to" starts with https', () => {
    const wrapper = shallowMount(Button, {
      props: {
        to: 'https://example.com',
        type: 'link',
      },
      global: {
        components: { Icon },
      },
    })

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
  })

  it('emits click event when clicked', async () => {
    const wrapper = shallowMount(Button, {
      global: {
        components: { Icon },
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies size classes correctly', () => {
    const wrapper = shallowMount(Button, {
      props: {
        size: 'lg',
      },
      global: {
        components: { Icon },
      },
    })

    expect(wrapper.classes()).toContain('text-base')
    expect(wrapper.classes()).toContain('sm:text-lg')
  })

  it('applies custom classes', () => {
    const wrapper = shallowMount(Button, {
      props: {
        cssClasses: 'custom-class',
      },
      global: {
        components: { Icon },
      },
    })

    expect(wrapper.classes()).toContain('custom-class')
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = shallowMount(Button, {
      props: {
        disabled: true,
      },
      global: {
        components: { Icon },
      },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
