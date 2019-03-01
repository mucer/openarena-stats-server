import * as express from 'express';
import { Pool } from 'pg';
import { StatsDao } from './stats-dao';
import { KillStatRestrictionsDto } from '@shared';
const bodyParser: any = require('body-parser');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'pwd',
    port: 5432
});
const statsDao = new StatsDao(pool);

const router = express.Router();
router.get('/persons', (req, res) => {
    statsDao.getPersons().then(
        persons => res.send(persons),
        err => res.status(500).send(err));
});
router.get('/person/:id', (req, res) => {
    statsDao.getPerson(req.params.id).then(
        person => res.send(person),
        err => res.status(500).send(err));
});
router.post('/persons', (req, res) => {
    console.log('Update person', req.body);
    statsDao.addPerson(req.body).then(
        person => res.send(person),
        err => res.status(500).send(err));
});
router.get('/clients', (req, res) => {
    statsDao.getClients().then(
        persons => res.send(persons),
        err => res.status(500).send(err));
});
router.post('/clients', (req, res) => {
    console.log('Update client', req.body);
    statsDao.updateClient(req.body).then(
        client => res.send(client),
        err => res.status(500).send(err));
});
router.post('/stats', (req, res) => {
    const rest: KillStatRestrictionsDto = req.body;
    statsDao.getKillStats(rest).then(
        stats => res.send(stats),
        err => res.status(500).send(err));
});
app.use('/api', router);

app.listen(3000);
