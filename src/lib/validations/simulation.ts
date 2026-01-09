import * as z from 'zod'

export const materialComponentSchema = z.object({
  element: z.enum(['H', 'B', 'C', 'N', 'O', 'Al', 'Si', 'Fe', 'Gd', 'Pb', 'Zr', 'W']),
  percentage: z.number().min(0).max(100),
})

export const materialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Malzeme adı gereklidir'),
  density: z.number().positive('Yoğunluk pozitif olmalıdır'),
  components: z.array(materialComponentSchema).min(1, 'En az bir bileşen gereklidir'),
}).refine((data) => {
  const totalPercentage = data.components.reduce((sum, comp) => sum + comp.percentage, 0)
  return Math.abs(totalPercentage - 100) < 0.01 // Allow small floating point errors
}, {
  message: 'Bileşen yüzdeleri toplamı 100% olmalıdır',
  path: ['components'],
})

export const layerSchema = z.object({
  materialId: z.string().min(1, 'Malzeme seçimi gereklidir'),
  thickness: z.number().positive('Kalınlık pozitif olmalıdır'),
})

export const simulationSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır').max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z.string().optional(),
  particleType: z.enum(['neutron', 'gamma']),
  energy: z.number().positive('Enerji pozitif olmalıdır'),
  energyUnit: z.enum(['keV', 'MeV']),
  particleCount: z.number().int().positive().min(1000, 'Parçacık sayısı en az 1000 olmalıdır'),
  materials: z.array(materialSchema).min(1, 'En az bir malzeme gereklidir'),
  layers: z.array(layerSchema).min(1, 'En az bir katman gereklidir'),
  uploadedFiles: z.array(z.string()).optional(),
})

export type SimulationForm = z.infer<typeof simulationSchema>
export type MaterialForm = z.infer<typeof materialSchema>
export type LayerForm = z.infer<typeof layerSchema>
