import Dexie, { type EntityTable } from 'dexie';

interface Scan {
    id?: number; //primary key
    rawValue: string;
    timestamp: Date;
}

const db = new Dexie('LibraryEntries') as Dexie & {
    scans: EntityTable<Scan, 'id'>;
}

db.version(1).stores({
    scans: '++id, rawValue, timestamp'
});

export { db };
export type { Scan };
