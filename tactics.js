// 足球传控战术训练 - JavaScript 实现
class TacticsGame {
    constructor() {
        this.canvas = document.getElementById('tacticsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentTactic = null;
        this.currentVariantIndex = 0;
        this.isPlaying = false;
        this.animationFrame = null;
        this.time = 0;
        this.players = [];
        this.defenders = [];
        this.ball = null;
        this.ballTrail = [];
        this.playerTrails = new Map();
        this.defenderTrails = [];
        this.rhythmPhase = 'slow';
        this.canvasWidth = 800;
        this.canvasHeight = 500;
        this.showAttackerThoughts = true;
        this.showDefenderThoughts = false;
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.setupResizeListener();
        this.setupDisplaySettings();
        this.reset();
        this.draw();
    }

    resizeCanvas() {
        const board = this.canvas.parentElement;
        const rect = board.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                if (this.currentTactic) this.setupTactic(this.currentTactic);
                this.draw();
            }, 250);
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.tactic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tactic-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectTactic(e.target.dataset.tactic);
            });
        });
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    setupDisplaySettings() {
        const attCheckbox = document.getElementById('showAttackerThoughts');
        const defCheckbox = document.getElementById('showDefenderThoughts');
        
        if (attCheckbox) attCheckbox.addEventListener('change', (e) => {
            this.showAttackerThoughts = e.target.checked;
            this.draw();
        });
        if (defCheckbox) defCheckbox.addEventListener('change', (e) => {
            this.showDefenderThoughts = e.target.checked;
            this.draw();
        });
    }

    selectTactic(name) {
        this.currentTactic = name;
        this.currentVariantIndex = 0;
        this.reset();
        this.setupTactic(name);
        this.updateExplanation(name);
        this.updateVariantButtons(name);
        if (!this.isPlaying) this.togglePlay();
    }

    setupTactic(name) {
        const config = TACTICS_CONFIG[name];
        if (!config) return;

        // 支持 variants 数组或直接配置
        const variant = config.variants ? config.variants[this.currentVariantIndex] : config;
        const variantName = config.variants ? config.variants[this.currentVariantIndex].name : '默认';

        const w = this.canvasWidth;
        const h = this.canvasHeight;

        this.players = variant.players.map(p => ({
            id: p.id, name: p.name,
            x: p.path[0].x * w, y: p.path[0].y * h,
            path: p.path.map(pt => ({ x: pt.x * w, y: pt.y * h, t: pt.t })),
            thoughts: p.thoughts
        }));

        this.defenders = variant.defenders.map(d => ({
            id: d.id, name: d.name,
            x: d.path[0].x * w, y: d.path[0].y * h,
            path: d.path.map(pt => ({ x: pt.x * w, y: pt.y * h, t: pt.t })),
            thoughts: d.thoughts
        }));

        this.passes = variant.passes;
        this.playerTrails.clear();
        this.defenderTrails = [];
        this.ballTrail = [];
        this.time = 0;
        this.currentPassIndex = -1;
        this.rhythmPhase = 'slow';
    }

    updateVariantButtons(name) {
        const config = TACTICS_CONFIG[name];
        const container = document.getElementById('variantList');
        const section = document.getElementById('variantSection');
        if (!container || !section) return;
        
        if (config && config.variants && config.variants.length > 1) {
            container.innerHTML = config.variants.map((v, i) => 
                `<button class="variant-btn${i === 0 ? ' active' : ''}" data-variant="${i}">${i + 1}. ${v.name}</button>`
            ).join('');
            
            // 动态绑定事件
            container.querySelectorAll('.variant-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    container.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentVariantIndex = parseInt(e.target.dataset.variant);
                    this.reset();
                    // 自动播放
                    if (!this.isPlaying) {
                        this.isPlaying = true;
                        document.getElementById('playBtn').textContent = '⏸️ 暂停';
                        this.animate();
                    }
                });
            });
            
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    }

    updateExplanation(name) {
        const config = TACTICS_CONFIG[name];
        const variant = config && config.variants ? config.variants[this.currentVariantIndex] : config;
        const exp = TACTIC_EXPLANATIONS[name];
        const variantName = config && config.variants ? config.variants[this.currentVariantIndex].name : '';
        if (exp) {
            document.getElementById('explanation').innerHTML = `<h3>${exp.title} - ${variantName}</h3>${exp.content}`;
        }
    }

    togglePlay() {
        if (!this.currentTactic) { alert('请先选择一个战术！'); return; }
        this.isPlaying = !this.isPlaying;
        document.getElementById('playBtn').textContent = this.isPlaying ? '⏸️ 暂停' : '▶️ 播放';
        if (this.isPlaying) this.animate();
        else if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }

    reset() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.isPlaying = false;
        this.time = 0;
        this.ballTrail = [];
        this.playerTrails.clear();
        this.defenderTrails = [];
        this.rhythmPhase = 'slow';
        document.getElementById('playBtn').textContent = '▶️ 播放';
        if (this.currentTactic) {
            this.setupTactic(this.currentTactic);
            this.updateExplanation(this.currentTactic);
        } else {
            const w = this.canvasWidth, h = this.canvasHeight;
            this.players = [{ id: 0, name: '球员', x: w * 0.3, y: h * 0.5, path: [{ x: w * 0.3, y: h * 0.5, t: 0 }] }];
            this.defenders = [];
            this.ball = { x: w * 0.3, y: h * 0.5 };
            this.passes = [];
        }
        this.draw();
    }

    animate() {
        if (!this.isPlaying) return;
        this.time += 0.0014;
        if (this.time >= 1) { this.time = 0; this.setupTactic(this.currentTactic); }
        this.rhythmPhase = this.time < 0.55 ? 'slow' : 'fast';
        this.updateAnimation();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    updateAnimation() {
        const t = this.time;
        this.players.forEach((player, i) => {
            const pos = this.getPositionOnPath(player.path, t);
            const avoidedPos = this.avoidDefenders(player, pos, t);
            player.x = avoidedPos.x;
            player.y = avoidedPos.y;
        });

        this.defenders.forEach(defender => {
            let dT = t;
            if (this.rhythmPhase === 'slow') dT = t * 0.92;
            else {
                const reactionDelay = 0.05;
                if (t >= 0.55) {
                    dT = t < 0.55 + reactionDelay ? 0.55 * 0.92 : 0.55 * 0.92 + (t - 0.55 - reactionDelay) * 1.6;
                    if (dT > 1) dT = 1;
                }
            }
            const pos = this.getPositionOnPath(defender.path, dT);
            defender.x = pos.x;
            defender.y = pos.y;
        });

        this.updateBall(t);
        this.recordTrails();
    }

    avoidDefenders(player, pos, t) {
        const radius = 25, strength = 0.6;
        let avoidX = 0, avoidY = 0;
        this.defenders.forEach(def => {
            const dx = pos.x - def.x, dy = pos.y - def.y;
            const dist = Math.hypot(dx, dy);
            if (dist < radius && dist > 0) {
                const force = (radius - dist) / radius;
                avoidX += (-dy / dist) * force * strength * 15;
                avoidY += (dx / dist) * force * strength * 15;
            }
        });
        return { x: pos.x + avoidX, y: pos.y + avoidY };
    }

    getPositionOnPath(path, t) {
        if (t <= path[0].t) return { x: path[0].x, y: path[0].y };
        if (t >= path[path.length - 1].t) return { x: path[path.length - 1].x, y: path[path.length - 1].y };
        for (let i = 0; i < path.length - 1; i++) {
            const p0 = path[i], p1 = path[i + 1];
            if (t >= p0.t && t <= p1.t) {
                if (p0.t === p1.t) return { x: p0.x, y: p0.y };
                const localT = (t - p0.t) / (p1.t - p0.t);
                return { x: p0.x + (p1.x - p0.x) * localT, y: p0.y + (p1.y - p0.y) * localT };
            }
        }
        return { x: path[path.length - 1].x, y: path[path.length - 1].y };
    }

    updateBall(t) {
        let activePass = null, activeIndex = -1;
        for (let i = 0; i < this.passes.length; i++) {
            if (t >= this.passes[i].startTime && t <= this.passes[i].endTime) {
                activePass = this.passes[i]; activeIndex = i; break;
            }
        }

        if (activePass) {
            const passT = (t - activePass.startTime) / (activePass.endTime - activePass.startTime);
            const from = this.getPositionOnPath(this.players[activePass.fromIndex].path, activePass.startTime);
            let to;
            if (activePass.leadFactor) {
                // 计算接球者到达目标位置的时间：传球结束时接球者在某位置，提前量意味着球会飞到接球者继续跑动后的位置
                // leadFactor = 1.3 表示球飞到接球者从传球开始到结束跑动距离的 30% 前方
                const end = this.getPositionOnPath(this.players[activePass.toIndex].path, activePass.endTime);
                const start = this.getPositionOnPath(this.players[activePass.toIndex].path, activePass.startTime);
                const runDx = end.x - start.x;
                const runDy = end.y - start.y;
                to = { x: end.x + runDx * (activePass.leadFactor - 1), y: end.y + runDy * (activePass.leadFactor - 1) };
            } else {
                to = this.getPositionOnPath(this.players[activePass.toIndex].path, activePass.endTime);
            }
            this.ball.x = from.x + (to.x - from.x) * passT;
            this.ball.y = from.y + (to.y - from.y) * passT;
            this.currentPassIndex = activeIndex;
            this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
            if (this.ballTrail.length > 60) this.ballTrail.shift();
        } else {
            let lastPass = null, nextPass = null;
            for (let i = 0; i < this.passes.length; i++) {
                if (this.passes[i].endTime <= t) lastPass = this.passes[i];
                else if (this.passes[i].startTime > t && !nextPass) nextPass = this.passes[i];
            }
            let pos;
            if (lastPass) pos = this.getPositionOnPath(this.players[lastPass.toIndex].path, t);
            else if (nextPass) pos = this.getPositionOnPath(this.players[nextPass.fromIndex].path, t);
            else pos = this.getPositionOnPath(this.players[0].path, t);
            this.ball.x = pos.x + 20;
            this.ball.y = pos.y;
            if (lastPass) this.ballTrail = [];
        }
    }

    recordTrails() {
        this.players.forEach((p, i) => {
            if (!this.playerTrails.has(i)) this.playerTrails.set(i, []);
            const trail = this.playerTrails.get(i);
            trail.push({ x: p.x, y: p.y });
            if (trail.length > 80) trail.shift();
        });
        this.defenders.forEach((d, i) => {
            if (!this.defenderTrails[i]) this.defenderTrails[i] = [];
            const trail = this.defenderTrails[i];
            trail.push({ x: d.x, y: d.y });
            if (trail.length > 80) trail.shift();
        });
    }

    draw() {
        this.ctx.fillStyle = '#4a7c4e';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawPitch();
        this.drawTrails();
        this.defenders.forEach(d => this.drawDefender(d.x, d.y, d.name));
        this.players.forEach(p => this.drawPlayer(p.x, p.y, p.name));
        if (this.ball) this.drawBall(this.ball.x, this.ball.y);
        this.drawThoughtBubbles();
        this.drawTacticHints();
    }

    drawPitch() {
        const ctx = this.ctx, w = this.canvasWidth, h = this.canvasHeight;
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;

        // 横向球场：左右进攻
        ctx.strokeRect(20, 20, w - 40, h - 40);
        ctx.beginPath(); ctx.moveTo(w / 2, 20); ctx.lineTo(w / 2, h - 20); ctx.stroke();
        ctx.beginPath(); ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeRect(20, h / 2 - 60, 60, 120); ctx.strokeRect(w - 80, h / 2 - 60, 60, 120);
        ctx.strokeRect(20, h / 2 - 100, 120, 200); ctx.strokeRect(w - 140, h / 2 - 100, 120, 200);

        // 添加球门区域（右侧为进攻方向）
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(w - 25, h / 2 - 70, 8, 140);

        // 进攻方向箭头
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.moveTo(w * 0.65, h / 2 - 15);
        ctx.lineTo(w * 0.75, h / 2);
        ctx.lineTo(w * 0.65, h / 2 + 15);
        ctx.lineTo(w * 0.68, h / 2);
        ctx.closePath();
        ctx.fill();

        // 添加"进攻方向"文字提示
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '12px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.fillText('进攻 →', w * 0.7, h / 2 - 20);
    }

    drawPlayer(x, y, name) {
        const ctx = this.ctx;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = '#2196F3'; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Microsoft YaHei';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
        ctx.fillText(name, x, y + 14);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    }

    drawDefender(x, y, name) {
        const ctx = this.ctx;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = '#e74c3c'; ctx.fill();
        ctx.fillStyle = '#ffcccc'; ctx.font = 'bold 14px Microsoft YaHei';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
        ctx.fillText(name || '防', x, y + 14);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    }

    drawBall(x, y) {
        const ctx = this.ctx;
        ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('⚽', x, y);
    }

    drawTrails() {
        const ctx = this.ctx;
        this.defenderTrails.forEach(trail => {
            if (trail && trail.length > 1) {
                ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = 'rgba(231,76,60,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.stroke();
            }
        });
        this.playerTrails.forEach(trail => {
            if (trail && trail.length > 1) {
                ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = 'rgba(33,150,243,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.stroke();
            }
        });
        if (this.ballTrail.length > 1) {
            ctx.beginPath(); ctx.moveTo(this.ballTrail[0].x, this.ballTrail[0].y);
            for (let i = 1; i < this.ballTrail.length; i++) ctx.lineTo(this.ballTrail[i].x, this.ballTrail[i].y);
            ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
        }
    }

    drawThoughtBubbles() {
        if (!this.isPlaying) return;
        const ctx = this.ctx, t = this.time;
        const getThought = (thoughts) => {
            if (!thoughts || !thoughts.length) return null;
            for (const thought of thoughts) {
                const thoughtStartTime = thought.t;
                const thoughtEndTime = thought.t + 0.25;
                if (t >= thoughtStartTime && t <= thoughtEndTime) return thought;
            }
            return null;
        };

        if (this.showAttackerThoughts) {
            this.players.forEach(p => {
                const thought = getThought(p.thoughts);
                if (thought) this.drawBubble(ctx, p.x, p.y, thought.text);
            });
        }
        if (this.showDefenderThoughts) {
            this.defenders.forEach(d => {
                const thought = getThought(d.thoughts);
                if (thought) this.drawBubble(ctx, d.x, d.y, thought.text);
            });
        }
    }

    drawBubble(ctx, x, y, text) {
        ctx.fillStyle = '#ffeb3b'; ctx.font = 'bold 14px Microsoft YaHei';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
        ctx.fillText(text, x, y - 50);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    }

    drawTacticHints() {
        if (!this.currentTactic || !this.isPlaying) return;
        const ctx = this.ctx, t = this.time;
        ctx.font = 'bold 14px Microsoft YaHei'; ctx.fillStyle = '#fff';
        ctx.textAlign = 'left'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
        const tikiHint = t < 0.55 ? '🔵 慢节奏控球' : '🔴 快节奏致命';
        ctx.fillStyle = t < 0.55 ? '#3498db' : '#e74c3c';
        ctx.fillText(tikiHint, 30, 90);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    }
}

document.addEventListener('DOMContentLoaded', () => new TacticsGame());
