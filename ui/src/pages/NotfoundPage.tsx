// -Path: 'ui\src\pages\NotfoundPage.tsx'
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { FaHouse, FaLeftLong } from 'react-icons/fa6';

export default function NotfoundPage() {
    // Variants สำหรับ Container (Stagger Children)
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.15,
            },
        },
    };

    // Variants สำหรับ Children แต่ละตัว
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    // Variants สำหรับ Floating Blobs
    const blobVariants: Variants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            transition: {
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
            },
        },
    };

    // Variants สำหรับ 404 Text Scaling
    const numberVariants: Variants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 15,
                duration: 0.8,
                stiffness: 200,
            },
        },
    };

    return (
        <div className="relative min-h-svh flex items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Background Animated Blobs with Framer Motion */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20"
                />
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    transition={{ delay: 1, duration: 7 }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20"
                />
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    transition={{ delay: 0.5, duration: 5 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-10"
                />
            </div>

            {/* Main Content with Stagger Animation */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-2xl mx-auto px-6 text-center"
            >
                {/* Animated 404 Text */}
                <motion.div variants={numberVariants} className="relative mb-8">
                    <h1 className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none tracking-tighter select-none bg-clip-text text-transparent bg-linear-to-r from-gray-800 via-gray-900 to-gray-800 dark:from-gray-200 dark:via-white dark:to-gray-200">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-2xl">
                        <h1 className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black">
                            404
                        </h1>
                    </div>
                </motion.div>

                {/* Message Section */}
                <motion.div variants={itemVariants} className="space-y-4 mb-10">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
                        Oops! Page not found
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        The page you are looking for might have been removed,
                        had its name changed, or is temporarily unavailable.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                        }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                        >
                            <FaHouse className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                        }}
                    >
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <FaLeftLong className="w-5 h-5" />
                            Go Back
                        </button>
                    </motion.div>
                </motion.div>

                {/* Help Text with subtle hover */}
                <motion.p
                    variants={itemVariants}
                    className="mt-8 text-sm text-gray-400 dark:text-gray-500"
                >
                    Need help?{' '}
                    <motion.a
                        href="/contact"
                        whileHover={{ x: 2 }}
                        className="text-gray-700 dark:text-gray-300 hover:underline inline-block"
                    >
                        Contact support
                    </motion.a>
                </motion.p>
            </motion.div>
        </div>
    );
}
