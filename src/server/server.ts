import * as express from 'express';
import { Pool } from 'pg';
import { StatsDao } from './stats-dao';
import { KillStatsRestrictions, GamePersonStatsDto, GamePersonStatsRestrictions } from '../shared';
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
        err => res.status(500).send(err.message || err));
});
router.get('/person/:id', (req, res) => {
    statsDao.getPerson(req.params.id).then(
        person => res.send(person),
        err => res.status(500).send(err.message || err));
});
router.post('/persons', (req, res) => {
    console.log('Update person', req.body);
    statsDao.addPerson(req.body).then(
        person => res.send(person),
        err => res.status(500).send(err.message || err));
});
router.get('/clients', (req, res) => {
    statsDao.getClients().then(
        persons => res.send(persons),
        err => res.status(500).send(err.message || err));
});
router.post('/clients', (req, res) => {
    console.log('Update client', req.body);
    statsDao.updateClient(req.body).then(
        client => res.send(client),
        err => res.status(500).send(err.message || err));
});
router.get('/maps', (req, res) => {
    statsDao.getMaps().then(
        maps => res.send(maps),
        err => res.status(500).send(err.message || err));
});
router.get('/game/:id', (req, res) => {
    statsDao.getGame(+req.params.id).then(
        game => res.send(game),
        err => res.status(500).send(err.message || err));
});
router.get('/refresh-materialized-views', (req, res) => {
    statsDao.refreshMaterializedViews().then(
        game => res.send(),
        err => res.status(500).send(err.message || err));
});
router.post('/stats/game-person', (req, res) => {
    const rest: GamePersonStatsRestrictions = req.body;
    statsDao.getGamePersonStats(rest).then(
        stats => res.send(stats),
        err => res.status(500).send(err.message || err));
});
router.post('/stats/kill', (req, res) => {
    const rest: KillStatsRestrictions = req.body;
    statsDao.getKillStats(rest).then(
        stats => res.send(stats),
        err => res.status(500).send(err.message || err));
});
app.use('/api', router);

app.listen(3000, () => console.log('Server is running'));
