import { displayForm } from "./common";
import { getSettings } from "./settings";
import Exchange from "../exchange";

/**
 * Resolves the index of a binding destination, looking it up in the list of
 * exchanges when the binding targets an exchange, otherwise in the queues.
 *
 * @param {object[]} exchanges - actors of type Exchange
 * @param {object[]} queues - actors of type Queue
 * @param {object} val - Binding actor
 * @returns {number} - index of the destination or -1
 */
const findDestinationIndex = (exchanges, queues, val) =>
  val.destination instanceof Exchange
    ? exchanges.findIndex((e) => e.id === val.destination.id)
    : queues.findIndex((q) => q.id === val.destination.id);

/**
 * Export topology as config.
 *
 * @param {object} e - Event object
 */
const exportTopology = (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.querySelector("#importBtn").classList.remove("hidden");
  const exports = {
    description: "",
    producers: [],
    consumers: [],
    exchanges: [],
    queues: [],
    bindings: []
  };
  const exchanges = globalThis.scene.getObjectsInScene("Exchange");
  exchanges.forEach((val) => {
    let alternate = null;
    if (val.alternate) {
      alternate = val.alternate.name;
    }
    exports.exchanges.push({
      x: val.x,
      y: val.y,
      name: val.name,
      type: val.type,
      alternate
    });
  });
  const queues = globalThis.scene.getObjectsInScene("Queue");
  queues.forEach((val) => {
    const q = {
      x: val.x,
      y: val.y,
      name: val.name,
      type: val.type
    };
    if (val.msgTtl) {
      q.ttl = val.msgTtl;
    }
    q.maxLength = val.maxLength;
    if (val.dlx) {
      const exchangeIndex = exchanges.findIndex((e) => e.id === val.dlx.id);
      q.dlx = exchangeIndex;
    }
    exports.queues.push(q);
  });
  const bindings = globalThis.scene.getObjectsInScene("Binding");
  bindings.forEach((val) => {
    const exchangeIndex = exchanges.findIndex((e) => e.id === val.source.id);
    const destinationIndex = findDestinationIndex(exchanges, queues, val);
    if (exchangeIndex !== -1 && destinationIndex !== -1) {
      const entry = {
        exchange: exchangeIndex,
        queue: destinationIndex,
        routingKey: val.routingKey
      };
      if (val.destination instanceof Exchange) {
        entry.destinationType = "exchange";
      }
      exports.bindings.push(entry);
    }
  });
  const consumers = globalThis.scene.getObjectsInScene("Consumer");
  consumers.forEach((val) => {
    const consumes = [];
    val.queues.forEach((queue) => {
      const queueIndex = queues.findIndex((q) => q.id === queue.id);
      consumes.push(queueIndex);
    });
    exports.consumers.push({
      x: val.x,
      y: val.y,
      name: val.name,
      consumes,
      mode: val.mode
    });
  });
  const producers = globalThis.scene.getObjectsInScene("Producer");
  producers.forEach((val) => {
    const publishes = {};
    for (const key in val.publishes) {
      publishes[key] = {
        exchange: val.publishes[key].exchange.name,
        routingKey: val.publishes[key].routingKey,
        message: val.publishes[key].message
      };
    }
    exports.producers.push({
      x: val.x,
      y: val.y,
      name: val.name,
      publishes
    });
  });

  document.querySelector("#ImExport").value = JSON.stringify(exports);
  document.querySelector("#imexportPanel").classList.add("panel-wrap-out");
};

/**
 * Export topology as curl statements.
 *
 * @param {object} e - Event object
 */
