'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, X } from 'lucide-react'
import { type MaterialForm } from '@/lib/validations/simulation'

const ELEMENTS = ['H', 'B', 'C', 'N', 'O', 'Al', 'Si', 'Fe', 'Gd', 'Pb', 'Zr', 'W'] as const

interface MaterialFormProps {
  materials: MaterialForm[]
  onMaterialsChange: (materials: MaterialForm[]) => void
}

export function MaterialManager({ materials, onMaterialsChange }: MaterialFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<MaterialForm | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    density: '',
    components: [{ element: 'H' as const, percentage: 0 }],
  })

  const resetForm = () => {
    setFormData({
      name: '',
      density: '',
      components: [{ element: 'H' as const, percentage: 0 }],
    })
    setEditingMaterial(null)
  }

  const handleOpenDialog = (material?: MaterialForm) => {
    if (material) {
      setEditingMaterial(material)
      setFormData({
        name: material.name,
        density: material.density.toString(),
        components: material.components.map(c => ({ ...c })),
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleAddComponent = () => {
    setFormData({
      ...formData,
      components: [...formData.components, { element: 'H' as const, percentage: 0 }],
    })
  }

  const handleRemoveComponent = (index: number) => {
    setFormData({
      ...formData,
      components: formData.components.filter((_, i) => i !== index),
    })
  }

  const handleComponentChange = (index: number, field: 'element' | 'percentage', value: string | number) => {
    const newComponents = [...formData.components]
    newComponents[index] = {
      ...newComponents[index],
      [field]: value,
    }
    setFormData({ ...formData, components: newComponents })
  }

  const calculateTotalPercentage = () => {
    return formData.components.reduce((sum, comp) => sum + comp.percentage, 0)
  }

  const handleSave = () => {
    if (!formData.name || !formData.density) {
      alert('Lütfen tüm alanları doldurun')
      return
    }

    const totalPercentage = calculateTotalPercentage()
    if (Math.abs(totalPercentage - 100) > 0.01) {
      alert(`Bileşen yüzdeleri toplamı 100% olmalıdır. Şu an: ${totalPercentage.toFixed(2)}%`)
      return
    }

    const material: MaterialForm = {
      id: editingMaterial?.id || `material-${Date.now()}`,
      name: formData.name,
      density: parseFloat(formData.density),
      components: formData.components.map(c => ({
        element: c.element,
        percentage: c.percentage,
      })),
    }

    if (editingMaterial) {
      onMaterialsChange(
        materials.map(m => (m.id === editingMaterial.id ? material : m))
      )
    } else {
      onMaterialsChange([...materials, material])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (materialId: string) => {
    if (confirm('Bu malzemeyi silmek istediğinize emin misiniz?')) {
      onMaterialsChange(materials.filter(m => m.id !== materialId))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Malzemeler</h3>
          <p className="text-sm text-muted-foreground">
            Simülasyon için kullanılacak malzemeleri tanımlayın
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Malzeme Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? 'Malzeme Düzenle' : 'Yeni Malzeme Ekle'}
              </DialogTitle>
              <DialogDescription>
                Malzeme bilgilerini ve bileşenlerini girin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material-name">Malzeme Adı *</Label>
                <Input
                  id="material-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Kurşun, Beton, vb."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material-density">Yoğunluk (g/cm³) *</Label>
                <Input
                  id="material-density"
                  type="number"
                  step="0.01"
                  value={formData.density}
                  onChange={(e) => setFormData({ ...formData, density: e.target.value })}
                  placeholder="Örn: 11.34"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Bileşenler *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddComponent}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Bileşen Ekle
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.components.map((component, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={component.element}
                        onValueChange={(value) =>
                          handleComponentChange(index, 'element', value as typeof ELEMENTS[number])
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ELEMENTS.map((el) => (
                            <SelectItem key={el} value={el}>
                              {el}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={component.percentage}
                        onChange={(e) =>
                          handleComponentChange(index, 'percentage', parseFloat(e.target.value) || 0)
                        }
                        placeholder="Yüzde"
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                      {formData.components.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveComponent(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Toplam:</span>
                  <span
                    className={
                      Math.abs(calculateTotalPercentage() - 100) < 0.01
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {calculateTotalPercentage().toFixed(2)}%
                  </span>
                </div>
                {Math.abs(calculateTotalPercentage() - 100) > 0.01 && (
                  <p className="text-sm text-destructive">
                    Bileşen yüzdeleri toplamı 100% olmalıdır
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleSave}>Kaydet</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Henüz malzeme eklenmedi. Yeni malzeme eklemek için yukarıdaki butonu kullanın.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((material) => (
            <Card key={material.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(material)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Yoğunluk:</span> {material.density} g/cm³
                  </p>
                  <div>
                    <p className="text-sm font-medium mb-1">Bileşenler:</p>
                    <div className="space-y-1">
                      {material.components.map((comp, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground">
                          {comp.element}: {comp.percentage}%
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
