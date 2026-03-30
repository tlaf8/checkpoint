import { type Dispatch, type SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SideMenuProps {
    showSideMenu: boolean;
    setShowSideMenu: Dispatch<SetStateAction<boolean>>
}

const SideMenu = ({ showSideMenu, setShowSideMenu }: SideMenuProps) => {
    return (
        <>
            {!showSideMenu && (
                <button
                    className='fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-gray-400/20 cursor-pointer'
                    onClick={() => setShowSideMenu(true)}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='w-5 h-5 text-gray-400'
                    >
                        <line x1='4' y1='6' x2='20' y2='6' />
                        <line x1='4' y1='12' x2='20' y2='12' />
                        <line x1='4' y1='18' x2='20' y2='18' />
                    </svg>
                </button>
            )}

            <AnimatePresence>
                {showSideMenu && (
                    <motion.div
                        key='sidebar-menu'
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        style={{ willChange: 'transform' }}
                        className='fixed top-0 left-0 h-screen w-72 bg-gray-700 z-50 shadow-2xl'
                    >
                        <div className='flex justify-end p-4'>
                            <button 
                                className='p-2 rounded-lg cursor-pointer hover:bg-red-500/35 transition-colors' 
                                onClick={() => setShowSideMenu(false)}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='3'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='w-5 h-5 text-gray-400'
                                >
                                    <line x1='18' y1='6' x2='6' y2='18' />
                                    <line x1='6' y1='6' x2='18' y2='18' />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default SideMenu;