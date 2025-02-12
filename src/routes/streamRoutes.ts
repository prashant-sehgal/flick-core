import { Router } from 'express'
import * as streamController from '../controllers/streamController'

const router = Router()

router.get('/:media', streamController.getMediaStream)

export default router
