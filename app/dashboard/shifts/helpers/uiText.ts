// النصوص العربية
export const UI_TEXT = {
  headerTitle: 'إدارة الورديات',
  addShiftButton: 'إضافة وردية جديدة',
  noShiftsMessage: 'لا توجد ورديات متوفرة. اضغط على الزر لإضافة وردية جديدة.',
  shiftName: 'اسم الوردية',
  shiftStartTime: 'وقت البدء',
  shiftEndTime: 'وقت الانتهاء',
  shiftDuration: 'مدة العمل',
  deleteButton: 'حذف',
  cancelButton: 'إلغاء',
  saveButton: 'حفظ',
  placeholder: {
    shiftName: "أدخل اسم الوردية (مثل 'نهار' أو 'ليل')",
  },
  dialogDescription: 'يرجى إدخال تفاصيل الوردية الجديدة أدناه.',
  errors: {
    nameRequired: 'يرجى إدخال اسم الوردية.',
    startTimeRequired: 'يرجى إدخال وقت البدء.',
    endTimeRequired: 'يرجى إدخال وقت الانتهاء.',
    invalidTime: 'وقت البدء يجب أن يكون قبل أو يساوي وقت الانتهاء.',
  },
  successMessages: {
    shiftAdded: 'تمت إضافة الوردية بنجاح!',
    shiftDeleted: 'تم حذف الوردية بنجاح!',
  },
  errorMessages: {
    fetchShifts: 'فشل في تحميل الورديات.',
    addShift: 'فشل في إضافة الوردية.',
    deleteShift: 'فشل في حذف الوردية.',
  },
};
