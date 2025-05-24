// client/src/utils/actions.ts

"use server"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"

// Create a singleton S3 client instance for reuse
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  maxAttempts: 3, 
})

function generateSecureFilename(prefix = 'uploads') {
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(8).toString('hex')
  return `${prefix}/${timestamp}-${randomString}`
}

function isAllowedFileType(fileType: string): boolean {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  return allowedTypes.includes(fileType)
}

export async function getSignedURL(fileType: string, folder = 'uploads') {
  try {
    // Validate input
    if (!fileType || typeof fileType !== 'string') {
      throw new Error('Invalid file type provided')
    }
    
    // Validate file type for security
    if (!isAllowedFileType(fileType)) {
      throw new Error('File type not allowed')
    }
    
    const bucketName = process.env.AWS_BUCKET_NAME
    if (!bucketName) {
      throw new Error('AWS bucket name is not configured')
    }
    
    // Generate secure filename
    const key = generateSecureFilename(folder)
    
    // Create command with proper parameters
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
      // Metadata for tracking/organization
      Metadata: {
        'upload-date': new Date().toISOString(),
        'content-type': fileType,
      },
    })

    // Generate signed URL with reasonable expiration
    const url = await getSignedUrl(s3Client, command, { 
      expiresIn: 15 * 60, // 15 minutes, more reasonable for security
    })
    
    return {
      success: { 
        url, 
        key,
        publicUrl: `https://${bucketName}.s3.${process.env.AWS_BUCKET_REGION || 'ap-south-1'}.amazonaws.com/${key}`
      }
    }
  } catch (error: any) {
    console.error("[S3 Signed URL Error]:", error)
    
    // Return safe error message for clients
    return {
      failure: 'Failed to generate upload URL. Please try again later.'
    }
  }
}