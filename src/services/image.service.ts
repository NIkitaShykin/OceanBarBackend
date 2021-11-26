import * as fs from 'fs'
import * as aws_sdk from 'aws-sdk'
require('dotenv').config()

export default async function uploadToS3(filePath:string, fileName: string, category: string ): Promise<string> {
    return new Promise((resolve, reject) =>{
        const S3: aws_sdk.S3 = new aws_sdk.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SERCET_ACCESS_KEY,
            region: 'eu-north-1'
        })
        const uploadParams: aws_sdk.S3.PutObjectRequest = {
            Bucket: process.env.BUCKET_NAME,
            Key: category + '/' + fileName,
            ACL: "public-read-write"
        }
        const fileStream: fs.ReadStream = fs.createReadStream(filePath)
        fileStream.on('error', function(err){
            reject('File error' + err)
        })
        uploadParams.Body = fileStream
        S3.upload(uploadParams, function (err, data){
            if (err) {
                fs.unlinkSync(filePath)
                reject('Error when upload' + err)
            }
            if (data) {
                fs.unlinkSync(filePath)
                resolve(data.Location)
            }
        }) 
    })
}