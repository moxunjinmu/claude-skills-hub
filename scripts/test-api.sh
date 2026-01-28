#!/bin/bash

# API 测试脚本
# 使用方法: ./scripts/test-api.sh

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Claude Skills Hub - API 测试"
echo "========================================="
echo ""

# 测试 1: 用户注册
echo -e "${YELLOW}测试 1: 用户注册${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "password123"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "User registered successfully"; then
  echo -e "${GREEN}✓ 注册成功${NC}"
  TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "Token: ${TOKEN:0:20}..."
else
  echo -e "${RED}✗ 注册失败${NC}"
  echo "$REGISTER_RESPONSE"
fi
echo ""

# 测试 2: 用户登录
echo -e "${YELLOW}测试 2: 用户登录${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
  echo -e "${GREEN}✓ 登录成功${NC}"
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
  echo -e "${RED}✗ 登录失败${NC}"
  echo "$LOGIN_RESPONSE"
fi
echo ""

# 测试 3: 获取 Skills 列表
echo -e "${YELLOW}测试 3: 获取 Skills 列表${NC}"
SKILLS_RESPONSE=$(curl -s $BASE_URL/api/skills)

if echo "$SKILLS_RESPONSE" | grep -q "Skills retrieved successfully"; then
  echo -e "${GREEN}✓ 获取成功${NC}"
  TOTAL=$(echo $SKILLS_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
  echo "总共 $TOTAL 个 Skills"
else
  echo -e "${RED}✗ 获取失败${NC}"
  echo "$SKILLS_RESPONSE"
fi
echo ""

# 测试 4: 带筛选的 Skills 列表
echo -e "${YELLOW}测试 4: 带筛选的 Skills 列表${NC}"
FILTERED_RESPONSE=$(curl -s "$BASE_URL/api/skills?sort=newest&limit=5")

if echo "$FILTERED_RESPONSE" | grep -q "Skills retrieved successfully"; then
  echo -e "${GREEN}✓ 筛选成功${NC}"
else
  echo -e "${RED}✗ 筛选失败${NC}"
  echo "$FILTERED_RESPONSE"
fi
echo ""

# 测试 5: 错误处理 - 无效登录
echo -e "${YELLOW}测试 5: 错误处理 - 无效登录${NC}"
ERROR_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid@example.com",
    "password": "wrongpassword"
  }')

if echo "$ERROR_RESPONSE" | grep -q "Invalid email or password"; then
  echo -e "${GREEN}✓ 错误处理正确${NC}"
else
  echo -e "${RED}✗ 错误处理失败${NC}"
  echo "$ERROR_RESPONSE"
fi
echo ""

echo "========================================="
echo "测试完成！"
echo "========================================="
