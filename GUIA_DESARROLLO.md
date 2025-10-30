# Guía para Implementar Nuevos Desarrollos en AmSpec Dashboard

Esta guía explica paso a paso cómo agregar nuevas funcionalidades al proyecto desde la web.

## 📋 Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Frontend (Vue 3 + TypeScript)
- **Ubicación**: `/src`
- **Tecnologías**: Vue 3, TypeScript, Vite, Tailwind CSS
- **Componentes**: `/src/components`
- **Vistas**: `/src/views`
- **Servicios**: `/src/services`
- **Rutas**: `/src/router/index.ts`

### Backend (Express + MongoDB)
- **Ubicación**: `/server`
- **Tecnologías**: Express.js, MongoDB, Mongoose
- **Modelos**: `/server/models`
- **Controladores**: `/server/controllers`
- **Rutas**: `/server/routes`

---

## 🚀 Proceso Paso a Paso para Agregar un Nuevo Módulo

### Ejemplo: Agregar un módulo llamado "Transport Orders"

---

## 1️⃣ Backend: Crear el Modelo

**Archivo**: `/server/models/TransportOrder.js`

```javascript
import mongoose from 'mongoose';

const transportOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      trim: true,
    },
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    client: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    scheduledDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Índices para mejorar rendimiento de consultas
transportOrderSchema.index({ orderNumber: 1 });
transportOrderSchema.index({ status: 1 });
transportOrderSchema.index({ createdAt: -1 });

const TransportOrder = mongoose.model('TransportOrder', transportOrderSchema);

export default TransportOrder;
```

---

## 2️⃣ Backend: Crear el Controlador

**Archivo**: `/server/controllers/transportOrderController.js`

```javascript
import TransportOrder from '../models/TransportOrder.js';

// @desc    Get all transport orders
// @route   GET /api/transport-orders
// @access  Public
export const getAllTransportOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = (req.query.sortOrder || 'desc') === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const total = await TransportOrder.countDocuments();
    const orders = await TransportOrder.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transport orders',
      error: error.message,
    });
  }
};

// @desc    Get single transport order by ID
// @route   GET /api/transport-orders/:id
// @access  Public
export const getTransportOrderById = async (req, res) => {
  try {
    const order = await TransportOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Transport order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transport order',
      error: error.message,
    });
  }
};

// @desc    Create new transport order
// @route   POST /api/transport-orders
// @access  Public
export const createTransportOrder = async (req, res) => {
  try {
    const order = await TransportOrder.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Transport order created successfully',
      data: order,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order number already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating transport order',
      error: error.message,
    });
  }
};

// @desc    Update transport order
// @route   PUT /api/transport-orders/:id
// @access  Public
export const updateTransportOrder = async (req, res) => {
  try {
    const order = await TransportOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Transport order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transport order updated successfully',
      data: order,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating transport order',
      error: error.message,
    });
  }
};

// @desc    Delete transport order
// @route   DELETE /api/transport-orders/:id
// @access  Public
export const deleteTransportOrder = async (req, res) => {
  try {
    const order = await TransportOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Transport order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transport order deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transport order',
      error: error.message,
    });
  }
};
```

---

## 3️⃣ Backend: Crear las Rutas

**Archivo**: `/server/routes/transportOrders.js`

```javascript
import express from 'express';
import {
  getAllTransportOrders,
  getTransportOrderById,
  createTransportOrder,
  updateTransportOrder,
  deleteTransportOrder,
} from '../controllers/transportOrderController.js';

const router = express.Router();

// Base routes
router.route('/').get(getAllTransportOrders).post(createTransportOrder);

// ID-based routes
router
  .route('/:id')
  .get(getTransportOrderById)
  .put(updateTransportOrder)
  .delete(deleteTransportOrder);

export default router;
```

---

## 4️⃣ Backend: Registrar la Ruta en el Servidor

**Archivo**: `/server/server.js`

Agregar la importación y registro de la ruta:

```javascript
// ... imports existentes ...
import transportOrderRoutes from './routes/transportOrders.js';

// ... en la sección de rutas ...
app.use('/api/transport-orders', transportOrderRoutes);
```

También actualizar el mensaje de bienvenida en la ruta raíz:

```javascript
app.get('/', (req, res) => {
  res.json({
    message: '🚢 AmSpec Backend API',
    version: '1.0.0',
    endpoints: {
      // ... endpoints existentes ...
      transportOrders: '/api/transport-orders',
    },
  });
});
```

---

## 5️⃣ Frontend: Crear el Servicio API

**Archivo**: `/src/services/transportOrderService.ts`

