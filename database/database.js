import Knex from 'knex';
import knexConfig from '../knexfile';

const knex = Knex(knexConfig.development);

export default knex
