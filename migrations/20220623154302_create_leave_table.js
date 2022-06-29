
exports.up = async function (knex) {
    const table = await knex.schema.hasTable('leave');
    if (!table) {
        return knex.schema.createTable('leave', (table) => {
            table.increments('id');
            table.integer('employee_id').unsigned();
            table.foreign('employee_id').references('employee.id').deferrable('deferred');
            table.string('remark').notNullable();
            table.date('date').notNullable();
            table.enu('span', ['full_day', 'half_day']).defaultTo('full_day');
            table.enu('leave_type', ['sick', 'personal']).defaultTo('sick');
            table.enu('status', ['approved', 'rejected', 'pending']).defaultTo('pending');
        })
    }
};

exports.down = function (knex) {
    return knex.schema.dropTable('leave');
};
