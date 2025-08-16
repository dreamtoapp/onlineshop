/**
 * Constants and enums for address management functionality
 */

/**
 * Address type options
 */
export const ADDRESS_TYPES = {
  HOME: 'المنزل',
  WORK: 'العمل',
  OTHER: 'أخرى',
} as const;

export type AddressType = typeof ADDRESS_TYPES[keyof typeof ADDRESS_TYPES];

/**
 * Address type labels for display
 */
export const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
  [ADDRESS_TYPES.HOME]: 'منزل',
  [ADDRESS_TYPES.WORK]: 'عمل',
  [ADDRESS_TYPES.OTHER]: 'أخرى',
};

/**
 * Location accuracy thresholds
 */
export const ACCURACY_THRESHOLDS = {
  EXCELLENT: 15, // meters - Green
  GOOD: 30,      // meters - Yellow
  POOR: 31,      // meters and above - Red
} as const;

/**
 * Accuracy colors for different levels
 */
export const ACCURACY_COLORS = {
  EXCELLENT: 'bg-green-500',
  GOOD: 'bg-yellow-500',
  POOR: 'bg-red-500',
} as const;

/**
 * Default coordinates (fallback values)
 */
export const DEFAULT_COORDINATES = {
  LATITUDE: '18.2255616',
  LONGITUDE: '42.5590784',
} as const;

/**
 * Form field validation messages
 */
export const VALIDATION_MESSAGES = {
  LABEL_REQUIRED: 'اسم العنوان مطلوب',
  DISTRICT_REQUIRED: 'الحي مطلوب',
  DISTRICT_MIN_LENGTH: 'الحي يجب أن يكون على الأقل حرفين',
  STREET_REQUIRED: 'الشارع مطلوب',
  STREET_MIN_LENGTH: 'الشارع يجب أن يكون على الأقل 5 أحرف',
  BUILDING_NUMBER_REQUIRED: 'رقم المبنى مطلوب',
  BUILDING_NUMBER_MIN_LENGTH: 'رقم المبنى مطلوب',
  INVALID_COORDINATES: 'إحداثيات غير صحيحة',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  ADDRESS_CREATED: 'تم إضافة العنوان بنجاح',
  ADDRESS_UPDATED: 'تم تحديث العنوان بنجاح',
  ADDRESS_DELETED: 'تم حذف العنوان بنجاح',
  ADDRESS_SET_DEFAULT: 'تم تعيين العنوان كافتراضي بنجاح',
  COORDINATES_EXTRACTED: 'تم تحديث الإحداثيات بنجاح!',
  FETCH_ADDRESSES: 'تم جلب العناوين بنجاح',
  CREATE_ADDRESS: 'تم إضافة العنوان بنجاح',
  UPDATE_ADDRESS: 'تم تحديث العنوان بنجاح',
  DELETE_ADDRESS: 'تم حذف العنوان بنجاح',
  SET_DEFAULT_ADDRESS: 'تم تعيين العنوان كافتراضي بنجاح',
  DEFAULT_ADDRESS_FOUND: 'تم العثور على العنوان الافتراضي',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'فشل في جلب العناوين',
  CREATE_FAILED: 'فشل في إضافة العنوان',
  UPDATE_FAILED: 'فشل في تحديث العنوان',
  DELETE_FAILED: 'فشل في حذف العنوان',
  SET_DEFAULT_FAILED: 'فشل في تعيين العنوان كافتراضي',
  LOCATION_DETECTION_FAILED: 'فشل في تحديد الموقع',
  COORDINATES_EXTRACTION_FAILED: 'حدث خطأ أثناء تحديث الإحداثيات',
  FETCH_ADDRESSES: 'فشل في جلب العناوين',
  CREATE_ADDRESS: 'فشل في إضافة العنوان',
  UPDATE_ADDRESS: 'فشل في تحديث العنوان',
  DELETE_ADDRESS: 'فشل في حذف العنوان',
  SET_DEFAULT_ADDRESS: 'فشل في تعيين العنوان كافتراضي',
  ADDRESS_NOT_FOUND: 'العنوان غير موجود',
  DEFAULT_ADDRESS_DELETE: 'لا يمكن حذف العنوان الافتراضي الوحيد. أضف عنوانًا جديدًا أولاً.',
  DEFAULT_ADDRESS_NOT_FOUND: 'لا يوجد عنوان افتراضي',
  DEFAULT_ADDRESS_FETCH: 'فشل في جلب العنوان الافتراضي',
} as const;

/**
 * Placeholder texts for form fields
 */
export const PLACEHOLDER_TEXTS = {
  DISTRICT: 'مثال: النزهة، العليا، الشاطئ',
  STREET: 'مثال: شارع الملك فهد، شارع التحلية',
  BUILDING_NUMBER: 'مثال: 123، 45، أ',
  FLOOR: 'مثال: 2، الثالث',
  APARTMENT_NUMBER: 'مثال: 101، أ',
  LANDMARK: 'مثال: قرب مسجد النور، مقابل بنك الراجحي',
  DELIVERY_INSTRUCTIONS: 'مثال: اترك الطلب عند الباب، اتصل عند الوصول',
  LOCATION_URL: 'ألصق رابط الموقع هنا...',
} as const;
