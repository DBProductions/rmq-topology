import BaseComponent from '../basecomponent'

describe('BaseComponent', () => {
  let baseComponentInstance
  let scene

  beforeEach(() => {
    baseComponentInstance = new BaseComponent(0, 0)
    scene = { ctx: {}, addActor: vi.fn() }
  })

  it('should create a new instance of the BaseComponent class with x, y properties and uuid', () => {
    const regexExp =
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}(?:\/.*)?$/i
    expect(baseComponentInstance).toBeInstanceOf(BaseComponent)
    expect(baseComponentInstance.x).toEqual(0)
    expect(baseComponentInstance.y).toEqual(0)
    expect(regexExp.test(baseComponentInstance.id)).toEqual(true)
    expect(baseComponentInstance.dragged).toEqual(false)
    expect(baseComponentInstance.hover).toEqual(false)
    expect(baseComponentInstance.debug).toEqual(false)
  })
})
