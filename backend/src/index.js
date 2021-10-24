const fastify = require('fastify');
const fastifyCors = require('fastify-cors')
const database = require('./json-database');
const mqtt = require('./mqtt');



const app = fastify({ logger: true });
app.register(fastifyCors, {});

const db = database.createDatabase('./config.db');
const mq = mqtt.createMqtt();

app.get('/', (_, res) => {
    const items = db.list();
    res.status(200).send(items)
})

app.post('/', (req, res) => {
    const items = db.create(req.body);
    res.status(200).send(items)
})

app.get('/:id', (req, res) => {
    const item = db.get(req.params.id);
    res.status(200).send(item)
})

app.put('/:id', (req, res) => {
    const id = req.params.id;
    const item = db.put(id, req.body);
    mq.send(`device/${id}`, JSON.stringify(item.status));
    res.status(200).send(item)
})

app.patch('/:id', (req, res) => {
    const id = req.params.id;
    const item = db.patch(id, req.body);
    mq.send(`device/${id}`, JSON.stringify(item.status));
    res.status(200).send(item)
})

app.delete('/:id', (req, res) => {
    const item = db.remove(req.params.id);
    res.status(200).send(item)
})

app.listen(3001, '0.0.0.0', () => {
    console.log('Server started!');
})