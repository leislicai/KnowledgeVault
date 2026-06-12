# KnowledgeVault

政务服务政策文件知识库——将非结构化政策文档处理为结构化 RAG 知识数据集的产品设计仓库。

## 仓库结构

```
docs/               # 产品设计文档、工作日志、功能清单
  specs/            # 设计文档
  features/         # 功能清单
  superpowers/      # 技能配置
  work-log.md       # 每日工作日志
.claude/
  skills/           # Claude Code 技能
    architecting-knowledge-forms/   # 知识管道编排技能
```

## 技能：architecting-knowledge-forms

多形态知识管道设计技能。将政策文档通过四阶段管线处理为知识库：

| Stage | 输入 | 产出 |
|-------|------|------|
| 1 — Block Extraction | 政策源文件（HTML/DOCX/PDF） | 原子化知识块（JSON） |
| 2 — Entity Extraction | 知识块 + 领域配置 | 实体目录 + 关系图 |
| 3 — Wiki Compilation | 实体目录 | 实体 Wiki 页面（Markdown） |
| 4 — QA Generation | Wiki 页面 | QA 问答对（JSON） |

核心原则：**每个数据点必须可溯源到政策原文条款**（source_articles）。

### 真实管线示例

`examples/` 目录包含一次完整执行的产出——天水市住房公积金政策文档处理：

- **31 个源文件** → **338 个知识块**
- **669 个实体**（621 个有关系，92.8%）
- **125 个 Wiki 页面**
- **496 个 QA 问答对**

详见 [docs/examples/README.md](docs/examples/README.md)

## React 交互原型

交互原型在独立仓库：
`/Users/cairuilin/Documents/KnowledgeVault-react-antd/`

技术栈：React 19 + TypeScript 6 + Vite 8 + Ant Design v6.4
