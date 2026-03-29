/**
 * 台州体彩 AI 智能助手 - 主应用逻辑
 */

// 彩种配置
const LOTTERY_CONFIG = {
    'dlt': { name: '超级大乐透', frontRange: [1, 35], frontCount: 5, backRange: [1, 12], backCount: 2 },
    'pl3': { name: '排列三', range: [0, 9], count: 3 },
    'pl5': { name: '排列五', range: [0, 9], count: 5 },
    'qxc': { name: '七星彩', frontRange: [0, 9], frontCount: 6, backRange: [0, 14], backCount: 1 }
};

// 全局状态
const AppState = { currentRecommendCount: 3, selectedAlgorithms: ['mlp', 'lstm'] };

// 工具函数
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomSample(array, count) { return [...array].sort(() => 0.5 - Math.random()).slice(0, count); }
function range(start, end) { return Array.from({ length: end - start + 1 }, (_, i) => start + i); }
function formatNumber(num, padding = 2) { return String(num).padStart(padding, '0'); }

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('[App] 台州体彩 AI 智能助手已启动 🚀');
    initNavigation();
    loadLatestDraws();
    animateStats();
    bindEvents();
});

// 导航功能
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                showSection(this.getAttribute('href').substring(1));
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 动画效果
function animateStats() {
    const stats = [
        { id: 'statDraws', target: 15000, suffix: '+' },
        { id: 'statUsers', target: 8800, suffix: '+' },
        { id: 'statAccuracy', target: 87, suffix: '%' }
    ];
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            let current = 0, increment = stat.target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) { current = stat.target; clearInterval(timer); }
                element.textContent = Math.floor(current) + stat.suffix;
            }, 40);
        }
    });
}

// 加载最新开奖
function loadLatestDraws() {
    const container = document.getElementById('latestDraws');
    if (!container) return;
    const draws = [
        { type: '大乐透', period: '26031', numbers: '06 08 22 29 34 + 05 07' },
        { type: '排列三', period: '26075', numbers: '4 3 7' },
        { type: '排列五', period: '26075', numbers: '4 3 7 5 2' },
        { type: '七星彩', period: '26032', numbers: '3 1 6 4 4 5 + 14' }
    ];
    container.innerHTML = draws.map(d => 
        `<div style="display:flex;align-items:center;gap:15px;background:rgba(255,255,255,0.1);padding:10px 20px;border-radius:15px;white-space:nowrap;">
            <span style="font-weight:700;">${d.type}</span><span style="opacity:0.8;">${d.period}期</span>
            <span style="font-family:monospace;font-size:1.1rem;font-weight:700;">${d.numbers}</span>
        </div>`
    ).join('');
}

// 事件绑定
function bindEvents() {
    document.querySelectorAll('.note-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.note-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            AppState.currentRecommendCount = parseInt(this.dataset.count);
        });
    });
}

// 快速选号
function quickSelect(lotteryType) {
    const config = LOTTERY_CONFIG[lotteryType];
    const result = generateQuickNumbers(lotteryType);
    showModal(`${config.name} - 快速选号`, `
        <div style="text-align:center;padding:30px;">
            <div style="font-size:3rem;margin-bottom:20px;">⚡</div>
            <h3 style="color:var(--primary-color);margin-bottom:20px;">随机号码已生成</h3>
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:30px;">
                ${renderBalls(result, lotteryType)}
            </div>
            <button class="btn btn-primary" onclick="quickSelect('${lotteryType}')">🔄 重新生成</button>
            <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
        </div>
    `);
}

function generateQuickNumbers(lotteryType) {
    const config = LOTTERY_CONFIG[lotteryType];
    if (config.frontRange) {
        const front = randomSample(range(config.frontRange[0], config.frontRange[1]), config.frontCount).sort((a, b) => a - b);
        const back = randomSample(range(config.backRange[0], config.backRange[1]), config.backCount).sort((a, b) => a - b);
        return { front, back };
    } else {
        return Array.from({ length: config.count }, () => randomInt(config.range[0], config.range[1]));
    }
}

