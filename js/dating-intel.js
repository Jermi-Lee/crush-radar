/**
 * CrushRadar - Dating Intel Module (约会情报局)
 * 表单验证、图片预览、复制功能
 */

(function() {
    'use strict';

    // ===========================================
    // DOM 元素引用
    // ===========================================
    const socialInput = document.getElementById('social-link-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    // ===========================================
    // 支持的社交平台正则
    // ===========================================
    const platformPatterns = {
        'instagram': /instagram\.com/i,
        'xiaohongshu': /xiaohongshu\.com|xhslink\.com/i,
        'facebook': /facebook\.com/i,
        'linkedin': /linkedin\.com/i,
        'threads': /threads\.net/i,
        'twitter': /twitter\.com|x\.com/i
    };

    // ===========================================
    // 表单验证 - 社交链接分析
    // ===========================================
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            const url = socialInput.value.trim();

            // 空输入检查
            if (!url) {
                showError(socialInput, '请输入社交媒体链接');
                return;
            }

            // URL格式检查
            if (!isValidURL(url)) {
                showError(socialInput, '请输入有效的网址');
                return;
            }

            // 检测平台
            const platform = detectPlatform(url);
            if (!platform) {
                showError(socialInput, '暂不支持该平台，支持：Instagram、小红书、Facebook、LinkedIn');
                return;
            }

            // 模拟分析过程
            simulateAnalysis(platform);
        });
    }

    // 输入时清除错误状态
    if (socialInput) {
        socialInput.addEventListener('input', function() {
            clearError(this);
        });

        // 回车键触发分析
        socialInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                analyzeBtn.click();
            }
        });
    }

    // ===========================================
    // 图片上传区域交互
    // ===========================================
    if (uploadArea && fileInput) {
        // 点击上传
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--red-primary)';
            this.style.background = 'rgba(230, 57, 70, 0.1)';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border)';
            this.style.background = 'transparent';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border)';
            this.style.background = 'transparent';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFiles(files);
            }
        });

        // 文件选择处理
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFiles(this.files);
            }
        });
    }

    // ===========================================
    // 复制功能
    // ===========================================
    copyButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            copyToClipboard(textToCopy, this);
        });
    });

    // ===========================================
    // 辅助函数
    // ===========================================

    /**
     * 验证URL格式
     * @param {string} url - 待验证的网址
     * @returns {boolean}
     */
    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 检测社交平台类型
     * @param {string} url - 网址
     * @returns {string|null} 平台名称或null
     */
    function detectPlatform(url) {
        for (const [name, pattern] of Object.entries(platformPatterns)) {
            if (pattern.test(url)) {
                return name;
            }
        }
        return null;
    }

    /**
     * 显示错误提示
     * @param {HTMLElement} input - 输入框元素
     * @param {string} message - 错误信息
     */
    function showError(input, message) {
        clearError(input);
        input.style.borderColor = 'var(--red-primary)';
        input.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.2)';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.style.cssText = 'color: var(--red-light); font-size: 0.8rem; margin-top: 8px;';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    /**
     * 清除错误状态
     * @param {HTMLElement} input - 输入框元素
     */
    function clearError(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        const error = input.parentNode.querySelector('.input-error');
        if (error) {
            error.remove();
        }
    }

    /**
     * 模拟AI分析过程
     * @param {string} platform - 社交平台名称
     */
    function simulateAnalysis(platform) {
        analyzeBtn.textContent = '🔄 分析中...';
        analyzeBtn.disabled = true;

        // 模拟2秒分析时间
        setTimeout(function() {
            analyzeBtn.textContent = '✅ 分析完成';
            analyzeBtn.style.background = 'var(--gold)';

            // 3秒后恢复原状态
            setTimeout(function() {
                analyzeBtn.textContent = '🔍 開始分析';
                analyzeBtn.style.background = '';
                analyzeBtn.disabled = false;
            }, 3000);
        }, 2000);
    }

    /**
     * 处理上传的文件
     * @param {FileList} files - 文件列表
     */
    function handleFiles(files) {
        const maxFiles = 9;
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (files.length > maxFiles) {
            alert(`最多只能上传 ${maxFiles} 张图片`);
            return;
        }

        Array.from(files).forEach(function(file) {
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} 不是图片文件`);
                return;
            }

            // 检查文件大小
            if (file.size > maxSize) {
                alert(`${file.name} 超过5MB限制`);
                return;
            }

            // 这里可以添加图片预览逻辑
            console.log('Uploaded file:', file.name);
        });
    }

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @param {HTMLElement} button - 触发复制的按钮
     */
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(function() {
            const originalText = button.textContent;
            button.textContent = '✅ 已复制';
            button.style.background = 'var(--gold)';

            setTimeout(function() {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(function() {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            button.textContent = '✅ 已复制';
            setTimeout(function() {
                button.textContent = '複製';
            }, 2000);
        });
    }

})();
