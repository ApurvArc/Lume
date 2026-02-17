import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'

const RemoveBg = () => {

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [loading, setLoading] = useState(false)

    const { backendUrl, token, loadCreditsData, user, setShowLogin } = useContext(AppContext)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
            setResultImage(null)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
            setResultImage(null)
        }
    }

    const handleRemoveBg = async () => {
        if (!user) {
            setShowLogin(true)
            return
        }
        if (!image) {
            toast.error('Please upload an image first')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/ai-tools/remove-bg', formData, {
                headers: { token },
            })

            if (data.success) {
                setResultImage(data.resultImage)
                loadCreditsData()
                toast.success('Background removed!')
            } else {
                toast.error(data.message)
                loadCreditsData()
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    const handleReset = () => {
        setImage(null)
        setPreview(null)
        setResultImage(null)
    }

    return (
        <motion.div className='min-h-[90vh] flex flex-col items-center justify-center py-10'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>AI Background <span className='text-blue-600'>Remover</span></h1>
            <p className='text-gray-500 mb-8'>Upload an image and remove the background instantly</p>

            {!preview && (
                <div
                    className='w-full max-w-lg border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300'
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('bg-upload').click()}
                >
                    <div className='text-5xl mb-4'>🖼️</div>
                    <p className='text-gray-500 text-lg'>Drag & drop an image here</p>
                    <p className='text-gray-400 text-sm mt-2'>or click to browse</p>
                    <input id='bg-upload' type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                </div>
            )}

            {preview && (
                <div className='flex flex-col md:flex-row gap-8 items-center mt-4'>
                    <div className='text-center'>
                        <p className='text-sm text-gray-500 mb-2 font-medium'>Original</p>
                        <img src={preview} alt='Original' className='max-w-xs rounded-lg shadow-md' />
                    </div>

                    {resultImage && (
                        <>
                            <div className='text-3xl text-gray-300'>→</div>
                            <div className='text-center'>
                                <p className='text-sm text-gray-500 mb-2 font-medium'>Background Removed</p>
                                <img src={resultImage} alt='Result' className='max-w-xs rounded-lg shadow-md bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%3E%3Crect%20width=%2210%22%20height=%2210%22%20fill=%22%23eee%22/%3E%3Crect%20x=%2210%22%20y=%2210%22%20width=%2210%22%20height=%2210%22%20fill=%22%23eee%22/%3E%3C/svg%3E")]' />
                            </div>
                        </>
                    )}
                </div>
            )}

            {loading && (
                <div className='mt-6 flex items-center gap-3'>
                    <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-gray-500'>Removing background...</p>
                </div>
            )}

            <div className='flex gap-3 mt-8'>
                {preview && !resultImage && !loading && (
                    <button onClick={handleRemoveBg} className='bg-black text-white px-10 py-3 rounded-full hover:scale-105 transition-all duration-300'>
                        Remove Background ✨
                    </button>
                )}
                {resultImage && (
                    <>
                        <a href={resultImage} download='removed-bg.png' className='bg-black text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300'>
                            Download
                        </a>
                        <button onClick={handleReset} className='border border-gray-400 text-gray-700 px-8 py-3 rounded-full hover:scale-105 transition-all duration-300'>
                            Try Another
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    )
}

export default RemoveBg
