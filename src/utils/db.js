import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';

addRxPlugin(RxDBQueryBuilderPlugin);

const cardSchema = {
  title: 'My Magicardt',
  description: 'Schema for a card in the Magicardt cart',
  version: 0,
  type: 'object',
  primaryKey: 'card_id',
  properties: {
    card_id: { type: 'string', maxLength: 100 },
    card_image: { type: 'string' },
    card_image_hd: { type: 'string' },
    card_name: { type: 'string' },
    card_price: { type: 'string' },
    card_title: { type: 'string' },
    set_icon: { type: 'string' },
    set_name: { type: 'string' }
  },
  required: [
    "card_id",
    "card_image",
    "card_image_hd",
    "card_name",
    "card_price",
    "card_title",
    "set_icon",
    "set_name"
  ],
  additionalProperties: false,
  indexes: ['card_name']
};

let dbPromise = null;

/**
 * IndexedDB
 */
export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = createRxDatabase({
      name: 'magicardt',
      storage: getRxStorageDexie()
    }).then(async db => {
      await db.addCollections({
        cards: {
          schema: cardSchema
        }
      });
      return db;
    });
  }
  return dbPromise;
}