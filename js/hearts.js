/**
 * CrushRadar - Enhanced Heart Animation System
 * 强化版爱心动画
 * - 更多漂浮爱心
 * - 鼠标轨迹爱心
 * - 点击爆发效果
 * - 爱心文字漂浮
 */

(function() {
    'use strict';

    const canvas = document.getElementById('heart-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // ===========================================
    // 画布设置
    // ===========================================
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ===========================================
    // 配置
    // ===========================================
    const config = {
        heartCount: 60,          // 爱心数量（增加）
        trailHeartCount: 30,     // 轨迹爱心数量
        burstHeartCount: 15,     // 爆发爱心数量
        floatingTextCount: 8     // 漂浮文字数量
    };

    // ===========================================
    // 颜色配置
    // ===========================================
    const heartColors = [
        'rgba(230, 57, 70, 0.7)',
        'rgba(255, 77, 109, 0.6)',
        'rgba(255, 107, 107, 0.5)',
        'rgba(255, 0, 85, 0.6)',
        'rgba(255, 215, 0, 0.6)',
        'rgba(255, 182, 193, 0.7)',
        'rgba(255, 20, 147, 0.5)',
        'rgba(255, 105, 180, 0.6)'
    ];

    const glowColors = [
        'rgba(255, 77, 109, 0.8)',
        'rgba(255, 0, 85, 0.8)',
        'rgba(255, 215, 0, 0.8)',
        'rgba(255, 20, 147, 0.8)'
    ];

    // ===========================================
    // 漂浮文字
    // ===========================================
    const floatingWords = ['Love', 'Crush', '💕', '💗', '💖', '❤️', 'Love', 'Crush'];

    /**
     * 漂浮文字类
     */
    class FloatingText {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.size = Math.random() * 20 + 15;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.text = floatingWords[Math.floor(Math.random() * floatingWords.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y < -50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(this.text, 0, 0);
            ctx.restore();
        }
    }

    /**
     * 爱心类
     */
    class Heart {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            // 尺寸
            const sizeRoll = Math.random();
            if (sizeRoll < 0.3) {
                this.size = Math.random() * 8 + 4;      // 小
            } else if (sizeRoll < 0.7) {
                this.size = Math.random() * 12 + 12;   // 中
            } else {
                this.size = Math.random() * 16 + 24;   // 大
            }

            // 对角线移动
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.speedX = (Math.random() * 1.5 + 0.5) * this.direction;
            this.speedY = (Math.random() * 1.5 + 0.5) * this.direction;

            // 颜色
            this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
            this.isGlow = Math.random() > 0.7;
            if (this.isGlow) {
                this.color = glowColors[Math.floor(Math.random() * glowColors.length)];
            }

            // 旋转
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;

            // 透明度
            this.opacity = Math.random() * 0.4 + 0.3;

            // 散开
            this.scatterMode = false;
            this.scatterX = 0;
            this.scatterY = 0;
            this.scatterLife = 0;

            // 脉动
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.05 + 0.02;
        }

        update(mouseX, mouseY, mouseOnCanvas) {
            // 鼠标散开
            if (!this.scatterMode && mouseOnCanvas) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.scatterMode = true;
                    const angle = Math.atan2(dy, dx);
                    const force = (120 - distance) / 120 * 10;
                    this.scatterX = Math.cos(angle) * force;
                    this.scatterY = Math.sin(angle) * force;
                    this.scatterLife = 1;
                }
            }

            if (this.scatterMode) {
                this.x += this.scatterX;
                this.y += this.scatterY;
                this.scatterLife -= 0.04;
                this.scatterX *= 0.92;
                this.scatterY *= 0.92;

                if (this.scatterLife <= 0) {
                    this.scatterMode = false;
                }
            } else {
                this.x += this.speedX;
                this.y += this.speedY;
            }

            // 脉动
            this.pulsePhase += this.pulseSpeed;

            // 旋转
            this.rotation += this.rotationSpeed;

            // 边界重置
            if (this.x < -50 || this.x > canvas.width + 50 ||
                this.y < -50 || this.y > canvas.height + 50) {
                this.reset();
                if (this.direction > 0) {
                    this.x = -20;
                    this.y = Math.random() * canvas.height;
                } else {
                    this.x = canvas.width + 20;
                    this.y = Math.random() * canvas.height;
                }
            }
        }

        draw() {
            const pulse = 1 + Math.sin(this.pulsePhase) * 0.1;
            const drawSize = this.size * pulse;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.scatterMode ? this.opacity * this.scatterLife : this.opacity;
            ctx.fillStyle = this.color;

            // 发光
            if (this.isGlow && !this.scatterMode) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
            }

            // 绘制爱心
            ctx.beginPath();
            ctx.moveTo(0, drawSize / 4);
            ctx.bezierCurveTo(-drawSize / 2, -drawSize / 2, -drawSize, drawSize / 6, 0, drawSize);
            ctx.bezierCurveTo(drawSize, drawSize / 6, drawSize / 2, -drawSize / 2, 0, drawSize / 4);
            ctx.fill();

            ctx.restore();
        }
    }

    /**
     * 轨迹爱心类（鼠标经过时留下）
     */
    class TrailHeart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 10 + 8;
            this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.rotation = Math.random() * Math.PI * 2;
        }

        update() {
            this.life -= this.decay;
        }

        draw() {
            if (this.life <= 0) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.life * 0.6;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;

            ctx.beginPath();
            ctx.moveTo(0, this.size / 4);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 6, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 6, this.size / 2, -this.size / 2, 0, this.size / 4);
            ctx.fill();

            ctx.restore();
        }

        isDead() {
            return this.life <= 0;
        }
    }

    /**
     * 爆发爱心类（点击时产生）
     */
    class BurstHeart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 15 + 10;
            this.color = glowColors[Math.floor(Math.random() * glowColors.length)];
            this.life = 1;
            this.decay = Math.random() * 0.03 + 0.02;

            // 爆发方向
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.vy += 0.1; // 重力
            this.life -= this.decay;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            if (this.life <= 0) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;

            ctx.beginPath();
            ctx.moveTo(0, this.size / 4);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 6, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 6, this.size / 2, -this.size / 2, 0, this.size / 4);
            ctx.fill();

            ctx.restore();
        }

        isDead() {
            return this.life <= 0;
        }
    }

    // ===========================================
    // 创建对象
    // ===========================================
    const hearts = [];
    for (let i = 0; i < config.heartCount; i++) {
        hearts.push(new Heart());
    }

    const floatingTexts = [];
    for (let i = 0; i < config.floatingTextCount; i++) {
        floatingTexts.push(new FloatingText());
    }

    let trailHearts = [];
    let burstHearts = [];

    // 鼠标跟踪
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseOnCanvas = false;
    let lastTrailTime = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseOnCanvas = true;

        // 限制轨迹生成频率
        const now = Date.now();
        if (now - lastTrailTime > 50) {
            trailHearts.push(new TrailHeart(mouseX, mouseY));
            if (trailHearts.length > config.trailHeartCount) {
                trailHearts.shift();
            }
            lastTrailTime = now;
        }
    });

    document.addEventListener('mouseleave', () => {
        mouseOnCanvas = false;
    });

    // 点击爆发
    canvas.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        for (let i = 0; i < config.burstHeartCount; i++) {
            burstHearts.push(new BurstHeart(x, y));
        }
    });

    // ===========================================
    // 动画循环
    // ===========================================
    function animate() {
        // 清除画布（带拖尾）
        ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制漂浮文字
        floatingTexts.forEach(text => {
            text.update();
            text.draw();
        });

        // 更新和绘制轨迹爱心
        trailHearts = trailHearts.filter(t => {
            t.update();
            t.draw();
            return !t.isDead();
        });

        // 更新和绘制爆发爱心
        burstHearts = burstHearts.filter(b => {
            b.update();
            b.draw();
            return !b.isDead();
        });

        // 更新和绘制漂浮爱心
        hearts.forEach(heart => {
            heart.update(mouseX, mouseY, mouseOnCanvas);
            heart.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // ===========================================
    // 暴露全局函数供HTML调用
    // ===========================================
    window.heartBurst = function(x, y, count) {
        count = count || config.burstHeartCount;
        for (let i = 0; i < count; i++) {
            burstHearts.push(new BurstHeart(x || canvas.width / 2, y || canvas.height / 2));
        }
    };

})();
