class Repository {
    constructor(knex, tableName) {
        this.knex = knex
        this.tableName = tableName
    }

    createOne = async (data, returnFields) => {
        try {
            const [result] = await this.knex(this.tableName).insert(data, returnFields)
            return result
        } catch (error) {
            throw error
        }
    }

    updateOne = async (query, data, returnFields) => {
        try {
            const [result] = await this.knex(this.tableName).modify(query).update(data, returnFields)
            return result
        } catch (error) {
            throw error
        }
    }

    updateOneById = async (id, data, returnFields) => {
        try {
            const [result] = await this.knex(this.tableName).where('id', id).update(data, returnFields)
            return result
        } catch (error) {
            throw error
        }
    }

    updateManyByIds = async (ids, data, returnFields) => {
        try {
            const result = await this.knex(this.tableName).whereIn('id', ids).update(data, returnFields)
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    deleteOneById = async (id) => {
        try {
            await this.knex(this.tableName).where('id', id).del()
        } catch (error) {
            throw error
        }
    }

    deleteManyByIds = async (ids) => {
        try {
            await this.knex(this.tableName).whereIn('id', ids).del()
        } catch (error) {
            throw error
        }
    }

    getOneById = async (id) => {
        try {
            const [result] = await this.knex(this.tableName).where('id', id)
            return result
        } catch (error) {
            throw error
        }
    }

    getOne = async (query) => {
        try {
            const [result] = await this.knex(this.tableName).modify(query)
            return result
        } catch (error) {
            throw error
        }
    }

    getMany = async (query, params) => {
        try {
            if (!params.limit) params.limit = null
            if (!params.offset) params.offset = null
            if (!params.orderBy) params.orderBy = 'id'
            if (!params.order) params.order = "asc"

            const result = await this.knex(this.tableName)
                .modify(query)
                .modify(qb => {
                    if (params.limit) qb.limit(params.limit)
                    if (params.offset) qb.offset(params.offset)
                    if (params.orderBy) qb.orderBy(params.orderBy, params.order)
                })

            const [count] = await this.knex(this.tableName)
                .modify(query)
                .clearSelect()
                .count()

            return { result, count }
        } catch (error) {
            throw error
        }
    }
}

export default Repository