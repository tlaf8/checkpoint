import Dexie, { type EntityTable } from 'dexie';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Scan {
    id?: number; //primary key
    rawValue: string;
    timestamp: Date;
}

const db = new Dexie('LibraryEntries') as Dexie & {
    scans: EntityTable<Scan, 'id'>;
}

const clearHistory = async () => {
    if (confirm('Do you want to delete all scans? This cannot be undone.')) {
        try {
            await db.scans.clear();
        } catch (error) {
            console.error('Failed to clear database:', error);
        }
    }
};

const generateCSV = async () => {
    const allScans: Array<Scan> = await db.scans.toArray();

    if (allScans.length === 0) {
        alert('No data to export.');
        return;
    }

    const headers = ['Name', 'Date', 'Time'];
    const csvRows = allScans.map(scan => {
        return [
            `"${scan.rawValue.replace(/"/g, '""')}"`, 
            scan.timestamp.toLocaleDateString(),
            scan.timestamp.toLocaleTimeString()
        ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `scanner_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await clearHistory();
};

const generatePDF = async () => {
    const scanData = await db.scans.toArray();

    if (scanData.length === 0) {
        alert("No scans found to export!");
        return;
    }

    const doc = new jsPDF();

    autoTable(doc, {
        startY: 10,
        head: [['Name', 'Timestamp']],
        body: scanData.map(scan => [
            scan.rawValue,
            scan.timestamp.toLocaleString()
        ]),
        theme: 'striped',
        headStyles: { fillColor: [31, 41, 55] },
    });

    doc.save(`scans-${new Date().getTime()}.pdf`);

    await clearHistory();
};

db.version(1).stores({
    scans: '++id, rawValue, timestamp'
});

export { db, clearHistory, generateCSV, generatePDF };
export type { Scan };
