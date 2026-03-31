import { useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'motion/react';
import { Buffer } from 'buffer';
import { db } from './scripts/db';
import SideMenu from './SideMenu';

const App = () => {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [showSideMenu, setShowSideMenu] = useState<boolean>(false);

    const onScan = async (result: Array<IDetectedBarcode>) => {
        if (!result?.length) return;
        try {
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 500);

            await db.scans.add({
                rawValue: Buffer.from(result[0].rawValue, 'base64').toString('utf8'),
                timestamp: new Date(),
            });
        } catch(err) {
            console.error('Failed to save scan:', err);
        }
    };

    const highlightCode = (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => {
        detectedCodes.forEach((detectedCode) => {
            const { cornerPoints } = detectedCode;
            ctx.save();
            ctx.strokeStyle = '#0a0';
            ctx.lineWidth = 4;
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
        <div className='bg-gray-800 w-screen h-svh flex flex-col items-center justify-center'>
            <SideMenu showSideMenu={showSideMenu} setShowSideMenu={setShowSideMenu}/>
            <div className='bg-gray-900 p-6 rounded-xl flex flex-col items-center justify-center w-[85vmin] h-[85vmin]'>
                <div className='relative rounded-xl overflow-hidden border-2 border-gray-700 bg-black w-full h-full'>
                    <AnimatePresence>
                        {showOverlay && (
                            <motion.div className='absolute inset-0 bg-green-500/30 z-10 flex items-center justify-center'
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' className='w-32 h-32 text-green-500'>
                                    <polyline points='20 6 9 17 4 12' />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Scanner
                        onScan={onScan}
                        onError={(error) => console.error(error)}
                        components={{ tracker: highlightCode, finder: false }}
                        styles={{
                            container: { width: '100%', height: '100%' },
                            video: { width: '100%', height: '100%', objectFit: 'cover' }
                        }}
                        constraints={{facingMode: 'front'}}
                        paused={showSideMenu}
                        sound={true}
                        scanDelay={100}
                    />
                </div>
            </div>

            <div className='text-gray-700 absolute bottom-3 text-xs'>
               github/tlaf8
            </div>
        </div>
    );
}

export default App;