import modelCont from '../models/index.model'
import repositoryCont from '../repositories/index.repository'
import AttendanceService from './attendance.service';
import LeaveService from './leave.service';
import PayrollService from './payroll.service';
import EmployeeService from './employee.service';

const container = {
    attendance: new AttendanceService(modelCont, repositoryCont),
    leave: new LeaveService(modelCont, repositoryCont),
    payroll: new PayrollService(modelCont, repositoryCont),
    employee: new EmployeeService(modelCont, repositoryCont),
}

export default container