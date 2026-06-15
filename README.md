# KnowledgeVault

政务服务政策文件知识库——将非结构化政策文档处理为结构化 RAG 知识数据集。

## 技能：architecting-knowledge-forms

多形态知识管线编排技能。将政策文档通过四阶段管线处理为知识库：

| Stage | 输入 | 产出 |
|-------|------|------|
| 1 — 块提取 | 政策源文件（HTML/DOCX/PDF） | 原子化知识块（JSON） |
| 2 — 实体提取 | 知识块 + 领域配置 | 实体目录 + 关系图谱 |
| 3 — Wiki 编译 | 实体目录 | 策划型 Wiki 页面（Markdown） |
| 4 — QA 生成 | Wiki 页面 | QA 问答对（JSON） |

核心原则：**一个写入目标（Block），图/Wiki/QA 全部派生。每个数据点可溯源到源文档。**

### 管线示例

`examples/` 目录包含最近一次完整执行产出——天水市住房公积金 23 份政策文档：

| 阶段 | 产出 | 质量 |
|------|------|------|
| Stage 1 | **250 个知识块** | 置信度 0.949 |
| Stage 2 | **65 个实体 + 97 条关系** | 87.7% 有联系，0 英文命名违规 |
| Stage 3 | **24 个 Wiki 页面** | 含 source_block_ids 追溯 |
| Stage 4 | **114 个 QA 对** | 91 条 ≥0.9 置信度 |

详见 [examples/pipeline-output/](examples/pipeline-output/) 和 [GETTING_STARTED.md](GETTING_STARTED.md)。

技能位置：`.claude/skills/architecting-knowledge-forms/`

## React 交互原型

`/Users/cairuilin/Documents/KnowledgeVault-react-antd/`

技术栈：React 19 + TypeScript 6 + Vite 8 + Ant Design v6.4
