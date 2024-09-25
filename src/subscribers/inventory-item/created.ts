import { Logger, MedusaContainer, type SubscriberConfig } from "@medusajs/medusa";
import { Modules } from '@medusajs/utils'
import { IInventoryService, IStockLocationService } from '@medusajs/types'

export default async function inventoryItemCreatedHandler({ event, container }) {
  const logger: Logger = container.resolve("logger");

  try {
    const inventoryItemId = event.data.id;
    if (!inventoryItemId) return

    await mappingInventoryItemToStockLocation(container, inventoryItemId)

    logger.info("Inventory Item event received");
  } catch (error) {
    logger.error(`Error Inventory Item , error: ${error.message}`, error);
  }
}

export const config: SubscriberConfig = {
  event: [ 'inventory-item-created' ],
  context: {
    subscriberId: "inventory-item-created",
  }
};

const mappingInventoryItemToStockLocation = async (
  container: MedusaContainer,
  inventoryItemId: string,
) => {
  const logger: Logger = container.resolve("logger");
  const stockLocationService: IStockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const inventoryService: IInventoryService = container.resolve(Modules.INVENTORY)

  try {
    const [ inventoryLevel ] = await inventoryService.listInventoryLevels({
      inventory_item_id: inventoryItemId,
    }, { take: 1 })

    if (inventoryLevel) return

    const [ stockLocation ] = await stockLocationService.listStockLocations({}, {
      take: 1,
    })

    if (!stockLocation) {
      logger.error("Stock Location not found")
      return
    }

    // mapping Stock Location automatically
    await inventoryService.createInventoryLevels({
      inventory_item_id: inventoryItemId,
      location_id: stockLocation.id,
      stocked_quantity: 0,
    })

  } catch (e) {
    logger.error(`Error mapping inventory item to stock location, error: ${e.message}`, e)
  }
}
