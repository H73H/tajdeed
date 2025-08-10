export type Lang = 'en' | 'ar'

export const strings: Record<Lang, Record<string,string>> = {
  en: {
    appName: 'TAJDEED',
    tagline: 'Never miss a renewal again.',
    getStarted: 'Get Started',
    signIn: 'Sign in with Magic Link',
    signOut: 'Sign out',
    dashboard: 'Dashboard',
    addItem: 'Add Item',
    category: 'Category',
    title: 'Title',
    idNumber: 'ID Number',
    issueDate: 'Issue Date',
    expiryDate: 'Expiry Date',
    reminderDays: 'Reminder Days (e.g. 60,30,7,1)',
    save: 'Save',
    items: 'Your Items',
    noItems: 'No items yet. Add your first one.',
    settings: 'Settings',
    language: 'Language',
    guides: 'Renewal Guides',
    delete: 'Delete',
    edit: 'Edit',
    logout: 'Log out'
  },
  ar: {
    appName: 'تجديد',
    tagline: 'لا تفوت أي تجديد مرة أخرى.',
    getStarted: 'ابدأ الآن',
    signIn: 'تسجيل الدخول برابط سحري',
    signOut: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    addItem: 'إضافة مستند',
    category: 'الفئة',
    title: 'العنوان',
    idNumber: 'رقم الهوية',
    issueDate: 'تاريخ الإصدار',
    expiryDate: 'تاريخ الانتهاء',
    reminderDays: 'أيام التذكير (مثال: 60,30,7,1)',
    save: 'حفظ',
    items: 'مستنداتك',
    noItems: 'لا يوجد مستندات بعد، أضف أول مستند.',
    settings: 'الإعدادات',
    language: 'اللغة',
    guides: 'أدلة التجديد',
    delete: 'حذف',
    edit: 'تعديل',
    logout: 'تسجيل الخروج'
  }
}

export function t(lang: Lang, key: string) {
  return strings[lang][key] || key
}
