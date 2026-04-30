# 智扫通机器人智能客服 🤖

> 基于 LangChain Agent + RAG + FastAPI + React TypeScript 的扫地机器人智能客服系统

---

## 使用必看

本项目需要提前配置好 Python 后端环境、前端 Node.js 环境以及大模型相关 API Key。

项目运行前，请根据自己的实际环境修改配置文件中的模型名称、知识库路径、向量数据库路径等参数。

> 注意：请不要将真实 API Key 直接上传到 GitHub，建议使用环境变量或本地配置文件进行管理。

---

## 📖 项目简介

**智扫通机器人智能客服**是一款面向扫地机器人、扫拖一体机器人用户的 AI 智能客服系统。

系统基于 **LangChain Agent** 构建智能问答能力，并结合 **RAG 检索增强生成** 技术，将扫地机器人常见问题、故障排查、维护保养、选购指南等知识文档接入向量数据库，使系统能够根据用户问题检索相关知识内容，并生成更加准确、可靠的回答。

本项目采用前后端分离架构：

- 前端使用 **React + TypeScript + Vite** 构建智能客服交互界面；
- 后端使用 **FastAPI** 封装智能体问答接口；
- Agent 部分基于 **LangChain** 实现智能问答、工具调用和多轮推理；
- RAG 部分通过文档加载、文本切分、Embedding 向量化和 Chroma 向量数据库实现知识库检索；
- 系统可用于扫地机器人产品咨询、故障诊断、维护保养建议、选购问答和使用报告生成等场景。

---

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| **智能客服问答** | 支持用户围绕扫地机器人使用、故障、保养、选购等内容进行自然语言提问 |
| **RAG 检索增强** | 从本地知识库中检索相关文档片段，提高回答准确性 |
| **LangChain Agent** | 基于 LangChain 构建智能体，支持工具调用和多轮问答 |
| **FastAPI 后端** | 封装智能体接口，为前端提供统一 API 服务 |
| **React + TypeScript 前端** | 构建现代化聊天界面，实现前后端交互 |
| **流式响应** | 后端通过 StreamingResponse 返回流式文本，前端可实现逐段/逐字展示 |
| **Chroma 向量数据库** | 本地持久化存储知识库向量 |
| **Embedding 向量化** | 将知识文档和用户问题转换为向量，用于相似度检索 |
| **文档去重机制** | 通过 MD5 记录已处理文档，避免重复入库 |
| **报告生成模式** | 通过中间件动态切换提示词，支持生成用户使用报告 |
| **模块化项目结构** | Agent、RAG、模型、工具、配置、前端、后端分层清晰，便于扩展 |

---

## 🏗 系统架构

```text
┌──────────────────────────────────────────────┐
│              React + TypeScript 前端          │
│  frontend/                                    │
│  - 聊天界面                                   │
│  - 用户输入                                   │
│  - AI 回复展示                                │
│  - Markdown 渲染                              │
│  - 前后端请求交互                             │
└──────────────────────┬───────────────────────┘
                       │ HTTP / Stream 请求
                       ▼
┌──────────────────────────────────────────────┐
│                FastAPI 后端                   │
│  backend/api.py                              │
│  - /api/health                                │
│  - /api/chat/stream                           │
│  - 调用 LangChain Agent                       │
│  - 返回流式智能客服回答                       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           LangGraph Agent (基于 LangChain)    │
│  agent/react_agent.py                         │
│  - 接收用户问题                               │
│  - 调用工具函数                               │
│  - 中间件动态切换提示词                       │
│  - 流式返回回答                               │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 RAG 检索模块                  │
│  rag/rag_service.py                           │
│  rag/vector_store.py                          │
│  - 文档加载                                   │
│  - 文本切分                                   │
│  - Embedding 向量化                           │
│  - 相似度检索                                 │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Chroma 向量数据库                │
│  - 存储知识库文档向量                         │
│  - 返回相关文档片段                           │
└──────────────────────────────────────────────┘
```

---

## 📂 目录结构

