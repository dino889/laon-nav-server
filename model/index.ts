import { DESTRUCTION } from "dns";
import * as SQ from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// 👋 DB 정의
export const sequelize = new SQ.Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    idle: 1000,
  },
  port: Number(process.env.DB_PORT),
  logging: false,
});

// 🚀 DB 연결
export async function dbinit() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // 🔥 Model 마이그레이션
    (async () => {
      await sequelize.sync({ alter: true }); //{ alter: true }
      // Code here
    })();
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
    unique: false,
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
  heartCount: {
    type: SQ.DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: SQ.DataTypes.FLOAT,
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

export const Review = sequelize.define("review", {
  id: {
    type: SQ.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  rate: {
    type: SQ.DataTypes.INTEGER,
    defaultValue: 0,
  },
  content: {
    type: SQ.DataTypes.STRING(255),
    allowNull: false,
  },
});

export const Like = sequelize.define("like", {
  id: {
    type: SQ.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

//  🍎 관계 정의
Notification.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Place.belongsTo(Area);
Place.hasMany(Like);
Like.belongsTo(Place, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Review.belongsTo(Place, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Review.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Like.belongsTo(Place, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Like.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
