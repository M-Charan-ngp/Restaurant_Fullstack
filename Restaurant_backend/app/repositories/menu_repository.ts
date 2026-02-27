import { paginationDataDto } from "#validators/common_validator";
import { MenuDataDto, UpdateMenuDataDto } from "#validators/menu_validator";
import MenuItem from "#models/menu_item";

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
        const item = await MenuItem.findOrFail(payload.params.id)
        item.merge(payload)
        await item.save()
        return item;
    }
    async updateAvailability(id:number){
        const item = await MenuItem.findOrFail(id)
        item.isAvailable = !item.isAvailable
        await item.save()
        return item;
    }
}