```text
zhisaotong-Agent/
├── agent/                         # Agent 智能体相关逻辑
│   ├── react_agent.py             # LangChain Agent 核心逻辑
│   └── tools/                     # Agent 工具与中间件
│       ├── agent_tools.py         # 工具函数定义
│       └── middleware.py          # Agent 中间件逻辑
│
├── backend/                       # FastAPI 后端服务
│   ├── __init__.py
│   └── api.py                     # FastAPI 接口入口
│
├── config/                        # 配置文件目录
│   ├── agent.yml                  # Agent 相关配置
│   ├── chroma.yml                 # Chroma 向量库配置
│   ├── prompts.yml                # Prompt 路径配置
│   └── rag.yml                    # LLM 与 Embedding 模型配置
│
├── data/                          # 知识库与外部数据
│   ├── external/                  # 外部使用记录数据
│   ├── 扫地机器人100问.pdf
│   ├── 扫地机器人100问2.txt
│   ├── 扫拖一体机器人100问.txt
│   ├── 故障排除.txt
│   ├── 维护保养.txt
│   └── 选购指南.txt
│
├── frontend/                      # React + TypeScript 前端项目
│   ├── public/                    # 静态资源
│   ├── src/                       # 前端源码
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── model/                         # 大模型与 Embedding 模型封装
│   └── factory.py                 # 模型工厂
│
├── prompts/                       # 提示词模板
│   ├── main_prompt.txt            # 主 Agent 提示词
│   ├── rag_summarize.txt          # RAG 总结提示词
│   └── report_prompt.txt          # 报告生成提示词
│
├── rag/                           # RAG 检索增强模块
│   ├── rag_service.py             # RAG 检索摘要服务
│   └── vector_store.py            # Chroma 向量库管理
│
├── utils/                         # 通用工具函数
│   ├── config_handler.py          # 配置文件读取
│   ├── file_handler.py            # 文件读取与文档加载
│   ├── logger_handler.py          # 日志处理
│   ├── path_tool.py               # 路径处理工具
│   └── prompt_loader.py           # Prompt 加载工具
│
├── .gitignore                     # Git 忽略文件
├── md5.text                       # 文档 MD5 去重记录
├── requirements.txt               # Python 后端依赖
└── README.md                      # 项目说明文档
```

---

## 📦 环境依赖

### 1. 后端环境

建议使用：

```text
Python 3.10+
```

主要 Python 依赖包括：

| 依赖 | 用途 |
|------|------|
| `fastapi` | 后端 Web 框架 |
| `uvicorn` | FastAPI 启动服务 |
| `langchain` | Agent / Chain / Tool 框架 |
| `langchain-core` | LangChain 核心组件 |
| `langchain-community` | 第三方模型和工具集成 |
| `langgraph` | Agent 执行流程支持 |
| `langchain-chroma` | LangChain 与 Chroma 集成 |
| `langchain-text-splitters` | 文本切分 |
| `chromadb` | Chroma 向量数据库 |
| `dashscope` | 阿里云 DashScope 模型调用 |
| `pypdf` | PDF 文档读取 |
| `PyYAML` | YAML 配置文件解析 |

安装后端依赖：

```bash
pip install -r requirements.txt
```

---

### 2. 前端环境

建议使用：

```text
Node.js 18+
npm 9+
```

进入前端目录并安装依赖：

```bash
cd frontend
npm install
```

---

## ⚙️ 配置说明

### 1. 大模型 API Key 配置

本项目使用通义千问大模型和 DashScope Embedding，请提前配置 DashScope API Key。

推荐使用环境变量：

```bash
DASHSCOPE_API_KEY="your_dashscope_api_key"
```

> 注意：真实 API Key 不建议直接写入公开仓库。

---

### 2. Agent 配置

`config/agent.yml` 用于配置 Agent 相关外部数据路径。

```yaml
external_data_path: data/external/records.csv
```

该配置用于报告生成场景中读取用户使用记录数据。

---

### 3. 模型配置

`config/rag.yml` 用于配置对话模型和 Embedding 模型。

```yaml
chat_model_name: qwen3-max
embedding_model_name: text-embedding-v4
```

---

### 4. Prompt 配置

`config/prompts.yml` 用于配置提示词文件路径。

```yaml
main_prompt_path: prompts/main_prompt.txt
rag_summarize_prompt_path: prompts/rag_summarize.txt
report_prompt_path: prompts/report_prompt.txt
```

