import { DataTypes } from 'sequelize';
import sequelize     from '../config/db.js';

const Symptom = sequelize.define('Symptom', {
  Symptom_id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  Patient_id: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },

  // ── الأعراض العامة ─────────────────────────────────────────────────────
  Fatigue: {
    type:         DataTypes.ENUM('none', 'mild', 'moderate', 'severe'),
    defaultValue: 'none',
  },
  Weight_Change: {
    type:         DataTypes.ENUM('none', 'mild', 'moderate', 'severe'),
    defaultValue: 'none',
  },
  Cold_Heat_Intolerance: {
    type:         DataTypes.ENUM('none', 'mild', 'moderate', 'severe'),
    defaultValue: 'none',
  },

  // ── العلامات الجسدية ───────────────────────────────────────────────────
  Hair_Loss:     { type: DataTypes.BOOLEAN, defaultValue: false },
  Dry_Skin:      { type: DataTypes.BOOLEAN, defaultValue: false },
  Neck_Swelling: { type: DataTypes.BOOLEAN, defaultValue: false },

  // ── الأعراض العصبية ────────────────────────────────────────────────────
  Anxiety:                  { type: DataTypes.INTEGER, defaultValue: 0 },
  Mood_Swings:              { type: DataTypes.INTEGER, defaultValue: 0 },
  Concentration_Difficulty: { type: DataTypes.INTEGER, defaultValue: 0 },

  Additional_Notes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName:  'symptoms',
  timestamps: true,
});

export default Symptom;