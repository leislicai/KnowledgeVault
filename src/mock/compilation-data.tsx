import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { FeatureState, FileStatus, TreeNode, PushTask } from '../types/knowledge';

export type { FeatureState, FileStatus, TreeNode, PushTask };

export const FEATURE_NAMES = ['大纲', '实体', '关系', '场景', '流程', '问答', 'wiki', '行动', '摘要'];

export const featureColor = (s: FeatureState) => s === 'high' ? '#4a7c59' : s === 'review' ? '#8b6914' : 'default';
export const featureLabel = (s: FeatureState) => s === 'high' ? '已完成' : s === 'review' ? '待审核' : '未解析';

export const fileFeatures: Record<string, Record<string, { state: FeatureState; summary: string }>> = {
  '1': {
    大纲:   { state: 'high', summary: '文档结构清晰，已提取 4 个一级章节和 2 个子章节，大纲评分 95 分' },
    实体:   { state: 'high', summary: '识别出 12 个技术术语和 3 个标准参数实体，置信度均 > 90%' },
    关系:   { state: 'review', summary: '已提取 5 组参数关联关系，其中"修正系数-温度"关系置信度 62% 需人工确认' },
    场景:   { state: 'high', summary: '覆盖高原、标准、极限 3 种运行场景，场景边界条件已明确标注' },
    流程:   { state: 'high', summary: '提取了参数修正流程和校准流程，含 3 个决策点和 2 个循环节点' },
    问答:   { state: 'default', summary: '文档为技术规范类，暂未提取到明确的 Q&A 对' },
    wiki:   { state: 'high', summary: '已生成本文档的标准化场景摘要，覆盖设备运行全流程' },
    行动:   { state: 'review', summary: '提取了 4 项操作建议，其中"UPS 电源配置"优先级需商榷' },
    摘要:   { state: 'high', summary: '文档核心信息完整，AI 摘要覆盖全部关键参数和修正方案' },
  },
  '2': {
    大纲:   { state: 'high', summary: '文档结构完整，4 个一级章节层次分明，大纲评分 93 分' },
    实体:   { state: 'review', summary: '提取了海拔修正系数、压力补偿装置等 8 个实体，部分边界模糊' },
    关系:   { state: 'review', summary: '已识别海拔-温度、海拔-压力 2 组修正关系，补偿装置关联待核实' },
    场景:   { state: 'high', summary: '覆盖高原 3000m/4000m/5000m 三档场景，散热效率逐级下降' },
    流程:   { state: 'review', summary: '参数修正流程已提取，但首次运行预热步骤与常规流程未拆分' },
    问答:   { state: 'default', summary: '文档以说明为主，未提取到结构化 Q&A 内容' },
    wiki:   { state: 'high', summary: '场景 Wiki 已生成，汇总高原工况修正的核心原则和注意事项' },
    行动:   { state: 'default', summary: '操作建议分散于各章节，尚未聚合为结构化行动清单' },
    摘要:   { state: 'high', summary: '文档核心为高原环境下的参数修正，摘要已涵盖关键修正系数' },
  },
  '3': {
    大纲:   { state: 'high', summary: '设备维护手册结构标准，已提取日常维护与故障处理两大板块' },
    实体:   { state: 'review', summary: '已识别 15 个设备部件实体，3 个部件名称不规范需标准化' },
    关系:   { state: 'default', summary: '文档为操作指南，实体间关系模式不明显，暂未提取' },
    场景:   { state: 'default', summary: '文档偏操作步骤，场景化解析结果有限' },
    流程:   { state: 'high', summary: '提取了日常点检、定期保养、故障排查 3 条完整操作流程' },
    问答:   { state: 'default', summary: '手册类文档，未检测到 Q&A 对' },
    wiki:   { state: 'default', summary: '维护手册不适合生成场景 Wiki，建议改用流程摘要' },
    行动:   { state: 'review', summary: '提取了 8 项维护操作，其中 2 项周期设定与行业标准有偏差' },
    摘要:   { state: 'review', summary: '文档覆盖范围广，AI 摘要已提取核心维护项，但需人工确认优先级' },
  },
  '4': {
    大纲:   { state: 'high', summary: '安全管理制度结构规范，含总则、细则、检查、奖惩 4 大模块' },
    实体:   { state: 'high', summary: '识别了 20+ 安全术语、责任主体和检查指标，实体分类清晰' },
    关系:   { state: 'high', summary: '提取了制度-责任人、违规-处罚、检查-整改 3 组核心关系链' },
    场景:   { state: 'review', summary: '覆盖日常检查、应急响应、事故处理场景，应急场景细节需补充' },
    流程:   { state: 'high', summary: '安全检查流程和违规处理流程已完整提取，含审批节点' },
    问答:   { state: 'default', summary: '制度汇编类文档，未包含结构化 Q&A' },
    wiki:   { state: 'review', summary: '安全制度 Wiki 已生成初稿，生产安全部分的交叉引用待补充' },
    行动:   { state: 'default', summary: '制度中的操作规范较多，行动项尚在解析中' },
    摘要:   { state: 'high', summary: '文档为安全生产管理制度汇编，摘要涵盖了所有核心制度要点' },
  },
  '5': {
    大纲:   { state: 'high', summary: '销售话术模板结构清晰，按客户类型和场景分为 5 大模块' },
    实体:   { state: 'review', summary: '提取了客户画像、卖点标签等 10 个实体，买点对应关系待完善' },
    关系:   { state: 'high', summary: '已建立客户类型-话术-卖点的三维映射关系' },
    场景:   { state: 'high', summary: '覆盖初次拜访、异议处理、竞品回应、签约促成 4 大销售场景' },
    流程:   { state: 'default', summary: '话术模板以内容为主，流程型结构不明显' },
    问答:   { state: 'high', summary: '已提取 8 组常见客户异议与标准应答' },
    wiki:   { state: 'high', summary: '销售场景 Wiki 已生成，可直接用于销售培训和新员工入职' },
    行动:   { state: 'review', summary: '提取了 6 项销售动作建议，Q2 话术更新的时效性需确认' },
    摘要:   { state: 'high', summary: '2026 Q2 销售话术模板，摘要覆盖核心话术策略和适用场景' },
  },
  '6': {
    大纲:   { state: 'review', summary: '研发流程文档基础框架已提取，但章节命名不统一需规范' },
    实体:   { state: 'default', summary: '文档为流程类，实体抽取正在进行中' },
    关系:   { state: 'default', summary: '关系抽取依赖实体完成，当前进度 30%' },
    场景:   { state: 'review', summary: '已初步识别需求评审、设计验证、试产评估 3 个场景' },
    流程:   { state: 'high', summary: '研发全流程已完整提取，含 5 阶段 12 节点，流程链路清晰' },
    问答:   { state: 'default', summary: '流程文档非 Q&A 格式，暂未提取' },
    wiki:   { state: 'default', summary: '研发流程文档偏标准化，Wiki 生成中' },
    行动:   { state: 'default', summary: '流程节点较多，结构化行动项尚在解析' },
    摘要:   { state: 'review', summary: '新产品研发流程 v2，摘要已提取核心阶段，需确认版本变更内容' },
  },
  'doc-002': {
    大纲:   { state: 'high', summary: '文档结构完整，4 个一级章节层次分明，大纲评分 93 分' },
    实体:   { state: 'review', summary: '提取了海拔修正系数、压力补偿装置等 8 个实体，部分边界模糊' },
    关系:   { state: 'review', summary: '已识别海拔-温度、海拔-压力 2 组修正关系，补偿装置关联待核实' },
    场景:   { state: 'high', summary: '覆盖高原 3000m/4000m/5000m 三档场景，散热效率逐级下降' },
    流程:   { state: 'review', summary: '参数修正流程已提取，但首次运行预热步骤与常规流程未拆分' },
    问答:   { state: 'default', summary: '文档以说明为主，未提取到结构化 Q&A 内容' },
    wiki:   { state: 'high', summary: '场景 Wiki 已生成，汇总高原工况修正的核心原则和注意事项' },
    行动:   { state: 'default', summary: '操作建议分散于各章节，尚未聚合为结构化行动清单' },
    摘要:   { state: 'high', summary: '文档核心为高原环境下的参数修正，摘要已涵盖关键修正系数' },
  },
};

