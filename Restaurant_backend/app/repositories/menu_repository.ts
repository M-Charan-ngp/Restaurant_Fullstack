import { paginationDataDto } from "#validators/common_validator";
import { MenuDataDto, UpdateMenuDataDto } from "#validators/menu_validator";
import MenuItem from "#models/menu_item";
import { cuid } from '@adonisjs/core/helpers'
import { readFile } from 'node:fs/promises'
import drive from '@adonisjs/drive/services/main'

export default class menuRepository{

    async listMenu(params:paginationDataDto){
        const items = await MenuItem.query()
            .where('is_available', true)
            .orderBy('category', 'asc')
            .paginate(params.page, params.limit)
        return items
    }
    async adminListMenu(params:paginationDataDto){
        const items = await MenuItem.query()
        .orderBy('category', 'asc')
        .paginate(params.page,params.limit)

        return items;
    }
    async createMenu(payload:MenuDataDto){
        const item = await MenuItem.create(payload)
        return item;
    }
    async updateMenu(payload:UpdateMenuDataDto){
        const id = payload.params.id
        const item = await MenuItem.findOrFail(id)
        const { params, ...data } = payload;
        item.merge(data)
        await item.save()
        return item;
    }
    async updateAvailability(id:number){
        const item = await MenuItem.findOrFail(id)
        item.isAvailable = !item.isAvailable
        await item.save()
        return item;
    }

    async updateMenuImage(image: any, id: number) {
        const item = await MenuItem.findOrFail(id)
        const fileName = `${cuid()}.${image.extname}`
        const key = `menuImages/${fileName}`
        const disk = drive.use('fs')
        const fileBuffer = await readFile(image.tmpPath)
        const oldKey = item.imagePath?.startsWith('/') 
            ? item.imagePath.slice(1) 
            : item.imagePath
        if (oldKey && typeof oldKey === 'string') {
            if (await disk.exists(oldKey)) {
            await disk.delete(oldKey)
            }
        }
        await disk.put(key, fileBuffer)
        item.imagePath = key
        await item.save()

        return item
    }
}