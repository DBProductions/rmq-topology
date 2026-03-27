import Binding from '../binding'

describe('Binding', () => {
  let source
  let destination
  let binding
  let ctx

  beforeEach(() => {
    source = { x: 0, y: 0, bindings: [] }
    destination = { x: 10, y: 10, bindings: [] }
    binding = new Binding(source, destination, 'routingKey')
    ctx = {
      beginPath: vi.fn(),
      strokeStyle: vi.fn(),
      setLineDash: vi.fn(),
      lineWidth: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      save: vi.fn(),
      textAlign: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn()
    }
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
    binding.ctx = ctx
    binding.drawLabel('routingKey')
    expect(binding.ctx.save).toHaveBeenCalled()
    expect(binding.ctx.textAlign).toEqual('center')
    expect(binding.ctx.translate).toHaveBeenCalled()
    expect(binding.ctx.rotate).toHaveBeenCalled()
    expect(binding.ctx.fillText).toHaveBeenCalledWith('routingKey', 0, 0)
    expect(binding.ctx.restore).toHaveBeenCalled()
  })

  it('should render like expected', () => {
    binding.ctx = ctx
    binding.render()
    expect(binding.ctx.beginPath).toHaveBeenCalled()
    expect(binding.ctx.strokeStyle).toEqual('#000')
    expect(binding.ctx.setLineDash).toHaveBeenCalledWith([])
    expect(binding.ctx.lineWidth).toEqual(1)
    expect(binding.ctx.moveTo).toHaveBeenCalled()
    expect(binding.ctx.lineTo).toHaveBeenCalled()
    expect(binding.ctx.stroke).toHaveBeenCalled()
    expect(binding.ctx.save).toHaveBeenCalled()
    expect(binding.ctx.translate).toHaveBeenCalled()
    expect(binding.ctx.rotate).toHaveBeenCalled()
    expect(binding.ctx.fillText).toHaveBeenCalledWith('routingKey', 0, 0)
    expect(binding.ctx.restore).toHaveBeenCalled()
  })

  it('should render hover like expected', () => {
    binding.hover = true
    binding.ctx = ctx
    binding.render()
    expect(binding.ctx.beginPath).toHaveBeenCalled()
    expect(binding.ctx.strokeStyle).toEqual('#000')
    expect(binding.ctx.setLineDash).toHaveBeenCalledWith([])
    expect(binding.ctx.lineWidth).toEqual(2)
    expect(binding.ctx.moveTo).toHaveBeenCalled()
    expect(binding.ctx.lineTo).toHaveBeenCalled()
    expect(binding.ctx.stroke).toHaveBeenCalled()
    expect(binding.ctx.save).toHaveBeenCalled()
    expect(binding.ctx.translate).toHaveBeenCalled()
    expect(binding.ctx.rotate).toHaveBeenCalled()
    expect(binding.ctx.fillText).toHaveBeenCalledWith('routingKey', 0, 0)
    expect(binding.ctx.restore).toHaveBeenCalled()
  })
})
