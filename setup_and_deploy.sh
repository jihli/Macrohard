#!/usr/bin/env bash
set -euo pipefail

ROOT_PWD="Aa11223344"

# 1. 安装 MySQL（如果未安装）
if ! command -v mysql >/dev/null; then
  echo "🔄 更新 apt 并安装 mysql-server..."
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
fi

# 2. 启动 MySQL
echo "🚀 启动 MySQL..."
service mysql start

# 等待 socket 文件就绪
echo -n "⏳ 等待 MySQL socket..."
for i in $(seq 1 10); do
  [ -S /var/run/mysqld/mysqld.sock ] && { echo " OK"; break; }
  sleep 1
done

# 3. 如果还能通过 socket 登录（意味着还没改插件），就做第一次的 ALTER USER
if sudo mysql -e "SELECT 1;" >/dev/null 2>&1; then
  echo "🔐 首次配置 root 密码和认证插件..."
  sudo mysql <<SQL
ALTER USER 'root'@'localhost'
  IDENTIFIED WITH mysql_native_password
  BY '${ROOT_PWD}';
FLUSH PRIVILEGES;
SQL
else
  echo "🔑 root 已用密码认证，跳过首次配置。"
fi

# 4. 进入 Database 目录并用密码运行 deploy.sh
echo "📦 运行 deploy.sh..."
cd "$(dirname "$0")/Database"
MYSQL_PWD="${ROOT_PWD}" ./deploy.sh

echo "🎉 全部完成！"
