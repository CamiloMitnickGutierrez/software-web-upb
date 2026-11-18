import {findByQrZone , updateZoneStatus} from "../models/zone.model.js"

export const getZoneByQrService = async (qrcode) => {

    const zone = await findByQrZone(qrcode)

    if (!zone){

        throw new Error("Zona o codigo qr invalido o no registrado")
    }

    return zone

}

export const updateStatusService = async (zoneId,status) => {

    return await updateZoneStatus(zoneId,status)
}