import Base from '../base'

describe('Base', () => {
  let baseInstance
  let scene

  beforeEach(() => {
    baseInstance = new Base(0, 0)
    scene = { ctx: {}, addActor: vi.fn() }
  })

  it('should create a new instance of the Base class with x and y properties', () => {
    expect(baseInstance).toBeInstanceOf(Base)
    expect(baseInstance.x).toEqual(0)
    expect(baseInstance.y).toEqual(0)
  })

  it('should add the instance to the scene when calling addToScene method', () => {
    baseInstance.addToScene(scene)
    expect(scene.addActor).toHaveBeenCalled()
    expect(scene.addActor).toHaveBeenCalledWith(baseInstance)
  })

  it('should generate a unique UUID using createUUID method', () => {
    const uuid = baseInstance.createUUID()

    expect(uuid).toBeDefined()
    expect(uuid.length).toEqual(36)
    expect(uuid).toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    )
  })

  it('should generate a different UUID for each call to createUUID method', () => {
    const firstUuid = baseInstance.createUUID()
    const secondUuid = baseInstance.createUUID()

    expect(firstUuid).not.toEqual(secondUuid)
  })

  it('should not throw an error when calling createUUID method', () => {
    // Test edge case: ensure that the createUUID method does not throw an error
    expect(() => baseInstance.createUUID()).not.toThrow()
  })
})