function renderBalls(numbers, lotteryType) {
    if (Array.isArray(numbers)) {
        return numbers.map(n => `<span class="number-ball digit">${n}</span>`).join('');
    } else {
        let html = '';
        numbers.front.forEach(n => html += `<span class="number-ball front">${formatNumber(n)}</span>`);
        if (numbers.back) {
            html += '<span class="number-separator">+</span>';
            if (Array.isArray(numbers.back)) {
                numbers.back.forEach(n => html += `<span class="number-ball back">${formatNumber(n)}</span>`);
            } else {
                html += `<span class="number-ball back special">${numbers.back}</span>`;
            }
        }
        return html;
    }
}

// 显示详情
function showLotteryDetail(lotteryType) {
    const content = {
        dlt: { title: '超级大乐透', icon: '🎫', rules: '从 35 个前区号码中选 5 个，再从 12 个后区号码中选 2 个', price: '2 元/注，追加 3 元/注', prize: '一等奖最高 1000 万元', draw: '周一、三、六 21:25' },
        pl3: { title: '排列三', icon: '🎲', rules: '从 000-999 中选择一个三位数', price: '2 元/注', prize: '直选 1040 元，组三 346 元，组六 173 元', draw: '每天 21:25' },
        pl5: { title: '排列五', icon: '🎯', rules: '从 00000-99999 中选择一个五位数', price: '2 元/注', prize: '固定奖 10 万元', draw: '每天 21:25' },
        qxc: { title: '七星彩', icon: '⭐', rules: '前 6 位从 0-9 中选择，第 7 位从 0-14 中选择', price: '2 元/注', prize: '一等奖最高 500 万元', draw: '周二、五、日 21:25' }
    };
    const info = content[lotteryType];
    showModal(`${info.icon} ${info.title}`, `
        <div style="padding:20px;">
            <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;border-radius:15px;text-align:center;margin-bottom:30px;">
                <div style="font-size:4rem;margin-bottom:15px;">${info.icon}</div>
                <h2 style="font-size:2rem;margin-bottom:10px;">${info.title}</h2>
            </div>
            <div style="display:grid;gap:20px;">
                <div style="background:#f8f9fa;padding:20px;border-radius:12px;border-left:4px solid var(--primary-color);">
                    <h4 style="color:var(--primary-color);margin-bottom:10px;">📋 玩法规则</h4>
                    <p style="color:#666;line-height:1.8;">${info.rules}</p>
                </div>
                <div style="background:#f8f9fa;padding:20px;border-radius:12px;border-left:4px solid #28a745;">
                    <h4 style="color:#28a745;margin-bottom:10px;">💰 单注价格</h4>
                    <p style="color:#666;font-size:1.2rem;">${info.price}</p>
                </div>
                <div style="background:#f8f9fa;padding:20px;border-radius:12px;border-left:4px solid #ffc107;">
                    <h4 style="color:#856404;margin-bottom:10px;">🏆 奖金设置</h4>
                    <p style="color:#666;font-size:1.2rem;">${info.prize}</p>
                </div>
                <div style="background:#f8f9fa;padding:20px;border-radius:12px;border-left:4px solid #17a2b8;">
                    <h4 style="color:#17a2b8;margin-bottom:10px;">📅 开奖时间</h4>
                    <p style="color:#666;font-size:1.2rem;">${info.draw}</p>
                </div>
            </div>
        </div>
    `);
}

// AI 走势分析
function analyzeTrendsAI() {
    const lotteryType = document.getElementById('trend-lottery-type').value;
    const dimension = document.getElementById('trend-dimension').value;
    const period = parseInt(document.getElementById('trend-period').value);
    const resultBox = document.getElementById('trend-result-ai');
    if (!resultBox) return;
    
    resultBox.innerHTML = `<div style="text-align:center;padding:60px 20px;">
        <div style="font-size:4rem;animation:pulse 1s infinite;">🔍</div>
        <h3 style="color:var(--primary-color);margin:20px 0;">AI 正在分析数据...</h3>
        <p style="color:#666;">使用${getDimensionName(dimension)}算法分析近${period}期数据</p>
    </div>`;
    
    setTimeout(() => {
        const analysis = AIEngine.analyzeTrends(lotteryType, dimension, period);
        renderTrendAnalysis(analysis, resultBox);
    }, 1500);
}

function getDimensionName(dimension) {
    const names = { 'hot_cold': '冷热号分析', 'skip_value': '遗漏值分析', 'sum_trend': '和值走势', 'odd_even': '奇偶比例', 'big_small': '大小号分布', 'zone_analysis': '区间分析' };
    return names[dimension] || dimension;
}

