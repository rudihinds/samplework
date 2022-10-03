const { omit } = require('lodash');
module.exports = {
  async upsertArray({ parentInstance, foreignKey, inputArray, relationshipName, ItemModel, filter = {} }) {
    // Delete missing items
    await parentInstance[relationshipName]()
      .whereNotIn(
        ['id', foreignKey],
        inputArray.filter((item) => item.id).map((item) => [item.id, parentInstance.id])
      )
      .andWhere(filter)
      .delete();

    // Upsert items in array
    if (inputArray.length > 0) {
      await Promise.all(
        inputArray.map(async (item) => {
          // If has id, then update
          if (item.id) {
            return await parentInstance[relationshipName]()
              .where('id', item.id)
              .update(omit(item, ['id']));
          } else {
            // Else create new model and insert
            const newItem = new ItemModel();
            newItem.merge(filter);
            newItem.merge(omit(item, ['id']));
            return await parentInstance[relationshipName]().save(newItem);
          }
        })
      );
    }
  }
};