export const files: Record<string, { name: string; status: string }> = {
  '1': { name: '工艺参数设定规范_v3.pdf', status: '已发布' },
  '2': { name: '高原工况补充说明.docx', status: '未归档' },
  '3': { name: '设备维护操作手册.docx', status: '编译中' },
  '4': { name: '安全生产管理制度汇编.pdf', status: '未归档' },
  '5': { name: '销售话术模板_2026Q2.docx', status: '已发布' },
  '6': { name: '新产品研发流程_v2.docx', status: '编译中' },
  'doc-002': { name: '高原工况补充说明.docx', status: '未归档' },
};

export const initialTreeData: TreeNode[] = [
  { key: 'root', title: '高原工况补充说明', icon: <FolderOutlined />, children: [
    { key: 'ch1', title: '一、背景与适用范围', icon: <FileOutlined /> },
    { key: 'ch2', title: '二、海拔对设备影响', icon: <FileOutlined /> },
    { key: 'ch3', title: '三、参数修正系数', icon: <FolderOutlined />, children: [
      { key: 'ch3-1', title: '3.1 温度修正', icon: <FileOutlined /> },
      { key: 'ch3-2', title: '3.2 压力修正', icon: <FileOutlined /> },
      { key: 'fig1', title: ' 图1 温度-压力曲线', icon: <FileOutlined /> },
      { key: 'tab1', title: ' 表1 各工况参数对照', icon: <FileOutlined /> },
    ]},
    { key: 'ch4', title: '四、使用注意事项', icon: <FileOutlined /> },
  ]}];

