import { Pool, PoolClient, QueryResult } from 'pg';
import { assign, ClientDto, GameDto, KillStatsDto, MapDto, MeanOfDeath, PersonDetailDto, PersonDto, KillStatsRestrictionsDto, WORLD_ID } from '../shared';

export class StatsDao {
    constructor(private pool: Pool) {
    }

    public async getGames(): Promise<GameDto[]> {
        const result = await this.pool.query('SELECT id, map, type, start_time FROM game');

        return result.rows.map(r => ({
            id: r.id,
            map: r.map,
            type: r.type,
            startTime: r.start_time
        }));
    }

    public async getPersons(): Promise<PersonDto[]> {
        const result = await this.pool.query('SELECT id, name, full_name FROM person');

        return result.rows.map(r => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name
        }));
    }

    public async getMaps(): Promise<MapDto[]> {
        const result = await this.pool.query('SELECT map, count(*) num, sum(duration) duration '
            + 'FROM game GROUP BY map ORDER BY 2 desc, 3 desc');

        return result.rows.map(r => ({
            name: r.map,
            numPlayed: +r.num,
            totalDuration: +r.duration
        }));
    }

    public async getMapDetail(name: string) {
        // SELECT type, count(*) FROM game WHERE map = $1 GROUP BY type

        // SELECT
        //   (SELECT count(*) FROM game WHERE map = 'am_thornish') AS num_games,
        //   (SELECT count(*) FROM game WHERE map = 'am_thornish' AND finished = true) AS num_finished_games

        // SELECT k.cause, count(*)
        // FROM game g
        // JOIN kill k ON k.game_id = g.id
        // WHERE g.map = 'am_thornish'
        // GROUP BY k.cause
        // ORDER BY 2 DESC

    }

    public async getPerson(id: string): Promise<PersonDetailDto> {
        let result = await this.pool.query('SELECT id, name, full_name FROM person WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error(`No person for name '${id}' found!`);
        }
        const person: any = result.rows[0];

        result = await this.pool.query('SELECT id FROM client WHERE person_id = $1', [id]);
        const clientIds: number[] = result.rows.map(r => +r.id);

        result = await this.pool.query(`
            SELECT SUM(to_time - from_time) AS time
            FROM game_join gj
            JOIN client c ON c .id = gj.client_id
            WHERE c.person_id = $1`, [id]);
        const totalTime: number = +result.rows[0].time;

        result = await this.pool.query(`
            SELECT g.finished, COUNT(*) AS sum
            FROM game g
            JOIN game_join gj ON gj.game_id = g.id
            JOIN client c ON gj.client_id = c.id
            WHERE c.person_id = $1
            GROUP BY g.finished`, [id]);
        let unfinishedGames = 0;
        let finishedGames = 0;
        for (const row of result.rows) {
            if (row.finished) {
                finishedGames = +row.sum;
            } else {
                unfinishedGames = +row.sum
            }
        }

        result = await this.pool.query(`
            SELECT k.cause, count(*) AS num
            FROM kill k
            JOIN client c ON c.id = k.from_client_id
            WHERE c.person_id = $1
              AND k.team_kill = false
            GROUP BY k.cause
            ORDER BY 2 DESC`, [id]);
        const killsWith: { cause: string, num: number }[] = result.rows.map(r => ({
            cause: MeanOfDeath[r.cause],
            num: +r.num
        }));

        return {
            id: person.id,
            name: person.name,
            fullName: person.full_name,
            clientIds,
            totalTime,
            totalGames: finishedGames + unfinishedGames,
            finishedGames,
            killsWith
        } as PersonDetailDto;
    }

    public async getClients(): Promise<ClientDto[]> {
        const conn: PoolClient = await this.pool.connect();
        try {
            const result = await conn.query(
                'SELECT c.id, c.hw_id, c.person_id, (SELECT p.name FROM person p WHERE p.id = c.person_id) as person_name ' +
                'FROM client c ORDER BY hw_id');
            const clients: ClientDto[] = [];
            for (const row of result.rows) {
                const id: number = row.id;

                const namesResult = await conn.query(
                    'SELECT name, count(*) num FROM game_join WHERE client_id = $1 GROUP BY name ORDER BY 2 DESC',
                    [id]);

                clients.push({
                    id,
                    hwId: row.hw_id,
                    personId: row.person_id,
                    personName: row.person_name,
                    names: namesResult.rows.map(r => ({
                        name: r.name,
                        count: r.num
                    }))
                });
            }
            return clients;
        } finally {
            conn.release();
        }

    }

    public async addPerson(person: Partial<PersonDto>): Promise<PersonDto> {
        const conn: PoolClient = await this.pool.connect();
        try {
            const result: QueryResult = await conn.query(
                'INSERT INTO person (name, full_name) ' +
                'VALUES ($1, $2) RETURNING id',
                [person.name, person.fullName]);
            return assign(person, { id: +result.rows[0].id }) as PersonDto;
        } finally {
            conn.release();
        }
    }

    public async updateClient(client: Partial<ClientDto>): Promise<ClientDto> {
        const conn: PoolClient = await this.pool.connect();
        try {
            await conn.query(
                'UPDATE client SET person_id = $1 WHERE id = $2',
                [client.personId, client.id]);
            const result = await conn.query('SELECT * FROM client WHERE id = $1', [client.id]);
            return result.rows[0] as ClientDto;
        } finally {
            conn.release();
        }
    }

    public async getKillStats(restrictions: KillStatsRestrictionsDto): Promise<KillStatsDto[]> {
        const { fromPersonId, toPersonId, cause, gameType, fromDate, toDate, map } = restrictions;

        const params: any[] = [];
        const where: string[] = [];
        const wherePlaytime: string[] = [];

        if (Number.isInteger(fromPersonId)) {
            params.push(fromPersonId);
            where.push(`from_id = $${params.length}`);
        }
        if (Number.isInteger(toPersonId)) {
            params.push(toPersonId);
            where.push(`to_id = $${params.length}`);
        }
        if (Number.isInteger(cause)) {
            params.push(cause);
            where.push(`cause = $${params.length}`);
        }
        if (Number.isInteger(gameType)) {
            params.push(gameType);
            where.push(`game_type = $${params.length}`);
        }
        if (fromDate) {
            params.push(new Date(fromDate));
            where.push(`start_time >= $${params.length}`);
        }
        if (toDate) {
            params.push(new Date(toDate));
            where.push(`start_time <= $${params.length}`);
        }
        if (map) {
            params.push(map);
            where.push(`map = $${params.length}`);
        }

        if (fromDate) {
            params.push(new Date(fromDate));
            wherePlaytime.push(`to_time >= $${params.length}`);
        }
        if (toDate) {
            params.push(new Date(toDate));
            wherePlaytime.push(`from_time >= $${params.length}`);
        }

        const sql = `WITH
          kills AS (
            SELECT *
            FROM kill_ext
            ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}
          )
          SELECT
            p.id,
            p.name,
            (SELECT count(*) FROM kills k WHERE k.from_id = p.id AND k.team_kill = false) kills,
            (SELECT count(*) FROM kills k WHERE k.from_id = p.id AND k.team_kill = true) team_kills,
            (SELECT count(*) FROM kills k WHERE k.to_id = p.id AND k.team_kill = false) deaths,
            (SELECT count(*) FROM kills k WHERE k.to_id = p.id AND k.team_kill = true) team_deaths,
            (SELECT sum(j.duration)
             FROM game_join_ext j
             WHERE j.person_id = p.id AND EXISTS (SELECT 1 FROM kills k WHERE k.game_id = j.game_id)
                   ${wherePlaytime.length > 0 ? 'AND' + wherePlaytime.join(' AND ') : ''}) duration
          FROM person p
          ORDER BY kills DESC, deaths DESC`;

        const result = await this.pool.query(sql, params);

        return result.rows
            .filter(row =>
                restrictions.fromPersonId === WORLD_ID ||
                restrictions.toPersonId === WORLD_ID ||
                +row.id === WORLD_ID ||
                row.duration > 0)
            .map(row => ({
                personId: +row.id,
                personName: row.name,
                kills: +row.kills,
                teamKills: +row.team_kills,
                deaths: +row.deaths,
                teamDeaths: +row.team_deaths,
                duration: +row.duration
            }) as KillStatsDto);
    }

    public async getGameStatsForPerson(personId: number): Promise<any[]> {
        const sql = `
            SELECT
                g.*,
                (SELECT COUNT(*) FROM kill_ext k WHERE k.game_id = g.id AND
                 k.from_id = game_data.person_id AND k.team_kill = false) AS kills,
                (SELECT COUNT(*) FROM kill_ext k WHERE k.game_id = g.id AND
                 k.from_id = game_data.person_id AND k.team_kill = true) AS team_kills,
                (SELECT COUNT(*) FROM kill_ext k WHERE k.game_id = g.id AND
                 k.to_id = game_data.person_id AND k.team_kill = false) AS deaths,
                (SELECT COUNT(*) FROM kill_ext k WHERE k.game_id = g.id AND
                 k.to_id = game_data.person_id AND k.team_kill = true) AS team_deaths
            FROM
            (
                SELECT c.person_id, g.id AS game_id, SUM(gj.to_time - gj.from_time)
                FROM client c
                JOIN game_join gj ON gj.client_id = c.id
                JOIN game g ON g.id = gj.game_id
                WHERE c.person_id = $1
                GROUP BY c.person_id, g.id
                ORDER BY g.start_time DESC
            ) AS game_data
            JOIN game g ON g.id = game_data.game_id`;

        const result = await this.pool.query(sql, [personId]);

        return result.rows.map(r => {
            gameId: r.id
        });
    }
}
