import * as mqtt from "mqtt/dist/mqtt";

let client = mqtt.connect("ws://localhost:9001");

const connectClient = (broker) => {
  try {
    client = mqtt.connect(broker);
  } catch (error) {}
};

const publish = (topic, message) => {
  client.publish(topic, JSON.stringify(message));
};

export default client;
export { connectClient, publish };
