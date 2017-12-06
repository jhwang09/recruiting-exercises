import { Map, Set } from 'immutable';

/**
 * InventoryAllocator
 */
export class InventoryAllocator {

    /**
     * Calculate and return all possible shipment configurations
     * 
     * @param orderedItems - Map of ordered items with item name as key, quantity as value
     * @param warehouseMap - Map of warehouse name to its item quantity map
     */
    public calculatePossibleShipments(
        orderedItems: Map<string, number>, 
        warehouseMap: Map<string, Map<string, number>>
    ): Map<string, Map<string, number>>[] {

        if (!orderedItems || !warehouseMap || orderedItems.isEmpty() || warehouseMap.isEmpty()) {
            return []; 
        }

        return this.recursiveCalculate(
            '', 
            Map<string, number>(), 
            orderedItems, 
            warehouseMap, 
            Map<string, Map<string, number>>()
        ).toArray();
    }

    /**
     * Main recursive function to calculate different shipment configurations
     */
    private recursiveCalculate(
        warehouseName: string,
        warehouseItems: Map<string, number>,
        remainOrderedItems: Map<string, number>, 
        remainWarehouseMap: Map<string, Map<string, number>>,
        allocationMap: Map<string, Map<string, number>>
    ): Set<Map<string, Map<string, number>>> {

        // looping through non-allocated ordered items and try to allocate 
        // items from current warehouse
        remainOrderedItems.entrySeq().forEach(([item, qty]) => {
            
            let warehouseQty = warehouseItems.get(item, 0);
            let alloactedQty = 0;

            // this warehouse has enough qty to fulfill for this item
            if (warehouseQty >= qty) {
                remainOrderedItems = remainOrderedItems.remove(item);
                alloactedQty = qty;
            
            // this warehouse does not have enough qty
            } else {
                let newQty = qty - warehouseQty;
                remainOrderedItems = remainOrderedItems.set(item, newQty);
                alloactedQty = warehouseQty;
            }

            // only record allocation when we actually have alloacted qty
            if (alloactedQty > 0) {
                allocationMap = this.updateAllocationMap(allocationMap, warehouseName, item, alloactedQty);
            }
        });

        // use a set so we don't need to worry about duplicate configurations
        let resultSet = Set<Map<string, Map<string, number>>>();

        // this warehouse may complete the order return the allocationMap if it is not empty
        if (remainOrderedItems.isEmpty()) {
            return allocationMap.isEmpty() ? resultSet : resultSet.add(allocationMap);
        }

        remainWarehouseMap.map((itemMap, warehouse) => {
            let result = this.recursiveCalculate(
                warehouse, 
                itemMap, 
                remainOrderedItems, 
                remainWarehouseMap.remove(warehouse), // remove itself from the remainWarehouseMap
                allocationMap
            );

            resultSet = resultSet.merge(result);
        });

        return resultSet;
    }

    private updateAllocationMap(
        allocationMap: Map<string, Map<string, number>>, 
        warehouseName: string, 
        item: string, 
        count: number
    ): Map<string, Map<string, number>> {
        let warehouseAllocation = allocationMap.get(warehouseName, Map<string, number>());
        warehouseAllocation = warehouseAllocation.set(item, count);
        return allocationMap.set(warehouseName, warehouseAllocation);
    }

}