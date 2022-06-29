
exports.up = async function (knex) {
    const table = await knex.schema.hasTable('employee');
    if (!table) {
        return knex.schema.createTable('employee', (table) => {
            table.increments('id');
            table.string('username').notNullable();
            table.string('password').notNullable();
            table.enu('role', ['admin', 'user']).defaultTo('user');
            table.string('firstname')
            table.string('lastname')
            table.string('address')
            table.string('phone_number')
            table.time('start_work_time')
            table.time('end_work_time')
            table.decimal('monthly_salary', 8, 2)
            table.date('joined_date').notNullable();
            table.enu('status', ['available', 'unavailable']).defaultTo('available');
            table.timestamps(true, true);
        })
    }
};

exports.down = function (knex) {
    return knex.schema.dropTable('employee');
};
