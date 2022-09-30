import * as mqtt from "mqtt/dist/mqtt";
import throttle from "lodash.throttle";

let client = null; //mqtt.connect("ws://localhost:9001");
let throttleTime = 16;
const throttledSendFunctions = {};

const connectClient = (protocol, host, port, onSuccess, onError) => {
  const broker = protocol + "://" + host + ":" + port
  try {
    for (const prop of Object.getOwnPropertyNames(throttledSendFunctions)) {
      delete throttledSendFunctions[prop];
    }
    client = mqtt.connect(broker);

    client.on('connect',  () => {
      onSuccess(broker)
    })

    client.on('offline', () => {
      onError(broker)
    })
    
  } catch (error) {
      onError(broker)
  }
};

const setThrottleTime = (time) => {
  throttleTime = time;
  for (const prop of Object.getOwnPropertyNames(throttledSendFunctions)) {
    delete throttledSendFunctions[prop];
  }
};

const publish = (topic, message) => {
  if (client && !Object.keys(throttledSendFunctions).includes(topic)) {
    throttledSendFunctions[topic] = throttle((message) => {
      client?.publish(topic, JSON.stringify(message));
    }, throttleTime);
  }
  throttledSendFunctions[topic](message);
};

// export default client;
export { connectClient, publish, setThrottleTime };
