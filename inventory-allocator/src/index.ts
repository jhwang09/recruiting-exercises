import { Map, fromJS } from 'immutable';
import { InventoryAllocator } from "./inventoryAllocator";

class Startup {
    public static main(): number {
        let orderedItems = this.validateAndBootstrapOrderedItems({ 
            "apple": 5, 
            "banana": 5, 
            "orange": 5 
        });

        let warehouseMap = this.validateAndBootstrapWarehouseMap({ 
            "a": { "apple": 3 }, 
            "b": { "apple": 3 },
            "c": { "banana": 5 },
            "d": { "orange": 5 }
        });

        console.log('orderedItems=', orderedItems);
        console.log('warehouseMap=', warehouseMap);

        let allocator = new InventoryAllocator();
        let possibleShipments = allocator.calculatePossibleShipments(orderedItems, warehouseMap);

        console.log('possibleShipments=', possibleShipments);
        
        return 0;
    }

    private static validateAndBootstrapOrderedItems(data: Object): Map<string, number> {
        return fromJS(data);
    }

    private static validateAndBootstrapWarehouseMap(data: Object): Map<string, Map<string, number>> {
        return fromJS(data);
    }
}

Startup.main();