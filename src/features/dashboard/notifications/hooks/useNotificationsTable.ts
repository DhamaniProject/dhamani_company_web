import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { Notification, Product } from "../types/types";
import {
  fetchCompanyNotifications,
  createNotification as createNotificationFromAPI,
  fetchProductNames,
} from "../services/notificationService";

// Map frontend notification types (uppercase) to backend notification types (lowercase)
const NOTIFICATION_TYPE_MAP: { [key: string]: string } = {
  WARRANTY_EXPIRY: "warranty_expiry",
  PROMOTION: "promotion",
  GENERAL_ANNOUNCEMENT: "general_announcement",
  RETURN_DEADLINE: "return_deadline",
  EXCHANGE_PERIOD: "exchange_period",
  RECALL: "recall",
};

interface NotificationsTableHook {
  notifications: Notification[];
  products: Product[];
  isLoading: boolean;
  error: string;
  successMessage: string;
  fetchNotifications: (limit?: number, offset?: number) => void;
  createNotification: (
    newNotification: Partial<Notification>,
    skuOrUpcFilter?: string
  ) => Promise<void>;
  totalNotifications: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchProducts: (search?: string) => void;
}

export const useNotificationsTable = (): NotificationsTableHook => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Temporarily mock company_id to force API call
  const companyId = user?.company_id || "6f0feaa8-2e7c-4b5c-8369-1275151c9f5b";

  const fetchNotifications = useCallback(
    async (limitParam: number = limit, offset: number = 0) => {
      console.log("Attempting to fetch notifications with:", {
        user,
        companyId,
      });
      setIsLoading(true);
      try {
        const fetchedNotifications = await fetchCompanyNotifications(
          companyId,
          limitParam,
          offset
        );
        // Ensure no undefined values in the array
        const validNotifications = fetchedNotifications.filter(
          (n): n is Notification =>
            n !== undefined && n.notificationType != null
        );
        console.log("Setting notifications:", validNotifications);
        setNotifications(validNotifications);
        // Placeholder for total count; update when API provides it
        setTotalNotifications(
          validNotifications.length < limitParam
            ? validNotifications.length
            : limitParam * 2
        );
      } catch (err: any) {
        console.error("Error fetching notifications:", err);
        setError(err.message || "fetchNotificationsError");
      } finally {
        setIsLoading(false);
      }
    },
    [] // Removed dependency to force API call
  );

  const fetchProducts = useCallback(
    async (search?: string) => {
      console.log("Attempting to fetch products with:", { companyId, search });
      setIsLoading(true);
      try {
        const productList = await fetchProductNames(companyId, search);
        console.log("Setting products:", productList);
        setProducts(productList);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "fetchProductsError");
      } finally {
        setIsLoading(false);
      }
    },
    [] // Removed dependency to force API call
  );

  const createNotification = async (
    newNotification: Partial<Notification>,
    skuOrUpcFilter?: string
  ) => {
    console.log("Attempting to create notification with:", {
      newNotification,
      companyId,
    });
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
        console.warn(
          "Validation failed for notification creation:",
          newNotification
        );
        throw new Error("validationError");
      }

      const notificationData = {
        target: newNotification.targetReceivers,
        product_id:
          newNotification.targetReceivers === "product_users"
            ? newNotification.productId
            : undefined,
        notification_type:
          NOTIFICATION_TYPE_MAP[newNotification.notificationType],
        translations: [
          {
            language_id: 1,
            message_title: newNotification.messageTitle.en,
            message_content: newNotification.messageContent.en,
          },
          {
            language_id: 2,
            message_title: newNotification.messageTitle.ar,
            message_content: newNotification.messageContent.ar,
          },
        ],
      };

      const createdNotification = await createNotificationFromAPI(
        companyId,
        notificationData
      );
      if (!createdNotification || !createdNotification.notificationType) {
        console.error("Created notification is invalid:", createdNotification);
        throw new Error("createNotificationFailed");
      }
      console.log("Adding created notification to state:", createdNotification);
      setNotifications((prev) => {
        const updatedNotifications = [...prev, createdNotification].filter(
          (n): n is Notification =>
            n !== undefined && n.notificationType != null
        );
        console.log(
          "Updated notifications after create:",
          updatedNotifications
        );
        return updatedNotifications;
      });
      setSuccessMessage("notificationCreated");
      fetchNotifications(limit, (currentPage - 1) * limit); // Refresh notifications
    } catch (err: any) {
      console.error("Error creating notification:", err);
      setError(err.message || "createError");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    console.log("Fetching products on mount");
    fetchProducts();
  }, [fetchProducts]);

  return {
    notifications,
    products,
    isLoading,
    error,
    successMessage,
    fetchNotifications,
    createNotification,
    totalNotifications,
    currentPage,
    setCurrentPage,
    fetchProducts,
  };
};
