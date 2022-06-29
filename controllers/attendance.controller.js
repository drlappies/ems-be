class AttendanceController {
    constructor({ logger, services, error, utils }) {
        this.logger = logger
        this.services = services
        this.error = error
        this.utils = utils
    }

    checkIn = async (req, res) => {
        try {
            const employee = req.user

            const date = this.utils.time.getDate()
            const time = this.utils.time.getTime()

            const todayAttendance = await this.services.attendance.getOneByEmployeeIdAndDate(employee.id, date)

            if (todayAttendance) {
                res.status(400).json({ error: "Already checked in for today!" })
                return
            }

            const result = await this.services.attendance.checkIn(employee, date, time)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    checkOut = async (req, res) => {
        try {
            const employee = req.user

            const date = this.utils.time.getDate()
            const time = this.utils.time.getTime()

            const todayAttendance = await this.services.attendance.getOneByEmployeeIdAndDate(employee.id, date)

            if (!todayAttendance) {
                res.status(400).json({ error: "Have not checked in for today!" })
                return;
            } else if (todayAttendance.check_out_time) {
                res.status(400).json({ error: "Already checked out for today!" })
                return
            }

            const result = await this.services.attendance.checkOut(employee, date, time)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getOneById = async (req, res) => {
        try {
            const id = req.params.id

            const result = await this.services.attendance.getOneById(id)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getMany = async (req, res) => {
        try {
            const offset = req.query.offset ? parseInt(req.query.offset) : undefined
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined

            const params = {
                offset: offset,
                limit: limit,
                search: req.query.search,
                status: req.query.status,
                mindate: req.query.mindate,
                maxdate: req.query.maxdate,
                employee_id: req.query.employee_id,
                order: req.query.order,
                orderBy: req.query.orderBy,
                role: req.query.role
            }

            const result = await this.services.attendance.getMany(params)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    deleteOneById = async (req, res) => {
        try {
            const id = req.params.id

            await this.services.attendance.deleteOneById(id)

            res.status(204).json()
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    updateOneById = async (req, res) => {
        try {
            const id = req.params.id

            const checkIn = req.body.check_in_time
            const checkOut = req.body.check_out_time

            if (checkIn || checkOut) {
                const result = await this.services.attendance.getOneById(id)

                if (!result) {
                    res.status(400).json({ error: "attendance not found" })
                    return
                }

                if (checkIn > result.check_out_time && result.check_out_time) {
                    res.status(400).json({ error: "Check in cannot be later than check out time!" })
                    return
                }

                if (checkOut < result.check_in_time && result.check_in_time) {
                    res.status(400).json({ error: "Check out cannot be earlier than check in time!" })
                    return
                }
            }

            const result = await this.services.attendance.updateOneById(id, req.body)

            res.status(200).json(result)
        } catch (error) {

            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    deleteManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids

            await this.services.attendance.deleteManyByIds(ids)

            res.status(204).json()
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    updateManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids
            const checkIn = req.body.check_in_time
            const checkOut = req.body.check_out_time
            delete req.body.ids

            const { result: attendances } = await this.services.attendance.getManyByIds(ids)


            if (attendances.length > 0) {
                for (let i = 0; i < attendances.length; i++) {
                    if (checkOut < attendances[i].check_in_time) {
                        res.status(400).json({ error: "Check out cannot be earlier than check in time!" })
                        return
                    }

                    if (checkIn > attendances[i].check_out_time) {
                        res.status(400).json({ error: "Check in cannot be later than check out time!" })
                        return
                    }
                }
            }

            const result = await this.services.attendance.updateManyByIds(ids, req.body)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    createOne = async (req, res) => {
        try {
            const employeeId = req.body.employee_id
            const date = req.body.date
            const checkIn = req.body.check_in_time
            const checkOut = req.body.check_out_time
            const status = req.body.status

            if (!date || !checkIn || !checkOut || !status || !employeeId) {
                res.status(400).json({
                    error: "Missing required fields"
                })
                return
            }

            if (checkIn >= checkOut) {
                res.status(400).json({
                    error: 'Check in time cannot be greater than or equal to the check out time!'
                })

                return
            }

            const attendance = await this.services.attendance.getOneByEmployeeIdAndDate(employeeId, date)

            if (attendance) {
                res.status(400).json({
                    error: "Overlapped"
                })
                return
            }

            const result = await this.services.attendance.createOne(employeeId, date, checkIn, checkOut, status)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getCheckInStatusByUser = async (req, res) => {
        try {
            const employee = req.user

            const date = this.utils.time.getDate()

            const result = await this.services.attendance.getOneByEmployeeIdAndDate(employee.id, date)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }
}

export default AttendanceController