function renderTrendAnalysis(analysis, container) {
    let html = '<div class="result-content" style="padding:20px;">';
    if (analysis.type === 'hot_cold') {
        html += `<h3 style="color:var(--primary-color);margin-bottom:20px;font-size:1.8rem;">🔥 冷热号分析报告</h3>
            <p style="color:#666;margin-bottom:30px;">分析周期：近${analysis.period}期</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:30px;">
                <div style="background:linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%);padding:25px;border-radius:15px;">
                    <h4 style="color:#d63031;margin-bottom:15px;font-size:1.3rem;">🔥 热号 TOP5</h4>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;">
                        ${analysis.hotNumbers.map(h => `<span style="background:white;padding:10px 20px;border-radius:25px;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,0.1);">${h.number}<span style="color:#999;font-size:0.85rem;">(${h.percentage}%)</span></span>`).join('')}
                    </div>
                </div>
                <div style="background:linear-gradient(135deg,#a1c4fd 0%,#c2e9fb 100%);padding:25px;border-radius:15px;">
                    <h4 style="color:#0984e3;margin-bottom:15px;font-size:1.3rem;">❄️ 冷号 TOP5</h4>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;">
                        ${analysis.coldNumbers.map(c => `<span style="background:white;padding:10px 20px;border-radius:25px;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,0.1);">${c.number}<span style="color:#999;font-size:0.85rem;">(${c.percentage}%)</span></span>`).join('')}
                    </div>
                </div>
            </div>
            <div style="background:#fff3cd;padding:20px;border-radius:12px;border-left:4px solid #ffc107;">
                <h4 style="color:#856404;margin-bottom:10px;">💡 AI 分析建议</h4>
                <p style="color:#856404;line-height:1.8;">${analysis.analysis}</p>
            </div>`;
    } else {
        html += `<h3 style="color:var(--primary-color);margin-bottom:20px;font-size:1.8rem;">📈 ${getDimensionName(analysis.type)}报告</h3>
            <pre style="white-space:pre-wrap;line-height:2;color:#666;background:#f8f9fa;padding:20px;border-radius:10px;">${JSON.stringify(analysis,null,2)}</pre>`;
    }
    html += '</div>';
    container.innerHTML = html;
}

// AI 推荐
function generateAIRecommendation() {
    const lotteryType = document.getElementById('rec-lottery-type').value;
    const resultBox = document.getElementById('ai-recommend-result');
    if (!resultBox) return;
    
    resultBox.innerHTML = `<div style="text-align:center;padding:60px 20px;">
        <div style="font-size:4rem;animation:pulse 1s infinite;">🤖</div>
        <h3 style="color:var(--primary-color);margin:20px 0;">AI 推荐引擎运行中...</h3>
    </div>`;
    
    setTimeout(() => {
        const recommendation = AIEngine.generateRecommendation(lotteryType, AppState.selectedAlgorithms, []);
        renderAIRecommendation(recommendation, resultBox);
    }, 2000);
}

function renderAIRecommendation(result, container) {
    const config = LOTTERY_CONFIG[result.lotteryType];
    let html = `<div class="result-content" style="padding:20px;">
        <div style="text-align:center;margin-bottom:30px;">
            <div style="font-size:4rem;margin-bottom:15px;">🤖</div>
            <h3 style="color:var(--primary-color);font-size:2rem;margin-bottom:10px;">AI 智能推荐结果</h3>
            <p style="color:#666;">彩种：${config.name} | 算法：${result.algorithms.join(' + ')} | 置信度：<span style="color:#28a745;font-weight:700;">${result.confidence}%</span></p>
        </div>
        <div style="display:grid;gap:20px;margin-bottom:30px;">`;
    
    result.recommendations.forEach((rec, index) => {
        html += `<div style="background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:25px;border-radius:15px;border-left:4px solid var(--primary-color);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <h4 style="color:var(--primary-color);font-size:1.3rem;">推荐 ${index + 1}</h4>
                <span style="background:#28a745;color:white;padding:5px 15px;border-radius:20px;font-weight:700;font-size:0.9rem;">置信度 ${rec.confidence?.toFixed(1) || result.confidence}%</span>
            </div>
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:15px;">
                ${renderBalls(rec.numbers, result.lotteryType)}
            </div>
        </div>`;
    });
    
    html += `</div>
        <div style="background:#fff3cd;padding:20px;border-radius:12px;border-left:4px solid #ffc107;margin-bottom:20px;">
            <h4 style="color:#856404;margin-bottom:10px;">💡 AI 分析说明</h4>
            <p style="color:#856404;line-height:1.8;">本推荐基于${result.algorithms.length}种 AI 算法融合分析。置信度${result.confidence}%表示算法信心程度，但不保证中奖。</p>
        </div>
        <div style="text-align:center;padding-top:20px;border-top:2px dashed #e0e0e0;">
            <button class="btn btn-primary btn-lg" onclick="generateAIRecommendation()" style="margin-right:15px;">🔄 重新生成</button>
            <button class="btn btn-secondary btn-lg" onclick="window.print()">🖨️ 打印结果</button>
        </div>
        <p style="text-align:center;color:#999;font-size:0.9rem;margin-top:20px;">⚠️ 理性购彩，量力而行 | AI 推荐仅供参考</p>
    </div>`;
    container.innerHTML = html;
}

