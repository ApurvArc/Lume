import express from 'express'
import multer from 'multer'
import { removeBackground, upscaleImage, cleanupImage } from '../controllers/aiToolsController.js'
import authUser from '../middlewares/auth.js'

const aiToolsRouter = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

aiToolsRouter.post('/remove-bg', authUser, upload.single('image'), removeBackground)
aiToolsRouter.post('/upscale', authUser, upload.single('image'), upscaleImage)
aiToolsRouter.post('/cleanup', authUser, upload.fields([{ name: 'image' }, { name: 'mask' }]), cleanupImage)

export default aiToolsRouter
