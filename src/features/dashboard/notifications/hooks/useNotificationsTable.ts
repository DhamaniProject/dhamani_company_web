import { useState, useCallback } from "react";
import { Notification, Product } from "../types/types";

interface NotificationsTableHook {
  notifications: Notification[];
  products: Product[];
  isLoading: boolean;
  error: string;
  successMessage: string;
  fetchNotifications: () => void;
  createNotification: (newNotification: Partial<Notification>) => Promise<void>;
}

export const useNotificationsTable = (): NotificationsTableHook => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products] = useState<Product[]>([
    {
      id: "1",
      product_name: { en: "Smartphone X", ar: "الهاتف الذكي X" },
      product_description: {
        en: "Latest model with 5G support",
        ar: "أحدث طراز يدعم 5G",
      },
      terms_and_notes: {
        en: "2-year warranty included",
        ar: "ضمان لمدة سنتين مشمول",
      },
      image: "https://via.placeholder.com/150",
      types: ["warranty", "exchange"],
      sku: "SMX123",
      upc: "123456789012",
      category: "electronics",
      warrantyPeriod: 730,
      returnPeriod: 0,
      exchangePeriod: 30,
      warrantyProvider: "TechCare",
      status: "active",
    },
    {
      id: "2",
      product_name: { en: "Leather Jacket", ar: "سترة جلدية" },
      product_description: {
        en: "Premium leather jacket",
        ar: "سترة جلدية فاخرة",
      },
      terms_and_notes: { en: null, ar: null },
      image: "https://via.placeholder.com/150",
      types: ["return", "exchange"],
      sku: "LJ456",
      upc: null,
      category: "clothing",
      warrantyPeriod: 0,
      returnPeriod: 14,
      exchangePeriod: 14,
      warrantyProvider: null,
      status: "active",
    },
    {
      id: "3",
      product_name: { en: "Wireless Earbuds", ar: "سماعات لاسلكية" },
      product_description: {
        en: "High-quality sound with noise cancellation",
        ar: "صوت عالي الجودة مع إلغاء الضوضاء",
      },
      terms_and_notes: { en: "1-year warranty", ar: "ضمان لمدة سنة" },
      image: "https://via.placeholder.com/150",
      types: ["warranty"],
      sku: "WE789",
      upc: "987654321098",
      category: "electronics",
      warrantyPeriod: 365,
      returnPeriod: 0,
      exchangePeriod: 0,
      warrantyProvider: "SoundTech",
      status: "inactive",
    },
    {
      id: "4",
      product_name: { en: "Sunglasses", ar: "نظارات شمسية" },
      product_description: { en: null, ar: null },
      terms_and_notes: { en: null, ar: null },
      image: "https://via.placeholder.com/150",
      types: ["return"],
      sku: "SG101",
      upc: null,
      category: "accessories",
      warrantyPeriod: 0,
      returnPeriod: 7,
      exchangePeriod: 0,
      warrantyProvider: null,
      status: "active",
    },
    {
      id: "5",
      product_name: { en: "Camping Tent", ar: "خيمة تخييم" },
      product_description: {
        en: "Durable tent for outdoor adventures",
        ar: "خيمة متينة للمغامرات الخارجية",
      },
      terms_and_notes: { en: null, ar: null },
      image: "https://via.placeholder.com/150",
      types: ["warranty", "return"],
      sku: "CT202",
      upc: "456789123456",
      category: "other",
      warrantyPeriod: 180,
      returnPeriod: 30,
      exchangePeriod: 0,
      warrantyProvider: "OutdoorGear",
      status: "active",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const mockNotifications: Notification[] = [
    {
      id: "n1",
      targetReceivers: "all_users",
      productId: null,
      notificationType: "PROMOTION",
      messageTitle: { en: "Summer Sale", ar: "تخفيضات الصيف" },
      messageContent: {
        en: "Get 20% off on all products this week!",
        ar: "احصل على خصم 20% على جميع المنتجات هذا الأسبوع!",
      },
      createdAt: "2025-04-26T10:00:00Z",
    },
    {
      id: "n2",
      targetReceivers: "product_users",
      productId: "1",
      notificationType: "WARRANTY_EXPIRY",
      messageTitle: { en: "Warranty Reminder", ar: "تذكير بالضمان" },
      messageContent: {
        en: "Your Smartphone X warranty is expiring soon.",
        ar: "ضمان هاتفك الذكي X سينتهي قريبًا.",
      },
      createdAt: "2025-04-25T12:00:00Z",
    },
    {
      id: "n3",
      targetReceivers: "expiring_warranty_users",
      productId: null,
      notificationType: "WARRANTY_EXPIRY",
      messageTitle: {
        en: "Warranty Expiry Notice",
        ar: "إشعار انتهاء الضمان",
      },
      messageContent: {
        en: "Some of your product warranties are nearing expiry.",
        ar: "بعض ضمانات منتجاتك تقترب من الانتهاء.",
      },
      createdAt: "2025-04-24T15:00:00Z",
    },
  ];

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<Notification[]>((resolve) =>
        setTimeout(() => resolve(mockNotifications), 1000)
      );
      setNotifications(response);
    } catch (err) {
      setError("fetchError");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNotification = async (newNotification: Partial<Notification>) => {
    setIsLoading(true);
    try {
      if (
        !newNotification.targetReceivers ||
        !newNotification.notificationType ||
        !newNotification.messageTitle?.en ||
        !newNotification.messageTitle?.ar ||
        !newNotification.messageContent?.en ||
        !newNotification.messageContent?.ar ||
        (newNotification.targetReceivers === "product_users" &&
          !newNotification.productId)
      ) {
        throw new Error("validationError");
      }
      const notification: Notification = {
        id: `n${notifications.length + 1}`,
        targetReceivers: newNotification.targetReceivers,
        productId: newNotification.productId || null,
        notificationType: newNotification.notificationType,
        messageTitle: newNotification.messageTitle,
        messageContent: newNotification.messageContent,
        createdAt: new Date().toISOString(),
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setNotifications((prev) => [...prev, notification]);
      setSuccessMessage("notificationCreated");
    } catch (err: any) {
      setError(err.message || "createError");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notifications,
    products,
    isLoading,
    error,
    successMessage,
    fetchNotifications,
    createNotification,
  };
};
