
exports.up = async function (knex) {
    const table = await knex.schema.hasTable('payroll');
    if (!table) {
        return knex.schema.createTable('payroll', table => {
            table.increments('id');
            table.integer('employee_id').unsigned()
            table.foreign('employee_id').references('employee.id').deferrable('deferred');
            table.date('date_from').notNullable();
            table.date('date_to').notNullable();
            table.decimal('amount', 8, 2).notNullable();
            table.date('payday').notNullable();
            table.enu('status', ['pending', 'confirmed']).defaultTo('pending')
        })
    }
};

exports.down = function (knex) {
    return knex.schema.dropTable('payroll');
};
