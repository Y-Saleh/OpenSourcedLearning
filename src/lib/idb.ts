'use client';
import type { Submission } from '@/types';

const DB_NAME = 'OpenSourcedPracticeDB';
const DB_VERSION = 1;
const STORE_NAME = 'submissions';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB can only be used in the browser.'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject('Error opening IndexedDB.');
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('problemSlug', 'problemSlug', { unique: false });
        }
      };
    });
  }
  return dbPromise;
}

export async function addSubmission(submission: Omit<Submission, 'id'>): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(submission);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error adding submission:', request.error);
      reject('Could not add submission.');
    };
  });
}

export async function getAllSubmissions(): Promise<Submission[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Error getting submissions:', request.error);
      reject('Could not get submissions.');
    };
  });
}
