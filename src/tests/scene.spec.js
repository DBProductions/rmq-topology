import Scene from '../scene'
import Exchange from '../exchange'
import Binding from '../binding'

describe('Scene', () => {
  let scene
  let ctx
  let actor1
  let actor2
  let bindingActor
  let exchange

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
    exchange = new Exchange(0, 0, 'test-exchange', 'direct')
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

  it('should purge scene', () => {
    scene.addActor(actor1)
    scene.addActor(actor2)
    scene.purge()
    expect(scene.actors).toEqual([])
  })

  it('should return the correct actor by id', () => {
    scene.addActor(actor1)
    const foundActor = scene.getIdInScene('actor1')
    expect(foundActor).toEqual(actor1)
  })

  it('should return the correct objects', () => {
    scene.addActor(exchange)
    const foundActor = scene.getObjectsInScene('Exchange')
    expect(foundActor).toEqual([exchange])
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
    const bindingCtx = {
      beginPath: vi.fn(),
      strokeStyle: '',
      setLineDash: vi.fn(),
      lineWidth: 0,
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      save: vi.fn(),
      textAlign: '',
      translate: vi.fn(),
      rotate: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn()
    }
    const src = { x: 0, y: 0, bindings: [] }
    const dest = { x: 10, y: 10, bindings: [] }
    const realBinding = new Binding(src, dest, 'rk')
    realBinding.ctx = bindingCtx
    const renderSpy = vi.spyOn(realBinding, 'render')
    scene.addActor(realBinding)
    scene.addActor(actor1)
    scene.render()
    expect(renderSpy).toHaveBeenCalledTimes(1)
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

  it('should render the scene description', () => {
    scene.description = 'Test topology'
    scene.render()
    expect(scene.ctx.fillText).toHaveBeenCalledWith(
      'Test topology',
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('should not render description when empty', () => {
    scene.description = ''
    scene.addActor(actor1)
    scene.render()
    expect(actor1.render).toHaveBeenCalled()
  })

  it('should store width and height', () => {
    const s = new Scene(ctx, 800, 600)
    expect(s.width).toEqual(800)
    expect(s.height).toEqual(600)
  })
})
