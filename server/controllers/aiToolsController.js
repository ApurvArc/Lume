import axios from 'axios'
import FormData from 'form-data'
import userModel from '../models/userModel.js'

// Controller function to remove background from image
export const removeBackground = async (req, res) => {
    try {
        const userId = req.userId

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (!req.file) {
            return res.json({ success: false, message: 'No image provided' })
        }

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }

        const formdata = new FormData()
        formdata.append('image_file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        })

        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formdata, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...formdata.getHeaders(),
            },
            responseType: 'arraybuffer',
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({ success: true, message: 'Background Removed', resultImage, creditBalance: user.creditBalance - 1 })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Controller function to upscale image
export const upscaleImage = async (req, res) => {
    try {
        const userId = req.userId
        const { targetWidth, targetHeight } = req.body

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (!req.file) {
            return res.json({ success: false, message: 'No image provided' })
        }

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }

        const formdata = new FormData()
        formdata.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        })
        formdata.append('target_width', targetWidth || 2048)
        formdata.append('target_height', targetHeight || 2048)

        const { data } = await axios.post('https://clipdrop-api.co/image-upscaling/v1', formdata, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...formdata.getHeaders(),
            },
            responseType: 'arraybuffer',
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({ success: true, message: 'Image Upscaled', resultImage, creditBalance: user.creditBalance - 1 })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Controller function to cleanup image (remove unwanted objects)
export const cleanupImage = async (req, res) => {
    try {
        const userId = req.userId

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (!req.files || !req.files.image || !req.files.mask) {
            return res.json({ success: false, message: 'Image and mask are required' })
        }

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }

        const imageFile = req.files.image[0]
        const maskFile = req.files.mask[0]

        const formdata = new FormData()
        formdata.append('image', imageFile.buffer, {
            filename: imageFile.originalname,
            contentType: imageFile.mimetype,
        })
        formdata.append('mask', maskFile.buffer, {
            filename: maskFile.originalname,
            contentType: maskFile.mimetype,
        })

        const { data } = await axios.post('https://clipdrop-api.co/cleanup/v1', formdata, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...formdata.getHeaders(),
            },
            responseType: 'arraybuffer',
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({ success: true, message: 'Image Cleaned', resultImage, creditBalance: user.creditBalance - 1 })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
