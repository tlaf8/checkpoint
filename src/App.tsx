import { useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'motion/react';
import { db, type Scan } from './scripts/db';
import SideMenu from './SideMenu'

const App = () => {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    const onScan = async (result: Array<IDetectedBarcode>) => {
        if (result && result.length === 0) return;

        try {
            setTimeout(() => {
                setShowOverlay(false);
            }, 500);

            setShowOverlay(true);

            await db.scans.add({
                rawValue: result[0].rawValue,
                timestamp: new Date(),
            });
        } catch(err) {
            console.error('Failed to save scan:', err);
        }
    };

    const exportToCSV = async () => {
        const allScans: Array<Scan> = await db.scans.toArray();

        if (allScans.length === 0) {
            alert('No data to export.');
            return;
        }

        const headers = ['Entry ID', 'Content', 'Date', 'Time'];
        const csvRows = allScans.map(scan => {
            return [
                scan.id,
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

    const clearHistory = async () => {
        if (confirm('Do you want to delete all scans? This cannot be undone.')) {
            try {
                await db.scans.clear();
            } catch (error) {
                console.error('Failed to clear database:', error);
            }
        }
    };

    const highlightCode = (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => {
        detectedCodes.forEach((detectedCode) => {
            const { cornerPoints } = detectedCode;

            ctx.save();

            ctx.strokeStyle = '#0a0';
            ctx.lineWidth = 4;

            ctx.scale(-1, 1);
            ctx.translate(-ctx.canvas.width, 0);

            ctx.beginPath();
            ctx.moveTo(cornerPoints[0].x, cornerPoints[0].y);

            for (let i = 1; i < cornerPoints.length; i++) {
                ctx.lineTo(cornerPoints[i].x, cornerPoints[i].y);
            }

            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        });
    };

    return (
        <>
            <div className='bg-gray-800 w-screen h-screen flex flex-col items-center justify-center'>
                <SideMenu />
                <div className='bg-gray-900 p-6 rounded-2xl flex flex-col items-center gap-4'>
                    <div className='relative rounded-xl overflow-hidden border-2 border-gray-700'>
                        <AnimatePresence>
                            {showOverlay && (
                                <motion.div className='absolute inset-0 bg-green-500/32 z-10 flex items-center justify-center'
                                initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={'w-32 h-32 text-green-500 transition-transform duration-200 ease-out transform scale-100'}
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Scanner
                            onScan={onScan}
                            onError={(error) => console.error(error)}
                            components={{
                                tracker: highlightCode,
                                finder: false,
                            }}
                            styles={{
                                container: {
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: '50vh'
                                },
                                video: {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scaleX(-1)'
                                }
                            }}
                            sound={true}
                            scanDelay={100}
                        />
                    </div>
                    <button className='p-3 cursor-pointer bg-gray-800 border-gray-700 text-gray-400 border-2 rounded-xl hover:bg-gray-700 transition duration-200' onClick={exportToCSV}>Export</button>
                </div>
                <div className='text-gray-700 absolute bottom-1'>
                   github/tlaf8
                </div>
            </div>
        </>
    );
}

export default App;