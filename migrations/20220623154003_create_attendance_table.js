
exports.up = async function (knex) {
    const table = await knex.schema.hasTable('attendance');
    if (!table) {
        return knex.schema.createTable('attendance', (table) => {
            table.increments('id');
            table.integer('employee_id').unsigned();
            table.foreign('employee_id').references('employee.id').deferrable('deferred');
            table.time('check_in_time').notNullable();
            table.time('check_out_time')
            table.date('date').notNullable();
            table.enu('status', ['on_time', 'late']).notNullable()
        })
    }
};

exports.down = function (knex) {
    return knex.schema.dropTable('attendance');
};
