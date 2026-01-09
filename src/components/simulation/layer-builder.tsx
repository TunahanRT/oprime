'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { type LayerForm, type MaterialForm } from '@/lib/validations/simulation'

interface LayerBuilderProps {
  layers: LayerForm[]
  materials: MaterialForm[]
  onLayersChange: (layers: LayerForm[]) => void
}

export function LayerBuilder({ layers, materials, onLayersChange }: LayerBuilderProps) {
  const handleAddLayer = () => {
    if (materials.length === 0) {
      alert('Önce en az bir malzeme eklemeniz gerekiyor')
      return
    }
    onLayersChange([
      ...layers,
      {
        materialId: materials[0].id,
        thickness: 1,
      },
    ])
  }

  const handleRemoveLayer = (index: number) => {
    onLayersChange(layers.filter((_, i) => i !== index))
  }

  const handleLayerChange = (index: number, field: 'materialId' | 'thickness', value: string | number) => {
    const newLayers = [...layers]
    newLayers[index] = {
      ...newLayers[index],
      [field]: value,
    }
    onLayersChange(newLayers)
  }

  const getTotalThickness = () => {
    return layers.reduce((sum, layer) => sum + layer.thickness, 0)
  }

  const getMaterialName = (materialId: string) => {
    return materials.find(m => m.id === materialId)?.name || 'Bilinmeyen'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Katman Yapısı</h3>
          <p className="text-sm text-muted-foreground">
            Zırhlama katmanlarını oluşturun ve sıralayın
          </p>
        </div>
        <Button onClick={handleAddLayer} disabled={materials.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Katman Ekle
        </Button>
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Katman eklemek için önce en az bir malzeme tanımlamanız gerekiyor.
          </CardContent>
        </Card>
      ) : layers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Henüz katman eklenmedi</p>
            <Button onClick={handleAddLayer}>İlk Katmanı Ekle</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Visual Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Görsel Önizleme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 h-32 overflow-x-auto">
                {layers.map((layer, index) => {
                  const material = materials.find(m => m.id === layer.materialId)
                  const colors = [
                    'bg-blue-500',
                    'bg-green-500',
                    'bg-yellow-500',
                    'bg-red-500',
                    'bg-purple-500',
                    'bg-pink-500',
                    'bg-indigo-500',
                    'bg-orange-500',
                  ]
                  const color = colors[index % colors.length]
                  
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center min-w-[80px]"
                      style={{ flex: layer.thickness }}
                    >
                      <div
                        className={`w-full ${color} rounded-t border-2 border-border`}
                        style={{ height: `${Math.max(20, layer.thickness * 10)}px` }}
                        title={`${getMaterialName(layer.materialId)} - ${layer.thickness} cm`}
                      />
                      <div className="text-xs text-center mt-1">
                        <div className="font-medium">{getMaterialName(layer.materialId)}</div>
                        <div className="text-muted-foreground">{layer.thickness} cm</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Toplam Kalınlık: <span className="font-semibold">{getTotalThickness().toFixed(2)} cm</span>
              </div>
            </CardContent>
          </Card>

          {/* Layer List */}
          <div className="space-y-2">
            {layers.map((layer, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                      <span className="font-semibold">#{index + 1}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Malzeme</Label>
                        <Select
                          value={layer.materialId}
                          onValueChange={(value) => handleLayerChange(index, 'materialId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {materials.map((material) => (
                              <SelectItem key={material.id} value={material.id}>
                                {material.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kalınlık (cm)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={layer.thickness}
                          onChange={(e) =>
                            handleLayerChange(index, 'thickness', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLayer(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
