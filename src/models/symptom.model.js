import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const Symptom = sequelize.define('Symptom', {
  Symptom_id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
  },
  Patient_id: { type: DataTypes.INTEGER, allowNull: false },

  // ── خمول الغدة الدرقية symptoms ───────────────────────────────────────
  feeling_cold:        { type: DataTypes.BOOLEAN, defaultValue: false }, // الشعور بالبرد
  weight_gain:         { type: DataTypes.BOOLEAN, defaultValue: false }, // زيادة الوزن
  cold_sensitivity:    { type: DataTypes.BOOLEAN, defaultValue: false }, // الحساسية للبرد
  slow_metabolism:     { type: DataTypes.BOOLEAN, defaultValue: false }, // بطء الايض
  chronic_constipation:{ type: DataTypes.BOOLEAN, defaultValue: false }, // الامساك المزمن
  muscle_pain:         { type: DataTypes.BOOLEAN, defaultValue: false }, // آلام العضلات
  muscle_cramps:       { type: DataTypes.BOOLEAN, defaultValue: false }, // تشنجات عضلية
  dry_skin:            { type: DataTypes.BOOLEAN, defaultValue: false }, // جفاف الجلد
  hair_loss:           { type: DataTypes.BOOLEAN, defaultValue: false }, // تساقط الشعر
  less_sweating:       { type: DataTypes.BOOLEAN, defaultValue: false }, // قلة التعرق
  depression:          { type: DataTypes.BOOLEAN, defaultValue: false }, // الاكتئاب
  mood_swings:         { type: DataTypes.BOOLEAN, defaultValue: false }, // تقلب المزاج
  face_swelling:       { type: DataTypes.BOOLEAN, defaultValue: false }, // تورم في الوجه
  neck_swelling:       { type: DataTypes.BOOLEAN, defaultValue: false }, // تضخم في الرقبة
  slow_heart_rate:     { type: DataTypes.BOOLEAN, defaultValue: false }, // بطء ضربات القلب

  // ── فرط نشاط الغدة الدرقية symptoms ──────────────────────────────────
  sudden_weight_loss:  { type: DataTypes.BOOLEAN, defaultValue: false }, // خسارة الوزن المفاجئة
  increased_appetite:  { type: DataTypes.BOOLEAN, defaultValue: false }, // زيادة الشهية
  heat_sensitivity:    { type: DataTypes.BOOLEAN, defaultValue: false }, // حساسية للحرارة
  excessive_sweating:  { type: DataTypes.BOOLEAN, defaultValue: false }, // التعرق الغزير
  anxiety:             { type: DataTypes.BOOLEAN, defaultValue: false }, // القلق والتوتر
  tremors:             { type: DataTypes.BOOLEAN, defaultValue: false }, // الرعشة
  insomnia:            { type: DataTypes.BOOLEAN, defaultValue: false }, // الأرق
  fast_heart_rate:     { type: DataTypes.BOOLEAN, defaultValue: false }, // تسارع النبض
  heart_palpitations:  { type: DataTypes.BOOLEAN, defaultValue: false }, // خفقان القلب
  bowel_activity:      { type: DataTypes.BOOLEAN, defaultValue: false }, // نشاط الأمعاء
  eye_bulging:         { type: DataTypes.BOOLEAN, defaultValue: false }, // جحوظ العينين
  thin_skin:           { type: DataTypes.BOOLEAN, defaultValue: false }, // الجلد الرقيق
  thin_hair:           { type: DataTypes.BOOLEAN, defaultValue: false }, // الشعر الخفيف

  // ── Shared symptoms ────────────────────────────────────────────────────
  mood_changes:        { type: DataTypes.BOOLEAN, defaultValue: false }, // تقلب المزاج (shared)

  additional_notes:    { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName:  'symptoms',
  timestamps: true,
});

export default Symptom;