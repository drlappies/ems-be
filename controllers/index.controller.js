import jwt from 'jsonwebtoken';
import logger from '../logger/logger';
import utils from '../utils/index.util';
import services from '../services/index.service';
import error from '../constants/error';
import AttendanceController from './attendance.controller';
import EmployeeController from './employee.controller';
import LeaveController from './leave.controller';
import LoginController from './login.controller';
import PayrollController from './payroll.controller';
import UserController from './user.controller';

const container = {
    attendence: new AttendanceController({ logger, services, utils, error }),
    employee: new EmployeeController({ logger, services, utils, error }),
    leave: new LeaveController({ logger, services, error }),
    login: new LoginController({ logger, services, jwt, utils, error }),
    payroll: new PayrollController({ logger, services, error }),
    user: new UserController({ logger, services, error }),
}

export default container