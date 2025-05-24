// client/src/components/file-upload.tsx

"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface FileUploadProps {
  accept?: string
  onDrop: (acceptedFiles: File[]) => void
  progress?: number
}

export function FileUpload({ accept, onDrop, progress = 0 }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragActive(false)
      onDrop(acceptedFiles)
    },
    [onDrop]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropCallback,
    accept: accept ? { [accept]: [] } : undefined,
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? 'Drop your file here' : 'Drag & drop your file here, or click to select'}
        </p>
        {progress > 0 && (
          <div className="w-full mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Uploading... {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}