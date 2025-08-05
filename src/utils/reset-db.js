import {
  removeRxDatabase
} from 'rxdb';
import {
  getRxStorageDexie
} from 'rxdb/plugins/storage-dexie';

export async function resetMagicardtDatabase() {
  await removeRxDatabase('magicardt', getRxStorageDexie());
  console.log('💥 Base RxDB "magicardt" supprimée avec succès');
}