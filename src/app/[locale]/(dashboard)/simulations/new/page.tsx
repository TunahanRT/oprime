'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { simulationSchema, type SimulationForm } from '@/lib/validations/simulation'
import { Stepper } from '@/components/simulation/stepper'
import { MaterialManager } from '@/components/simulation/material-form'
import { LayerBuilder } from '@/components/simulation/layer-builder'
import { FileUpload } from '@/components/simulation/file-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const steps = [
  { id: 1, title: 'Temel Bilgiler', description: 'Başlık ve açıklama' },
  { id: 2, title: 'Kaynak Parametreleri', description: 'Parçacık tipi ve enerji' },
  { id: 3, title: 'Malzeme Yönetimi', description: 'Malzemeleri tanımlayın' },
  { id: 4, title: 'Katman Yapısı', description: 'Katmanları oluşturun' },
  { id: 5, title: 'Dosya Yükleme', description: 'Opsiyonel dosyalar' },
  { id: 6, title: 'Özet ve Gönder', description: 'Kontrol edin ve gönderin' },
]

export default function NewSimulationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<SimulationForm>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      particleCount: 100000,
      materials: [],
      layers: [],
      uploadedFiles: [],
    },
  })

  const watchedMaterials = watch('materials')
  const watchedLayers = watch('layers')
  const watchedFiles = watch('uploadedFiles')
  const watchedData = watch()

  const onSubmit = async (data: SimulationForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Simülasyon oluşturulamadı')
      }

      const result = await response.json()
      router.push(`/simulations/${result.simulation.id}`)
    } catch (error: any) {
      console.error('Error creating simulation:', error)
      alert(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    // Validate current step before moving forward
    let isValid = true
    
    if (currentStep === 0) {
      isValid = await trigger(['title'])
    } else if (currentStep === 1) {
      isValid = await trigger(['particleType', 'energy', 'energyUnit', 'particleCount'])
    } else if (currentStep === 2) {
      if (watchedMaterials.length === 0) {
        alert('En az bir malzeme eklemeniz gerekiyor')
        isValid = false
      }
    } else if (currentStep === 3) {
      if (watchedLayers.length === 0) {
        alert('En az bir katman eklemeniz gerekiyor')
        isValid = false
      }
    }

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Simülasyon başlığı"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama/Notlar</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Simülasyon hakkında notlar..."
                rows={4}
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Parçacık Tipi *</Label>
              <RadioGroup
                onValueChange={(value) => setValue('particleType', value as 'neutron' | 'gamma')}
                defaultValue={watch('particleType')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutron" id="neutron" />
                  <Label htmlFor="neutron">Nötron</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gamma" id="gamma" />
                  <Label htmlFor="gamma">Gama</Label>
                </div>
              </RadioGroup>
              {errors.particleType && (
                <p className="text-sm text-destructive">{errors.particleType.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="energy">Enerji *</Label>
                <Input
                  id="energy"
                  type="number"
                  step="0.01"
                  {...register('energy', { valueAsNumber: true })}
                />
                {errors.energy && (
                  <p className="text-sm text-destructive">{errors.energy.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="energyUnit">Birim *</Label>
                <Select
                  onValueChange={(value) => setValue('energyUnit', value as 'keV' | 'MeV')}
                  defaultValue={watch('energyUnit')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Birim seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keV">keV</SelectItem>
                    <SelectItem value="MeV">MeV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="particleCount">Parçacık Sayısı *</Label>
              <Input
                id="particleCount"
                type="number"
                {...register('particleCount', { valueAsNumber: true })}
              />
              {errors.particleCount && (
                <p className="text-sm text-destructive">{errors.particleCount.message}</p>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <MaterialManager
            materials={watchedMaterials}
            onMaterialsChange={(materials) => setValue('materials', materials)}
          />
        )
      case 3:
        return (
          <LayerBuilder
            layers={watchedLayers}
            materials={watchedMaterials}
            onLayersChange={(layers) => setValue('layers', layers)}
          />
        )
      case 4:
        return (
          <FileUpload
            uploadedFiles={watchedFiles || []}
            onFilesChange={(files) => setValue('uploadedFiles', files)}
          />
        )
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Simülasyon Özeti</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lütfen bilgileri kontrol edin ve göndermek için onaylayın.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Başlık:</span>
                  <span className="text-sm font-medium">{watchedData.title}</span>
                </div>
                {watchedData.description && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Açıklama:</span>
                    <span className="text-sm">{watchedData.description}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kaynak Parametreleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Parçacık Tipi:</span>
                  <span className="text-sm font-medium">
                    {watchedData.particleType === 'neutron' ? 'Nötron' : 'Gama'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Enerji:</span>
                  <span className="text-sm font-medium">
                    {watchedData.energy} {watchedData.energyUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Parçacık Sayısı:</span>
                  <span className="text-sm font-medium">
                    {watchedData.particleCount?.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Malzemeler ({watchedMaterials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {watchedMaterials.map((material) => (
                    <div key={material.id} className="text-sm">
                      <span className="font-medium">{material.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({material.density} g/cm³)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Katman Yapısı ({watchedLayers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {watchedLayers.map((layer, index) => {
                    const material = watchedMaterials.find(m => m.id === layer.materialId)
                    return (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Katman {index + 1}:</span>
                        <span className="text-muted-foreground ml-2">
                          {material?.name || 'Bilinmeyen'} - {layer.thickness} cm
                        </span>
                      </div>
                    )
                  })}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-medium">
                  <span>Toplam Kalınlık:</span>
                  <span>
                    {watchedLayers.reduce((sum, l) => sum + l.thickness, 0).toFixed(2)} cm
                  </span>
                </div>
              </CardContent>
            </Card>

            {watchedFiles && watchedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Yüklenen Dosyalar ({watchedFiles.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {watchedFiles.map((file, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {file.split('/').pop()}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Simülasyon hazır
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Tüm gerekli bilgiler tamamlandı. Göndermek için butona tıklayın.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <div>Bilinmeyen adım</div>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Yeni Simülasyon Oluştur</h1>
        <p className="text-muted-foreground">
          Adım adım simülasyon parametrelerinizi belirleyin
        </p>
      </div>

      <Card>
        <CardHeader>
          <Stepper steps={steps} currentStep={currentStep} />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Geri
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  İleri
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Gönderiliyor...' : 'Simülasyonu Gönder'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