export const findNodeAndParent = (nodes: TreeNode[], key: string): { node: TreeNode | null; siblings: TreeNode[]; index: number } => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].key === key) return { node: nodes[i], siblings: nodes, index: i };
    if (nodes[i].children) {
      const found = findNodeAndParent(nodes[i].children!, key);
      if (found.node) return found;
    }
  }
  return { node: null, siblings: nodes, index: -1 };
};

export const chapterContent: Record<string, { title: string; content: string; original: string; score: number }> = {
  root: { title: '整体文档', content: '本文档规定了在高原环境下设备运行时的参数修正方案和使用注意事项。\n\n包含：背景与适用范围、海拔对设备影响、参数修正系数、使用注意事项等章节。\n\n核心结论：当海拔超过 3000m 时，温度上限从 200°C 修正至 170°C，压力上限从 0.8MPa 修正至 0.7MPa。', score: 93, original: '# 高原工况补充说明\n\n**生效日期：2026-05-01**\n\n## 一、背景与适用范围\n\n本说明适用于海拔 3000m 以上地区使用的 XX 系列设备。标准参数在高原环境下需要进行修正以保证设备正常运行。\n\n## 二、海拔对设备影响\n\n高海拔地区空气密度降低，导致散热效率下降约 15%。设备运行温度升高，需对标准参数进行系统性调整。\n\n## 三、参数修正系数\n\n### 3.1 温度修正\n\n标准工作温度为 150-200°C。在海拔超过 3000m 时，上限温度应降低至 170°C。高海拔地区空气密度降低，散热效率下降约 15%。\n\n### 3.2 压力修正\n\n标准工作压力为 0.5-0.8MPa。在海拔超过 3000m 时，上限压力调整为 0.7MPa。设计极限压力为 1.2MPa（短期耐受，不超过 30 分钟）。\n\n## 四、使用注意事项\n\n1. 首次运行前需进行 30 分钟预热\n2. 每 200 小时检查一次压力补偿装置\n3. 建议配置 UPS 电源\n4. 定期校准参数设置' },
  ch1: { title: '一、背景与适用范围', content: '本说明适用于海拔 3000m 以上地区使用的 XX 系列设备。\n\n标准参数在高原环境下需要进行修正以保证设备正常运行。', score: 90, original: '## 一、背景与适用范围\n\n本说明适用于海拔 3000m 以上地区使用的 XX 系列设备。标准参数在高原环境下需要进行修正以保证设备正常运行。\n\n当设备运行海拔超过 3000m 时，散热效率下降约 15%，设备运行温度升高，需对标准参数进行系统性调整。' },
  ch2: { title: '二、海拔对设备影响', content: '高海拔地区空气密度降低，导致散热效率下降约 15%。\n\n设备运行温度升高，需对标准参数进行系统性调整。', score: 91, original: '## 二、海拔对设备影响\n\n高海拔地区空气密度降低，导致散热效率下降约 15%。设备运行温度升高，需对标准参数进行系统性调整。\n\n经测试，海拔 4000m 时散热效率下降约 22%，5000m 时下降约 30%，建议超过 3000m 即启用修正方案。' },
  ch3: { title: '三、参数修正系数', content: '当海拔超过 3000m 时，需对标准参数进行修正：\n\n• 温度上限：标准 200°C → 修正至 170°C\n• 压力上限：标准 0.8MPa → 修正至 0.7MPa', score: 88, original: '## 三、参数修正系数\n\n当海拔超过 3000m 时，需对标准参数进行修正：\n\n温度上限：标准 200°C → 修正至 170°C（降低 30°C，降幅 15%）\n压力上限：标准 0.8MPa → 修正至 0.7MPa（降低 0.1MPa，降幅 12.5%）\n\n修正原因：根据 GB/T 12345-2025 标准，高海拔地区需执行温度降额和压力补偿。' },
  'ch3-1': { title: '3.1 温度修正', content: '标准工作温度为 150-200°C。\n\n在海拔超过 3000m 时，上限温度应降低至 170°C。', score: 85, original: '### 3.1 温度修正\n\n标准工作温度为 150°C 至 200°C。在海拔超过 3000m 时，上限温度应降低至 170°C。\n\n修正范围：200°C → 170°C（-30°C）\n适用条件：海拔 ≥ 3000m，环境温度 ≤ 40°C\n\n注意：修正后的参数适用于持续运行工况，短期峰值可放宽至 180°C。' },
  'ch3-2': { title: '3.2 压力修正', content: '标准工作压力为 0.5-0.8MPa。\n\n在海拔超过 3000m 时，上限压力调整为 0.7MPa。', score: 87, original: '### 3.2 压力修正\n\n标准工作压力为 0.5-0.8MPa。在海拔超过 3000m 时，上限压力调整为 0.7MPa。\n\n设计极限压力：1.2MPa（短期耐受，不超过 30 分钟）\n修正范围：0.8MPa → 0.7MPa（-0.1MPa）\n\n需要同时执行温度和压力修正，不可单独修正其中一项。' },
  ch4: { title: '四、使用注意事项', content: '1. 首次运行前需进行 30 分钟预热\n2. 每 200 小时检查一次压力补偿装置\n3. 建议配置 UPS 电源', score: 92, original: '## 四、使用注意事项\n\n1. 首次运行前需进行 30 分钟预热\n2. 每 200 小时检查一次压力补偿装置\n3. 建议配置 UPS 电源\n4. 定期校准参数设置\n5. 高原环境下增加巡检频率至每 100 小时一次' },
  fig1: { title: ' 图1 温度-压力曲线', content: '横轴：温度（°C）  纵轴：压力（MPa）\n\n标准工况曲线与高原修正曲线的对比。修正后温度上限降低 30°C，压力上限降低 0.1MPa。\n\n关键交点：(170°C, 0.7MPa) 为高原工况上限参数点。', score: 90, original: '图1 温度-压力曲线\n\n说明：展示了标准工况与高原工况下的温度-压力对照关系。蓝色实线为标准曲线，红色虚线为修正后曲线。\n\n关键交点：(170°C, 0.7MPa) 为高原工况上限参数点。' },
  tab1: { title: ' 表1 各工况参数对照', content: '三种工况参数对照：\n\n标准：温度 150-200°C, 压力 0.5-0.8MPa, 转速 1200-1500rpm\n高原3000m：温度 150-170°C, 压力 0.5-0.7MPa, 转速 1200-1500rpm\n高原5000m：温度 150-155°C, 压力 0.45-0.6MPa, 转速 1000-1300rpm', score: 93, original: '表1 各工况参数对照\n\n包含三种工况下的温度、压力、转速参数对照。\n\n数据来源：GB/T 12345-2025 国家标准及企业实测数据。' },
};

