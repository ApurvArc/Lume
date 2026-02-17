import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Description = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center my-24 p-6 md:px-28"
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2">AI-Powered Image Suite</h1>
            <p className="text-gray-500 mb-8">Everything you need for stunning visuals</p>
            <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center">
                <img src={assets.sample_img_1} className="w-80 xl:w-96 rounded-lg" alt="" />
                <div>
                    <h2 className="text-3xl font-medium max-w-lg mb-4">One platform. Multiple AI tools. Endless creativity.</h2>
                    <p className=" text-gray-600 mb-4">
                        Lume brings together powerful AI tools to supercharge your creative workflow. Generate images from text descriptions, remove backgrounds with one click, upscale low-res images to crystal-clear HD, and clean up unwanted objects from photos.
                    </p>
                    <p className=" text-gray-600">
                        Whether you're a designer, content creator, or entrepreneur, Lume's AI suite handles it all. Each tool is powered by cutting-edge AI technology, delivering professional results in seconds — no design skills needed.
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default Description