-- 创建 goals 表
USE wealth_app;

CREATE TABLE IF NOT EXISTS goals (
  goal_id       BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT NOT NULL,
  goal_name     VARCHAR(100) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline      DATE,
  priority      ENUM('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'MEDIUM',
  goal_type     VARCHAR(50) NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  INDEX idx_user_active (user_id, is_active),
  INDEX idx_deadline (deadline)
);

-- 插入一些测试数据
INSERT INTO goals (user_id, goal_name, target_amount, current_amount, deadline, priority, goal_type, is_active) VALUES
(1, '紧急备用金', 50000, 35000, DATE_ADD(CURDATE(), INTERVAL 180 DAY), 'HIGH', 'emergency', TRUE),
(1, '欧洲旅行基金', 30000, 18000, DATE_ADD(CURDATE(), INTERVAL 270 DAY), 'MEDIUM', 'travel', TRUE),
(1, '购房首付', 200000, 80000, DATE_ADD(CURDATE(), INTERVAL 365 DAY), 'HIGH', 'savings', TRUE); 