```typescript
import api from './api'

export interface TransportOrderData {
  orderNumber: string
  origin: string
  destination: string
  client?: string
  status?: 'pending' | 'in-transit' | 'delivered' | 'cancelled'
  scheduledDate?: string
}

export interface TransportOrder extends TransportOrderData {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: string[]
  count?: number
  total?: number
  page?: number
  pages?: number
  limit?: number
}

// Get all transport orders (paginated)
export const getAllTransportOrders = async (
  params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<ApiResponse<TransportOrder[]>> => {
  const response = await api.get('/transport-orders', { params })
  return response.data
}

// Get transport order by ID
export const getTransportOrderById = async (id: string): Promise<ApiResponse<TransportOrder>> => {
  const response = await api.get(`/transport-orders/${id}`)
  return response.data
}

// Create new transport order
export const createTransportOrder = async (
  data: TransportOrderData
): Promise<ApiResponse<TransportOrder>> => {
  const response = await api.post('/transport-orders', data)
  return response.data
}

// Update transport order
export const updateTransportOrder = async (
  id: string,
  data: Partial<TransportOrderData>
): Promise<ApiResponse<TransportOrder>> => {
  const response = await api.put(`/transport-orders/${id}`, data)
  return response.data
}

// Delete transport order
export const deleteTransportOrder = async (id: string): Promise<ApiResponse<{}>> => {
  const response = await api.delete(`/transport-orders/${id}`)
  return response.data
}
```

---

## 6️⃣ Frontend: Crear el Componente del Formulario

**Archivo**: `/src/components/operations/TransportOrderForm.vue`

Puedes basarte en los componentes existentes como `ShipNominationForm.vue`. El formulario debe incluir:

- Campos del formulario según el modelo
- Validación de campos
- Manejo de errores
- Integración con el servicio API
- Mensajes de éxito/error usando toast notifications

---

## 7️⃣ Frontend: Crear la Vista

**Archivo**: `/src/views/Operations/TransportOrder.vue`

```vue
<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Transport Orders" />

    <div class="mt-4">
      <ComponentCard
        title="New Transport Order"
        description="Create a new transport order"
      >
        <div class="p-6">
          <TransportOrderForm />
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import TransportOrderForm from '@/components/operations/TransportOrderForm.vue'
</script>
```

---

## 8️⃣ Frontend: Agregar la Ruta

**Archivo**: `/src/router/index.ts`

Agregar la nueva ruta en el array de rutas:

```typescript
{
  path: '/transport-orders',
  name: 'Transport Orders',
  component: () => import('../views/Operations/TransportOrder.vue'),
  meta: {
    title: 'Transport Orders',
  },
},
```

---

## ✅ Checklist de Implementación

- [ ] Modelo creado en `/server/models/`
- [ ] Controlador creado en `/server/controllers/`
- [ ] Rutas creadas en `/server/routes/`
- [ ] Ruta registrada en `/server/server.js`
- [ ] Servicio API creado en `/src/services/`
- [ ] Componente de formulario creado en `/src/components/operations/`
- [ ] Vista creada en `/src/views/Operations/`
- [ ] Ruta agregada en `/src/router/index.ts`
- [ ] Probado en desarrollo (`npm run dev:full`)
- [ ] Validaciones implementadas
- [ ] Manejo de errores implementado

---

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Iniciar frontend y backend simultáneamente
npm run dev:full

# Solo frontend
npm run dev

# Solo backend
npm run dev:server
```

### Base de Datos
```bash
# Ejecutar seeds (poblar base de datos)
cd server
npm run seed
```

---

## 📝 Notas Importantes

1. **Convenciones de Nombres**:
   - Modelos: PascalCase (ej: `TransportOrder.js`)
   - Controladores: camelCase con sufijo Controller (ej: `transportOrderController.js`)
   - Rutas: kebab-case (ej: `transport-orders`)
   - Servicios: camelCase con sufijo Service (ej: `transportOrderService.ts`)

2. **Validaciones**:
   - Siempre validar en el modelo de Mongoose
   - Validar también en el frontend antes de enviar
   - Manejar errores de validación apropiadamente

3. **Errores**:
   - Usar códigos de estado HTTP apropiados (200, 201, 400, 404, 500)
   - Retornar mensajes de error descriptivos
   - Manejar errores de validación y duplicados

4. **Paginación**:
   - Implementar paginación en las rutas GET que retornan listas
   - Incluir parámetros: `page`, `limit`, `sortBy`, `sortOrder`

5. **Tipos TypeScript**:
   - Definir interfaces para todos los datos
   - Usar tipos en servicios y componentes

---

## 🎯 Ejemplos de Módulos Existentes

Puedes usar estos módulos como referencia:

- **Ship Nominations**: `/server/models/ShipNomination.js`, `/src/services/shipNominationService.ts`
- **Molekulis Loading**: `/server/models/MolekulisLoading.js`, `/src/services/molekulisLoadingService.ts`
- **Other Jobs**: `/server/models/OtherJob.js`, `/src/services/otherJobsService.ts`

---

## 📚 Recursos Adicionales

- [Vue 3 Documentation](https://vuejs.org/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
