const mqtt = require('mqtt')


exports.createMqtt = () => {
    const mqttClient  = mqtt.connect('mqtt://192.168.0.56:1883');

    return {
        send: (topic, message) => {
            mqttClient.publish(topic, message);
        }
    }

}