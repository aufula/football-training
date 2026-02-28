// 足球传控战术训练 - 战术配置
// 所有战术的球员位置、跑位路径、想法、传球等配置

const TACTICS_CONFIG = {
    'checking': {
        name: '接应角度 (Checking to Ball)',
        category: 'basic',
        players: [
            {
                id: 0, name: '中场',
                path: [{ x: 0.3, y: 0.5, t: 0 }, { x: 0.35, y: 0.5, t: 0.4 }, { x: 0.4, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '持球' }, { t: 0.3, text: '给 A' }, { t: 0.6, text: '前插！' }]
            },
            {
                id: 1, name: 'A',
                path: [{ x: 0.5, y: 0.3, t: 0 }, { x: 0.45, y: 0.35, t: 0.25 }, { x: 0.5, y: 0.4, t: 0.35 }, { x: 0.55, y: 0.45, t: 0.5 }, { x: 0.65, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '远离' }, { t: 0.2, text: '变向！' }, { t: 0.35, text: '侧身接球' }, { t: 0.5, text: '转身！' }]
            }
        ],
        defenders: [
            { id: 0, name: '后卫',
                path: [{ x: 0.55, y: 0.35, t: 0 }, { x: 0.5, y: 0.38, t: 0.3 }, { x: 0.52, y: 0.42, t: 0.5 }, { x: 0.6, y: 0.48, t: 1 }],
                thoughts: [{ t: 0, text: '盯紧' }, { t: 0.25, text: '跟！' }, { t: 0.4, text: '被晃了！' }]
            }
        ],
        passes: [{ fromIndex: 0, toIndex: 1, startTime: 0.3, endTime: 0.45, leadFactor: 1.0 }]
    },
    'triangle-pos': {
        name: '三角形站位 (Triangle)',
        category: 'basic',
        players: [
            {
                id: 0, name: 'A',
                path: [{ x: 0.3, y: 0.7, t: 0 }, { x: 0.35, y: 0.7, t: 0.3 }, { x: 0.4, y: 0.7, t: 0.6 }, { x: 0.5, y: 0.65, t: 1 }],
                thoughts: [{ t: 0, text: '持球' }, { t: 0.25, text: '传给 B' }, { t: 0.55, text: '跑位！' }]
            },
            {
                id: 1, name: 'B',
                path: [{ x: 0.5, y: 0.5, t: 0 }, { x: 0.5, y: 0.5, t: 0.3 }, { x: 0.55, y: 0.55, t: 0.5 }, { x: 0.6, y: 0.6, t: 0.7 }, { x: 0.7, y: 0.55, t: 1 }],
                thoughts: [{ t: 0.05, text: '接应' }, { t: 0.25, text: '一脚！' }, { t: 0.5, text: '传给 C' }]
            },
            {
                id: 2, name: 'C',
                path: [{ x: 0.3, y: 0.3, t: 0 }, { x: 0.4, y: 0.35, t: 0.3 }, { x: 0.45, y: 0.4, t: 0.5 }, { x: 0.5, y: 0.45, t: 0.7 }, { x: 0.6, y: 0.4, t: 1 }],
                thoughts: [{ t: 0, text: '拉开' }, { t: 0.45, text: '接应 B' }, { t: 0.65, text: '向前！' }]
            }
        ],
        defenders: [
            { id: 0, name: '后腰',
                path: [{ x: 0.45, y: 0.6, t: 0 }, { x: 0.48, y: 0.58, t: 0.3 }, { x: 0.55, y: 0.55, t: 0.6 }, { x: 0.65, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '盯 A' }, { t: 0.3, text: 'B 接球' }, { t: 0.55, text: 'C 呢？' }]
            }
        ],
        passes: [
            { fromIndex: 0, toIndex: 1, startTime: 0.2, endTime: 0.35 },
            { fromIndex: 1, toIndex: 2, startTime: 0.5, endTime: 0.65 }
        ]
    },
    'shield-turn': {
        name: '护球转身 (Shield & Turn)',
        category: 'basic',
        players: [
            {
                id: 0, name: '中场',
                path: [{ x: 0.3, y: 0.5, t: 0 }, { x: 0.35, y: 0.5, t: 0.3 }, { x: 0.45, y: 0.5, t: 0.6 }, { x: 0.6, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '要球' }, { t: 0.05, text: '给前锋' }, { t: 0.35, text: '前插！' }]
            },
            {
                id: 1, name: '前锋',
                path: [{ x: 0.6, y: 0.5, t: 0 }, { x: 0.55, y: 0.5, t: 0.3 }, { x: 0.55, y: 0.45, t: 0.45 }, { x: 0.7, y: 0.4, t: 0.8 }, { x: 0.8, y: 0.35, t: 1 }],
                thoughts: [{ t: 0, text: '背身拿球' }, { t: 0.25, text: '护球' }, { t: 0.35, text: '转身！' }, { t: 0.5, text: '前插！' }]
            }
        ],
        defenders: [
            { id: 0, name: '后卫',
                path: [{ x: 0.65, y: 0.5, t: 0 }, { x: 0.58, y: 0.5, t: 0.3 }, { x: 0.58, y: 0.48, t: 0.5 }, { x: 0.65, y: 0.45, t: 1 }],
                thoughts: [{ t: 0, text: '盯紧' }, { t: 0.25, text: '贴身！' }, { t: 0.4, text: '被过了！' }]
            }
        ],
        passes: [{ fromIndex: 0, toIndex: 1, startTime: 0.1, endTime: 0.3 }]
    },
    'wall-pass': {
        name: '墙式二过一 (Wall Pass)',
        category: 'basic',
        players: [
            {
                id: 0, name: '中场',
                path: [{ x: 0.3, y: 0.6, t: 0 }, { x: 0.4, y: 0.6, t: 0.2 }, { x: 0.55, y: 0.6, t: 0.4 }, { x: 0.75, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '传球' }, { t: 0.15, text: '给！' }, { t: 0.3, text: '前插！' }]
            },
            {
                id: 1, name: '前锋',
                path: [{ x: 0.5, y: 0.2, t: 0 }, { x: 0.45, y: 0.35, t: 0.2 }, { x: 0.5, y: 0.4, t: 0.35 }, { x: 0.7, y: 0.35, t: 0.6 }, { x: 0.8, y: 0.3, t: 1 }],
                thoughts: [{ t: 0, text: '接应' }, { t: 0.2, text: '做！' }, { t: 0.3, text: '跑！' }]
            }
        ],
        defenders: [
            { id: 0, name: '后卫',
                path: [{ x: 0.5, y: 0.5, t: 0 }, { x: 0.48, y: 0.48, t: 0.2 }, { x: 0.52, y: 0.52, t: 0.4 }, { x: 0.65, y: 0.45, t: 1 }],
                thoughts: [{ t: 0, text: '封堵' }, { t: 0.2, text: '撞墙！' }, { t: 0.35, text: '来不及！' }]
            }
        ],
        passes: [
            { fromIndex: 0, toIndex: 1, startTime: 0.15, endTime: 0.25 },
            { fromIndex: 1, toIndex: 0, startTime: 0.25, endTime: 0.4, leadFactor: 1.1 }
        ]
    },
    'third-man': {
        name: '第三人配合 (Third Man Run)',
        category: 'basic',
        players: [
            {
                id: 0, name: 'A',
                path: [{ x: 0.2, y: 0.7, t: 0 }, { x: 0.3, y: 0.6, t: 0.3 }, { x: 0.4, y: 0.7, t: 1 }],
                thoughts: [{ t: 0, text: '传球' }, { t: 0.15, text: '给 B' }]
            },
            {
                id: 1, name: 'B',
                path: [{ x: 0.6, y: 0.5, t: 0 }, { x: 0.5, y: 0.6, t: 0.4 }, { x: 0.5, y: 0.6, t: 0.5 }, { x: 0.6, y: 0.4, t: 1 }],
                thoughts: [{ t: 0.15, text: '接球' }, { t: 0.35, text: '做给 C' }]
            },
            {
                id: 2, name: 'C',
                path: [{ x: 0.3, y: 0.3, t: 0 }, { x: 0.5, y: 0.3, t: 0.4 }, { x: 0.7, y: 0.4, t: 0.7 }, { x: 0.8, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '准备' }, { t: 0.45, text: '接球！' }, { t: 0.65, text: '射门！' }]
            }
        ],
        defenders: [
            { id: 0, name: '中卫',
                path: [{ x: 0.65, y: 0.6, t: 0 }, { x: 0.55, y: 0.65, t: 0.5 }, { x: 0.6, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '盯 B' }, { t: 0.45, text: 'C 呢？' }]
            },
            { id: 1, name: '边卫',
                path: [{ x: 0.6, y: 0.3, t: 0 }, { x: 0.55, y: 0.4, t: 0.6 }, { x: 0.7, y: 0.35, t: 1 }],
                thoughts: [{ t: 0, text: '防 C' }, { t: 0.55, text: '晚了！' }]
            }
        ],
        passes: [
            { fromIndex: 0, toIndex: 1, startTime: 0.2, endTime: 0.4 },
            { fromIndex: 1, toIndex: 2, startTime: 0.5, endTime: 0.7, leadFactor: 1.2 }
        ]
    },
    'triangle': {
        name: '三角传递 (Triangle Passing)',
        category: 'intermediate',
        players: [
            {
                id: 0, name: 'A',
                path: [{ x: 0.3, y: 0.7, t: 0 }, { x: 0.3, y: 0.7, t: 0.1 }, { x: 0.4, y: 0.75, t: 0.4 }, { x: 0.45, y: 0.7, t: 0.6 }, { x: 0.6, y: 0.6, t: 0.85 }, { x: 0.75, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '传球给 B' }, { t: 0.35, text: '跑位' }, { t: 0.6, text: '接 C 回传' }, { t: 0.8, text: '直塞 B！' }]
            },
            {
                id: 1, name: 'B',
                path: [{ x: 0.5, y: 0.5, t: 0 }, { x: 0.5, y: 0.5, t: 0.2 }, { x: 0.55, y: 0.45, t: 0.4 }, { x: 0.6, y: 0.4, t: 0.6 }, { x: 0.8, y: 0.55, t: 0.85 }, { x: 0.9, y: 0.6, t: 1 }],
                thoughts: [{ t: 0.05, text: '接球' }, { t: 0.2, text: '传给 C' }, { t: 0.5, text: '斜线前插！' }, { t: 0.8, text: '接直塞！' }]
            },
            {
                id: 2, name: 'C',
                path: [{ x: 0.3, y: 0.3, t: 0 }, { x: 0.4, y: 0.35, t: 0.3 }, { x: 0.45, y: 0.4, t: 0.5 }, { x: 0.4, y: 0.45, t: 0.65 }, { x: 0.5, y: 0.5, t: 0.8 }, { x: 0.6, y: 0.55, t: 1 }],
                thoughts: [{ t: 0.25, text: '接应' }, { t: 0.4, text: '回做 A' }, { t: 0.7, text: '拉开！' }]
            }
        ],
        defenders: [
            { id: 0, name: '中卫',
                path: [{ x: 0.45, y: 0.6, t: 0 }, { x: 0.4, y: 0.65, t: 0.2 }, { x: 0.5, y: 0.55, t: 0.4 }, { x: 0.55, y: 0.5, t: 0.6 }, { x: 0.7, y: 0.5, t: 0.85 }, { x: 0.8, y: 0.45, t: 1 }],
                thoughts: [{ t: 0, text: '盯 A' }, { t: 0.25, text: 'B 接球了' }, { t: 0.55, text: 'C 拿球' }, { t: 0.75, text: 'B 前插了！' }]
            },
            { id: 1, name: '后腰',
                path: [{ x: 0.55, y: 0.3, t: 0 }, { x: 0.5, y: 0.4, t: 0.3 }, { x: 0.55, y: 0.35, t: 0.6 }, { x: 0.65, y: 0.35, t: 0.85 }, { x: 0.75, y: 0.3, t: 1 }],
                thoughts: [{ t: 0, text: '防 B' }, { t: 0.35, text: 'C 接球' }, { t: 0.6, text: 'A 前插' }, { t: 0.8, text: '跟不住！' }]
            }
        ],
        passes: [
            { fromIndex: 0, toIndex: 1, startTime: 0.05, endTime: 0.2 },
            { fromIndex: 1, toIndex: 2, startTime: 0.25, endTime: 0.4 },
            { fromIndex: 2, toIndex: 0, startTime: 0.5, endTime: 0.65 },
            { fromIndex: 0, toIndex: 1, startTime: 0.75, endTime: 0.9, leadFactor: 1.3 }
        ]
    },
    'diagonal-run': {
        name: '斜线前插 (Diagonal Run)',
        category: 'intermediate',
        players: [
            {
                id: 0, name: '中场',
                path: [{ x: 0.3, y: 0.5, t: 0 }, { x: 0.4, y: 0.5, t: 0.5 }, { x: 0.45, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '控球' }, { t: 0.35, text: '准备直塞' }, { t: 0.45, text: '传！' }]
            },
            {
                id: 1, name: '前锋',
                path: [{ x: 0.5, y: 0.2, t: 0 }, { x: 0.55, y: 0.2, t: 0.4 }, { x: 0.8, y: 0.45, t: 0.7 }, { x: 0.9, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '游弋' }, { t: 0.35, text: '启动！' }, { t: 0.7, text: '接球！' }]
            }
        ],
        defenders: [
            { id: 0, name: '中卫',
                path: [{ x: 0.6, y: 0.3, t: 0 }, { x: 0.6, y: 0.35, t: 0.5 }, { x: 0.75, y: 0.45, t: 1 }],
                thoughts: [{ t: 0, text: '盯前锋' }, { t: 0.4, text: '人呢？' }, { t: 0.7, text: '追不上！' }]
            },
            { id: 1, name: '中卫',
                path: [{ x: 0.6, y: 0.7, t: 0 }, { x: 0.6, y: 0.65, t: 0.5 }, { x: 0.75, y: 0.55, t: 1 }],
                thoughts: [{ t: 0, text: '防中场' }, { t: 0.4, text: '别传！' }, { t: 0.7, text: '晚了！' }]
            }
        ],
        passes: [{ fromIndex: 0, toIndex: 1, startTime: 0.5, endTime: 0.75, leadFactor: 1.3 }]
    },
    'wing-overlap': {
        name: '边路套边 (Wing Overlap)',
        category: 'intermediate',
        players: [
            {
                id: 0, name: '边锋',
                path: [{ x: 0.5, y: 0.8, t: 0 }, { x: 0.65, y: 0.6, t: 0.45 }, { x: 0.7, y: 0.55, t: 0.55 }, { x: 0.72, y: 0.5, t: 0.75 }, { x: 0.75, y: 0.45, t: 1 }],
                thoughts: [{ t: 0, text: '拿球内切' }, { t: 0.4, text: '吸引防守' }, { t: 0.5, text: '回传！' }]
            },
            {
                id: 1, name: '边卫',
                path: [{ x: 0.3, y: 0.9, t: 0 }, { x: 0.5, y: 0.9, t: 0.3 }, { x: 0.8, y: 0.88, t: 0.6 }, { x: 0.85, y: 0.85, t: 0.75 }, { x: 0.85, y: 0.8, t: 1 }],
                thoughts: [{ t: 0, text: '套边' }, { t: 0.25, text: '快跑！' }, { t: 0.55, text: '接球！' }, { t: 0.75, text: '传中！' }]
            },
            {
                id: 2, name: '前锋',
                path: [{ x: 0.6, y: 0.4, t: 0 }, { x: 0.7, y: 0.4, t: 0.5 }, { x: 0.85, y: 0.6, t: 0.75 }, { x: 0.9, y: 0.55, t: 1 }],
                thoughts: [{ t: 0, text: '包抄' }, { t: 0.45, text: '插入禁区' }, { t: 0.7, text: '射门！' }]
            }
        ],
        defenders: [
            { id: 0, name: '边卫',
                path: [{ x: 0.7, y: 0.7, t: 0 }, { x: 0.65, y: 0.65, t: 0.45 }, { x: 0.7, y: 0.68, t: 0.65 }, { x: 0.78, y: 0.72, t: 1 }],
                thoughts: [{ t: 0, text: '盯边锋' }, { t: 0.4, text: '内切了' }, { t: 0.5, text: '套边呢？' }]
            },
            { id: 1, name: '中卫',
                path: [{ x: 0.75, y: 0.35, t: 0 }, { x: 0.75, y: 0.4, t: 0.55 }, { x: 0.8, y: 0.45, t: 0.75 }, { x: 0.85, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '盯前锋' }, { t: 0.5, text: '传球了' }, { t: 0.7, text: '防不住！' }]
            }
        ],
        passes: [
            { fromIndex: 0, toIndex: 1, startTime: 0.45, endTime: 0.65, leadFactor: 1.2 },
            { fromIndex: 1, toIndex: 2, startTime: 0.75, endTime: 0.9, leadFactor: 1.1 }
        ]
    },
    'through-ball': {
        name: '直塞身后 (Through Ball)',
        category: 'advanced',
        players: [
            {
                id: 0, name: '中场',
                path: [{ x: 0.3, y: 0.5, t: 0 }, { x: 0.4, y: 0.5, t: 0.5 }, { x: 0.45, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '观察' }, { t: 0.35, text: '前锋启动了' }, { t: 0.45, text: '直塞！' }]
            },
            {
                id: 1, name: '前锋',
                path: [{ x: 0.5, y: 0.3, t: 0 }, { x: 0.55, y: 0.35, t: 0.4 }, { x: 0.85, y: 0.5, t: 0.8 }, { x: 0.9, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '游弋' }, { t: 0.35, text: '反越位！' }, { t: 0.75, text: '单刀！' }]
            }
        ],
        defenders: [
            { id: 0, name: '中卫',
                path: [{ x: 0.6, y: 0.3, t: 0 }, { x: 0.6, y: 0.35, t: 0.5 }, { x: 0.7, y: 0.4, t: 1 }],
                thoughts: [{ t: 0, text: '盯人' }, { t: 0.45, text: '被过了！' }, { t: 0.75, text: '追！' }]
            },
            { id: 1, name: '中卫',
                path: [{ x: 0.6, y: 0.7, t: 0 }, { x: 0.6, y: 0.65, t: 0.5 }, { x: 0.7, y: 0.6, t: 1 }],
                thoughts: [{ t: 0, text: '保护' }, { t: 0.45, text: '直塞球！' }, { t: 0.75, text: '来不及！' }]
            }
        ],
        passes: [{ fromIndex: 0, toIndex: 1, startTime: 0.5, endTime: 0.75, leadFactor: 1.4 }]
    },
    'rotation': {
        name: '拉玛西亚轮转 (La Masia Rotation)',
        category: 'advanced',
        players: [
            {
                id: 0, name: 'A',
                path: [{ x: 0.3, y: 0.5, t: 0 }, { x: 0.3, y: 0.5, t: 0.1 }, { x: 0.5, y: 0.3, t: 0.4 }, { x: 0.75, y: 0.5, t: 0.75 }, { x: 0.85, y: 0.5, t: 1 }],
                thoughts: [{ t: 0, text: '传球给 B' }, { t: 0.15, text: '前插' }, { t: 0.6, text: '接回传！' }]
            },
            {
                id: 1, name: 'B',
                path: [{ x: 0.4, y: 0.3, t: 0 }, { x: 0.45, y: 0.3, t: 0.2 }, { x: 0.45, y: 0.3, t: 0.3 }, { x: 0.6, y: 0.2, t: 0.6 }, { x: 0.7, y: 0.3, t: 1 }],
                thoughts: [{ t: 0.05, text: '接球' }, { t: 0.2, text: '做给 C' }, { t: 0.55, text: '拉开！' }]
            },
            {
                id: 2, name: 'C',
                path: [{ x: 0.6, y: 0.5, t: 0 }, { x: 0.55, y: 0.55, t: 0.4 }, { x: 0.5, y: 0.6, t: 0.6 }, { x: 0.5, y: 0.6, t: 0.7 }, { x: 0.55, y: 0.65, t: 1 }],
                thoughts: [{ t: 0.25, text: '回撤接应' }, { t: 0.35, text: '回做' }, { t: 0.6, text: '给 A' }]
            },
            {
                id: 3, name: 'D',
                path: [{ x: 0.3, y: 0.7, t: 0 }, { x: 0.5, y: 0.8, t: 0.5 }, { x: 0.7, y: 0.7, t: 1 }],
                thoughts: [{ t: 0, text: '接应' }, { t: 0.45, text: '转移' }, { t: 0.75, text: '包抄！' }]
            }
        ],
        defenders: [
            { id: 0, name: '后腰',
                path: [{ x: 0.5, y: 0.4, t: 0 }, { x: 0.55, y: 0.45, t: 0.4 }, { x: 0.6, y: 0.55, t: 1 }],
                thoughts: [{ t: 0, text: '盯 A' }, { t: 0.35, text: 'B 接球' }, { t: 0.6, text: '跟丢了！' }]
            },
            { id: 1, name: '中卫',
                path: [{ x: 0.65, y: 0.6, t: 0 }, { x: 0.65, y: 0.6, t: 0.5 }, { x: 0.7, y: 0.55, t: 0.8 }, { x: 0.75, y: 0.55, t: 1 }],
                thoughts: [{ t: 0, text: '防 C' }, { t: 0.55, text: '轮转了' }, { t: 0.75, text: '乱了！' }]
            }
        ],
        passes: [
            { fromIndex: 0, toIndex: 1, startTime: 0.05, endTime: 0.2 },
            { fromIndex: 1, toIndex: 2, startTime: 0.25, endTime: 0.4 },
            { fromIndex: 2, toIndex: 0, startTime: 0.55, endTime: 0.7, leadFactor: 1.1 }
        ]
    }
};