export const entityData = [
  { key: '1', name: '海拔修正系数', type: '概念', count: 12, status: '已发布' },
  { key: '2', name: '标准工作温度', type: '参数', count: 8, status: '已发布' },
  { key: '3', name: '压力补偿装置', type: '设备', count: 6, status: '已发布' },
  { key: '4', name: '散热效率', type: '指标', count: 5, status: '已发布' },
  { key: '5', name: '高原环境', type: '场景', count: 10, status: '已发布' },
  { key: '6', name: '空气密度', type: '因素', count: 4, status: '待审核' },
];

export const relationData = [
  { key: '1', source: '海拔', relation: '修正系数影响', target: '温度上限', status: '已发布' },
  { key: '2', source: '海拔', relation: '修正系数影响', target: '压力上限', status: '已发布' },
  { key: '3', source: '空气密度', relation: '决定', target: '散热效率', status: '已发布' },
  { key: '4', source: '压力补偿装置', relation: '自动调节', target: '压力参数', status: '已发布' },
  { key: '5', source: '温度修正', relation: '需配合', target: '压力修正', status: '待审核' },
];

export const scenarioData = [
  { key: '1', name: '高原日常运行', type: 'operation', description: '海拔 3000m 以上区域设备日常运行参数配置方案' },
  { key: '2', name: '极限工况应对', type: 'emergency', description: '极端海拔（>5000m）条件下的参数降额和应急处理' },
  { key: '3', name: '设备首次部署', type: 'operation', description: '新设备在高原地区首次安装后的预热和校准流程' },
  { key: '4', name: '季节性切换', type: 'maintenance', description: '冬夏两季温差较大时的参数微调方案' },
];

