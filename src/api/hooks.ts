import { isCloudMode } from "../lib/utils";
import * as cloudHooks from "./hooksCloud";
import * as localHooks from "./hooksLocal";

const hooks = isCloudMode ? cloudHooks : localHooks;

export const useProducts = hooks.useProducts;
export const useSalesByDateRange = hooks.useSalesByDateRange;
export const useSalesSummary = hooks.useSalesSummary;
export const useProductMutations = hooks.useProductMutations;
export const useSaleMutations = hooks.useSaleMutations;