// 战术说明
const TACTIC_EXPLANATIONS = {
    'checking': { title: '接应角度 (Checking)', content: '<p>V 字跑动：先远离接球点，再变向接球；侧身 45° 接球，一眼看球一眼看场。</p>' },
    'triangle-pos': { title: '三角形站位 (Triangle)', content: '<p>保持等边三角站位（3-5 米，60° 夹角）；球动人动，三角滚动；持球者永远有 2 个出球点。</p>' },
    'shield-turn': { title: '护球转身 (Shield & Turn)', content: '<p>背身要球时感知防守位置，接球瞬间用身体护住球，以远离防守的脚为轴转身。</p>' },
    'wall-pass': { title: '墙式二过一 (Wall Pass)', content: '<p>接应者 45 度角站位，传球手传完球立刻前插，接应者一脚回传到跑动路线。</p>' },
    'third-man': { title: '第三人配合 (Third Man Run)', content: '<p>A 传给 B，B 不做处理直接做球给 C，C 接球完成进攻，B 的做球时机是关键。</p>' },
    'triangle': { title: '三角传递 (Triangle Passing)', content: '<p>动态保持三角站位，连续 4 次传递 A→B→C→A→B，每次传球后立刻跑位，调动防守重心创造空当。</p>' },
    'diagonal-run': { title: '斜线前插 (Diagonal Run)', content: '<p>前插者从防守侧后方盲区启动，爆发加速 45 度斜插两后卫之间，人到球到不减速。</p>' },
    'wing-overlap': { title: '边路套边 (Wing Overlap)', content: '<p>边锋内切带球向中路，边后卫从外线高速套上，传向边卫身后，下底传中或倒三角。</p>' },
    'through-ball': { title: '直塞身后 (Through Ball)', content: '<p>前锋在防守侧后方游弋（弧线跑位），传球瞬间全力启动，直塞球打穿防线身后。</p>' },
    'rotation': { title: '拉玛西亚轮转 (La Masia Rotation)', content: '<p>A 传 B 后前插，B 做球给 C 后跑位，C 回撤做球给反插的 A，多人在局部形成轮转换位。</p>' }
};
