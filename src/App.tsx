import { useEffect, useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './scripts/db';
import Debug from './Debug'

const App = () => {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    const onScan = async (result: Array<IDetectedBarcode>) => {
        if (result && result.length > 0) {
            const barcode = result[0];

            try {
                setTimeout(() => {
                    setShowOverlay(false);
                }, 500);

                setShowOverlay(true);

                await db.scans.add({
                    rawValue: barcode.rawValue,
                    timestamp: new Date(),
                });

                console.table(await db.scans.toArray());
            } catch(err) {
                console.error('Failed to save scan:', err);
            }
        }
    };

    const highlightCode = (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => {
        detectedCodes.forEach((detectedCode) => {
            const { cornerPoints } = detectedCode;

            ctx.save();

            ctx.strokeStyle = '#676767';
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
            <div className='bg-gray-800 w-screen h-screen flex items-center justify-center'>
                <div className='absolute w-[20vw] top-0 left-0 flex flex-col items-center opacity-20'>
                    <Debug />
                </div>
                <div className='bg-gray-900 p-6 rounded-2xl flex flex-col items-center gap-4'>
                    <div className='relative rounded-xl overflow-hidden border-2 border-gray-700'>
                        <AnimatePresence>
                            {showOverlay && (
                                <motion.div className='absolute inset-0 bg-green-500/32 z-10 flex items-center justify-center'
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, }}>
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
                </div>
            </div>
        </>
    );
}

export default App;