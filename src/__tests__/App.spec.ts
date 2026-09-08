import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

const gridSelector = '[data-testid=grid-table]'
const buttonSelector = '[data-testid=loading-btn]'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.find(buttonSelector).text()).toContain('Загрузить')
    expect(wrapper.find(gridSelector)).toBeTruthy()
  })
})