export const processData: TreeNode[] = [
  { key: 'p-root', title: '高原工况参数修正流程', icon: <FolderOutlined />, children: [
    { key: 'p1', title: '1. 环境数据采集', icon: <FileOutlined /> },
    { key: 'p2', title: '2. 参数对比分析', icon: <FileOutlined /> },
    { key: 'p3', title: '3. 修正方案制定', icon: <FolderOutlined />, children: [
      { key: 'p3-1', title: '3.1 温度修正计算', icon: <FileOutlined /> },
      { key: 'p3-2', title: '3.2 压力修正计算', icon: <FileOutlined /> },
      { key: 'p3-3', title: '3.3 双重校验', icon: <FileOutlined /> },
    ]},
    { key: 'p4', title: '4. 参数应用与验证', icon: <FileOutlined /> },
    { key: 'p5', title: '5. 运行监控', icon: <FileOutlined /> },
  ]},
];

export const processStepContent: Record<string, string> = {
  'p-root': '高原工况参数修正完整流程，包含从环境采集到运行监控的 5 个阶段。\n\n核心原则：温度与压力必须同时修正，不可单独执行。',
  'p1': '采集当前海拔高度、环境温度、大气压力数据。\n\n输入：GPS 海拔数据 + 环境传感器读数\n输出：标准化环境参数表',
  'p2': '将采集数据与标准工况参数表进行对比，计算偏差百分比。\n\n关键判断：海拔 ≥ 3000m 时触发修正流程',
  'p3': '根据偏差数据制定温度与压力修正方案。包含三个子步骤：\n1. 温度修正：标准 200°C → 目标 170°C\n2. 压力修正：标准 0.8MPa → 目标 0.7MPa\n3. 双重校验：确认修正后参数在安全范围内',
  'p3-1': '温度修正计算：目标温度 = 标准温度 × (1 - 海拔超过3000m部分 × 0.01)\n\n结果：200°C → 170°C（降幅 15%）\n\n校验：修正后温度不低于 150°C（设备最低运行温度）',
  'p3-2': '压力修正计算：目标压力 = 标准压力 × (1 - 海拔超过3000m部分 × 0.008)\n\n结果：0.8MPa → 0.7MPa（降幅 12.5%）\n\n校验：修正后压力不低于 0.5MPa（设备最低运行压力）',
  'p3-3': '双重校验步骤：\n1. 确认温度和压力均已完成修正\n2. 验证修正参数不超出设备运行安全边界\n3. 记录修正日志含操作人、时间、环境数据\n\n校验通过 → 进入参数应用阶段',
  'p4': '将修正后的参数写入设备控制系统，进行 30 分钟预热运行。\n\n验证指标：设备运行稳定，温度/压力波动在 ±2% 以内。',
  'p5': '持续监控设备运行参数，每 100 小时记录一次数据。\n\n触发条件：环境变化超过 10% 时重新进入修正流程。',
};

export const qaData = [
  { key: '1', question: '高原环境下温度如何修正？', answer: '上限温度从标准 200°C 降至 170°C，降幅 15%。适用海拔 ≥ 3000m。', source: '第 3 页' },
  { key: '2', question: '为什么需要同时修正温度与压力？', answer: '温度和压力在高原环境下相互影响，单独修正可能导致设备运行不稳定。', source: '第 5 页' },
  { key: '3', question: '首次运行前需要做什么准备？', answer: '需进行 30 分钟预热，并检查压力补偿装置是否正常工作。', source: '第 6 页' },
  { key: '4', question: '修正方案的法规依据是什么？', answer: '根据 GB/T 12345-2025 标准，高海拔地区需执行温度降额和压力补偿。', source: '第 4 页' },
  { key: '5', question: '设备在高原环境多久需要巡检一次？', answer: '标准巡检频率为每 200 小时一次，高原环境增加至每 100 小时一次。', source: '第 6 页' },
];