const exportCurl = (e) => {
  e.preventDefault();
  e.stopPropagation();
  displayForm("imexportForm");
  document.querySelector("#importBtn").classList.add("hidden");
  let generatedString = "";
  const brokerSettings = getSettings();
  const { management } = brokerSettings;
  const { username } = brokerSettings;
  const { password } = brokerSettings;
  const { vhost } = brokerSettings;
  const exchanges = globalThis.scene.getObjectsInScene("Exchange");
  exchanges.forEach((val) => {
    const name = encodeURIComponent(val.name);
    const args = {};
    if (val.alternate !== null) {
      args["alternate-exchange"] = val.alternate.name;
    }
    generatedString +=
      `curl -u ${username}:${password} -i -H "content-type:application/json" -XPUT ${management}/exchanges/${vhost}/${name} -d '{"type": "${val.type}", "auto_delete": false, "durable": true, "internal": false, "arguments": ${
        JSON.stringify(
          args
        )
      }}'\n\n`;
  });
  const queues = globalThis.scene.getObjectsInScene("Queue");
  queues.forEach((val) => {
    const name = encodeURIComponent(val.name);
    const args = { "x-queue-type": val.type };
    if (val.dlx) {
      args["x-dead-letter-exchange"] = val.dlx.name;
      args["x-dead-letter-routing-key"] = val.dlxrk;
    }
    if (val.msgTtl) {
      args["x-message-ttl"] = val.msgTtl;
    }
    if (val.maxLength) {
      args["x-max-length"] = val.maxLength;
    }
    generatedString +=
      `curl -u ${username}:${password} -i -H "content-type:application/json" -XPUT ${management}/queues/${vhost}/${name} -d '{"auto_delete": false, "durable": true, "arguments": ${
        JSON.stringify(
          args
        )
      }}'\n\n`;
  });
  const bindings = globalThis.scene.getObjectsInScene("Binding");
  bindings.forEach((val) => {
    const exchangeIndex = exchanges.findIndex((e) => e.id === val.source.id);
    const destinationIndex = findDestinationIndex(exchanges, queues, val);
    if (exchangeIndex !== -1 && destinationIndex !== -1) {
      const exchange = exchanges[exchangeIndex];
      const destination = val.destination instanceof Exchange
        ? exchanges[destinationIndex]
        : queues[destinationIndex];
      const destinationType = val.destination instanceof Exchange ? "e" : "q";
      generatedString +=
        `curl -u ${username}:${password} -i -H "content-type:application/json" -XPOST ${management}/bindings/${vhost}/e/${
          encodeURIComponent(
            exchange.name
          )
        }/${destinationType}/${
          encodeURIComponent(destination.name)
        } -d '{"routing_key": ${JSON.stringify(val.routingKey)}, "arguments": {}}'\n\n`;
    }
  });
  document.querySelector("#ImExport").value = generatedString;
  document.querySelector("#imexportPanel").classList.add("panel-wrap-out");
};

/**
 * Export topology as rabbitmqadmin statements.
 *
 * @param {object} e - Event object
 */
