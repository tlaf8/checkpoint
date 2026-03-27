import { useEffect, useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import Debug from './Debug'

const App = () => {
    const [scanned, setScanned] = useState<string | null>(null);

    const onScan = (result: Array<IDetectedBarcode>) => {
        if (result && result.length > 0) {
            console.log(result);
            setScanned(result[0].rawValue);
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
                <div className='absolute top-0 left-0 flex flex-col items-center '>
                    <Debug />
                </div>
                <div className='bg-gray-900 p-6 rounded-2xl flex flex-col items-center gap-4'>
                    <div className='rounded-xl overflow-hidden border-2 border-gray-700'>
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

                    <p className='text-gray-300 text-xl'>
                        {scanned ? (scanned) : ('Scanning...')}
                    </p>
                </div>
            </div>
        </>
    );
}

export default App;