// 足球传控战术训练 - JavaScript 实现
// 战术设计：巴萨拉玛西亚青训体系
// 青训总监：基于瓜迪奥拉传控哲学

class TacticsGame {
    constructor() {
        this.canvas = document.getElementById('tacticsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentTactic = null;
        this.isPlaying = false;
        this.animationFrame = null;
        this.time = 0;

        // 球员和球
        this.players = [];
        this.defenders = [];
        this.ball = null;

        // 轨迹
        this.ballTrail = [];
        this.playerTrails = new Map();
        this.defenderTrails = [];

        // Tiki-Taka 节奏状态
        this.rhythmPhase = 'slow';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.reset();
        this.draw();
    }

    setupEventListeners() {
        document.querySelectorAll('.tactic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tactic-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const tactic = e.target.dataset.tactic;
                this.selectTactic(tactic);
            });
        });

        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    selectTactic(tacticName) {
        this.currentTactic = tacticName;
        this.reset();
        this.setupTactic(tacticName);
        this.updateExplanation(tacticName);
    }

    setupTactic(tacticName) {
        const width = this.canvas.width;
        const height = this.canvas.height;

        const w = width;
        const h = height;

        switch (tacticName) {
            case 'shield-turn':
                this.players = [
                    { id: 0, name: '中场', x: w * 0.3, y: h * 0.5, path: [{ x: w * 0.3, y: h * 0.5, t: 0 }, { x: w * 0.35, y: h * 0.5, t: 1 }] },
                    { id: 1, name: '前锋', x: w * 0.6, y: h * 0.5, path: [
                        { x: w * 0.6, y: h * 0.5, t: 0 },
                        { x: w * 0.55, y: h * 0.5, t: 0.3 }, 
                        { x: w * 0.55, y: h * 0.4, t: 0.5 }, 
                        { x: w * 0.75, y: h * 0.4, t: 1 }    
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.65, y: h * 0.5, path: [{ x: w * 0.65, y: h * 0.5, t: 0 }, { x: w * 0.58, y: h * 0.5, t: 0.3 }, { x: w * 0.58, y: h * 0.45, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.1, endTime: 0.3 }
                ];
                break;
            case 'wall-pass':
                this.players = [
                    { id: 0, name: '中场', x: w * 0.3, y: h * 0.6, path: [
                        { x: w * 0.3, y: h * 0.6, t: 0 },
                        { x: w * 0.4, y: h * 0.6, t: 0.2 },
                        { x: w * 0.6, y: h * 0.6, t: 0.6 },
                        { x: w * 0.75, y: h * 0.5, t: 1 }  
                    ]},
                    { id: 1, name: '前锋', x: w * 0.5, y: h * 0.3, path: [
                        { x: w * 0.5, y: h * 0.3, t: 0 },
                        { x: w * 0.45, y: h * 0.4, t: 0.4 },
                        { x: w * 0.48, y: h * 0.45, t: 0.5 },
                        { x: w * 0.6, y: h * 0.3, t: 1 }     
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.5, y: h * 0.5, path: [{ x: w * 0.5, y: h * 0.5, t: 0 }, { x: w * 0.45, y: h * 0.55, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.2, endTime: 0.4 },
                    { fromIndex: 1, toIndex: 0, startTime: 0.5, endTime: 0.7, leadFactor: 1.2 }
                ];
                break;
            case 'overlap':
                this.players = [
                    { id: 0, name: '边锋', x: w * 0.3, y: h * 0.3, path: [
                        { x: w * 0.3, y: h * 0.3, t: 0 },
                        { x: w * 0.5, y: h * 0.5, t: 0.4 }, 
                        { x: w * 0.55, y: h * 0.5, t: 0.6 }, 
                        { x: w * 0.6, y: h * 0.6, t: 1 }
                    ]},
                    { id: 1, name: '边卫', x: w * 0.2, y: h * 0.15, path: [
                        { x: w * 0.2, y: h * 0.15, t: 0 },
                        { x: w * 0.4, y: h * 0.2, t: 0.3 },
                        { x: w * 0.6, y: h * 0.3, t: 0.6 }, 
                        { x: w * 0.8, y: h * 0.35, t: 0.9 }, 
                        { x: w * 0.85, y: h * 0.4, t: 1 }
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.6, y: h * 0.4, path: [{ x: w * 0.6, y: h * 0.4, t: 0 }, { x: w * 0.55, y: h * 0.45, t: 0.5 }, { x: w * 0.6, y: h * 0.35, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.6, endTime: 0.8, leadFactor: 1.1 }
                ];
                break;
            case 'third-man':
                this.players = [
                    { id: 0, name: 'A', x: w * 0.2, y: h * 0.7, path: [
                        { x: w * 0.2, y: h * 0.7, t: 0 },
                        { x: w * 0.3, y: h * 0.6, t: 0.3 }, 
                        { x: w * 0.4, y: h * 0.7, t: 1 }
                    ]},
                    { id: 1, name: 'B', x: w * 0.6, y: h * 0.5, path: [
                        { x: w * 0.6, y: h * 0.5, t: 0 },
                        { x: w * 0.5, y: h * 0.6, t: 0.4 }, 
                        { x: w * 0.5, y: h * 0.6, t: 0.5 }, 
                        { x: w * 0.6, y: h * 0.4, t: 1 }
                    ]},
                    { id: 2, name: 'C', x: w * 0.3, y: h * 0.3, path: [
                        { x: w * 0.3, y: h * 0.3, t: 0 },
                        { x: w * 0.5, y: h * 0.3, t: 0.4 }, 
                        { x: w * 0.7, y: h * 0.4, t: 0.7 }, 
                        { x: w * 0.8, y: h * 0.5, t: 1 }
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.65, y: h * 0.6, path: [{ x: w * 0.65, y: h * 0.6, t: 0 }, { x: w * 0.55, y: h * 0.65, t: 0.5 }, { x: w * 0.6, y: h * 0.5, t: 1 }] },
                    { id: 1, x: w * 0.6, y: h * 0.3, path: [{ x: w * 0.6, y: h * 0.3, t: 0 }, { x: w * 0.55, y: h * 0.4, t: 0.6 }, { x: w * 0.7, y: h * 0.35, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.2, endTime: 0.4 },
                    { fromIndex: 1, toIndex: 2, startTime: 0.5, endTime: 0.7, leadFactor: 1.2 }
                ];
                break;
            case 'triangle':
                this.players = [
                    { id: 0, name: 'A', x: w * 0.3, y: h * 0.7, path: [
                        { x: w * 0.3, y: h * 0.7, t: 0 },
                        { x: w * 0.3, y: h * 0.7, t: 0.1 }, 
                        { x: w * 0.4, y: h * 0.8, t: 0.4 }, 
                        { x: w * 0.4, y: h * 0.8, t: 0.7 }, 
                        { x: w * 0.6, y: h * 0.7, t: 1 }
                    ]},
                    { id: 1, name: 'B', x: w * 0.5, y: h * 0.5, path: [
                        { x: w * 0.5, y: h * 0.5, t: 0 },
                        { x: w * 0.5, y: h * 0.5, t: 0.2 }, 
                        { x: w * 0.5, y: h * 0.5, t: 0.3 }, 
                        { x: w * 0.6, y: h * 0.4, t: 0.6 }, 
                        { x: w * 0.7, y: h * 0.5, t: 1 }
                    ]},
                    { id: 2, name: 'C', x: w * 0.3, y: h * 0.3, path: [
                        { x: w * 0.3, y: h * 0.3, t: 0 },
                        { x: w * 0.4, y: h * 0.3, t: 0.4 }, 
                        { x: w * 0.4, y: h * 0.3, t: 0.5 }, 
                        { x: w * 0.5, y: h * 0.2, t: 0.8 }, 
                        { x: w * 0.6, y: h * 0.2, t: 1 }
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.4, y: h * 0.5, path: [{ x: w * 0.4, y: h * 0.5, t: 0 }, { x: w * 0.45, y: h * 0.55, t: 0.3 }, { x: w * 0.35, y: h * 0.4, t: 0.6 }, { x: w * 0.45, y: h * 0.6, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.05, endTime: 0.2 },
                    { fromIndex: 1, toIndex: 2, startTime: 0.25, endTime: 0.4 },
                    { fromIndex: 2, toIndex: 0, startTime: 0.45, endTime: 0.6 }
                ];
                break;
            case 'diagonal-run':
                this.players = [
                    { id: 0, name: '中场', x: w * 0.3, y: h * 0.5, path: [
                        { x: w * 0.3, y: h * 0.5, t: 0 },
                        { x: w * 0.4, y: h * 0.5, t: 0.5 }, 
                        { x: w * 0.45, y: h * 0.5, t: 1 }
                    ]},
                    { id: 1, name: '前锋', x: w * 0.5, y: h * 0.2, path: [
                        { x: w * 0.5, y: h * 0.2, t: 0 },
                        { x: w * 0.55, y: h * 0.2, t: 0.4 }, 
                        { x: w * 0.8, y: h * 0.45, t: 0.8 }, 
                        { x: w * 0.85, y: h * 0.5, t: 1 }
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.6, y: h * 0.3, path: [{ x: w * 0.6, y: h * 0.3, t: 0 }, { x: w * 0.6, y: h * 0.35, t: 0.5 }, { x: w * 0.7, y: h * 0.4, t: 1 }] },
                    { id: 1, x: w * 0.6, y: h * 0.7, path: [{ x: w * 0.6, y: h * 0.7, t: 0 }, { x: w * 0.6, y: h * 0.65, t: 0.5 }, { x: w * 0.7, y: h * 0.55, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.5, endTime: 0.75, leadFactor: 1.3 }
                ];
                break;
            case 'wing-overlap':
                this.players = [
                    { id: 0, name: '边锋', x: w * 0.5, y: h * 0.8, path: [
                        { x: w * 0.5, y: h * 0.8, t: 0 },
                        { x: w * 0.65, y: h * 0.6, t: 0.5 }, 
                        { x: w * 0.7, y: h * 0.55, t: 0.6 }, 
                        { x: w * 0.75, y: h * 0.4, t: 1 } 
                    ]},
                    { id: 1, name: '边卫', x: w * 0.3, y: h * 0.9, path: [
                        { x: w * 0.3, y: h * 0.9, t: 0 },
                        { x: w * 0.5, y: h * 0.9, t: 0.3 },
                        { x: w * 0.8, y: h * 0.85, t: 0.7 }, 
                        { x: w * 0.85, y: h * 0.8, t: 0.8 }, 
                        { x: w * 0.9, y: h * 0.6, t: 1 }
                    ]},
                    { id: 2, name: '前锋', x: w * 0.6, y: h * 0.4, path: [
                        { x: w * 0.6, y: h * 0.4, t: 0 },
                        { x: w * 0.7, y: h * 0.4, t: 0.5 },
                        { x: w * 0.85, y: h * 0.5, t: 1 } 
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.7, y: h * 0.7, path: [{ x: w * 0.7, y: h * 0.7, t: 0 }, { x: w * 0.65, y: h * 0.65, t: 0.5 }, { x: w * 0.8, y: h * 0.75, t: 1 }] },
                    { id: 1, x: w * 0.75, y: h * 0.4, path: [{ x: w * 0.75, y: h * 0.4, t: 0 }, { x: w * 0.75, y: h * 0.45, t: 0.6 }, { x: w * 0.85, y: h * 0.55, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.55, endTime: 0.75, leadFactor: 1.2 },
                    { fromIndex: 1, toIndex: 2, startTime: 0.8, endTime: 0.95, leadFactor: 1.1 } 
                ];
                break;
            case 'through-ball':
                this.players = [
                    { id: 0, name: '中场', x: w * 0.3, y: h * 0.5, path: [
                        { x: w * 0.3, y: h * 0.5, t: 0 },
                        { x: w * 0.4, y: h * 0.5, t: 0.5 }, 
                        { x: w * 0.45, y: h * 0.5, t: 1 }
                    ]},
                    { id: 1, name: '前锋', x: w * 0.5, y: h * 0.3, path: [
                        { x: w * 0.5, y: h * 0.3, t: 0 },
                        { x: w * 0.55, y: h * 0.35, t: 0.4 }, 
                        { x: w * 0.85, y: h * 0.5, t: 0.8 }, 
                        { x: w * 0.9, y: h * 0.5, t: 1 }
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.6, y: h * 0.4, path: [{ x: w * 0.6, y: h * 0.4, t: 0 }, { x: w * 0.6, y: h * 0.45, t: 0.5 }, { x: w * 0.75, y: h * 0.5, t: 1 }] },
                    { id: 1, x: w * 0.6, y: h * 0.6, path: [{ x: w * 0.6, y: h * 0.6, t: 0 }, { x: w * 0.6, y: h * 0.55, t: 0.5 }, { x: w * 0.7, y: h * 0.5, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.5, endTime: 0.75, leadFactor: 1.4 }
                ];
                break;
            case 'rotation':
                this.players = [
                    { id: 0, name: 'A', x: w * 0.3, y: h * 0.5, path: [
                        { x: w * 0.3, y: h * 0.5, t: 0 },
                        { x: w * 0.3, y: h * 0.5, t: 0.1 }, 
                        { x: w * 0.5, y: h * 0.3, t: 0.4 }, 
                        { x: w * 0.7, y: h * 0.5, t: 0.8 }, 
                        { x: w * 0.8, y: h * 0.5, t: 1 }
                    ]},
                    { id: 1, name: 'B', x: w * 0.4, y: h * 0.3, path: [
                        { x: w * 0.4, y: h * 0.3, t: 0 },
                        { x: w * 0.45, y: h * 0.3, t: 0.2 }, 
                        { x: w * 0.45, y: h * 0.3, t: 0.3 }, 
                        { x: w * 0.6, y: h * 0.2, t: 0.6 }, 
                        { x: w * 0.7, y: h * 0.3, t: 1 }
                    ]},
                    { id: 2, name: 'C', x: w * 0.6, y: h * 0.5, path: [
                        { x: w * 0.6, y: h * 0.5, t: 0 },
                        { x: w * 0.6, y: h * 0.4, t: 0.4 }, 
                        { x: w * 0.5, y: h * 0.6, t: 0.6 }, 
                        { x: w * 0.5, y: h * 0.6, t: 0.7 }, 
                        { x: w * 0.6, y: h * 0.7, t: 1 }
                    ]},
                    { id: 3, name: 'D', x: w * 0.3, y: h * 0.7, path: [
                        { x: w * 0.3, y: h * 0.7, t: 0 },
                        { x: w * 0.5, y: h * 0.8, t: 0.5 },
                        { x: w * 0.7, y: h * 0.7, t: 1 }
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.5, y: h * 0.4, path: [{ x: w * 0.5, y: h * 0.4, t: 0 }, { x: w * 0.55, y: h * 0.45, t: 0.4 }, { x: w * 0.6, y: h * 0.55, t: 1 }] },
                    { id: 1, x: w * 0.65, y: h * 0.6, path: [{ x: w * 0.65, y: h * 0.6, t: 0 }, { x: w * 0.6, y: h * 0.5, t: 0.6 }, { x: w * 0.75, y: h * 0.55, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.05, endTime: 0.2 },
                    { fromIndex: 1, toIndex: 2, startTime: 0.25, endTime: 0.4 },
                    { fromIndex: 2, toIndex: 0, startTime: 0.65, endTime: 0.8, leadFactor: 1.1 }
                ];
                break;
            case 'box-attack':
                this.players = [
                    { id: 0, name: '边锋', x: w * 0.6, y: h * 0.8, path: [
                        { x: w * 0.6, y: h * 0.8, t: 0 },
                        { x: w * 0.85, y: h * 0.85, t: 0.4 }, 
                        { x: w * 0.85, y: h * 0.85, t: 0.5 }, 
                        { x: w * 0.9, y: h * 0.8, t: 1 }
                    ]},
                    { id: 1, name: '前锋', x: w * 0.6, y: h * 0.5, path: [
                        { x: w * 0.6, y: h * 0.5, t: 0 },
                        { x: w * 0.8, y: h * 0.6, t: 0.5 }, 
                        { x: w * 0.8, y: h * 0.6, t: 0.6 }, 
                        { x: w * 0.9, y: h * 0.5, t: 1 }
                    ]},
                    { id: 2, name: '中场', x: w * 0.4, y: h * 0.4, path: [
                        { x: w * 0.4, y: h * 0.4, t: 0 },
                        { x: w * 0.7, y: h * 0.45, t: 0.6 }, 
                        { x: w * 0.85, y: h * 0.45, t: 0.8 }, 
                        { x: w * 0.9, y: h * 0.45, t: 1 }
                    ]},
                    { id: 3, name: '后点', x: w * 0.5, y: h * 0.2, path: [
                        { x: w * 0.5, y: h * 0.2, t: 0 },
                        { x: w * 0.8, y: h * 0.3, t: 0.7 }, 
                        { x: w * 0.85, y: h * 0.3, t: 1 }
                    ]}
                ];
                this.defenders = [
                    { id: 0, x: w * 0.75, y: h * 0.7, path: [{ x: w * 0.75, y: h * 0.7, t: 0 }, { x: w * 0.8, y: h * 0.75, t: 0.4 }, { x: w * 0.8, y: h * 0.65, t: 1 }] },
                    { id: 1, x: w * 0.8, y: h * 0.5, path: [{ x: w * 0.8, y: h * 0.5, t: 0 }, { x: w * 0.75, y: h * 0.55, t: 0.5 }, { x: w * 0.8, y: h * 0.45, t: 1 }] },
                    { id: 2, x: w * 0.85, y: h * 0.4, path: [{ x: w * 0.85, y: h * 0.4, t: 0 }, { x: w * 0.8, y: h * 0.4, t: 0.6 }, { x: w * 0.85, y: h * 0.45, t: 1 }] }
                ];
                this.passes = [
                    { fromIndex: 0, toIndex: 1, startTime: 0.45, endTime: 0.55, leadFactor: 1.1 },
                    { fromIndex: 1, toIndex: 2, startTime: 0.6, endTime: 0.75, leadFactor: 1.2 }
                ];
                break;
        }

        this.playerTrails.clear();
        this.defenderTrails = [];
        this.ballTrail = [];
        this.time = 0;
        this.currentPassIndex = -1;
        this.rhythmPhase = 'slow';
    }

    updateExplanation(tacticName) {
        const explanations = {
            'shield-turn': { title: '护球转身 (Shield & Turn)', content: '<p>背身要球时感知防守位置，接球瞬间用身体护住球，以远离防守的脚为轴转身。</p>' },
            'wall-pass': { title: '墙式二过一 (Wall Pass)', content: '<p>接应者 45 度角站位，传球手传完球立刻前插，接应者一脚回传到跑动路线。</p>' },
            'overlap': { title: '交叉换位 (Overlap)', content: '<p>持球者吸引防守，交叉者从持球者身后跑过，防守被交叉迷惑瞬间，持球者传给交叉者。</p>' },
            'third-man': { title: '第三人配合 (Third Man Run)', content: '<p>A 传给 B，B 不做处理直接做球给 C，C 接球完成进攻，B 的做球时机是关键。</p>' },
            'triangle': { title: '三角传递 (Triangle Passing)', content: '<p>动态保持三角站位，连续传递 A→B→C→A，每次传球后立刻跑位，调动防守重心创造空当。</p>' },
            'diagonal-run': { title: '斜线前插 (Diagonal Run)', content: '<p>前插者从防守侧后方盲区启动，45 度斜插两后卫之间，人到球到不减速。</p>' },
            'wing-overlap': { title: '边路套边 (Wing Overlap)', content: '<p>边锋内切带球向中路，边后卫从外线高速套上，边锋回传给套边的边后卫。</p>' },
            'through-ball': { title: '直塞身后 (Through Ball)', content: '<p>前锋在防守侧后方游弋（弧线跑位），传球瞬间全力启动，直塞球打穿防线身后。</p>' },
            'rotation': { title: '拉玛西亚轮转 (La Masia Rotation)', content: '<p>A传B后前插，B做球给C后跑位，C回撤做球给反插的A，多人在局部形成轮转换位。</p>' },
            'box-attack': { title: '禁区配合 (Box Attack)', content: '<p>边锋下底传中，前锋接球做给中场，中场插入禁区射门，多点包抄。</p>' }
        };

        const exp = explanations[tacticName];
        document.getElementById('explanation').innerHTML = `<h3>${exp.title}</h3>${exp.content}`;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.currentTactic) {
            alert('请先选择一个战术！');
            return;
        }
        this.isPlaying = true;
        document.getElementById('playBtn').textContent = '⏸️ 暂停';
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('playBtn').textContent = '▶️ 播放';
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    reset() {
        this.pause();
        this.time = 0;
        this.ballTrail = [];
        this.playerTrails.clear();
        this.defenderTrails = [];
        this.rhythmPhase = 'slow';

        if (this.currentTactic) {
            this.setupTactic(this.currentTactic);
        } else {
            const width = this.canvas.width;
            const height = this.canvas.height;
            this.players = [{
                id: 0, name: '球员',
                x: width * 0.3, y: height * 0.5,
                path: [{ x: width * 0.3, y: height * 0.5, t: 0 }]
            }];
            this.defenders = [];
            this.ball = { x: width * 0.3, y: height * 0.5 };
            this.passes = [];
        }
        this.draw();
    }

    /**
     * 计算 Tiki-Taka 节奏阶段
     * slow: 0-0.55 (慢节奏控球调动)
     * fast: 0.55-1.0 (快节奏致命一击)
     */
    updateRhythmPhase(t) {
        if (t < 0.55) {
            this.rhythmPhase = 'slow';
        } else {
            this.rhythmPhase = 'fast';
        }
    }

    animate() {
        if (!this.isPlaying) return;

        this.time += 0.002;

        if (this.time >= 1) {
            this.time = 0;
            this.setupTactic(this.currentTactic);
        }

        this.updateRhythmPhase(this.time);
        this.updateAnimation();
        this.draw();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    updateAnimation() {
        const t = this.time;

        // 1. 更新进攻球员位置（带碰撞躲避）
        this.players.forEach((player, index) => {
            const pos = this.getPositionOnPath(player.path, t);
            const avoidedPos = this.avoidDefenders(player, pos, t);
            player.x = avoidedPos.x;
            player.y = avoidedPos.y;
        });

        // 2. 更新防守球员位置 - 根据进攻节奏动态调整
        this.defenders.forEach(defender => {
            let defenderT = t;

            if (this.rhythmPhase === 'slow') {
                // 慢节奏：防守 92% 速度紧密跟随
                defenderT = t * 0.92;
            } else {
                // 快节奏：防守有反应延迟，然后全力回追
                const fastStartTime = 0.55;
                const reactionDelay = 0.05;

                if (t >= fastStartTime) {
                    if (t < fastStartTime + reactionDelay) {
                        defenderT = fastStartTime * 0.92;
                    } else {
                        defenderT = fastStartTime * 0.92 + (t - fastStartTime - reactionDelay) * 1.6;
                        if (defenderT > 1) defenderT = 1;
                    }
                }
            }

            const pos = this.getPositionOnPath(defender.path, defenderT);
            defender.x = pos.x;
            defender.y = pos.y;
        });

        // 3. 更新球的位置
        this.updateBall(t);

        // 4. 记录轨迹
        this.recordTrails();
    }

    avoidDefenders(player, targetPos, t) {
        const avoidRadius = 25;
        const avoidStrength = 0.6;

        let avoidX = 0;
        let avoidY = 0;

        this.defenders.forEach(defender => {
            const dx = targetPos.x - defender.x;
            const dy = targetPos.y - defender.y;
            const dist = Math.hypot(dx, dy);

            if (dist < avoidRadius && dist > 0) {
                const avoidForce = (avoidRadius - dist) / avoidRadius;
                avoidX += (-dy / dist) * avoidForce * avoidStrength * 15;
                avoidY += (dx / dist) * avoidForce * avoidStrength * 15;
            }
        });

        return { x: targetPos.x + avoidX, y: targetPos.y + avoidY };
    }

    getPositionOnPath(path, t) {
        if (t <= path[0].t) return { x: path[0].x, y: path[0].y };
        if (t >= path[path.length - 1].t) return { x: path[path.length - 1].x, y: path[path.length - 1].y };

        for (let i = 0; i < path.length - 1; i++) {
            const p0 = path[i];
            const p1 = path[i + 1];

            if (t >= p0.t && t <= p1.t) {
                if (p0.t === p1.t) return { x: p0.x, y: p0.y };
                const localT = (t - p0.t) / (p1.t - p0.t);
                return {
                    x: p0.x + (p1.x - p0.x) * localT,
                    y: p0.y + (p1.y - p0.y) * localT
                };
            }
        }

        return { x: path[path.length - 1].x, y: path[path.length - 1].y };
    }

    updateBall(t) {
        let activePass = null;
        let activePassIndex = -1;

        for (let i = 0; i < this.passes.length; i++) {
            const pass = this.passes[i];
            if (t >= pass.startTime && t <= pass.endTime) {
                activePass = pass;
                activePassIndex = i;
                break;
            }
        }

        if (activePass) {
            const passT = (t - activePass.startTime) / (activePass.endTime - activePass.startTime);

            const fromPos = this.getPositionOnPath(
                this.players[activePass.fromIndex].path,
                activePass.startTime
            );

            let toPos;
            if (activePass.leadFactor) {
                const receiverPosAtEnd = this.getPositionOnPath(
                    this.players[activePass.toIndex].path,
                    activePass.endTime
                );
                const receiverPosAtStart = this.getPositionOnPath(
                    this.players[activePass.toIndex].path,
                    activePass.startTime
                );
                const dirX = receiverPosAtEnd.x - receiverPosAtStart.x;
                const dirY = receiverPosAtEnd.y - receiverPosAtStart.y;
                toPos = {
                    x: receiverPosAtEnd.x + dirX * (activePass.leadFactor - 1),
                    y: receiverPosAtEnd.y + dirY * (activePass.leadFactor - 1)
                };
            } else {
                toPos = this.getPositionOnPath(
                    this.players[activePass.toIndex].path,
                    activePass.endTime
                );
            }

            this.ball.x = fromPos.x + (toPos.x - fromPos.x) * passT;
            this.ball.y = fromPos.y + (toPos.y - fromPos.y) * passT;
            this.currentPassIndex = activePassIndex;

            this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
            if (this.ballTrail.length > 60) this.ballTrail.shift();
        } else {
            let lastPass = null;
            let nextPass = null;

            for (let i = 0; i < this.passes.length; i++) {
                const pass = this.passes[i];
                if (pass.endTime <= t) lastPass = pass;
                else if (pass.startTime > t && !nextPass) nextPass = pass;
            }

            if (lastPass) {
                const receiver = lastPass.toIndex;
                const pos = this.getPositionOnPath(this.players[receiver].path, t);
                this.ball.x = pos.x;
                this.ball.y = pos.y;
                this.ballTrail = [];
            } else if (nextPass) {
                const passer = nextPass.fromIndex;
                const pos = this.getPositionOnPath(this.players[passer].path, t);
                this.ball.x = pos.x;
                this.ball.y = pos.y;
            } else {
                const pos = this.getPositionOnPath(this.players[0].path, t);
                this.ball.x = pos.x;
                this.ball.y = pos.y;
            }
        }
    }

    recordTrails() {
        this.players.forEach((player, index) => {
            if (!this.playerTrails.has(index)) this.playerTrails.set(index, []);
            const trail = this.playerTrails.get(index);
            trail.push({ x: player.x, y: player.y });
            if (trail.length > 80) trail.shift();
        });

        this.defenders.forEach((defender, index) => {
            if (!this.defenderTrails[index]) this.defenderTrails[index] = [];
            const trail = this.defenderTrails[index];
            trail.push({ x: defender.x, y: defender.y });
            if (trail.length > 80) trail.shift();
        });
    }

    draw() {
        this.ctx.fillStyle = '#4a7c4e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawPitch();
        this.drawTrails();

        this.defenders.forEach(d => this.drawDefender(d.x, d.y));
        this.players.forEach(p => this.drawPlayer(p.x, p.y, p.name));

        if (this.ball) this.drawBall(this.ball.x, this.ball.y);

        this.drawTacticHints();
        this.drawRhythmIndicator();
    }

    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;

        ctx.strokeRect(20, 20, w - 40, h - 40);
        ctx.beginPath();
        ctx.moveTo(w / 2, 20);
        ctx.lineTo(w / 2, h - 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeRect(20, h / 2 - 60, 60, 120);
        ctx.strokeRect(w - 80, h / 2 - 60, 60, 120);
        ctx.strokeRect(20, h / 2 - 100, 120, 200);
        ctx.strokeRect(w - 140, h / 2 - 100, 120, 200);
    }

    drawPlayer(x, y, name) {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#2196F3';
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(name, x, y - 12);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    drawDefender(x, y) {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText('防', x, y - 12);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    drawBall(x, y) {
        const ctx = this.ctx;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚽', x, y);
    }

    drawTrails() {
        const ctx = this.ctx;

        this.defenderTrails.forEach(trail => {
            if (trail && trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                ctx.stroke();
            }
        });

        this.playerTrails.forEach(trail => {
            if (trail && trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = 'rgba(33, 150, 243, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                ctx.stroke();
            }
        });

        if (this.ballTrail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.ballTrail[0].x, this.ballTrail[0].y);
            for (let i = 1; i < this.ballTrail.length; i++) ctx.lineTo(this.ballTrail[i].x, this.ballTrail[i].y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    drawRhythmIndicator() {
        const ctx = this.ctx;
        const w = this.canvas.width;

        ctx.font = 'bold 11px Microsoft YaHei';
        ctx.textAlign = 'right';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;

        const phases = [
            { name: '慢节奏控球', key: 'slow', color: '#3498db' },
            { name: '快节奏致命', key: 'fast', color: '#e74c3c' }
        ];

        let x = w - 20;
        const y = 30;

        phases.forEach((phase, index) => {
            const isActive = this.rhythmPhase === phase.key;
            ctx.fillStyle = isActive ? phase.color : 'rgba(255,255,255,0.4)';
            ctx.fillText(phase.name, x, y + index * 20);
        });

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    drawTacticHints() {
        const ctx = this.ctx;
        if (!this.currentTactic || !this.isPlaying) return;

        const t = this.time;
        ctx.font = 'bold 12px Microsoft YaHei';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;

        let hint = '';
        let defenseHint = '';
        let tikiHint = '';

        if (t < 0.55) {
            tikiHint = '🔵 慢节奏控球';
        } else {
            tikiHint = '🔴 快节奏致命';
        }



        if (hint) ctx.fillText(hint, 30, 35);
        if (defenseHint) { ctx.fillStyle = '#e74c3c'; ctx.fillText(defenseHint, 30, 55); }
        if (tikiHint) { ctx.fillStyle = this.rhythmPhase === 'slow' ? '#3498db' : '#e74c3c'; ctx.fillText(tikiHint, 30, 75); }

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TacticsGame();
});
