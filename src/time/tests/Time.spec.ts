import { mount } from '@vue/test-utils'
import { NTime } from '../index'

describe('n-time', () => {
  const date = new Date('1970-01-01 00:00:00 UTC').getTime()

  const mockedNow = new Date('2020-01-01 00:00:01 UTC').getTime()

  const cachedDateNow = Date.now

  it('should work with import on demand', () => {
    mount(NTime)
  })

  it('should work with `unix` prop', async () => {
    const wrapper = mount(NTime, {
      props: { time: 3600, unix: true, timezone: 'Asia/Shanghai' }
    })
    expect(wrapper.find('time').text()).toContain('1970-01-01 09:00:00')
    await wrapper.setProps({ time: date })
  })

  it('should work with `format` prop', async () => {
    const wrapper = mount(NTime, {
      props: {
        time: date.valueOf(),
        format: 'yyyy/MM/dd HH:mm:ss',
        timezone: 'Asia/Shanghai'
      }
    })
    expect(wrapper.find('time').text()).toContain('1970/01/01 08:00:00')
    await wrapper.setProps({
      timezone: 'America/New_York'
    })
    expect(wrapper.find('time').text()).toContain('1969/12/31 19:00:00')
  })

  it('should work with `type` prop', async () => {
    Date.now = () => mockedNow

    const wrapper = mount(NTime, {
      props: { time: date, type: 'date', timezone: 'Asia/Shanghai' }
    })
    expect(wrapper.find('time').text()).toContain('1970-01-01')
    console.log(
      'github ci time zone',
      Intl.DateTimeFormat().resolvedOptions().timeZone
    )
    // await wrapper.setProps({ time: date, type: 'datetime' })
    // expect(wrapper.find('time').text()).toContain('1970-01-01 08:00:00')
    await wrapper.setProps({ time: date, type: 'relative' })
    expect(wrapper.find('time').text()).toContain('about 50 years ago')

    Date.now = () => new Date('1972-01-01 00:00:00 UTC').getTime()
    const wrapper2 = mount(NTime, {
      props: { to: 0, type: 'relative', unix: true }
    })
    expect(wrapper2.find('time').text()).toContain('in about 2 years')

    Date.now = cachedDateNow
  })

  it('should work with `text` prop', () => {
    const wrapper = mount(NTime, { props: { time: date, text: true } })
    expect(wrapper.find('time').exists()).toEqual(false)
  })
})
