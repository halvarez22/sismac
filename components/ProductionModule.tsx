import React, { useState } from 'react';
import { useModelStore } from '../store/useModelStore';
import type { ProductionOrder, ProductionLine, ProductionBatch, QualityCheck } from '../types';
import {
  Plus,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Package,
  ClipboardCheck,
  BarChart3,
  Calendar,
  X,
  Edit,
  Trash2,
  FileText,
  Download
} from 'lucide-react';

export default function ProductionModule() {
  const {
    models,
    productionOrders,
    productionLines,
    productionBatches,
    qualityChecks,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    createProductionLine,
    updateProductionLine,
    deleteProductionLine,
    assignOrderToLine,
    createProductionBatch,
    updateProductionBatch,
    deleteProductionBatch,
    addQualityCheck
  } = useModelStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'lines' | 'batches' | 'quality' | 'schedule' | 'reports'>('orders');

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLineModal, setShowLineModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [editingLine, setEditingLine] = useState<ProductionLine | null>(null);
  const [editingBatch, setEditingBatch] = useState<ProductionBatch | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Modal Components
  const OrderModal = () => {
    const [formData, setFormData] = useState({
      modelId: editingOrder?.modelId || models[0]?.id || '',
      quantity: editingOrder?.quantity || 1000,
      startDate: editingOrder?.startDate || new Date().toISOString().split('T')[0],
      priority: editingOrder?.priority || 'medium' as const
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingOrder) {
        updateProductionOrder(editingOrder.id, formData);
      } else {
        createProductionOrder(formData.modelId, formData.quantity, formData.startDate);
      }
      setShowOrderModal(false);
      setEditingOrder(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editingOrder ? 'Editar Orden' : 'Nueva Orden de Producción'}
            </h3>
            <button
              onClick={() => {
                setShowOrderModal(false);
                setEditingOrder(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Modelo
              </label>
              <select
                value={formData.modelId}
                onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.header.moldCode} - {model.header.client}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowOrderModal(false);
                  setEditingOrder(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                {editingOrder ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const LineModal = () => {
    const [formData, setFormData] = useState({
      name: editingLine?.name || '',
      description: editingLine?.description || '',
      capacity: editingLine?.capacity || 1000
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingLine) {
        updateProductionLine(editingLine.id, formData);
      } else {
        createProductionLine(formData.name, formData.capacity);
        // Also update with description
        const newLine = productionLines[productionLines.length - 1];
        if (newLine) {
          updateProductionLine(newLine.id, { description: formData.description });
        }
      }
      setShowLineModal(false);
      setEditingLine(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editingLine ? 'Editar Línea' : 'Nueva Línea de Producción'}
            </h3>
            <button
              onClick={() => {
                setShowLineModal(false);
                setEditingLine(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacidad Diaria (pares)
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min="1"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowLineModal(false);
                  setEditingLine(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                {editingLine ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const BatchModal = () => {
    const [formData, setFormData] = useState({
      productionOrderId: editingBatch?.productionOrderId || productionOrders[0]?.id || '',
      quantity: editingBatch?.quantity || 100
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingBatch) {
        updateProductionBatch(editingBatch.id, formData);
      } else {
        createProductionBatch(formData.productionOrderId, formData.quantity);
      }
      setShowBatchModal(false);
      setEditingBatch(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editingBatch ? 'Editar Lote' : 'Nuevo Lote de Producción'}
            </h3>
            <button
              onClick={() => {
                setShowBatchModal(false);
                setEditingBatch(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Orden de Producción
              </label>
              <select
                value={formData.productionOrderId}
                onChange={(e) => setFormData({ ...formData, productionOrderId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                {productionOrders.map(order => {
                  const model = models.find(m => m.id === order.modelId);
                  return (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - {model?.header.moldCode}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cantidad del Lote
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min="1"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowBatchModal(false);
                  setEditingBatch(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                {editingBatch ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const OrderCard = ({ order }: { order: ProductionOrder }) => {
    const model = models.find(m => m.id === order.modelId);

    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {model?.header.moldCode} - {model?.header.client}
            </p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
              {order.priority}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cantidad</p>
            <p className="text-sm font-medium">{order.quantity.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Progreso</p>
            <p className="text-sm font-medium">{order.progress}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Inicio</p>
            <p className="text-sm font-medium">{new Date(order.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Línea Asignada</p>
            <select
              value={order.assignedTo || ''}
              onChange={(e) => assignOrderToLine(order.id, e.target.value || null)}
              className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
            >
              <option value="">Sin asignar</option>
              {productionLines.map(line => (
                <option key={line.id} value={line.id}>{line.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${order.progress}%` }}
            ></div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => updateProductionOrder(order.id, { status: 'in_progress' })}
              className="p-1 text-green-600 hover:bg-green-100 rounded"
              title="Iniciar"
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateProductionOrder(order.id, { status: 'on_hold' })}
              className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
              title="Pausar"
            >
              <Pause className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateProductionOrder(order.id, { status: 'completed', progress: 100 })}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Completar"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setEditingOrder(order);
                setShowOrderModal(true);
              }}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('¿Está seguro de que desea eliminar esta orden?')) {
                  deleteProductionOrder(order.id);
                }
              }}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LineCard = ({ line }: { line: ProductionLine }) => (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{line.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{line.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(line.status)}`}>
            {line.status}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => {
                setEditingLine(line);
                setShowLineModal(true);
              }}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('¿Está seguro de que desea eliminar esta línea?')) {
                  deleteProductionLine(line.id);
                }
              }}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Capacidad Diaria</p>
          <p className="text-sm font-medium">{line.capacity.toLocaleString()} pares</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Eficiencia</p>
          <p className="text-sm font-medium">{line.efficiency}%</p>
        </div>
      </div>

      {line.currentOrder && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Orden Actual:</p>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            {productionOrders.find(o => o.id === line.currentOrder)?.orderNumber}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Órdenes Activas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {productionOrders.filter(o => o.status === 'in_progress').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                de {productionOrders.length} total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Líneas Activas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {productionLines.filter(l => l.status === 'active').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                de {productionLines.length} total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClipboardCheck className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lotes Hoy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {productionBatches.filter(b => b.startDate.startsWith(new Date().toISOString().split('T')[0])).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {productionBatches.filter(b => b.status === 'completed').length} completados
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Defectos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {qualityChecks.filter(q => q.status === 'fail').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {qualityChecks.length > 0 ? Math.round((qualityChecks.filter(q => q.status === 'fail').length / qualityChecks.length) * 100) : 0}% tasa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas avanzadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eficiencia por línea */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Eficiencia por Línea
          </h3>
          {productionLines.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay líneas configuradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {productionLines.map(line => (
                <div key={line.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {line.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {line.efficiency}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${line.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estado de órdenes por prioridad */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Órdenes por Prioridad
          </h3>
          <div className="space-y-4">
            {['urgent', 'high', 'medium', 'low'].map(priority => {
              const count = productionOrders.filter(o => o.priority === priority).length;
              const percentage = productionOrders.length > 0 ? (count / productionOrders.length) * 100 : 0;

              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      priority === 'urgent' ? 'bg-red-500' :
                      priority === 'high' ? 'bg-orange-500' :
                      priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {priority === 'urgent' ? 'Urgente' :
                       priority === 'high' ? 'Alta' :
                       priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {count}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          priority === 'urgent' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Producción semanal */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Producción Esta Semana
          </h3>
          <div className="space-y-3">
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => {
              const dayBatches = productionBatches.filter(b => {
                const batchDate = new Date(b.startDate);
                const today = new Date();
                const dayOfWeek = batchDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
                return dayOfWeek === (index + 1) % 7; // Adjust for Monday start
              });
              const totalQuantity = dayBatches.reduce((sum, b) => sum + b.quantity, 0);

              return (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {day}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {totalQuantity.toLocaleString()} pares
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((totalQuantity / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas y problemas */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Alertas de Producción
          </h3>
          <div className="space-y-3">
            {productionLines.filter(l => l.status === 'maintenance').length > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Líneas en mantenimiento
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    {productionLines.filter(l => l.status === 'maintenance').length} línea(s) requieren atención
                  </p>
                </div>
              </div>
            )}

            {qualityChecks.filter(q => q.status === 'fail').length > 10 && (
              <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <XCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Alta tasa de defectos
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    {qualityChecks.filter(q => q.status === 'fail').length} defectos detectados
                  </p>
                </div>
              </div>
            )}

            {productionOrders.filter(o => o.status === 'on_hold').length > 0 && (
              <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <Pause className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Órdenes en pausa
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {productionOrders.filter(o => o.status === 'on_hold').length} orden(es) esperando
                  </p>
                </div>
              </div>
            )}

            {productionOrders.length === 0 && productionLines.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50 text-green-500" />
                <p className="text-sm">Sistema listo para configuración</p>
                <p className="text-xs">Configure líneas y órdenes para comenzar la producción</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Órdenes</span>
          </button>
          <button
            onClick={() => setActiveTab('lines')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'lines'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Líneas</span>
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'batches'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Lotes</span>
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'quality'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Calidad</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'schedule'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Programación</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'reports'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Reportes</span>
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div>
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Órdenes de Producción</h2>
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Orden
              </button>
            </div>

            {productionOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No hay órdenes de producción</p>
                <p className="text-sm">Crea tu primera orden para comenzar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productionOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'lines' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Líneas de Producción</h2>
              <button
                onClick={() => setShowLineModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Línea
              </button>
            </div>

            {productionLines.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No hay líneas de producción</p>
                <p className="text-sm">Configura tus líneas de producción</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productionLines.map(line => (
                  <LineCard key={line.id} line={line} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'batches' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Lotes de Producción</h2>
              <button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors duration-200"
                disabled={productionOrders.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Lote
              </button>
            </div>

            {productionBatches.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No hay lotes de producción</p>
                <p className="text-sm">Crea lotes a partir de órdenes de producción</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Número de Lote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Calidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {productionBatches.map(batch => {
                      const order = productionOrders.find(o => o.id === batch.productionOrderId);
                      return (
                        <tr key={batch.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {batch.batchNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {order?.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {batch.quantity.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                              {batch.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.qualityStatus)}`}>
                              {batch.qualityStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => updateProductionBatch(batch.id, { status: 'completed' })}
                              className="text-green-600 hover:text-green-900 mr-2"
                              title="Completar"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => addQualityCheck(batch.id, 'operation-1', 'Inspector', 'pass')}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                              title="Control de Calidad"
                            >
                              <ClipboardCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingBatch(batch);
                                setShowBatchModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-900 mr-2"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('¿Está seguro de que desea eliminar este lote?')) {
                                  deleteProductionBatch(batch.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Control de Calidad</h2>

            {qualityChecks.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <ClipboardCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No hay controles de calidad registrados</p>
                <p className="text-sm">Los controles se registrarán automáticamente durante la producción</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Lote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Inspector
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Resultado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Defectos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {qualityChecks.map(check => {
                      const batch = productionBatches.find(b => b.id === check.batchId);
                      return (
                        <tr key={check.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {batch?.batchNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {check.inspector}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(check.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              check.status === 'pass'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {check.status === 'pass' ? 'Aprobado' : 'Rechazado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {check.defects.length}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Programación Semanal</h2>
              <div className="flex items-center space-x-4">
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  defaultValue="current"
                >
                  <option value="current">Semana Actual</option>
                  <option value="next">Próxima Semana</option>
                </select>
              </div>
            </div>

            {productionLines.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No hay líneas de producción configuradas</p>
                <p className="text-sm">Configure líneas de producción para crear la programación semanal</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Línea
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Lunes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Martes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Miércoles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Jueves
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Viernes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Sábado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Domingo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                      {productionLines.map(line => (
                        <tr key={line.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            <div>
                              <div className="font-semibold">{line.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Cap: {line.capacity} pares/día
                              </div>
                            </div>
                          </td>
                          {[1, 2, 3, 4, 5, 6, 7].map(day => (
                            <td key={day} className="px-6 py-4 whitespace-nowrap">
                              <div className="min-h-[80px] border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-md p-2">
                                {/* Aquí se mostrarían las órdenes asignadas a esta línea y día */}
                                <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                                  Sin asignar
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Panel lateral con órdenes disponibles */}
                <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Órdenes Disponibles para Programar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productionOrders
                      .filter(order => order.status === 'planned' || order.status === 'in_progress')
                      .map(order => {
                        const model = models.find(m => m.id === order.modelId);
                        return (
                          <div
                            key={order.id}
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              {order.orderNumber}
                            </div>
                            <div className="text-xs text-blue-700 dark:text-blue-300">
                              {model?.header.moldCode} - {model?.header.client}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {order.quantity.toLocaleString()} pares
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                              order.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              order.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              order.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.priority}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {productionOrders.filter(order => order.status === 'planned' || order.status === 'in_progress').length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay órdenes disponibles para programar</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Reportes de Producción</h2>
              <button
                onClick={() => {
                  // Función para exportar reportes
                  const reportData = {
                    productionSummary: {
                      totalOrders: productionOrders.length,
                      activeOrders: productionOrders.filter(o => o.status === 'in_progress').length,
                      completedOrders: productionOrders.filter(o => o.status === 'completed').length,
                      totalBatches: productionBatches.length,
                      completedBatches: productionBatches.filter(b => b.status === 'completed').length,
                      qualityPassRate: qualityChecks.length > 0 ?
                        Math.round((qualityChecks.filter(q => q.status === 'pass').length / qualityChecks.length) * 100) : 0
                    },
                    lineEfficiency: productionLines.map(line => ({
                      name: line.name,
                      efficiency: line.efficiency,
                      status: line.status,
                      currentOrder: line.currentOrder
                    })),
                    recentOrders: productionOrders.slice(-5).map(order => ({
                      orderNumber: order.orderNumber,
                      status: order.status,
                      progress: order.progress,
                      startDate: order.startDate
                    }))
                  };
                  console.log('Exportando reporte:', JSON.stringify(reportData, null, 2));
                  alert('Reporte exportado a consola. Revisa las herramientas de desarrollo.');
                }}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Reporte
              </button>
            </div>

            {/* Resumen Ejecutivo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Resumen Ejecutivo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Órdenes:</span>
                    <span className="text-sm font-medium">{productionOrders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Órdenes Activas:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {productionOrders.filter(o => o.status === 'in_progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Órdenes Completadas:</span>
                    <span className="text-sm font-medium text-green-600">
                      {productionOrders.filter(o => o.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Eficiencia Promedio:</span>
                    <span className="text-sm font-medium">
                      {productionLines.length > 0 ?
                        Math.round(productionLines.reduce((sum, line) => sum + line.efficiency, 0) / productionLines.length) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Rendimiento de Calidad
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Controles Realizados:</span>
                    <span className="text-sm font-medium">{qualityChecks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Aprobados:</span>
                    <span className="text-sm font-medium text-green-600">
                      {qualityChecks.filter(q => q.status === 'pass').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rechazados:</span>
                    <span className="text-sm font-medium text-red-600">
                      {qualityChecks.filter(q => q.status === 'fail').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tasa de Aprobación:</span>
                    <span className="text-sm font-medium">
                      {qualityChecks.length > 0 ?
                        Math.round((qualityChecks.filter(q => q.status === 'pass').length / qualityChecks.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Producción por Línea
                </h3>
                <div className="space-y-2">
                  {productionLines.map(line => (
                    <div key={line.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{line.name}:</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          line.status === 'active' ? 'bg-green-100 text-green-800' :
                          line.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {line.status}
                        </span>
                        <span className="text-sm font-medium">{line.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reporte Detallado de Órdenes */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reporte Detallado de Órdenes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Modelo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Progreso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Línea
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fecha Inicio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {productionOrders.map(order => {
                      const model = models.find(m => m.id === order.modelId);
                      const assignedLine = productionLines.find(l => l.id === order.assignedTo);
                      return (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {model?.header.moldCode} - {model?.header.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {order.progress}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {assignedLine?.name || 'Sin asignar'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.startDate).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reporte de Lotes */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reporte de Lotes de Producción
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Lote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Calidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {productionBatches.slice(-10).map(batch => {
                      const order = productionOrders.find(o => o.id === batch.productionOrderId);
                      return (
                        <tr key={batch.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {batch.batchNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {order?.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {batch.quantity.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                              {batch.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.qualityStatus)}`}>
                              {batch.qualityStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(batch.startDate).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showOrderModal && <OrderModal />}
      {showLineModal && <LineModal />}
      {showBatchModal && <BatchModal />}
    </div>
  );
}
