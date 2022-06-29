import knex from '../database/database'
import AttendanceRepository from './attendance.repository';
import EmployeeRepository from './employee.repository';
import LeaveRepository from './leave.repository';
import PayrollRepository from './payroll.repository';

const container = {
    attendance: new AttendanceRepository(knex, "attendance"),
    employee: new EmployeeRepository(knex, "employee"),
    leave: new LeaveRepository(knex, "leave"),
    payroll: new PayrollRepository(knex, "payroll")
}

export default container