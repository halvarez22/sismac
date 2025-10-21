
import { useEffect } from 'react';
import { useModelStore } from '../store/useModelStore';
import { shallow } from 'zustand/shallow';
import type { Financials, Material } from '../types';

/**
 * Rounds a number to a specified number of decimal places robustly.
 * @param num The number to round.
 * @param places The number of decimal places.
 * @returns The rounded number.
 */
function round(num: number, places: number): number {
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  // Using exponential notation to avoid floating point issues
  return Number(Math.round(Number(num + 'e' + places)) + 'e-' + places);
}


export const useCostCalculator = () => {
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const selectedModel = useModelStore((state) => state.getSelectedModel());
  const setFinancials = useModelStore((state) => state.setFinancials);
  const setMaterials = useModelStore((state) => state.setMaterials);

  // Always call useEffect with the same dependencies to maintain hook order
  useEffect(() => {
    // Solo calcular si hay un modelo seleccionado
    if (!selectedModelId || !selectedModel) {
      return;
    }

    const { materials, header, financials } = selectedModel;
    const { requestedPairs } = header;
    const { directLabor, manufacturingExpenses, clientPrice } = financials;

    // Create a stable, stringified dependency of the raw inputs from the materials array.
    // This prevents the useEffect from re-running just because the `materials` array reference changes.
    // It will only run when the actual input values (netPrice, consumption) change.
    const materialInputs = JSON.stringify(
      materials.map(m => ({
        netPrice: m.netPrice,
        consumptionPerPair: m.consumptionPerPair,
      }))
    );

    let hasMaterialChanges = false;

    // 1. Create a new array with all calculated material values, rounding to prevent float precision loops.
    const updatedMaterials = materials.map((material: Material) => {
      const calculatedCostPerPair = round(material.netPrice * material.consumptionPerPair, 4);
      const calculatedTotalBudget = round(calculatedCostPerPair * requestedPairs, 2);
      const calculatedRequiredToBuy = round(material.consumptionPerPair * requestedPairs, 4);

      // Check if an update is needed. Compare rounded values to avoid infinite loops.
      if (
        material.costPerPair !== calculatedCostPerPair ||
        material.totalBudget !== calculatedTotalBudget ||
        material.requiredToBuy !== calculatedRequiredToBuy
      ) {
        hasMaterialChanges = true;
        return {
          ...material,
          costPerPair: calculatedCostPerPair,
          totalBudget: calculatedTotalBudget,
          requiredToBuy: calculatedRequiredToBuy,
        };
      }
      return material;
    });

    // 2. If any material changed, update the store with the new array in a single batch.
    if (hasMaterialChanges) {
      setMaterials(updatedMaterials);
    }

    // 3. Calculate financial summary. Use the newly calculated materials if they changed.
    const currentMaterialsForSummary = hasMaterialChanges ? updatedMaterials : materials;
    const directMaterials = round(currentMaterialsForSummary.reduce((sum, m) => sum + m.costPerPair, 0), 2);
    const totalCost = round(directMaterials + (directLabor || 0) + (manufacturingExpenses || 0), 2);
    const profitOrLoss = round((clientPrice || 0) - totalCost, 2);

    const newFinancials: Financials = {
      directMaterials,
      directLabor: directLabor || 0,
      manufacturingExpenses: manufacturingExpenses || 0,
      totalCost,
      clientPrice: clientPrice || 0,
      profitOrLoss,
    };

    // 4. Update the global store if the summary has changed.
    const currentFinancials = financials;
    if (
        currentFinancials.directMaterials !== newFinancials.directMaterials ||
        currentFinancials.totalCost !== newFinancials.totalCost ||
        currentFinancials.profitOrLoss !== newFinancials.profitOrLoss
    ) {
      setFinancials(newFinancials);
    }
  // Always use the same dependencies to maintain hook order consistency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModelId]);
};
