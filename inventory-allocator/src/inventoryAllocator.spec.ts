import { InventoryAllocator } from './inventoryAllocator';
import { Map, fromJS } from 'immutable';
import { assert } from 'chai';
import 'mocha';

describe('InventoryAllocator', () => {

  const allocator = new InventoryAllocator();

  it('multiple warehouses, should return proper configurations', () => {
    let orderedItems = fromJS({ apple: 100, banana: 50, cherry: 33, milk: 1 });
    let result = allocator.calculatePossibleShipments(
      orderedItems, 
      fromJS({ 
        w1: { apple: 30, banana: 1, cherry: 33 }, 
        w2: { apple: 40, banana: 50 },
        w3: { apple: 5, banana: 33, milk: 10, cherry: 99 },
        w4: { apple: 30, banana: 22, milk: 99 },
        w5: { cherry: 10 },
      })
    );

    validateConfigurations(orderedItems, result);
  });

  it('two warehouses, match and has more, should return 2 configurations', () => {
    let orderedItems = fromJS({ apple: 5 });
    let result = allocator.calculatePossibleShipments(
      orderedItems, 
      fromJS({ w1: { apple: 3 }, w2: { apple: 3 }})
    );
    validateConfigurations(orderedItems, result);

    result = allocator.calculatePossibleShipments(
      orderedItems, 
      fromJS({ w1: { apple: 10, banana: 10 }, w2: { apple: 20, banana: 1 }})
    );
    validateConfigurations(orderedItems, result);
  });

  it('two warehouses, perfect match, should return 1 configuration', () => {
    let orderedItems = fromJS({ apple: 5 });
    let result = allocator.calculatePossibleShipments(
      orderedItems, 
      fromJS({ w1: { apple: 3 }, w2: { apple: 2 }})
    );
    validateConfigurations(orderedItems, result);

    result = allocator.calculatePossibleShipments(
      orderedItems, 
      fromJS({ w1: { apple: 1 }, w2: { apple: 4, banana: 1 }})
    );
    validateConfigurations(orderedItems, result);
  });

  it('two warehouses, no match, should return empty array', () => {
    let orderedItems = fromJS({ apple: 5 });
    let warehouseMap = fromJS({ w1: { apple: 1 }, w2: { banana: 1 }});

    let result = allocator.calculatePossibleShipments(orderedItems, warehouseMap);
    assert.lengthOf(result, 0);
  });

  it('one warehouse, match and has more items, should return 1 configuration', () => {
    let orderedItems = fromJS({ apple: 5 });
    let warehouseMap = fromJS({ w1: { apple: 10 }});

    validateOneWarehouse(allocator.calculatePossibleShipments(orderedItems, warehouseMap));
  });

  it('one warehouse, perfect match, should return 1 configuration', () => {
    let orderedItems = fromJS({ apple: 5 });
    let warehouseMap = fromJS({ w1: { apple: 5 }});

    validateOneWarehouse(allocator.calculatePossibleShipments(orderedItems, warehouseMap));
  });

  it('one warehouse, no match, should return empty array', () => {
    let orderedItems = fromJS({ apple: 5 });
    let warehouseMap = fromJS({ w1: { apple: 2 }});

    let result = allocator.calculatePossibleShipments(orderedItems, warehouseMap);
    assert.lengthOf(result, 0);
  });
  
  it('map with 0 values, should return empty array', () => {
    const orderedItems = fromJS({ apple: 0, banana: 0 });
    const warehouseMap = fromJS({ 
      aw: { apple: 0, banana: 0}, 
      banana: { apple: 0, banana: 0}
    });

    let result = allocator.calculatePossibleShipments(orderedItems, warehouseMap);
    assert.lengthOf(result, 0);
  });

  it('null/empty inputs, should return empty array', () => {
    const emptyOrderedItems = Map<string, number>();
    const emptyWarehouseMap = Map<string, Map<string, number>>();

    let result = allocator.calculatePossibleShipments(null, null);
    assert.lengthOf(result, 0);

    result = allocator.calculatePossibleShipments(emptyOrderedItems, emptyWarehouseMap);
    assert.lengthOf(result, 0);

    result = allocator.calculatePossibleShipments(null, emptyWarehouseMap);
    assert.lengthOf(result, 0);

    result = allocator.calculatePossibleShipments(emptyOrderedItems, null);
    assert.lengthOf(result, 0);
  });

});

// validate if all the configurations matches to orderedItems
function validateConfigurations(
  orderedItems: Map<string, number>, 
  results: Map<string, Map<string, number>>[]
) {
  results.map((configuration) => {
    let actualMap = Map<string, number>();
    configuration.valueSeq().forEach((itemMap) => {
      itemMap.entrySeq().forEach((entry) => {
        let item = entry[0];
        let qty = entry[1];
        actualMap = actualMap.set(item, actualMap.get(item, 0) + qty);
      });
    });

    assert.isTrue(orderedItems.equals(actualMap), 'configuration does not match origianl ordered items');
  });
}

function validateOneWarehouse(result: Map<string, Map<string, number>>[] ) {
  assert.lengthOf(result, 1);
  assert.isNotNull(result[0].get("w1"));
  assert.equal(result[0].get("w1").size, 1);
  assert.equal(result[0].get("w1").get("apple"), 5);
}