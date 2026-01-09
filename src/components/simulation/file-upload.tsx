'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FileUploadProps {
  uploadedFiles: string[]
  onFilesChange: (files: string[]) => void
}

export function FileUpload({ uploadedFiles, onFilesChange }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const supabase = createClient()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    setIsUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Giriş yapmanız gerekiyor')
        return
      }

      const uploadedUrls: string[] = []

      for (const file of files) {
        // Validate file type
        const validExtensions = ['.txt', '.csv', '.xlsx', '.xls']
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        
        if (!validExtensions.includes(fileExtension)) {
          alert(`${file.name} geçersiz dosya formatı. Desteklenen formatlar: ${validExtensions.join(', ')}`)
          continue
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} çok büyük. Maksimum dosya boyutu: 10MB`)
          continue
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `simulations/${user.id}/${fileName}`

        const { data, error } = await supabase.storage
          .from('simulation-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (error) {
          console.error('Upload error:', error)
          alert(`${file.name} yüklenirken hata oluştu: ${error.message}`)
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('simulation-files')
          .getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl)
        }
      }

      onFilesChange([...uploadedFiles, ...uploadedUrls])
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Dosya yükleme sırasında bir hata oluştu')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    onFilesChange(uploadedFiles.filter((_, i) => i !== index))
  }

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Dosya'
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Dosya Yükleme (Opsiyonel)</h3>
        <p className="text-sm text-muted-foreground">
          Simülasyon için ek dosyalar yükleyebilirsiniz (.txt, .csv, .xlsx)
        </p>
      </div>

      <Card
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={dragActive ? 'border-primary bg-primary/5' : ''}
      >
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Dosyaları buraya sürükleyin veya
              </p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  disabled={isUploading}
                  asChild
                >
                  <span>Dosya Seç</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".txt,.csv,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Maksimum dosya boyutu: 10MB
              </p>
            </div>
            {isUploading && (
              <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Yüklenen Dosyalar</CardTitle>
            <CardDescription>
              {uploadedFiles.length} dosya yüklendi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{getFileName(url)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
