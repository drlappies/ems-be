import utils from '../utils/index.util'

export async function seed(knex) {
  try {
    await knex('payroll').del();
    await knex('leave').del();
    await knex('attendance').del();
    await knex('employee').del();

    const generateAttendance = (timespan, employee_id) => {
      const time = new Date();
      time.setMonth(0)
      time.setDate(1);

      const attendance = [];
      for (let i = 0; i < timespan; i++) {
        if (time.getDay() === 6 || time.getDay() === 0) {
          time.setDate(time.getDate() + 1)
          continue;
        }

        let obj = {
          employee_id: employee_id,
          status: "on_time",
          check_in_time: "09:00 AM",
          check_out_time: "6:00 PM",
          date: new Date(time)
        }

        time.setDate(time.getDate() + 1)
        attendance.push(obj)
      }

      return attendance;
    }

    const employeeSeed = await knex.insert([
      {
        firstname: 'Ming',
        lastname: 'Chan',
        joined_date: new Date().toISOString(),
        username: 'admin',
        password: await utils.password.hashPassword('admin'),
        role: 'admin',
        start_work_time: '09:00 AM',
        end_work_time: '06:00 PM',
        monthly_salary: 50000.00,
      }, {
        firstname: 'Tai Man',
        lastname: 'Chan',
        joined_date: new Date().toISOString(),
        username: 'user',
        password: await utils.password.hashPassword('user'),
        role: 'user',
        start_work_time: '09:00 AM',
        end_work_time: '06:00 PM',
        monthly_salary: 22000.00,
      }]).into('employee').returning(['id']);



    const attendance = generateAttendance(365, employeeSeed[1].id)
    await knex.insert(attendance).into('attendance')
  } catch (error) {
    console.log(error)
  }
}