const exportRabbitmqadmin = (e) => {
  e.preventDefault();
  e.stopPropagation();
  displayForm("imexportForm");
  document.querySelector("#importBtn").classList.add("hidden");
  let generatedString = "";
  const brokerSettings = getSettings();
  const { management } = brokerSettings;
  const { username } = brokerSettings;
  const { password } = brokerSettings;
  const url = new URL(management);
  let { vhost } = brokerSettings;
  if (vhost === "%2f") {
    vhost = "/";
  }
  const exchanges = globalThis.scene.getObjectsInScene("Exchange");
  exchanges.forEach((val) => {
    generatedString +=
      `rabbitmqadmin -H ${url.hostname} -u ${username} -p ${password} -V ${vhost} declare exchange `;
    generatedString += `name="${val.name}" type="${val.type}" durable=true`;
    if (val.alternate !== null) {
      generatedString += ` arguments='${
        JSON.stringify({ "alternate-exchange": val.alternate.name })
      }'`;
    }
    generatedString += `\n\n`;
  });
  const queues = globalThis.scene.getObjectsInScene("Queue");
  queues.forEach((val) => {
    const args = { "x-queue-type": val.type };
    if (val.dlx) {
      args["x-dead-letter-exchange"] = val.dlx.name;
      args["x-dead-letter-routing-key"] = val.dlxrk;
    }
    if (val.msgTtl) {
      args["x-message-ttl"] = val.msgTtl;
    }
    if (val.maxLength) {
      args["x-max-length"] = val.maxLength;
    }
    generatedString +=
      `rabbitmqadmin -H ${url.hostname} -u ${username} -p ${password} -V ${vhost} declare queue name="${val.name}" durable=true`;
    if (Object.keys(args).length !== 0) {
      generatedString += ` arguments='${JSON.stringify(args)}'`;
    }
    generatedString += "\n\n";
  });
  const bindings = globalThis.scene.getObjectsInScene("Binding");
  bindings.forEach((val) => {
    const exchangeIndex = exchanges.findIndex((e) => e.id === val.source.id);
    const destinationIndex = findDestinationIndex(exchanges, queues, val);
    if (exchangeIndex !== -1 && destinationIndex !== -1) {
      const exchange = exchanges[exchangeIndex];
      const destination = val.destination instanceof Exchange
        ? exchanges[destinationIndex]
        : queues[destinationIndex];
      generatedString +=
        `rabbitmqadmin -H ${url.hostname} -u ${username} -p ${password} -V ${vhost} declare binding source="${exchange.name}" destination_type="${
          val.destination instanceof Exchange ? "exchange" : "queue"
        }" destination="${destination.name}" routing_key="${val.routingKey}"\n\n`;
    }
  });
  document.querySelector("#ImExport").value = generatedString;
  document.querySelector("#imexportPanel").classList.add("panel-wrap-out");
};

/**
 * Export topology as Terraform.
 *
 * @param {object} e - Event object
 */
const exportTerraform = (e) => {
  e.preventDefault();
  e.stopPropagation();
  displayForm("imexportForm");
  document.querySelector("#importBtn").classList.add("hidden");
  let generatedString = "";
  const brokerSettings = getSettings();
  const { management } = brokerSettings;
  const { username } = brokerSettings;
  const { password } = brokerSettings;
  const url = new URL(management);
  let { vhost } = brokerSettings;
  if (vhost === "%2f") {
    vhost = "/";
  }
  generatedString += `terraform {
  required_providers {
    rabbitmq = {
      source = "cyrilgdn/rabbitmq"
      version = "1.8.0"
    }
  }
}
provider "rabbitmq" {
  endpoint = "${url.origin}"
  username = "${username}"
  password = "${password}"
}
resource "rabbitmq_vhost" "vhost" {
  name = "${vhost}"
}
`;
  const exchanges = globalThis.scene.getObjectsInScene("Exchange");
  exchanges.forEach((val) => {
    const name = val.name.replace(/ /g, "-");
    generatedString += `resource "rabbitmq_exchange" "${name}" {
  name  = "${val.name}"
  vhost = "\${rabbitmq_vhost.vhost.name}"
  settings {
    type        = "${val.type}"
    durable     = true
    auto_delete = false`;
    if (val.alternate !== null) {
      generatedString += `
    arguments_json = <<EOF
{
  "alternate-exchange": "${val.alternate.name}"
}
EOF`;
    }
    generatedString += `
  }
}
`;
  });
  const queues = globalThis.scene.getObjectsInScene("Queue");
  queues.forEach((val) => {
    const name = val.name.replace(/ /g, "-");
    generatedString += `variable "${name}args" {
  default = <<EOF
  {
`;
    const extra = [`"x-queue-type": "${val.type}"`];
    if (val.dlx) {
      extra.push(`"x-dead-letter-exchange": "${val.dlx.name}"`);
      extra.push(`"x-dead-letter-routing-key": "${val.dlxrk}"`);
    }
    if (val.msgTtl) {
      extra.push(`"x-message-ttl": ${val.msgTtl}`);
    }
    if (val.maxLength) {
      extra.push(`"x-max-length": ${val.maxLength}`);
    }
    generatedString += `    ${extra.join(",\n    ")}`;
    generatedString += `
  }
  EOF
}
`;
    generatedString += `resource "rabbitmq_queue" "${name}" {
  name  = "${val.name}"
  vhost = "\${rabbitmq_vhost.vhost.name}"
    
  settings {
    durable     = true
    auto_delete = false`;
    generatedString += `
    arguments_json = "\${var.${name}args}"`;
    generatedString += `
  }
}
`;
  });

  const bindings = globalThis.scene.getObjectsInScene("Binding");
  bindings.forEach((val) => {
    const srcName = val.source.name.replace(/ /g, "-");
    const destName = val.destination.name.replace(/ /g, "-");
    const destinationIsExchange = val.destination instanceof Exchange;
    const destinationRef = destinationIsExchange
      ? `rabbitmq_exchange.${destName}.name`
      : `rabbitmq_queue.${destName}.name`;
    generatedString += `resource "rabbitmq_binding" "${srcName}${destName}" {
  source           = "\${rabbitmq_exchange.${srcName}.name}"
  vhost            = "\${rabbitmq_vhost.vhost.name}"
  destination      = "\${${destinationRef}}"
  destination_type = "${destinationIsExchange ? "exchange" : "queue"}"
  routing_key      = "${val.routingKey}"
}
`;
  });

  document.querySelector("#ImExport").value = generatedString;
  document.querySelector("#importBtn").classList.add("hidden");
  document.querySelector("#imexportPanel").classList.add("panel-wrap-out");
};