---

### 5. Chroma 向量库配置

`config/chroma.yml` 用于配置向量数据库、知识库路径、文本分块大小等参数。

```yaml
collection_name: agent
persist_directory: chroma_db
k: 3
data_path: data
md5_hex_store: md5.text
allow_knowledge_file_type: ["txt", "pdf"]
chunk_size: 200
chunk_overlap: 20
separators: ["\n\n", "\n", ".", "!", "?", "。", "！", "？", " ", ""]
```

参数说明：

| 参数 | 说明 |
|------|------|
| `collection_name` | Chroma 集合名称 |
| `persist_directory` | 向量数据库本地持久化目录 |
| `k` | 每次检索返回的最相关文档数量 |
| `data_path` | 知识库文档目录 |
| `md5_hex_store` | 文档 MD5 去重记录文件 |
| `allow_knowledge_file_type` | 允许加载的知识库文件类型 |
| `chunk_size` | 文本切分长度 |
| `chunk_overlap` | 文本块之间的重叠长度 |
| `separators` | 文本切分时使用的分隔符列表 |

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/lruihong/zhisaotong-Agent.git
cd zhisaotong-Agent
```

---

### 2. 配置环境

**配置 API Key（必须）：**

```bash
OPENAI_API_KEY="your_open_api_key"
DASHSCOPE_API_KEY="your_dashscope_api_key"
可在 [阿里云百炼平台](https://bailian.console.aliyun.com/) 获取 API Key。
```

---

### 3. 启动后端服务

打开第一个 PowerShell 窗口：

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn backend.api:app --reload
```

后端默认运行地址：

```text
http://127.0.0.1:8000
```

---

### 4. 启动前端服务

打开第二个 PowerShell 窗口：
进入项目根目录的`frontend`目录

```bash
npm.cmd install
npm.cmd run dev
```

前端默认运行地址：

```text
http://localhost:5173
```

---

### 5. 访问应用

在浏览器中打开 `http://localhost:5173`，即可进入智扫通机器人智能客服页面。

---

## 💬 使用方式

启动项目后，用户可以在前端聊天框中输入问题。系统会将问题发送给 FastAPI 后端，后端调用 LangChain Agent，并结合知识库检索结果生成回答。

### 产品使用咨询

```text
扫地机器人第一次使用需要注意什么？
扫地机器人可以拖木地板吗？
扫拖一体机器人和普通扫地机器人有什么区别？
```

---

### 故障排查

```text
扫地机器人一直原地打转怎么办？
机器人提示滤网堵塞，但是我已经清理过了怎么办？
扫地机器人连不上 WiFi 应该怎么处理？
```

---

### 维护保养

```text
扫地机器人的滤网多久换一次？
边刷和主刷应该怎么清理？
水箱长期不用需要注意什么？
```

---

### 选购建议

```text
家里有宠物，应该选择哪种扫地机器人？
预算有限，扫地机器人主要看哪些参数？
扫拖一体机器人适合小户型吗？
```

---

### 使用报告生成

```text
帮我生成我的使用报告
给我一份扫地机器人的使用分析和保养建议
```

---

## 🛠 Agent 工具与中间件

Agent 中包含以下核心工具和中间件：

| 名称 | 类型 | 说明 |
|------|------|------|
| `rag_summarize` | 工具 | 从向量知识库中检索参考资料并辅助生成回答 |
| `get_user_id` | 工具 | 获取用户 ID，用于报告生成等场景 |
| `get_current_month` | 工具 | 获取当前月份，用于查询用户使用记录 |
| `fetch_external_data` | 工具 | 从外部记录文件中读取指定用户、指定月份的使用数据 |
| `fill_context_for_report` | 工具 | 触发报告生成模式，为动态提示词切换提供上下文信号 |
| `monitor_tool` | 中间件 | 监控工具调用过程，并记录日志 |
| `log_before_model` | 中间件 | 在模型调用前记录消息数量和最新消息 |
| `report_prompt_switch` | 中间件 | 根据上下文判断是否切换为报告生成提示词 |

> 本项目未接入真实地图定位或天气查询服务，相关演示类工具不依赖第三方地图 API。

---

## 🔍 RAG 工作流程

本项目的 RAG 检索流程如下：

```text
1. 读取 data/ 目录下的知识库文档
2. 将 PDF / TXT 文档转换为 Document 对象
3. 按照 chunk_size、chunk_overlap 和 separators 进行文本切分
4. 调用 Embedding 模型将文本块转换为向量
5. 将文本块和向量存入 Chroma 向量数据库
6. 用户提问时，将问题转换为向量
7. 在 Chroma 中进行相似度检索
8. 返回最相关的文档片段
9. Agent 结合检索结果生成最终回答
```

---

## 📚 知识库说明

知识库文档存放在：

```text
data/
```

支持的文档类型包括：

```text
.txt
.pdf
```

当前知识库主要包含：

| 文件 | 内容 |
|------|------|
| `扫地机器人100问.pdf` | 扫地机器人常见问题 |
| `扫地机器人100问2.txt` | 扫地机器人补充问答 |
| `扫拖一体机器人100问.txt` | 扫拖一体机器人常见问题 |
| `故障排除.txt` | 故障排查指南 |
| `维护保养.txt` | 日常维护保养说明 |
| `选购指南.txt` | 扫地机器人选购建议 |
| `data/external/records.csv` | 用户使用记录数据，用于报告生成 |

系统会读取知识库文件，将文档内容切分并写入 Chroma 向量数据库。

已处理过的文档会通过 `md5.text` 记录，避免重复向量化和重复入库。

如需扩展知识库，只需要将新的 `.txt` 或 `.pdf` 文件放入 `data/` 目录，然后重新启动后端服务即可。

---

## 📋 日志与调试

项目中包含日志工具模块，可用于记录系统运行状态、Agent 调用过程、RAG 检索过程和错误信息。

常见调试方向：

| 问题 | 排查方式 |
|------|----------|
| 后端无法启动 | 检查 `requirements.txt` 是否安装完整 |
| 前端无法访问后端 | 检查 FastAPI 是否启动，接口地址是否正确 |
| AI 没有回答 | 检查 DashScope API Key 是否配置正确 |
| 检索不到知识库内容 | 检查 `data/` 目录是否有文档，Chroma 是否成功生成 |
| 前端页面空白 | 检查 `npm install` 是否成功，浏览器控制台是否报错 |
| 接口跨域错误 | 检查 FastAPI CORS 配置 |
| 回答内容不准确 | 检查知识库文档内容、`chunk_size`、检索数量 `k` 等参数 |

---

## 🧪 项目亮点

- 采用 **前后端分离架构**，项目层次清晰；
- 使用 **React + TypeScript + Vite** 构建前端页面，交互体验较好；
- 使用 **FastAPI** 提供后端接口，接口调用简洁高效；
- 基于 **LangChain Agent** 实现智能体问答逻辑；
- 结合 **RAG 技术** 提高专业问题回答准确性；
- 使用 **Chroma 向量数据库** 实现本地知识库检索；
- 支持扫地机器人真实应用场景，如选购、维护、故障排查等；
- 支持通过中间件进行动态提示词切换；
- 支持流式响应，提高聊天交互体验；
- 项目结构模块化，便于后续扩展更多功能。

---

## 🔮 后续优化方向

- 增加用户登录与多用户会话管理；
- 增加聊天历史持久化存储；
- 优化前端聊天页面样式和移动端适配；
- 完善流式输出效果，实现更自然的逐字生成；
- 支持上传自定义知识库文档；
- 支持 Word、Excel、Markdown 等更多文档格式；
- 引入 Redis、Milvus 等更适合生产环境的向量数据库；
- 增加后台管理页面，用于维护知识库和查看用户问题；
- 增加模型回答评价机制，持续优化客服回答质量。

---

## 📄 许可证

本项目仅供学习、课程设计、项目实践和技术交流使用。

如需用于商业用途，请根据实际使用的大模型服务和第三方依赖协议进行合规处理。

---

## 🙏 鸣谢

感谢以下技术和平台支持：

- LangChain
- LangGraph
- FastAPI
- React
- TypeScript
- Vite
- Chroma
- 阿里云 DashScope
