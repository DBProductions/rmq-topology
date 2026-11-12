describe('message customisation and display', () => {
  const clickCanvas = (x, y) => {
    cy.get('#canvas').then(($canvas) => {
      const canvas = $canvas[0]
      const rect = canvas.getBoundingClientRect()
      const sx = rect.width / canvas.width
      const sy = rect.height / canvas.height
      cy.get('#canvas').click(x * sx, y * sy)
    })
  }

  const pump = (win) => {
    const consumer = win.scene.actors.find(
      (a) => a.constructor.name === 'Consumer'
    )
    consumer.displayMessages = true
    if (!consumer.messageLog) consumer.messageLog = []
    for (let i = 0; i < 4000; i += 1) {
      win.scene.update(0.016)
    }
    return consumer
  }

  it('shows arriving messages inline with routing info', () => {
    cy.visit('/')
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.wait(300)

    clickCanvas(815, 145)
    cy.wait(300)
    cy.get('#consumerShowMessagesToggle').should('be.visible').check()
    cy.get('#consumerMsgInlineWrap').should('be.visible')

    cy.window().then((win) => {
      pump(win)
    })

    cy.get('#consumerMsgInline')
      .invoke('val')
      .should('match', /"headers"/)
    cy.get('#consumerMsgInline')
      .invoke('val')
      .should('match', /Exchange -> rk:Queue -> Queue/)
  })

  it('applies a custom body when editing an existing producer', () => {
    cy.visit('/')
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.wait(300)

    clickCanvas(210, 140)
    cy.wait(300)

    cy.get('#producerCustomMsgToggle').check()
    cy.get('#producerMsgHeaders')
      .clear()
      .type('{"content-type":"application/json"}', {
        parseSpecialCharSequences: false
      })
    cy.get('#producerMsgBody')
      .clear()
      .type('{"hello":"world"}', { parseSpecialCharSequences: false })
    cy.get('#sendProducerForm').click()
    cy.wait(300)

    cy.window().then((win) => {
      const producer = win.scene.actors.find(
        (a) => a.constructor.name === 'Producer'
      )
      const publishes = Object.values(producer.publishes)
      expect(publishes[0].message.body).to.deep.eq({ hello: 'world' })

      const consumer = pump(win)
      expect(consumer.messageLog.length).to.be.greaterThan(0)
      const bodies = consumer.messageLog.map((entry) => entry.message.body)
      expect(bodies.some((body) => body && body.hello === 'world')).to.eq(true)
    })

    // Reopening the producer shows the message that is actually set.
    clickCanvas(210, 140)
    cy.wait(300)
    cy.get('#producerCustomMsgToggle').should('be.checked')
    cy.get('#producerCustomMsgSection').should('be.visible')
    cy.get('#producerMsgHeaders')
      .invoke('val')
      .should('contain', '"content-type": "application/json"')
    cy.get('#producerMsgBody')
      .invoke('val')
      .should('contain', '"hello": "world"')
    cy.get('#producerPublishTo .msg-preview').should(
      'contain',
      'body {"hello":"world"}'
    )

    // Unchecking and saving resets the publish to the default message.
    cy.get('#producerCustomMsgToggle').uncheck()
    cy.get('#producerCustomMsgSection').should('not.be.visible')
    cy.get('#sendProducerForm').click()
    cy.wait(300)

    cy.window().then((win) => {
      const producer = win.scene.actors.find(
        (a) => a.constructor.name === 'Producer'
      )
      const publishes = Object.values(producer.publishes)
      expect(publishes[0].message).to.deep.eq({ headers: {}, body: {} })
    })

    clickCanvas(210, 140)
    cy.wait(300)
    cy.get('#producerCustomMsgToggle').should('not.be.checked')
    cy.get('#producerPublishTo .msg-preview').should(
      'contain',
      'default message'
    )
  })

  it('applies a custom body when creating a new producer', () => {
    cy.visit('/')
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.wait(300)

    cy.get('#newComponent').select('Producer')
    cy.wait(300)
    cy.get('#producerNameField').type('CustomProducer')
    cy.get('#producerPublishToSelect').select('Exchange')
    cy.get('#producerRoutingKeyField').type('Queue')
    cy.get('#producerCustomMsgToggle').check()
    cy.get('#producerMsgBody')
      .clear()
      .type('{"foo":"bar"}', { parseSpecialCharSequences: false })
    cy.get('#sendProducerForm').click()
    cy.wait(300)

    cy.window().then((win) => {
      const custom = win.scene.actors.find(
        (a) => a.constructor.name === 'Producer' && a.name === 'CustomProducer'
      )
      expect(custom, 'custom producer').to.exist
      const publishes = Object.values(custom.publishes)
      expect(publishes[0].message.body).to.deep.eq({ foo: 'bar' })
    })
  })

  it('keeps consumer message display through export and import', () => {
    cy.visit('/')
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.wait(300)

    clickCanvas(815, 145)
    cy.wait(300)
    cy.get('#consumerShowMessagesToggle').check()
    cy.get('#export').click()
    cy.get('#ImExport')
      .invoke('val')
      .should('contain', '"displayMessages":true')

    cy.get('#importBtn').click()
    cy.wait(300)

    cy.window().then((win) => {
      const consumer = win.scene.actors.find(
        (a) => a.constructor.name === 'Consumer'
      )
      expect(consumer.displayMessages).to.eq(true)
    })
  })
})
