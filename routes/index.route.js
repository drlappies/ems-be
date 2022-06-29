import { Router } from 'express'
import middlewares from '../middlewares/index.middleware'
import controllerCont from '../controllers/index.controller'
import AttendanceRoute from './attendance.route';
import EmployeeRoute from './employee.route';
import LeaveRoute from './leave.route';
import LoginRoute from './login.route';
import PayrollRoute from './payroll.route';
import UserRoute from './user.route'

const container = {
    attendance: new AttendanceRoute({ router: Router, controller: controllerCont.attendence, middlewares }),
    employee: new EmployeeRoute({ router: Router, controller: controllerCont.employee, middlewares }),
    leave: new LeaveRoute({ router: Router, controller: controllerCont.leave, middlewares }),
    login: new LoginRoute({ router: Router, controller: controllerCont.login, middlewares }),
    payroll: new PayrollRoute({ router: Router, controller: controllerCont.payroll, middlewares }),
    user: new UserRoute({ router: Router, controller: controllerCont.user, middlewares })
}

export default container