import Binding from '../binding'

describe('Binding', () => {
  let source, destination, binding

  beforeEach(() => {
    source = { x: 0, y: 0, bindings: [] }
    destination = { x: 10, y: 10, bindings: [] }
    binding = new Binding(source, destination, 'routingKey')
  })

  it('should create a new instance of Binding', () => {
    expect(binding).toBeInstanceOf(Binding)
  })

  it('should set the source and destination properties correctly', () => {
    expect(binding.source).toEqual(source)
    expect(binding.destination).toEqual(destination)
  })

  it('should add the binding to both source and destination bindings arrays', () => {
    expect(source.bindings).toContain(binding)
    expect(destination.bindings).toContain(binding)
  })

  it('should set x1, x2, y1, and y2 properties correctly in the constructor', () => {
    expect(binding.x1).toEqual(source.x)
    expect(binding.x2).toEqual(destination.x)
    expect(binding.y1).toEqual(source.y)
    expect(binding.y2).toEqual(destination.y)
  })

  it('should set x1, x2, y1, and y2 properties correctly in the update method', () => {
    binding.update()
    expect(binding.x1).toEqual(source.x)
    expect(binding.x2).toEqual(destination.x)
    expect(binding.y1).toEqual(source.y)
    expect(binding.y2).toEqual(destination.y)
  })

  it('should draw the label at the correct position and rotation', () => {
    binding.ctx = {
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn()
    }
    binding.drawLabel('routingKey')
    expect(binding.ctx.save).toHaveBeenCalled()
    expect(binding.ctx.translate).toHaveBeenCalled()
    expect(binding.ctx.rotate).toHaveBeenCalled()
    expect(binding.ctx.fillText).toHaveBeenCalled()
    expect(binding.ctx.restore).toHaveBeenCalled()
  })
})
