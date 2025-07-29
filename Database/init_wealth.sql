/* ---------- 一键初始化脚本：init_wealth.sql ---------- */
-- 1) 如数据库已存在先删除，再新建保持干净
DROP DATABASE IF EXISTS wealth_app;
CREATE DATABASE wealth_app DEFAULT CHARSET = utf8mb4;
USE wealth_app;

-- 2) 关闭外键检查，方便按任意顺序 DROP
SET FOREIGN_KEY_CHECKS = 0;

/* --- DROP TABLES (子表→父表) --- */
DROP TABLE IF EXISTS holding_prices;
DROP TABLE IF EXISTS networth_daily;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS holdings;
DROP TABLE IF EXISTS recurring_transactions;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

/* --- CREATE TABLES (父表→子表) --- */

-- 0. 用户表
CREATE TABLE users (
  user_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  username  VARCHAR(50) NOT NULL UNIQUE,
  timezone  VARCHAR(30) DEFAULT 'UTC'
);

-- 1. 账户表
CREATE TABLE accounts (
  account_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT NOT NULL,
  account_name    VARCHAR(60) NOT NULL,
  account_type    ENUM('Cash','Bank','Credit','Investment') NOT NULL,
  currency        CHAR(3) DEFAULT 'USD',
  current_balance DECIMAL(12,2) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 2. 类别表
CREATE TABLE categories (
  category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(40) NOT NULL,
  flow_type   ENUM('Income','Spending') NOT NULL
);

-- 3. 交易流水表
CREATE TABLE transactions (
  transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id        BIGINT NOT NULL,
  account_id     BIGINT NOT NULL,
  category_id    BIGINT NOT NULL,
  txn_date       DATE NOT NULL,
  txn_name       VARCHAR(80),
  merchant_name  VARCHAR(80),
  flow_type      ENUM('Income','Spending') NOT NULL,
  amount         DECIMAL(12,2) NOT NULL,
  description    TEXT,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(user_id),
  FOREIGN KEY (account_id)  REFERENCES accounts(account_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  INDEX idx_user_date (user_id, txn_date)
);

-- 4. 循环交易表
CREATE TABLE recurring_transactions (
  recurring_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT NOT NULL,
  account_id   BIGINT NOT NULL,
  category_id  BIGINT NOT NULL,
  flow_type    ENUM('Income','Spending') NOT NULL,
  amount       DECIMAL(12,2) NOT NULL,
  start_date   DATE NOT NULL,
  frequency    ENUM('Daily','Weekly','Monthly','Quarterly','Yearly') NOT NULL,
  end_date     DATE DEFAULT NULL,
  note         VARCHAR(120),
  FOREIGN KEY (user_id)     REFERENCES users(user_id),
  FOREIGN KEY (account_id)  REFERENCES accounts(account_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 5. 持仓表
CREATE TABLE holdings (
  holding_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT NOT NULL,
  account_id   BIGINT NOT NULL,
  product_code VARCHAR(30),
  product_name VARCHAR(80),
  asset_type   ENUM('Stock','Bond','Option','Crypto','Fund') NOT NULL,
  quantity     DECIMAL(18,6) NOT NULL,
  unit_cost    DECIMAL(12,4) NOT NULL,
  FOREIGN KEY (user_id)    REFERENCES users(user_id),
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- 6. 日价格快照
CREATE TABLE holding_prices (
  holding_id  BIGINT NOT NULL,
  price_date  DATE   NOT NULL,
  close_price DECIMAL(12,4) NOT NULL,
  PRIMARY KEY (holding_id, price_date),
  FOREIGN KEY (holding_id) REFERENCES holdings(holding_id)
);

-- 7. 预算表
CREATE TABLE budgets (
  budget_id       BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT NOT NULL,
  category_id     BIGINT NOT NULL,
  period_start    DATE NOT NULL,
  budget_amount   DECIMAL(12,2) NOT NULL,
  alert_threshold DECIMAL(5,2)  DEFAULT 1.0,
  budget_name     VARCHAR(60),
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  UNIQUE KEY uniq_user_cat_month (user_id, category_id, period_start)
);

-- 8. 净资产快照
CREATE TABLE networth_daily (
  user_id       BIGINT NOT NULL,
  snapshot_date DATE   NOT NULL,
  net_worth     DECIMAL(14,2) NOT NULL,
  PRIMARY KEY (user_id, snapshot_date),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3) 重新开启外键检查
SET FOREIGN_KEY_CHECKS = 1;
