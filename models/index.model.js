import Attendance from "./attendance.model";
import Employee from "./employee.model";
import Leave from "./leave.model";
import Payroll from "./payroll.model";


const container = {
    attendance: new Attendance(),
    employee: new Employee(),
    leave: new Leave(),
    payroll: new Payroll(),
}

export default container