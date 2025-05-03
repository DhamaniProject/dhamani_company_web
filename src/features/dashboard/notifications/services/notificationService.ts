import api from "../../../../services/api";
import { Notification, Product } from "../types/types";

interface ApiNotification {
  company_id: string;
  product_id: string | null;
  record_id: string | null;
  notification_type: string;
  sent_by: string;
  notification_id: string;
  created_at: string;
  updated_at: string | null;
  translations: {
    language_id: number;
    message_title: string;
    message_content: string;
    notification_translation_id: number;
    created_at: string;
    updated_at: string | null;
  }[];
  user_ids: string[];
  read_status: string | null;
}

interface CreateNotificationData {
  target: string;
  product_id?: string;
  notification_type: string;
  translations: {
    language_id: number;
    message_title: string;
    message_content: string;
  }[];
}

interface ApiProduct {
  product_id: string;
  translations: {
    language_id: number;
    product_name: string;
    product_description: string | null;
    terms_and_notes: string | null;
    product_translation_id: number;
    product_id: string;
    created_at: string;
    updated_at: string | null;
  }[];
}

const VALID_NOTIFICATION_TYPES = [
  "warranty_expiry",
  "promotion",
  "general_announcement",
  "return_deadline",
  "exchange_period",
  "recall",
];

const VALID_TARGET_TYPES = [
  "all_users",
  "product_users",
  "expiring_warranty_users",
  "old_records_users",
];

// Mapping backend enums to frontend enums
const NOTIFICATION_TYPE_MAP: {
  [key: string]: Notification["notificationType"];
} = {
  warranty_expiry: "WARRANTY_EXPIRY",
  promotion: "PROMOTION",
  general_announcement: "GENERAL_ANNOUNCEMENT",
  return_deadline: "RETURN_DEADLINE",
  exchange_period: "EXCHANGE_PERIOD",
  recall: "RECALL",
};

const TARGET_TYPE_MAP: { [key: string]: Notification["targetReceivers"] } = {
  all_users: "all_users",
  product_users: "product_users",
  expiring_warranty_users: "expiring_warranty_users",
  old_records_users: "old_records_users",
};

