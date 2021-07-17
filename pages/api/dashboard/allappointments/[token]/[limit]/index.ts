import { NextApiHandler } from 'next'
import {verify} from 'jsonwebtoken'

// Models
import { Appointment } from '../../../../../../db/models/appointment'

// Typescripts
import { Iappointment } from '../../../../../../ts/appointment'

const allAppointments: NextApiHandler = async (req, res) => {

    // const {token, limit} = req.query as {token: string, limit: number}

    const token = req.query.token as string
    const skipCount = req.query.limit as string 
    // const convertedLimit = parseInt(limit)

    // console.log(token)
    // console.log(skipCount) 
    const verifiedToken = verify(token, process.env.JWT_KEY as string) as {id: string, iat: number}

    try {

        if (req.method === "GET") {

            if (!verifiedToken) {
                return res.json({
                    status: 'fail',
                    msg: 'Invalid Token.'
                })
            }

            const all = await Appointment.find() as Iappointment[]
            const allAppointmentsWithConfig = await Appointment.find().skip(parseInt(skipCount)).limit(5) as Iappointment[]
            // console.log(all.length)
            // console.log(allAppointmentsWithConfig.length)

            if (allAppointmentsWithConfig.length < 5) {
                return res.status(200).json({
                    status: 'ok',
                    data: allAppointmentsWithConfig,
                    total: all.length,
                    max: true
                })
            }

            // if (all.length > allAppointmentsWithConfig.length)
            
            return res.status(200).json({
                status: 'ok',
                data: allAppointmentsWithConfig,
                total: all.length,
                max: false
            })
        }
        
    } catch (err) {
        throw Error ('Please try again.')
    }

}

export default allAppointments