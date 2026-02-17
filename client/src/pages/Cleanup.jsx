import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'

const Cleanup = () => {

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const [brushSize, setBrushSize] = useState(20)

    const canvasRef = useRef(null)
    const maskCanvasRef = useRef(null)
    const imgRef = useRef(null)

    const { backendUrl, token, loadCreditsData, user, setShowLogin } = useContext(AppContext)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
            setResultImage(null)
        }
    }

    useEffect(() => {
        if (preview && canvasRef.current && maskCanvasRef.current) {
            const img = new Image()
            img.onload = () => {
                const maxW = 500
                const scale = Math.min(maxW / img.width, 1)
                const w = img.width * scale
                const h = img.height * scale

                canvasRef.current.width = w
                canvasRef.current.height = h
                maskCanvasRef.current.width = img.width
                maskCanvasRef.current.height = img.height

                const ctx = canvasRef.current.getContext('2d')
                ctx.drawImage(img, 0, 0, w, h)

                const maskCtx = maskCanvasRef.current.getContext('2d')
                maskCtx.fillStyle = 'black'
                maskCtx.fillRect(0, 0, img.width, img.height)

                imgRef.current = img
            }
            img.src = preview
        }
    }, [preview])

    const getCanvasCoords = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }

    const startDraw = (e) => {
        setIsDrawing(true)
        draw(e)
    }

    const draw = (e) => {
        if (!isDrawing || !canvasRef.current || !imgRef.current) return

        const { x, y } = getCanvasCoords(e)
        const ctx = canvasRef.current.getContext('2d')

        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'
        ctx.beginPath()
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
        ctx.fill()

        const scaleX = imgRef.current.width / canvasRef.current.width
        const scaleY = imgRef.current.height / canvasRef.current.height
        const maskCtx = maskCanvasRef.current.getContext('2d')
        maskCtx.fillStyle = 'white'
        maskCtx.beginPath()
        maskCtx.arc(x * scaleX, y * scaleY, (brushSize / 2) * scaleX, 0, Math.PI * 2)
        maskCtx.fill()
    }

    const stopDraw = () => {
        setIsDrawing(false)
    }

    const handleCleanup = async () => {
        if (!user) {
            setShowLogin(true)
            return
        }
        if (!image || !maskCanvasRef.current) {
            toast.error('Please upload and mark areas to remove')
            return
        }

        setLoading(true)
        try {
            const maskBlob = await new Promise(resolve =>
                maskCanvasRef.current.toBlob(resolve, 'image/png')
            )

            const formData = new FormData()
            formData.append('image', image)
            formData.append('mask', maskBlob, 'mask.png')

            const { data } = await axios.post(backendUrl + '/api/ai-tools/cleanup', formData, {
                headers: { token },
            })

            if (data.success) {
                setResultImage(data.resultImage)
                loadCreditsData()
                toast.success('Image cleaned up!')
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
            <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>AI Image <span className='text-blue-600'>Cleanup</span></h1>
            <p className='text-gray-500 mb-8'>Draw over unwanted objects to remove them</p>

            {!preview && (
                <div
                    className='w-full max-w-lg border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300'
                    onClick={() => document.getElementById('cleanup-upload').click()}
                >
                    <div className='text-5xl mb-4'>🧹</div>
                    <p className='text-gray-500 text-lg'>Upload an image to clean up</p>
                    <p className='text-gray-400 text-sm mt-2'>Click to browse</p>
                    <input id='cleanup-upload' type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                </div>
            )}

            {preview && !resultImage && (
                <div className='flex flex-col items-center mt-4'>
                    <div className='flex items-center gap-4 mb-4'>
                        <label className='text-sm text-gray-600'>Brush Size:</label>
                        <input
                            type='range'
                            min='5'
                            max='50'
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className='w-32'
                        />
                        <span className='text-sm text-gray-500'>{brushSize}px</span>
                    </div>
                    <p className='text-sm text-gray-400 mb-3'>Draw over areas you want to remove (shown in red)</p>
                    <canvas
                        ref={canvasRef}
                        className='rounded-lg shadow-md cursor-crosshair border'
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                    />
                    <canvas ref={maskCanvasRef} className='hidden' />
                </div>
            )}

            {resultImage && (
                <div className='text-center mt-4'>
                    <p className='text-sm text-gray-500 mb-2 font-medium'>Cleaned Result</p>
                    <img src={resultImage} alt='Cleaned' className='max-w-md rounded-lg shadow-md' />
                </div>
            )}

            {loading && (
                <div className='mt-6 flex items-center gap-3'>
                    <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-gray-500'>Cleaning image...</p>
                </div>
            )}

            <div className='flex gap-3 mt-8'>
                {preview && !resultImage && !loading && (
                    <button onClick={handleCleanup} className='bg-black text-white px-10 py-3 rounded-full hover:scale-105 transition-all duration-300'>
                        Cleanup Image ✨
                    </button>
                )}
                {resultImage && (
                    <>
                        <a href={resultImage} download='cleaned.png' className='bg-black text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300'>
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

export default Cleanup
