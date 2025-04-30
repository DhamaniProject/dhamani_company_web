import { useState } from "react";
import { Product } from "../types/types";

interface ProductModalHook {
  showAddModal: boolean;
  selectedProduct: Product | null;
  modalMode: "view" | "update" | "deactivate" | "reactivate";
  setShowAddModal: (value: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setModalMode: (mode: "view" | "update" | "deactivate" | "reactivate") => void;
}

export const useProductModal = (): ProductModalHook => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<
    "view" | "update" | "deactivate" | "reactivate"
  >("view");

  return {
    showAddModal,
    selectedProduct,
    modalMode,
    setShowAddModal,
    setSelectedProduct,
    setModalMode,
  };
};
