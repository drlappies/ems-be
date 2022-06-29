class UserController {
    constructor({ logger, services, error }) {
        this.logger = logger
        this.services = services
        this.error = error
    }

    getUser = async (req, res) => {
        try {
            const user = req.user

            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getAttendanceByUser = async (req, res) => {
        try {
            const employee = req.user
            const mindate = req.query.mindate
            const maxdate = req.query.maxdate

            const params = {
                mindate: mindate,
                maxdate: maxdate,
                employeeId: employee.id
            }

            const result = await this.services.attendance.getMany(params)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getLeaveByUser = async (req, res) => {
        try {
            const employee = req.user
            const mindate = req.query.mindate
            const maxdate = req.query.maxdate

            const params = {
                mindate: mindate,
                maxdate: maxdate,
                employeeId: employee.id
            }

            const result = await this.services.leave.getMany(params)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getPayrollByUser = async (req, res) => {
        try {
            const employee = req.user
            const offset = parseInt(req.query.offset)
            const limit = parseInt(req.query.limit)
            const sort = req.query.sort
            const order = req.query.order

            const params = {
                offset: offset,
                limit: limit,
                orderBy: sort,
                order: order,
                employee_id: employee.id
            }

            const result = await this.services.payroll.getMany(params)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }
}

export default UserController