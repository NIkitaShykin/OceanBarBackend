import * as JWT from 'jsonwebtoken'
require('dotenv').config()

function generateTokens(payload: {id: number, isAdmin: boolean}): {accessToken: string, refreshToken: string} {
    const accessToken: string = JWT.sign(payload, process.env.JWT_SECRET, {expiresIn: '30m'})
    const refreshToken: string = JWT.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
    return {accessToken: accessToken, refreshToken: refreshToken}
}

export default generateTokens