/**
 * Export topology as AsyncApi.
 *
 * @param {object} e - Event object
 */
const exportAsyncApi = (e) => {
  e.preventDefault();
  e.stopPropagation();
  displayForm("imexportForm");
  document.querySelector("#importBtn").classList.add("hidden");
  let generatedString = "";
  const brokerSettings = getSettings();
  const { host } = brokerSettings;
  const { title, description, version } = brokerSettings.asyncapi;
  let { vhost } = brokerSettings;
  if (vhost === "%2f") {
    vhost = "/";
  }
  const exchanges = globalThis.scene.getObjectsInScene("Exchange");
  const queues = globalThis.scene.getObjectsInScene("Queue");
  const bindings = globalThis.scene.getObjectsInScene("Binding");
  const e2eDestinations = [
    ...new Set(
      bindings
        .filter(
          (v) =>
            v.source instanceof Exchange &&
            v.destination instanceof Exchange
        )
        .map((v) => v.destination)
    )
  ];

  generatedString += `asyncapi: 3.0.0
info:
  title: ${title}
  description: ${description}
  version: ${version}
  termsOfService: https://asyncapi.org/terms/
  contact:
    name: API Support
    url: https://www.asyncapi.org/support
    email: support@asyncapi.org
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.htm  
servers:
  production:
    host: ${host}
    protocol: amqps
    protocolVersion: 0.9.1
    description: Production broker.
    tags:
      - name: env:production
        description: This environment is the live environment available for final users
channels:
`;
  exchanges.forEach((val) => {
    if (val.type === "topic") {
      val.bindings
        .filter((v) => v.source === val)
        .forEach((v) => {
          if (v.routingKey !== "#") {
            let nameAddition = "";
            if (v.routingKey) {
              nameAddition = "_" + v.routingKey;
            }
            generatedString += `  ${
              val.name.replaceAll(" ", "_")
            }${nameAddition}          
    address: '${v.routingKey}'
    messages:
      event:
        $ref: '#/components/messages/Event'
    bindings:
      amqp:
        is: routingKey
        exchange:
          name: ${v.source.name}
          type: 'topic'
          durable: true
          autoDelete: false
          vhost: ${vhost}`;
            if (val.alternate !== null) {
              generatedString += `
          x-arguments:
            alternate-exchange: ${val.alternate.name}`;
            }
            generatedString += `
`;
          }
        });
    } else {
      generatedString += `  ${val.name.replaceAll(" ", "_")}:
    messages:
      event:
        $ref: '#/components/messages/Event'
    bindings:
      amqp:
        is: routingKey
        exchange:
          name: ${val.name}
          type: '${val.type}'
          durable: true
          autoDelete: false
          vhost: ${vhost}`;
      if (val.alternate !== null) {
        generatedString += `
          x-arguments:
            alternate-exchange: ${val.alternate.name}`;
      }
      generatedString += `
`;
    }
  });

  e2eDestinations.forEach((val) => {
    if (val.type === "topic") {
      generatedString += `  ${val.name.replaceAll(" ", "_")}:
    address: '#'
    messages:
      event:
        $ref: '#/components/messages/Event'
    bindings:
      amqp:
        is: routingKey
        exchange:
          name: ${val.name}
          type: 'topic'
          durable: true
          autoDelete: false
          vhost: ${vhost}`;
      if (val.alternate !== null) {
        generatedString += `
          x-arguments:
            alternate-exchange: ${val.alternate.name}`;
      }
      generatedString += `
`;
    }
  });

  queues.forEach((val) => {
    generatedString += `  ${val.name.replaceAll(" ", "_")}:
    messages:
      event:
        $ref: '#/components/messages/Event'
    bindings:
      amqp:
        is: queue
        queue:
          name: ${val.name}
          type: ${val.type}
          durable: true
          exclusive: false
          autoDelete: false
`;
  });

  generatedString += `operations:`;
  exchanges.forEach((val) => {
    if (val.type === "topic") {
      val.bindings
        .filter((v) => v.source === val)
        .forEach((v) => {
          if (v.routingKey !== "#") {
            let nameAddition = "";
            if (v.routingKey) {
              nameAddition = "_" + v.routingKey;
            }
            generatedString += `
  send${val.name}/${v.routingKey}:
    channel:
      $ref: '#/channels/${val.name.replaceAll(" ", "_")}${nameAddition}'
    action: send`;
          }
        });
    } else if (
      val.bindings.filter((v) => v.source === val).some((v) => v.routingKey !== "#")
    ) {
      generatedString += `
  send${val.name}/:
    channel:
      $ref: '#/channels/${val.name.replaceAll(" ", "_")}'
    action: send`;
    }
  });

  e2eDestinations.forEach((val) => {
    generatedString += `
  receive${val.name.replaceAll(" ", "_")}:
    channel:
      $ref: '#/channels/${val.name.replaceAll(" ", "_")}'
    action: receive`;
  });

  queues.forEach((val) => {
    generatedString += `
  receive${val.name.replaceAll(" ", "_")}:
    channel:
      $ref: '#/channels/${val.name.replaceAll(" ", "_")}'
    action: receive`;
  });

  // remove two to start again
  //generatedString = generatedString.slice(0, -2)
  generatedString += `  
components:
  messages:
    Event:
      name: EventName
      title: Event Title
      summary: Summary of the event.
      description: Event description
      contentType: application/json
      tags:
        - name: message
        - name: example
      headers:
        type: object
        properties:
          correlationId:
            description: Correlation ID set by application
            type: string
          applicationInstanceId:
            description: Unique identifier for a given instance of the publishing application
            type: string
      payload:
        type: object
        additionalProperties: false
        properties:
          created:
            type: string
            description: The date and time a message was sent.
            format: datetime
          name:
            type: string
            description: The name of the message was sent.
          value:
            type: string
            description: The value of the message was sent.`;

  document.querySelector("#ImExport").value = generatedString;
  document.querySelector("#imexportPanel").classList.add("panel-wrap-out");
};

export {
  exportAsyncApi,
  exportCurl,
  exportRabbitmqadmin,
  exportTerraform,
  exportTopology
};
