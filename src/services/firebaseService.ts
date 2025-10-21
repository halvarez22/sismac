import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Model, ProductionOrder, ProductionLine, ProductionBatch, QualityCheck } from '../types';

// Colecciones de Firestore
const COLLECTIONS = {
  MODELS: 'models',
  PRODUCTION_ORDERS: 'productionOrders',
  PRODUCTION_LINES: 'productionLines',
  PRODUCTION_BATCHES: 'productionBatches',
  QUALITY_CHECKS: 'qualityChecks',
  USER_SETTINGS: 'userSettings'
};

// Servicio para modelos
export const modelService = {
  // Guardar un modelo
  async saveModel(model: Model): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.MODELS, model.id);
      await setDoc(docRef, {
        ...model,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error saving model to Firebase:', error);
      throw error;
    }
  },

  // Obtener todos los modelos
  async getAllModels(): Promise<Model[]> {
    try {
      const q = query(collection(db, COLLECTIONS.MODELS), orderBy('header.date', 'desc'));
      const querySnapshot = await getDocs(q);
      console.log('🔥 DOCUMENTOS ENCONTRADOS EN FIREBASE:', querySnapshot.docs.length);

      const models = querySnapshot.docs.map(doc => doc.data() as Model);
      console.log('🔥 MODELOS PROCESADOS:', models.length);
      return models;
    } catch (error) {
      console.error('❌ Error getting models from Firebase:', error);
      return [];
    }
  },

  // Eliminar un modelo
  async deleteModel(modelId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MODELS, modelId));
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  }
};

// Servicio para órdenes de producción
export const productionOrderService = {
  async saveOrder(order: ProductionOrder): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTION_ORDERS, order.id);
      await setDoc(docRef, {
        ...order,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error saving production order:', error);
      throw error;
    }
  },

  async getAllOrders(): Promise<ProductionOrder[]> {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTION_ORDERS), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ProductionOrder);
    } catch (error) {
      console.error('Error getting production orders:', error);
      return [];
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTION_ORDERS, orderId));
    } catch (error) {
      console.error('Error deleting production order:', error);
      throw error;
    }
  }
};

// Servicio para líneas de producción
export const productionLineService = {
  async saveLine(line: ProductionLine): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTION_LINES, line.id);
      await setDoc(docRef, line);
    } catch (error) {
      console.error('Error saving production line:', error);
      throw error;
    }
  },

  async getAllLines(): Promise<ProductionLine[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTION_LINES));
      return querySnapshot.docs.map(doc => doc.data() as ProductionLine);
    } catch (error) {
      console.error('Error getting production lines:', error);
      return [];
    }
  },

  async deleteLine(lineId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTION_LINES, lineId));
    } catch (error) {
      console.error('Error deleting production line:', error);
      throw error;
    }
  }
};

// Servicio para lotes de producción
export const productionBatchService = {
  async saveBatch(batch: ProductionBatch): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTION_BATCHES, batch.id);
      await setDoc(docRef, {
        ...batch,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error saving production batch:', error);
      throw error;
    }
  },

  async getAllBatches(): Promise<ProductionBatch[]> {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTION_BATCHES), orderBy('startDate', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ProductionBatch);
    } catch (error) {
      console.error('Error getting production batches:', error);
      return [];
    }
  },

  async deleteBatch(batchId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTION_BATCHES, batchId));
    } catch (error) {
      console.error('Error deleting production batch:', error);
      throw error;
    }
  }
};

// Servicio para controles de calidad
export const qualityCheckService = {
  async saveCheck(check: QualityCheck): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.QUALITY_CHECKS, check.id);
      await setDoc(docRef, check);
    } catch (error) {
      console.error('Error saving quality check:', error);
      throw error;
    }
  },

  async getAllChecks(): Promise<QualityCheck[]> {
    try {
      const q = query(collection(db, COLLECTIONS.QUALITY_CHECKS), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as QualityCheck);
    } catch (error) {
      console.error('Error getting quality checks:', error);
      return [];
    }
  }
};

// Servicio para configuraciones de usuario
export const userSettingsService = {
  async saveSetting(key: string, value: any): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USER_SETTINGS, key);
      await setDoc(docRef, { value, updatedAt: Timestamp.now() });
    } catch (error) {
      console.error('Error saving user setting:', error);
      throw error;
    }
  },

  async getSetting(key: string): Promise<any> {
    try {
      const docRef = doc(db, COLLECTIONS.USER_SETTINGS, key);
      const docSnap = await getDocs(query(collection(db, COLLECTIONS.USER_SETTINGS), where('__name__', '==', key)));
      if (!docSnap.empty) {
        return docSnap.docs[0].data().value;
      }
      return null;
    } catch (error) {
      console.error('Error getting user setting:', error);
      return null;
    }
  }
};
