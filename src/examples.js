const Examples = {
  direct: {
    description:
      'Direct exchange sends message to the queue whose matches the routing key.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: [0],
        routingKey: 'Queue'
      }
    ],
    consumers: [
      {
        x: 800,
        y: 130,
        name: 'Consumer',
        consumes: [0],
        mode: 'ack'
      }
    ],
    exchanges: [
      {
        x: 400,
        y: 150,
        name: 'Exchange',
        type: 'direct'
      }
    ],
    queues: [{ x: 650, y: 150, name: 'Queue' }],
    bindings: [{ exchange: 0, queue: 0, routingKey: '' }]
  },
  fanout: {
    description:
      'Fanout exchange broadcasts all the messages to all bind queues, it ignores the routing key.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: [0]
      }
    ],
    consumers: [
      {
        x: 800,
        y: 50,
        name: 'Consumer 1',
        consumes: [0],
        mode: 'ack'
      },
      {
        x: 800,
        y: 150,
        name: 'Consumer 2',
        consumes: [1],
        mode: 'ack'
      },
      {
        x: 800,
        y: 250,
        name: 'Consumer 3',
        consumes: [2],
        mode: 'ack'
      }
    ],
    exchanges: [
      {
        x: 400,
        y: 170,
        name: 'Exchange',
        type: 'fanout'
      }
    ],
    queues: [
      { x: 650, y: 80, name: 'Queue 1' },
      { x: 650, y: 170, name: 'Queue 2' },
      { x: 650, y: 260, name: 'Queue 3' }
    ],
    bindings: [
      { exchange: 0, queue: 0, routingKey: '' },
      { exchange: 0, queue: 1, routingKey: '' },
      { exchange: 0, queue: 2, routingKey: '' }
    ]
  },
  topic: {
    description:
      'Topic exchange sends messages by routing key to the matching queue.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer 1',
        publishes: [0]
      },
      {
        x: 200,
        y: 200,
        name: 'Producer 2',
        publishes: [0]
      }
    ],
    consumers: [
      {
        x: 800,
        y: 80,
        name: 'Consumer 1',
        consumes: [0],
        mode: 'ack'
      },
      {
        x: 800,
        y: 170,
        name: 'Consumer 2',
        consumes: [1],
        mode: 'ack'
      },
      {
        x: 800,
        y: 260,
        name: 'Consumer 3',
        consumes: [2],
        mode: 'ack'
      }
    ],
    exchanges: [
      {
        x: 400,
        y: 170,
        name: 'Exchange',
        type: 'topic'
      }
    ],
    queues: [
      { x: 650, y: 80, name: 'Queue 1' },
      { x: 650, y: 170, name: 'Queue 2' },
      { x: 650, y: 260, name: 'Queue 3' }
    ],
    bindings: [
      { exchange: 0, queue: 0, routingKey: 'x.x.x' },
      { exchange: 0, queue: 1, routingKey: '#' },
      { exchange: 0, queue: 2, routingKey: 'x.y.z' }
    ]
  },
  'queue-ttl': {
    description:
      'Time to live for queues, messages which are staying longer are removed.',
    producers: [
      {
        x: 200,
        y: 100,
        name: 'Producer',
        publishes: [0],
        routingKey: 'Queue'
      }
    ],
    consumers: [],
    exchanges: [
      {
        x: 400,
        y: 130,
        name: 'Exchange',
        type: 'direct'
      }
    ],
    queues: [
      {
        x: 650,
        y: 130,
        name: 'Queue',
        ttl: 3000
      }
    ],
    bindings: [{ exchange: 0, queue: 0, routingKey: '' }]
  },
  'queue-max-length': {
    description:
      'Queues can have a maximum length of messages before they get dead lettered.',
    producers: [
      {
        x: 200,
        y: 100,
        name: 'Producer',
        publishes: [0],
        routingKey: 'Queue 1'
      }
    ],
    consumers: [
      {
        x: 800,
        y: 80,
        name: 'Consumer 1',
        consumes: [1],
        mode: 'reject'
      },
      {
        x: 800,
        y: 170,
        name: 'Consumer 2',
        consumes: [1],
        mode: 'ack'
      }
    ],
    exchanges: [
      {
        x: 400,
        y: 80,
        name: 'Exchange 1',
        type: 'direct'
      },
      {
        x: 400,
        y: 170,
        name: 'Exchange 2',
        type: 'direct'
      }
    ],
    queues: [
      {
        x: 650,
        y: 80,
        name: 'Queue 1',
        dlx: 1,
        maxLength: 5
      },
      { x: 650, y: 170, name: 'Queue 2' }
    ],
    bindings: [
      { exchange: 0, queue: 0, routingKey: '' },
      { exchange: 1, queue: 1, routingKey: '' }
    ]
  },
  dlx: {
    description:
      'Dead letter exchanges are used to get dead lettered messages republished.',
    producers: [
      {
        x: 200,
        y: 100,
        name: 'Producer',
        publishes: [0],
        routingKey: 'Queue 1'
      }
    ],
    consumers: [
      {
        x: 800,
        y: 100,
        name: 'Consumer 1',
        consumes: [0],
        mode: 'reject'
      },
      {
        x: 800,
        y: 170,
        name: 'Consumer 2',
        consumes: [1],
        mode: 'ack'
      }
    ],
    exchanges: [
      {
        x: 400,
        y: 100,
        name: 'Exchange 1',
        type: 'direct'
      },
      {
        x: 400,
        y: 200,
        name: 'Exchange 2',
        type: 'direct'
      }
    ],
    queues: [
      {
        x: 650,
        y: 100,
        name: 'Queue 1',
        dlx: 1
      },
      { x: 650, y: 200, name: 'Queue 2' }
    ],
    bindings: [
      { exchange: 0, queue: 0, routingKey: '' },
      { exchange: 1, queue: 1, routingKey: '' }
    ]
  },
  retry: {
    description:
      'Simple time based retry mechanism with a queue to park and republish messages.',
    producers: [
      {
        x: 200,
        y: 100,
        name: 'Producer',
        publishes: [0],
        routingKey: 'Queue 1'
      }
    ],
    consumers: [
      {
        x: 800,
        y: 100,
        name: 'Consumer 1',
        consumes: [0],
        mode: 'reject'
      }
    ],
    exchanges: [
      {
        x: 400,
        y: 100,
        name: 'Exchange 1',
        type: 'direct'
      },
      {
        x: 650,
        y: 200,
        name: 'Exchange 2',
        type: 'direct'
      }
    ],
    queues: [
      {
        x: 650,
        y: 100,
        name: 'Queue 1',
        dlx: 1
      },
      {
        x: 400,
        y: 300,
        name: 'Queue 2',
        dlx: 0,
        ttl: 3000
      }
    ],
    bindings: [
      { exchange: 0, queue: 0, routingKey: '' },
      { exchange: 1, queue: 1, routingKey: '' }
    ]
  }
}

export { Examples }
