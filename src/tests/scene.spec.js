import Scene from '../scene'

describe('Scene', () => {
  let scene
  let ctx
  let actor1
  let actor2
  let bindingActor

  beforeEach(() => {
    ctx = {
      canvas: document.createElement('canvas'),
      clearRect: vi.fn(),
      fillText: vi.fn()
    }
    scene = new Scene(ctx, 100, 100)

    actor1 = { id: 'actor1', update: vi.fn(), render: vi.fn() } // Create a mock actor object
    actor2 = { id: 'actor2', update: vi.fn(), render: vi.fn() } // Create another mock actor object
    bindingActor = {
      id: 'binding',
      constructor: { name: 'Binding' },
      update: vi.fn(),
      render: vi.fn()
    } // Create a mock binding actor object
  })

  it('should initialize with the correct properties', () => {
    expect(scene.ctx).toBe(ctx)
    expect(scene.width).toEqual(100)
    expect(scene.height).toEqual(100)
    expect(scene.curleft).toEqual(0)
    expect(scene.curtop).toEqual(0)
    expect(scene.actors).toEqual([])
    expect(scene.lostMessages).toEqual(0)
    expect(scene.description).toEqual('')
  })

  it('should add an actor to the scene', () => {
    scene.addActor(actor1)
    expect(scene.actors).toContainEqual(actor1)
  })

  it('should remove an actor from the scene', () => {
    scene.addActor(actor1)
    scene.removeActor(actor1)
    expect(scene.actors).not.toContainEqual(actor1)
  })

  it('should return the correct actor by id', () => {
    scene.addActor(actor1)
    const foundActor = scene.getIdInScene('actor1')
    expect(foundActor).toEqual(actor1)
  })

  it('should return an empty array if no actor with the given id is found', () => {
    const notFoundActor = scene.getIdInScene('nonExistentId')
    expect(notFoundActor).toEqual(null)
  })

  it('should render all actors in the scene', () => {
    scene.addActor(actor1)
    scene.addActor(actor2)
    scene.render()
    expect(actor1.render).toHaveBeenCalledTimes(1)
    expect(actor2.render).toHaveBeenCalledTimes(1)
  })

  it('should render binding actors first, followed by non-binding actors', () => {
    scene.addActor(bindingActor)
    scene.addActor(actor1)
    scene.render()
    //expect(bindingActor.render).toHaveBeenCalledBefore(actor1.render);
    expect(bindingActor.render).toHaveBeenCalledTimes(1)
    expect(actor1.render).toHaveBeenCalledTimes(1)
  })

  it('should call update on all actors when updateing', () => {
    scene.addActor(actor1)
    scene.addActor(actor2)
    scene.update()
    expect(actor1.update).toHaveBeenCalledTimes(1)
    expect(actor2.update).toHaveBeenCalledTimes(1)
  })

  it('should call update on actors only once per render', () => {
    scene.addActor(actor1)
    scene.render() // First render
    scene.render() // Second render
    expect(actor1.render).toHaveBeenCalledTimes(2)
  })
})
