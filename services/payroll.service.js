class PayrollService {
    constructor(models, repositories) {
        this.models = models
        this.repositories = repositories
    }

    createOne = async (employeeId, dateFrom, dateTo, payday) => {
        try {
            const workingDaysCounter = (year, month) => {
                const calendarDays = new Date(year, month + 1, 0).getDate();
                let weekendDays = 0;
                let day = 1;
                let date = new Date(year, month, day);
                while (date.getMonth() === month) {
                    if (date.getDay() === 0 || date.getDay() === 6) {
                        weekendDays = weekendDays + 1;
                    }
                    day = day + 1;
                    date = new Date(year, month, day)
                }
                return calendarDays - weekendDays
            }

            let amount = 0;

            const employee = await this.repositories.employee.getOneById(employeeId)

            const attdQuery = (qb) => {
                qb.whereBetween('date', [dateFrom, dateTo])
                qb.andWhere('employee_id', employeeId)
            }

            const { result: attdList } = await this.repositories.attendance.getMany(attdQuery, {})

            for (let i = 0; i < attdList.length; i++) {
                const workingDays = workingDaysCounter(attdList[i].date.getFullYear(), attdList[i].date.getMonth())
                let dailySalary = employee.monthly_salary / workingDays
                amount = amount + dailySalary
            }

            const leaveQuery = (qb) => {
                qb.select(['date', 'leave_type', 'status'])
                qb.whereBetween('date', [dateFrom, dateTo])
                qb.andWhere('status', 'approved')
                qb.andWhere('employee_id', employeeId)
            }

            const { result: leaveList } = await this.repositories.leave.getMany(leaveQuery, {})

            for (let i = 0; i < leaveList.length; i++) {
                if (leaveList[i].type === "sick" || leaveList[i].status === "rejected" || leaveList[i].status === "pending") {
                    continue
                }

                if (leaveList[i].type === "personal") {
                    const workingDays = workingDaysCounter(leaveList[i].date.getFullYear(), leaveList[i].date.getMonth())
                    let dailySalary = employee.salary_monthly / workingDays

                    if (leaveList[i].span === "full_day") {
                        amount = amount - dailySalary
                    } else {
                        amount = amount - (dailySalary / 2)
                    }
                }
            }

            const payroll = this.models.payroll.create()

            payroll.employee_id = employeeId
            payroll.date_from = dateFrom
            payroll.date_to = dateTo
            payroll.payday = payday
            payroll.amount = amount

            const result = this.repositories.payroll.createOne(payroll, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    deleteOneById = async (id) => {
        try {
            await this.repositories.payroll.deleteOneById(id)
        } catch (error) {
            throw error
        }
    }

    deleteManyByIds = async (ids) => {
        try {
            await this.repositories.payroll.deleteManyByIds(ids)
        } catch (error) {
            throw error
        }
    }

    getOneById = async (id) => {
        try {
            const result = await this.repositories.payroll.getOneById(id)

            return result
        } catch (error) {
            throw error
        }
    }

    getMany = async (params) => {
        try {
            const ids = params.ids
            const offset = params.offset
            const limit = params.limit
            const orderBy = params.orderBy
            const order = params.order
            const employee_id = params.employee_id
            const status = params.status
            const mindate = params.mindate
            const maxdate = params.maxdate
            const minamount = params.minamount
            const maxamount = params.maxamount

            const query = (qb) => {
                qb.join('employee', 'payroll.employee_id', 'employee.id')
                qb.select(['payroll.id', 'payroll.employee_id', 'employee.firstname', 'employee.lastname', 'payroll.date_from', 'payroll.date_to', 'payroll.payday', 'payroll.amount', 'payroll.amount', 'payroll.status'])
                if (employee_id) qb.where('payroll.employee_id', '=', employee_id)
                if (ids) qb.whereIn('payroll.id', [...ids])
                if (status) qb.where('payroll.status', '=', status)
                if (mindate && maxdate) {
                    qb.whereBetween('payroll.date_from', [mindate, maxdate])
                    qb.whereBetween('payroll.date_to', [mindate, maxdate])
                    qb.whereBetween('payroll.payday', [mindate, maxdate])
                }
                if (minamount && maxamount) {
                    qb.whereBetween('payroll.amount', [minamount, maxamount])
                }
            }

            const result = await this.repositories.payroll.getMany(query, { offset, limit, orderBy, order })

            return result
        } catch (error) {
            throw error
        }
    }

    updateOneById = async (id, params) => {
        try {
            const status = params.status

            const data = {}
            if (status) data.status = status

            const result = await this.repositories.payroll.updateOneById(id, data, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    updateManyByIds = async (ids, params) => {
        try {
            const status = params.status

            const data = {}
            if (status) data.status = status

            const result = await this.repositories.payroll.updateManyByIds(ids, data, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    checkIfPayrollOverlapped = async (employee_id, starting_date, ending_date) => {
        try {
            const query = qb => {
                qb.select('id')
                qb.where('employee_id', employee_id)
                qb.andWhere(qb => {
                    qb.andWhere('date_from', '<=', ending_date)
                    qb.andWhere('date_to', '>=', starting_date)
                })
            }

            const result = await this.repositories.payroll.getMany(query, {})

            return result
        } catch (error) {
            throw error
        }
    }
}

export default PayrollService