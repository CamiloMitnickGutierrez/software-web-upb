import { getZoneByQrService } from "../services/zone.service.js"


export const getZoneByQr = async (req,res) => {

    try {

        const {qrcode} = req.params
        const zone = await getZoneByQrService(qrcode)

        return res.status(200).json(zone)
        
    } catch (error) {

        return res.status(404).json({message:error.message})
        
    }
    
}