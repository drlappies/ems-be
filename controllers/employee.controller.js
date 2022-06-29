class EmployeeController {
    constructor({ logger, services, error, utils }) {
        this.logger = logger
        this.services = services
        this.error = error
        this.utils = utils
    }

    createOne = async (req, res) => {
        try {
            const username = req.body.username
            const password = req.body.password
            const role = req.body.role
            const firstname = req.body.firstname
            const lastname = req.body.lastname
            const joinedDate = req.body.joined_date
            const monthlySalary = req.body.monthly_salary
            const startHour = req.body.start_work_time
            const endHour = req.body.end_work_time

            if (!username || !password) {
                res.status(400).json({ error: 'Missing required fields' });
                return
            }

            if (startHour >= endHour) {
                res.status(400).json({
                    error: 'Employee start work hour cannot be greater than or equal to his/her off hour.'
                })
                return
            }

            const user = await this.services.employee.getOneByUsername(username)

            if (user) {
                res.status(400).json({
                    error: 'Uesrname is taken.'
                })
                return
            }

            const hashedPassword = await this.utils.password.hashPassword(password)

            const result = await this.services.employee.createOne(username, hashedPassword, role, firstname, lastname, joinedDate, monthlySalary, startHour, endHour)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getOneById = async (req, res) => {
        try {
            const id = req.params.id

            const result = await this.services.employee.getOneById(id)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getMany = async (req, res) => {
        try {
            const offset = req.query.offset ? parseInt(req.query.offset) : null
            const limit = req.query.limit ? parseInt(req.query.limit) : null

            const params = {
                offset: offset,
                limit: limit,
                search: req.query.search,
                status: req.query.status,
                role: req.query.role,
                orderBy: req.query.orderBy,
                order: req.query.order,
                mindate: req.query.mindate,
                maxdate: req.query.maxdate,
            }

            const result = await this.services.employee.getMany(params)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    updateOneById = async (req, res) => {
        try {
            const id = req.params.id

            const data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                phone_number: req.body.phone_number,
                joined_date: req.body.joined_date,
                status: req.body.status,
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                start_work_time: req.body.start_work_time,
                end_work_time: req.body.end_work_time,
                monthly_salary: req.body.monthly_salary,
            }

            const result = await this.services.employee.updateOneById(id, data)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    updateManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids
            delete req.body.ids

            const result = await this.services.employee.updateManyByIds(ids, req.body)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    deleteOneById = async (req, res) => {
        try {
            const id = req.params.id

            const result = await this.services.employee.deleteOneById(id)

            res.status(200).json(result)
        } catch (error) {
            this.logger.error(error)
            res.status(500).json(error)
        }
    }

    deleteManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids

            console.log(ids)

            await this.services.employee.deleteManyByIds(ids)

            res.status(204).json()
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }
}

export default EmployeeController