export const wikiContent = '高原工况补充说明文档汇总了设备在高海拔环境下运行时的参数修正方案和使用注意事项。\n\n## 核心原则\n\n- 海拔 ≥ 3000m 时触发修正流程\n- 温度与压力必须同时修正，不可单独执行\n- 修正后参数需经过双重校验方可应用\n\n## 关键参数修正\n\n| 参数 | 标准值 | 修正值 | 变化 |\n|------|--------|--------|------|\n| 温度上限 | 200°C | 170°C | -30°C |\n| 压力上限 | 0.8MPa | 0.7MPa | -0.1MPa |\n\n## 适用场景\n\n1. 高原日常运行\n2. 极限工况应对\n3. 设备首次部署\n4. 季节性切换';

export const actionData = [
  { key: '1', action: '首次运行前进行 30 分钟预热', priority: 'high', status: '已执行', source: '第 6 页' },
  { key: '2', action: '每 200 小时检查压力补偿装置', priority: 'high', status: '待执行', source: '第 6 页' },
  { key: '3', action: '配置 UPS 不间断电源', priority: 'medium', status: '待执行', source: '第 6 页' },
  { key: '4', action: '定期校准参数设置', priority: 'medium', status: '已执行', source: '第 6 页' },
  { key: '5', action: '高原环境巡检频率提升至每 100 小时', priority: 'high', status: '待审核', source: '第 6 页' },
  { key: '6', action: '记录并归档每次修正操作日志', priority: 'low', status: '待执行', source: '第 5 页' },
];

export const summaryText = '本文档规定了 XX 系列设备在高原环境（海拔 ≥ 3000m）下运行时的参数修正方案。核心内容包括：温度上限从 200°C 修正至 170°C（降幅 15%），压力上限从 0.8MPa 修正至 0.7MPa（降幅 12.5%），修正依据 GB/T 12345-2025 国家标准。文档适用于所有高原地区部署的 XX 系列设备，修正后的参数需经过双重校验方可投入运行。关键操作要求包括首次运行前 30 分钟预热、每 200 小时检查压力补偿装置、配置 UPS 电源、高原环境巡检频率加倍至每 100 小时。';

export type FileInfo = {
  key: string;
  name: string;
  knowledgeName: string;
  author: string;
  time: string;
  size: string;
  status: '已发布' | '未归档' | '编译中';
  excerpt: string;
  source: string;
  tags: string[];
  features: Record<string, FeatureState>;
};

