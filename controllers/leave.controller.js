class LeaveController {
    constructor({ logger, services, error }) {
        this.logger = logger
        this.services = services
        this.error = error
    }

    getOneById = async (req, res) => {
        try {
            const id = req.params.id

            const result = await this.services.leave.getOneById(id)

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
                employee_id: req.query.employee_id,
                mindate: req.query.mindate,
                maxdate: req.query.maxdate,
                status: req.query.status,
                leave_type: req.query.leave_type,
                span: req.query.span,
                orderBy: req.query.orderBy,
                order: req.query.order
            }

            const result = await this.services.leave.getMany(params)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    createOne = async (req, res) => {
        try {
            const employeeId = req.body.employee_id
            const date = req.body.date
            const remark = req.body.remark
            const leaveType = req.body.leave_type
            const status = req.body.status
            const span = req.body.span

            if (!employeeId || !date || !leaveType || !status || !span) {
                res.status(400).json({
                    error: 'Missing required fields.'
                })
                return;
            }

            const params = {
                mindate: date,
                maxdate: date,
                employee_id: employeeId
            }

            const { result: leaves } = await this.services.leave.getMany(params)

            if (leaves.length >= 1) {
                res.status(400).json({
                    error: 'Found conflicting leave record.'
                })
                return
            }

            const result = await this.services.leave.createOne(employeeId, date, span, leaveType, remark)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    updateOneById = async (req, res) => {
        try {
            const id = req.params.id

            const data = {
                date: req.body.date ? req.body.date : undefined,
                remark: req.body.remark ? req.body.remark : undefined,
                leave_type: req.body.leave_type ? req.body.leave_type : undefined,
                status: req.body.status ? req.body.status : undefined,
                span: req.body.span ? req.body.span : undefined
            }

            const result = await this.services.leave.updateOneById(id, data)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    updateManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids

            const data = {
                date: req.body.data.date ? req.body.data.date : undefined,
                remark: req.body.data.remark ? req.body.data.remark : undefined,
                leave_type: req.body.data.leave_type ? req.body.data.leave_type : undefined,
                status: req.body.data.status ? req.body.data.status : undefined,
                span: req.body.data.span ? req.body.data.span : undefined,
            }

            const result = await this.services.leave.updateManyByIds(ids, data)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    deleteOneById = async (req, res) => {
        try {
            const id = req.params.id

            const { result: leave } = await this.services.leave.getOneById(id)

            if (leave.status === "approved") {
                res.status(400).json({
                    error: 'Cannot delete an approved leave!'
                })
                return;
            }

            await this.services.leave.deleteOneById(id)

            res.status(204).json()
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    deleteManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids

            const { result: leaves } = await this.services.leave.getManyByIds(ids)

            if (leaves.length > 0) {
                for (let i = 0; i < leaves.length; i++) {
                    if (leaves[i].status === "approved") {
                        res.status(400).json({ error: "Cannot delete an approved leave" })
                        return
                    }
                }
            }

            await this.services.leave.deleteManyByIds(ids)

            res.status(204).json()
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    apply = async (req, res) => {
        try {
            const employee = req.user
            const reason = req.body.reason
            const from = req.body.from
            const to = req.body.to
            const duration = req.body.duration
            const type = req.body.type

            const result = await this.services.leave.createOne(employee.id, reason, from, to, duration, type)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    applyMany = async (req, res) => {
        try {
            const employee = req.user
            const leaves = req.body.leaves

            const result = await Promise.all(
                leaves.map(el => this.services.leave.createOne(employee.id, el.date, el.span, el.leave_type, el.remark))
            )

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }
}

export default LeaveController