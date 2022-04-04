import { DESTRUCTION } from "dns";
import * as SQ from "sequelize";

// 👋 DB 정의
export const sequelize = new SQ.Sequelize("navdb", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 1000,
  },
});

// 🚀 DB 연결
export async function dbinit() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// ⭐️ Model 정의
export const User = sequelize.define("user", {
  id: {
    type: SQ.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: SQ.DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: SQ.DataTypes.STRING(100),
    allowNull: false,
  },
  username: {
    type: SQ.DataTypes.STRING(50),
    allowNull: false,
  },
  nickname: {
    type: SQ.DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  social_type: {
    type: SQ.DataTypes.STRING(255),
    allowNull: true,
  },
});

export const Notification = sequelize.define("notification", {
  id: {
    type: SQ.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: SQ.DataTypes.STRING(100),
    allowNull: false,
  },
  title: {
    type: SQ.DataTypes.STRING(100),
    allowNull: false,
  },
  content: {
    type: SQ.DataTypes.STRING(200),
    allowNull: false,
  },
});

export const Area = sequelize.define("area", {
  id: {
    type: SQ.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: SQ.DataTypes.STRING(50),
    allowNull: false,
  },
  imgURL: {
    type: SQ.DataTypes.TEXT,
    allowNull: true,
  },
  lat: {
    type: SQ.DataTypes.FLOAT,
    allowNull: true,
  },
  long: {
    type: SQ.DataTypes.FLOAT,
    allowNull: true,
  },
});

export const Place = sequelize.define("place", {
  id: {
    type: SQ.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: SQ.DataTypes.STRING(100),
    allowNull: false,
  },
  summary: {
    type: SQ.DataTypes.STRING(200),
    allowNull: true,
  },
  description: {
    type: SQ.DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: SQ.DataTypes.INTEGER,
    defaultValue: 0,
  },
  lat: {
    type: SQ.DataTypes.FLOAT,
    allowNull: true,
  },
  long: {
    type: SQ.DataTypes.FLOAT,
    allowNull: true,
  },
  imgURL: {
    type: SQ.DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: SQ.DataTypes.STRING(100),
    allowNull: true,
  },
  address: {
    type: SQ.DataTypes.STRING(255),
  },
});

//  🍎 관계 정의
Notification.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Place.belongsTo(Area);

// 🔥 Model 마이그레이션
(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();
