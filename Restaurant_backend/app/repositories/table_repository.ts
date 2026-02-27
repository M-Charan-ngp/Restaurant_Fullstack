import Table from '#models/table'
import { paginationDataDto } from '#validators/common_validator'
import { tableDataDto, UpdateTableDataDto } from '#validators/table_validator'

export default class tableRepository{

    async listTables(params:paginationDataDto){
        const tables = await Table.query()
              .where('is_available', true)
              .orderBy('table_number', 'asc')
              .paginate(params.page, params.limit)
        return tables
    }

    async adminListTables(params:paginationDataDto){
        const tables = await Table.query()
                .orderBy('table_number', 'asc')
                .paginate(params.page, params.limit)
        return tables
    }

    async createTable(payload:tableDataDto){
        const table = await Table.create(payload)
        return table
    }

    async updateTable(payload:UpdateTableDataDto){
        const table = await Table.findOrFail(payload.params.id)
        table.merge(payload)
        await table.save()
        return table;
    }

    async toggleAvailbilityStatus(id:number){
        const table = await Table.findOrFail(id)
        table.isAvailable = !table.isAvailable;
        await table.save()
        return table
    }
}