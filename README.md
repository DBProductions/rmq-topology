# RMQ Topology

A small tool to simulate RabbitMQ topologies and see the message flow.  
Have several examples of common use cases and messaging pattern.  
It creates curl, rabbitmqadmin, Terraform and AsyncAPI definitions.  

[Demo Page](https://dbproductions.github.io/rmq-topology/)

![demo page screenshot](screenshot.png "Demo Page Screenshot")

![Coverage](https://img.shields.io/badge/Code%20Coverage-16%25-critical?style=flat "Coverage")

The project uses [Rollup](https://rollupjs.org/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) and [JSDoc](https://jsdoc.app/) with the [clean-jsdoc-theme](https://ankdev.me/clean-jsdoc-theme/). [Vitest](https://vitest.dev/) and [Cypress](https://www.cypress.io/) runs some tests.  

    node -v
    v21.5.0
    npm i

    npm run bundle
    npm start

    http://localhost:3000/

## Feedback
Star this repo if you found it useful. Use the github issue tracker to give feedback on this repo.