import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const toolsData = [
    {
        title: 'Background Remover',
        description: 'Remove backgrounds from any image instantly with AI precision.',
        icon: '🖼️',
        path: '/remove-bg',
        color: 'from-purple-500 to-pink-500',
    },
    {
        title: 'Image Upscaler',
        description: 'Enhance low-resolution images to crystal-clear high quality.',
        icon: '🔍',
        path: '/upscale',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        title: 'Image Cleanup',
        description: 'Remove unwanted objects from your photos seamlessly.',
        icon: '🧹',
        path: '/cleanup',
        color: 'from-green-500 to-teal-500',
    },
]

const AiTools = () => {

    const { user, setShowLogin } = useContext(AppContext)
    const navigate = useNavigate()

    const onClickHandler = (path) => {
        if (user) {
            navigate(path)
            scrollTo(0, 0)
        } else {
            scrollTo(0, 0)
            setShowLogin(true)
        }
    }

    return (
        <motion.div
            className='flex flex-col items-center justify-center my-24'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>AI-Powered Tools</h1>
            <p className='text-gray-500 mb-10'>Explore our suite of AI features</p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl'>
                {toolsData.map((tool, index) => (
                    <motion.div
                        key={index}
                        className='bg-white rounded-xl shadow-md border p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group flex flex-col h-full'
                        whileHover={{ y: -5 }}
                    >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            {tool.icon}
                        </div>
                        <h3 className='text-lg font-semibold mb-2'>{tool.title}</h3>
                        <p className='text-gray-500 text-sm mb-4 leading-relaxed flex-grow'>{tool.description}</p>
                        <button
                            onClick={() => onClickHandler(tool.path)}
                            className='text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center gap-1'
                        >
                            Try Now <span className='group-hover:translate-x-1 transition-transform'>→</span>
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default AiTools