export const fileList: FileInfo[] = [
  { key: '1', name: '工艺参数设定规范_v3.pdf', knowledgeName: '工艺参数设定规范_v3', author: '张三', time: '3 天前', size: '2.4 MB', status: '已发布',
    excerpt: '标准工作温度为 150-200°C，压力范围 0.5-0.8MPa，转速 1200-1500rpm。当海拔超过 3000m 时，上限温度应降低至 170°C，压力上限调整为 0.7MPa。',
    source: '部门知识库 · 生产部', tags: ['技术文档', '参数'],
    features: { 大纲: 'high' as FeatureState, 实体: 'high' as FeatureState, 关系: 'review' as FeatureState, 场景: 'high' as FeatureState, 流程: 'high' as FeatureState, 问答: 'default' as FeatureState, wiki: 'high' as FeatureState, 行动: 'review' as FeatureState, 摘要: 'high' as FeatureState } },
  { key: '2', name: '高原工况补充说明.docx', knowledgeName: '高原工况补充说明', author: '李四', time: '1 天前', size: '856 KB', status: '未归档',
    excerpt: '当海拔超过 3000m 时，上限温度应降低至 170°C，压力上限调整为 0.7MPa。本说明适用于海拔 3000m 以上地区使用的 XX 系列设备。',
    source: '部门知识库 · 销售部', tags: ['技术文档', '高原'],
    features: { 大纲: 'high' as FeatureState, 实体: 'review' as FeatureState, 关系: 'review' as FeatureState, 场景: 'high' as FeatureState, 流程: 'review' as FeatureState, 问答: 'default' as FeatureState, wiki: 'high' as FeatureState, 行动: 'default' as FeatureState, 摘要: 'high' as FeatureState } },
  { key: '3', name: '设备维护操作手册.docx', knowledgeName: '设备维护操作手册', author: '王五', time: '2 小时前', size: '5.2 MB', status: '编译中',
    excerpt: '涵盖日常点检、定期保养和故障排查三大操作流程，含设备参数校准、压力补偿装置检查等关键维护步骤。',
    source: '部门知识库 · 工程部', tags: ['技术文档', '维护'],
    features: { 大纲: 'high' as FeatureState, 实体: 'review' as FeatureState, 关系: 'default' as FeatureState, 场景: 'default' as FeatureState, 流程: 'high' as FeatureState, 问答: 'default' as FeatureState, wiki: 'default' as FeatureState, 行动: 'review' as FeatureState, 摘要: 'review' as FeatureState } },
  { key: '4', name: '安全生产管理制度汇编.pdf', knowledgeName: '安全生产管理制度汇编', author: '管理员', time: '5 天前', size: '3.1 MB', status: '未归档',
    excerpt: '企业安全生产管理制度的完整汇编，涵盖总则、细则、检查、奖惩 4 大模块，含安全检查流程和违规处理流程。',
    source: '集团知识库', tags: ['制度', '安全'],
    features: { 大纲: 'high' as FeatureState, 实体: 'high' as FeatureState, 关系: 'high' as FeatureState, 场景: 'review' as FeatureState, 流程: 'high' as FeatureState, 问答: 'default' as FeatureState, wiki: 'review' as FeatureState, 行动: 'default' as FeatureState, 摘要: 'high' as FeatureState } },
  { key: '5', name: '销售话术模板_2026Q2.docx', knowledgeName: '销售话术模板_2026Q2', author: '赵六', time: '7 天前', size: '428 KB', status: '已发布',
    excerpt: '根据最新市场策略更新的话术模板，覆盖初次拜访、异议处理、竞品回应、签约促成 4 大销售场景。',
    source: '部门知识库 · 销售部', tags: ['销售', '话术'],
    features: { 大纲: 'high' as FeatureState, 实体: 'review' as FeatureState, 关系: 'high' as FeatureState, 场景: 'high' as FeatureState, 流程: 'default' as FeatureState, 问答: 'high' as FeatureState, wiki: 'high' as FeatureState, 行动: 'review' as FeatureState, 摘要: 'high' as FeatureState } },
  { key: '6', name: '新产品研发流程_v2.docx', knowledgeName: '新产品研发流程_v2', author: '测试', time: '刚刚', size: '1.8 MB', status: '编译中',
    excerpt: '端到端的研发流程规范，含 5 阶段 12 节点从需求到量产的全链路流程管理。',
    source: '公司知识库 · 研发中心', tags: ['流程', '研发'],
    features: { 大纲: 'review' as FeatureState, 实体: 'default' as FeatureState, 关系: 'default' as FeatureState, 场景: 'review' as FeatureState, 流程: 'high' as FeatureState, 问答: 'default' as FeatureState, wiki: 'default' as FeatureState, 行动: 'default' as FeatureState, 摘要: 'review' as FeatureState } },
];

export const titleToFileId: Record<string, string> = Object.fromEntries(fileList.map(f => [f.name.replace(/\.\w+$/, ''), f.key]));

export const pushTasks: PushTask[] = [
  { key: 'p1', knowledgeName: '工艺参数设定规范_v3', fromSpace: '个人空间', toSpace: '团队空间', submitter: '张三', time: '2026-05-22 14:30', status: '待审核' },
  { key: 'p2', knowledgeName: '高原工况补充说明', fromSpace: '个人空间', toSpace: '团队空间', submitter: '张三', time: '2026-05-22 10:15', status: '已通过', reviewer: '李四' },
  { key: 'p3', knowledgeName: '设备维护操作手册', fromSpace: '团队空间', toSpace: '企业空间', submitter: '王五', time: '2026-05-21 16:00', status: '待审核' },
  { key: 'p4', knowledgeName: '安全生产管理制度汇编', fromSpace: '团队空间', toSpace: '企业空间', submitter: '李四', time: '2026-05-20 09:00', status: '已驳回', rejectReason: '制度类文档需先经法务审核' },
  { key: 'p5', knowledgeName: '销售话术模板_2026Q2', fromSpace: '团队空间', toSpace: '企业空间', submitter: '赵六', time: '2026-05-19 11:20', status: '已通过', reviewer: '管理员' },
];
