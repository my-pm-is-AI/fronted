# AI Agent 协作平台 API 接口文档

## 通用说明
- **基础路径 (Base URL)**: `/api/v1`
- **数据格式**: 默认使用 `application/json`，部分对话接口使用 `text/event-stream`（Server-Sent Events）。
- **认证方式**: 大部分接口需在 HTTP 请求头 (Headers) 中携带 JWT Token（登录接口除外）。
  - 格式: `Authorization: Bearer <token>`
- **通用响应结构** (非流式):
  ```json
  {
    "code": 200,
    "message": "操作提示信息",
    "data": {} // 具体业务数据，根据不同接口变化
  }
  ```

---

## 1. 认证模块 (Auth)

### 1.1 用户登录 / 注册
- **接口路径**: `/auth/login`
- **请求方法**: `POST`
- **是否需要 Token**: 否
- **请求体 (Body)**:
  ```json
  {
    "username": "test_user" // 用户名，数据库中不存在则自动注册
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user_id": 1,
      "username": "test_user"
    }
  }
  ```

---

## 2. 用户配置模块 (Profile)

### 2.1 获取个人信息
- **接口路径**: `/profile`
- **请求方法**: `GET`
- **是否需要 Token**: 是
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "full_name": "张三",
      "profession": "产品经理",
      "skills": ["Axure", "需求拆解"],
      "introduction": "资深AI产品经理",
      "hourly_rate": 200.00
    }
  }
  ```

### 2.2 更新个人信息
- **接口路径**: `/profile`
- **请求方法**: `PUT`
- **是否需要 Token**: 是
- **请求体 (Body)**:
  ```json
  {
    "full_name": "张三",
    "profession": "产品经理",
    "skills": ["Axure", "需求拆解", "AI"],
    "introduction": "资深AI产品经理",
    "hourly_rate": 250.00
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": null
  }
  ```

---

## 3. 需求管理模块 (Requirement)

### 3.1 需求沟通助手 (流式对话)
- **接口路径**: `/requirement/chat`
- **请求方法**: `POST`
- **是否需要 Token**: 是
- **请求体 (Body)**:
  ```json
  {
    "message": "我想做一个AI协作平台",
    "conversation_id": null // 首次为null，预留扩展字段
  }
  ```
- **响应格式**: `text/event-stream`
- **响应示例**:
  ```text
  data: {"content": "你想做的AI协作"}
  data: {"content": "平台核心功能有哪些？"}
  data: [DONE]
  ```

### 3.2 创建正式需求 (生成PRD)
- **接口路径**: `/requirement/create`
- **请求方法**: `POST`
- **是否需要 Token**: 是
- **说明**: 会根据传入的 PRD 正式生成需求，并自动初始化一个项目。
- **请求体 (Body)**:
  ```json
  {
    "title": "AI Agent 协作平台",
    "prd": "需求背景...功能清单...交付周期...验收标准"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "需求创建成功",
    "data": {
      "requirement_id": 1,
      "project_id": 1
    }
  }
  ```

---

## 4. 项目与分工模块 (Project)

### 4.1 匹配项目成员 (Agent)
- **接口路径**: `/project/match-agents`
- **请求方法**: `POST`
- **是否需要 Token**: 是
- **说明**: 根据 PRD 自动提取技能标签，并匹配对应的虚拟 Agent 成员加入项目。
- **请求体 (Body)**:
  ```json
  {
    "project_id": 1
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "Agent匹配成功",
    "data": {
      "matched_agents": [
        {
          "agent_id": 1,
          "name": "后端开发Agent",
          "profession": "Python开发",
          "skills": ["Python", "FastAPI"]
        }
      ]
    }
  }
  ```

### 4.2 自动生成任务分工 (TodoList & Nodes)
- **接口路径**: `/project/assign-tasks`
- **请求方法**: `POST`
- **是否需要 Token**: 是
- **说明**: 为匹配到的 Agent 生成专属任务列表 (TodoList) 和整体项目的交付节点 (Nodes)。
- **请求体 (Body)**:
  ```json
  {
    "project_id": 1
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "分工完成，已生成TodoList和交付节点",
    "data": {
      "todo_lists": [
        {
          "agent_id": 1,
          "content": "完成属于Python开发的相关任务",
          "deadline": "2026-04-15T12:00:00",
          "status": "pending"
        }
      ],
      "project_nodes": [
        {
          "name": "第一阶段交付",
          "deadline": "2026-04-22T12:00:00",
          "status": "pending"
        }
      ]
    }
  }
  ```

### 4.3 项目管家对话 (流式解答)
- **接口路径**: `/project/chat`
- **请求方法**: `POST`
- **是否需要 Token**: 是
- **说明**: 带项目上下文的 AI 答疑接口。
- **请求体 (Body)**:
  ```json
  {
    "project_id": 1,
    "member_id": 1,
    "message": "FastAPI 怎么实现流式响应？"
  }
  ```
- **响应格式**: `text/event-stream`
- **响应示例**:
  ```text
  data: {"content": "你可以使用 StreamingResponse..."}
  data: [DONE]
  ```

### 4.4 项目进度同步
- **接口路径**: `/project/progress`
- **请求方法**: `PUT`
- **是否需要 Token**: 是
- **请求体 (Body)**:
  ```json
  {
    "project_member_id": 1,
    "content": "完成了数据库设计",
    "progress_percent": 30
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "进度更新成功",
    "data": null
  }
  ```

### 4.5 获取项目整体进度
- **接口路径**: `/project/{project_id}/progress`
- **请求方法**: `GET`
- **是否需要 Token**: 是
- **路径参数**:
  - `project_id`: (整数) 项目的唯一标识 ID
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取进度成功",
    "data": {
      "project_status": "assigned",
      "members_progress": [
        {
          "agent_id": 1,
          "name": "后端开发Agent",
          "latest_progress": "完成了数据库设计",
          "progress_percent": 30,
          "update_time": "2026-04-08T15:30:00"
        }
      ],
      "overall_progress": 30
    }
  }
  ```
