const Examples = {
  'direct exchange': {
    description:
      'Direct exchange sends message to the queue whose matches the routing key.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: 'Queue',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
  'fanout exchange': {
    description:
      'Fanout exchange broadcasts all the messages to all bind queues, it ignores the routing key. Publish/Subscribe pattern.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: '',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
  'topic exchange': {
    description:
      'Topic exchange sends messages by routing key to the matching queue.',
    producers: [
      {
        x: 200,
        y: 80,
        name: 'Producer 1',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: 'x.y.z',
            message: {
              headers: {},
              body: {}
            }
          }
        }
      },
      {
        x: 200,
        y: 170,
        name: 'Producer 2',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: 'x.x.x',
            message: {
              headers: {},
              body: {}
            }
          }
        }
      },
      {
        x: 200,
        y: 260,
        name: 'Producer 3',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: 'y.y.y',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
  'work queue': {
    description:
      'Work queues share the work between multiple consumers behind one queue.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: 'Queue',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
        consumes: [0],
        mode: 'ack'
      },
      {
        x: 800,
        y: 260,
        name: 'Consumer 3',
        consumes: [0],
        mode: 'ack'
      }
    ],
    exchanges: [
      {
        x: 400,
        y: 170,
        name: 'Exchange',
        type: 'direct'
      }
    ],
    queues: [{ x: 650, y: 170, name: 'Queue' }],
    bindings: [{ exchange: 0, queue: 0, routingKey: '' }]
  },
  stream: {
    description:
      'Streams a specific type of queues they are an append-only log and does not remove messages.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: 'Queue',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
    queues: [{ x: 650, y: 150, name: 'Queue', type: 'stream' }],
    bindings: [{ exchange: 0, queue: 0, routingKey: '' }]
  },
  'queue-ttl': {
    description:
      'Time to live for queues, messages which are staying longer are removed.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange',
            routingKey: 'Queue',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange 1',
            routingKey: 'Queue 1',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
        dlxrk: 'Queue 2',
        maxLength: 3
      },
      { x: 650, y: 170, name: 'Queue 2' }
    ],
    bindings: [
      { exchange: 0, queue: 0, routingKey: '' },
      { exchange: 1, queue: 1, routingKey: '' }
    ]
  },
  'alternate exchange': {
    description:
      'When an exchange can not route the message it publishes the message to the alternate exchange.',
    producers: [
      {
        x: 200,
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange 1',
            routingKey: '',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
        y: 180,
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
        type: 'direct',
        alternate: 'Exchange 2'
      },
      {
        x: 450,
        y: 180,
        name: 'Exchange 2',
        type: 'topic'
      }
    ],
    queues: [
      {
        x: 650,
        y: 100,
        name: 'Queue 1'
      },
      { x: 650, y: 200, name: 'Queue 2' }
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
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange 1',
            routingKey: 'Queue 1',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
        dlx: 1,
        dlxrk: 'Queue 2'
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
        y: 130,
        name: 'Producer',
        publishes: {
          0: {
            exchange: 'Exchange 1',
            routingKey: 'Queue 1',
            message: {
              headers: {},
              body: {}
            }
          }
        }
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
        dlx: 1,
        dlxrk: 'Queue 2'
      },
      {
        x: 400,
        y: 300,
        name: 'Queue 2',
        dlx: 0,
        dlxrk: 'Queue 1',
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