export const fetchCompanyNotifications = async (
  companyId: string,
  limit: number = 10,
  offset: number = 0,
  languageId?: number
): Promise<Notification[]> => {
  try {
    console.log("Sending request to fetch notifications:", {
      companyId,
      limit,
      offset,
      languageId,
    });
    const response = await api.get<ApiNotification[]>(
      `/api/v1/notifications/company/sent`,
      {
        params: { limit, offset, language_id: languageId },
      }
    );

    // Log response for debugging
    console.log("API Response for fetchCompanyNotifications:", response.data);

    // Validate response data
    if (!Array.isArray(response.data)) {
      console.error("Invalid response format:", response.data);
      throw new Error("invalidResponseFormat");
    }

    const notifications = response.data
      .map((n) => {
        // Validate required fields
        if (!n.notification_id || !n.created_at || !n.notification_type) {
          console.warn(
            "Skipping notification with missing required fields:",
            n
          );
          return undefined;
        }

        // Validate notification type
        if (!VALID_NOTIFICATION_TYPES.includes(n.notification_type)) {
          console.warn(
            "Skipping notification with invalid type:",
            n.notification_type
          );
          return undefined;
        }

        // Validate target type (inferred from product_id for fetched notifications)
        const targetReceivers = n.product_id ? "product_users" : "all_users";
        if (!VALID_TARGET_TYPES.includes(targetReceivers)) {
          console.warn(
            "Skipping notification with invalid target:",
            targetReceivers
          );
          return undefined;
        }

        // Ensure translations exist
        const enTranslation = n.translations.find(
          (t) => t.language_id === 1
        ) || {
          message_title: "N/A",
          message_content: "N/A",
        };
        const arTranslation = n.translations.find(
          (t) => t.language_id === 2
        ) || {
          message_title: "غير متوفر",
          message_content: "غير متوفر",
        };

        return {
          id: n.notification_id,
          targetReceivers: TARGET_TYPE_MAP[targetReceivers],
          productId: n.product_id,
          notificationType: NOTIFICATION_TYPE_MAP[n.notification_type],
          messageTitle: {
            en: enTranslation.message_title,
            ar: arTranslation.message_title,
          },
          messageContent: {
            en: enTranslation.message_content,
            ar: arTranslation.message_content,
          },
          createdAt: n.created_at,
          sentBy: n.sent_by || "company",
          updatedAt: n.updated_at,
          readStatus: n.read_status,
        };
      })
      .filter((n): n is Notification => n !== undefined);

    console.log("Mapped notifications:", notifications);
    return notifications;
  } catch (error: any) {
    console.error("Fetch Notifications Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });
    if (error.response?.status === 403) {
      throw new Error("forbiddenError");
    }
    throw new Error(error.message || "fetchNotificationsError");
  }
};

export const createNotification = async (
  companyId: string,
  notificationData: CreateNotificationData
): Promise<Notification> => {
  try {
    // Validate notification type and target before sending
    if (
      !VALID_NOTIFICATION_TYPES.includes(notificationData.notification_type)
    ) {
      console.error(
        "Invalid notification type in request:",
        notificationData.notification_type
      );
      throw new Error("invalidNotificationType");
    }
    if (!VALID_TARGET_TYPES.includes(notificationData.target)) {
      console.error("Invalid target in request:", notificationData.target);
      throw new Error("invalidTargetType");
    }

    // Ensure product_id is omitted if target is not product_users
    const requestData: CreateNotificationData = {
      target: notificationData.target,
      notification_type: notificationData.notification_type,
      translations: notificationData.translations,
    };
    if (
      notificationData.target === "product_users" &&
      notificationData.product_id
    ) {
      requestData.product_id = notificationData.product_id;
    }

    console.log("Sending request to create notification:", requestData);
    const response = await api
      .post<ApiNotification>(`/api/v1/notifications/`, requestData)
      .catch((error) => {
        console.error("Axios post failed:", error);
        throw error; // Ensure the error is thrown to be caught in the outer catch block
      });

    console.log("Raw API Response for createNotification:", response);

    const n = response.data;
    console.log("API Response Data for createNotification:", n);

    // Validate required fields in the response
    if (!n || !n.notification_id || !n.created_at || !n.notification_type) {
      console.error("Invalid response from createNotification:", n);
      throw new Error("invalidResponseFormat");
    }

    // Validate notification type and target in the response
    if (!VALID_NOTIFICATION_TYPES.includes(n.notification_type)) {
      console.error(
        "Invalid notification type in response:",
        n.notification_type
      );
      throw new Error("invalidNotificationType");
    }
    const targetReceivers = n.product_id ? "product_users" : "all_users";
    if (!VALID_TARGET_TYPES.includes(targetReceivers)) {
      console.error("Invalid target in response:", targetReceivers);
      throw new Error("invalidTargetType");
    }

    const enTranslation = n.translations.find((t) => t.language_id === 1) || {
      message_title: "N/A",
      message_content: "N/A",
    };
    const arTranslation = n.translations.find((t) => t.language_id === 2) || {
      message_title: "غير متوفر",
      message_content: "غير متوفر",
    };

    const mappedNotification: Notification = {
      id: n.notification_id,
      targetReceivers: TARGET_TYPE_MAP[targetReceivers],
      productId: n.product_id,
      notificationType: NOTIFICATION_TYPE_MAP[n.notification_type],
      messageTitle: {
        en: enTranslation.message_title,
        ar: arTranslation.message_title,
      },
      messageContent: {
        en: enTranslation.message_content,
        ar: arTranslation.message_content,
      },
      createdAt: n.created_at,
      sentBy: n.sent_by || "company",
      updatedAt: n.updated_at,
      readStatus: n.read_status,
    };

    console.log("Mapped created notification:", mappedNotification);
    return mappedNotification;
  } catch (error: any) {
    console.error("Create Notification Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });
    if (error.response?.status === 404) {
      throw new Error("notFoundError");
    }
    if (error.response?.status === 403) {
      throw new Error("forbiddenError");
    }
    if (error.response?.status === 500) {
      throw new Error("serverError");
    }
    throw new Error(error.message || "createNotificationError");
  }
};

export const fetchProductNames = async (
  companyId: string,
  search?: string
): Promise<Product[]> => {
  try {
    console.log("Sending request to fetch product names:", {
      companyId,
      search,
    });
    const response = await api.get<{ success: boolean; data: ApiProduct[] }>(
      `/api/v1/companies/${companyId}/products/name`,
      {
        params: { search },
      }
    );

    // Validate response
    if (!response.data.success || !Array.isArray(response.data.data)) {
      console.error("Invalid product response format:", response.data);
      throw new Error("invalidProductResponseFormat");
    }

    const products = response.data.data.map((p) => {
      const enTranslation = p.translations.find((t) => t.language_id === 1) || {
        product_name: "N/A",
        product_description: null,
        terms_and_notes: null,
      };
      const arTranslation = p.translations.find((t) => t.language_id === 2) || {
        product_name: "غير متوفر",
        product_description: null,
        terms_and_notes: null,
      };

      return {
        id: p.product_id,
        product_name: {
          en: enTranslation.product_name,
          ar: arTranslation.product_name,
        },
        product_description: {
          en: enTranslation.product_description,
          ar: arTranslation.product_description,
        },
        terms_and_notes: {
          en: enTranslation.terms_and_notes,
          ar: arTranslation.terms_and_notes,
        },
        image: "",
        types: [],
        sku: "",
        upc: null,
        category: "other",
        warrantyPeriod: 0,
        returnPeriod: 0,
        exchangePeriod: 0,
        warrantyProvider: null,
        status: "active",
      };
    });

    console.log("Mapped products:", products);
    return products;
  } catch (error: any) {
    console.error("Fetch Product Names Error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    if (error.response?.status === 403) {
      throw new Error("forbiddenError");
    }
    throw new Error(error.message || "fetchProductsError");
  }
};
