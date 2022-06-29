class PayrollController {
    constructor({ logger, services, error }) {
        this.logger = logger
        this.services = services
        this.error = error
    }

    createOne = async (req, res) => {
        try {
            const employeeId = req.body.employee_id
            const dateFrom = req.body.date_from
            const dateTo = req.body.date_to
            const payday = req.body.payday

            if (!employeeId || !dateFrom || !dateTo || dateFrom > dateTo) {
                res.status(400).json(this.error.invalid_input)
                return
            }

            const overlappedPayroll = await this.services.payroll.checkIfPayrollOverlapped(employeeId, dateFrom, dateTo)

            if (overlappedPayroll.result.length > 0) {
                res.status(400).json({ error: "Already created payroll for this period" })
                return
            }

            const result = await this.services.payroll.createOne(employeeId, dateFrom, dateTo, payday)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    deleteOneById = async (req, res) => {
        try {
            const id = req.params.id

            const result = await this.services.payroll.getOneById(id)

            if (result) {
                if (result.status === "approved") {
                    res.status(400).json({ error: "Cannot delete a confirmed payroll!" })
                }
                return;
            }

            await this.services.payroll.deleteOneById(id)

            res.status(401).json()
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    deleteManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids

            const { result: result } = await this.services.payroll.getMany({
                ids: ids,
                status: "approved"
            })

            for (let i = 0; i < result.length; i++) {
                if (result.status === "approved") {
                    res.status(400).json({ error: "Cannot delete a confirmed payroll!" })
                }
                return;
            }

            await this.services.payroll.deleteManyByIds(ids)

            res.status(204).json()
        } catch (error) {
            console.log(error)
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
                status: req.query.status,
                mindate: req.query.mindate,
                maxdate: req.query.maxdate,
                minamount: req.query.minamount,
                maxamount: req.query.maxamount,
                orderBy: req.query.orderBy,
                order: req.query.order
            }

            const result = await this.services.payroll.getMany(params)

            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.error.internal_server_error)
        }
    }

    getOneById = async (req, res) => {
        try {
            const id = req.params.id

            const result = await this.services.payroll.getOneById(id)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }

    updateOneById = async (req, res) => {
        try {
            const id = req.params.id

            const result = await this.services.payroll.updateOneById(id, req.body)

            res.status(200).json(result)
        } catch (error) {
            this.logger.error(error)
            res.status(500).json(error)
        }
    }

    updateManyByIds = async (req, res) => {
        try {
            const ids = req.body.ids
            delete req.body.ids

            const result = await this.services.payroll.updateManyByIds(ids, req.body)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(this.error.internal_server_error)
        }
    }
}

export default PayrollController