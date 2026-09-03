import { Inspection } from '../types/inspection';

const DB_NAME = 'RentProofDB';
const DB_VERSION = 1;
const STORE_NAME = 'inspections';

class IndexedDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        if (!window.indexedDB) {
          reject(new Error('IndexedDB is not supported in this browser.'));
          return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return this.dbPromise;
  }

  async saveInspection(inspection: Inspection): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({
          ...inspection,
          updatedAt: new Date().toISOString()
        });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('IndexedDB write failed, falling back to localStorage:', err);
      try {
        const existing = this.getLocalStorageInspections();
        const index = existing.findIndex(i => i.id === inspection.id);
        if (index >= 0) {
          existing[index] = inspection;
        } else {
          existing.push(inspection);
        }
        localStorage.setItem(STORE_NAME, JSON.stringify(existing));
      } catch (lsErr) {
        console.error('LocalStorage backup save failed:', lsErr);
        throw new Error('Unable to save inspection due to browser storage limits.');
      }
    }
  }

  async getInspection(id: string): Promise<Inspection | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      const existing = this.getLocalStorageInspections();
      return existing.find(i => i.id === id) || null;
    }
  }

  async getAllInspections(): Promise<Inspection[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      return this.getLocalStorageInspections();
    }
  }

  async deleteInspection(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      const existing = this.getLocalStorageInspections().filter(i => i.id !== id);
      localStorage.setItem(STORE_NAME, JSON.stringify(existing));
    }
  }

  private getLocalStorageInspections(): Inspection[] {
    try {
      const raw = localStorage.getItem(STORE_NAME);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}

export const dbStorage = new IndexedDBStorage();
