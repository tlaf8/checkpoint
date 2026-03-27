import { useEffect, useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';

const imgs = [
  'src/assets/herta.png',
  'src/assets/sparkle.png'
]

export default function App() {
  const [scanText, setScanText] = useState<string>('Scanning...');
  const [img, setImg] = useState<string>(imgs[0]);

  const highlightCode = (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => {
    detectedCodes.forEach((detectedCode) => {
      const { cornerPoints } = detectedCode;

      ctx.save(); 

      ctx.strokeStyle = '#676767';
      ctx.lineWidth = 4;

      // flip horizontally
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
          {/* <img className='w-[10vw]' src={img} alt='hehe' /> */}
          {/* <p className='text-2xl font-bold bg-linear-to-r from-red-500 via-green-400 to-blue-500 bg-clip-text text-transparent'>bitch corner</p> */}
        </div>
        <div className='bg-gray-900 p-6 rounded-2xl flex flex-col items-center gap-4'>
          <div className='rounded-xl overflow-hidden border-2 border-gray-700'>
            <Scanner
              onScan={(result) => console.log(result)}
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

            <div className="absolute inset-0 pointer-events-none">
              {/* example: dark mask */}
              <div className="w-full h-full bg-black/30" />

              {/* example: center box */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-white rounded-xl" />
              </div>
            </div>
          </div>

          <p className='text-gray-300 text-xl'>
            {scanText}
          </p>
        </div>
      </div>
    </>
  );
}