// 历史数据查询
function queryHistoryData() {
    const lotteryType = document.getElementById('data-lottery-type').value;
    const tbody = document.getElementById('historyDataBody');
    if (!tbody) return;
    const data = AIEngine.historicalData[lotteryType] || [];
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><div class="empty-icon">📊</div><p>暂无数据</p></td></tr>';
        return;
    }
    let html = '';
    data.slice(0, 20).forEach(row => {
        const numbersStr = Array.isArray(row.numbers) ? row.numbers.join(' ') : (row.numbers.front?.join(' ') + ' + ' + row.numbers.back?.join(' '));
        html += `<tr style="transition:all 0.3s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
            <td style="font-weight:700;color:var(--primary-color);">${row.period}</td>
            <td>${row.date}</td>
            <td style="font-family:monospace;font-weight:700;">${numbersStr}</td>
            <td>${row.sum || '-'}</td>
            <td>${row.odd || '-'}</td>
            <td>${row.big || '-'}</td>
            <td><button class="btn-action" style="padding:5px 15px;font-size:0.85rem;" onclick="alert('分析功能开发中...')">🔍 分析</button></td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// AI 聊天
function toggleAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    if (chatWindow) chatWindow.classList.toggle('show');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    if (!input || !messagesContainer) return;
    const message = input.value.trim();
    if (!message) return;
    addChatMessage(message, 'user');
    input.value = '';
    setTimeout(() => {
        const response = AIEngine.chatResponse(message);
        addChatMessage(response, 'ai');
    }, 800);
}

function addChatMessage(content, type) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') sendChatMessage();
}

// 弹窗
function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    modalBody.innerHTML = `<span class="modal-close" onclick="closeModal()" style="position:absolute;right:20px;top:20px;font-size:2rem;cursor:pointer;">&times;</span><h3 style="margin-bottom:20px;font-size:1.8rem;color:var(--primary-color);">${title}</h3>${content}`;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('show');
}

// 启动 AI 推荐（快捷按钮）
function startAIRecommendation() {
    showSection('recommend');
}

// 检查中奖
function checkMyTickets() {
    alert('🔍 查中奖功能开发中...\n\n您可以手动对比开奖号码，或使用 AI 推荐功能获取新号码！');
}

// 高级设置
function advancedSettings() {
    alert('⚙️ 高级设置功能开发中...\n\n包括：\n- 自定义算法权重\n- 特征工程配置\n- 历史数据范围调整\n- 模型参数优化');
}

// 导出全局函数
window.showSection = showSection;
window.quickSelect = quickSelect;
window.showLotteryDetail = showLotteryDetail;
window.analyzeTrendsAI = analyzeTrendsAI;
window.generateAIRecommendation = generateAIRecommendation;
window.queryHistoryData = queryHistoryData;
window.toggleAIChat = toggleAIChat;
window.sendChatMessage = sendChatMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.closeModal = closeModal;
window.startAIRecommendation = startAIRecommendation;
window.checkMyTickets = checkMyTickets;
window.advancedSettings = advancedSettings;

console.log('[App] 所有功能已就绪 ✨');
