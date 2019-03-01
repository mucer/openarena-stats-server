import { assign, ClientDto, GameDto, KillStatDto, KillStatRestrictionsDto, MapDto, PersonDetailDto, PersonDto } from '@shared';
import { Pool, PoolClient, QueryResult } from 'pg';

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
            + 'FROM game GROUP BY map ORDER BY 2 desc, 3 desc;');

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
        const person = result.rows[0];

        result = await this.pool.query('SELECT id FROM client WHERE person_id = $1', [id]);
        const clientIds: number[] = result.rows.map(r => +r.id);

        return {
            id: person.id,
            name: person.name,
            fullName: person.full_name,
            clientIds
        };
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

    public async getKillStats(restrictions: KillStatRestrictionsDto): Promise<KillStatDto[]> {
        const { fromPersonId, toPersonId, cause, gameType, fromDate, toDate, map } = restrictions;

        const where: string[] = [];
        const params: any[] = [];

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
            params.push(new Date(map));
            where.push(`map = $${params.length}`);
        }

        const sql = `WITH
          kills AS (
            SELECT *
            FROM kill_ext
            ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}
          )
          SELECT
            p.id,
            (select count(*) from kills k where k.from_id = p.id and k.team_kill = false) kills,
            (select count(*) from kills k where k.from_id = p.id and k.team_kill = true) team_kills,
            (select count(*) from kills k where k.to_id = p.id and k.team_kill = false) deaths,
            (select count(*) from kills k where k.to_id = p.id and k.team_kill = true) team_deaths
          FROM person p`;

        const result = await this.pool.query(sql, params);

        return result.rows.map(row => ({
            personId: row.id,
            kills: row.kills,
            teamKills: row.team_kills,
            deaths: row.deaths,
            teamDeaths: row.team_deaths
        }) as KillStatDto);
    }
}
