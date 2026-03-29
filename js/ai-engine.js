/**
 * 台州体彩 AI 智能助手 - AI 引擎核心
 * 基于机器学习的彩票数据分析与推荐系统
 */

// ========== AI 引擎配置 ==========

const AI_CONFIG = {
    // 历史数据期数
    defaultPeriod: 100,
    maxPeriod: 500,
    
    // 算法权重
    algorithmWeights: {
        mlp: 0.35,      // MLP 神经网络
        lstm: 0.30,     // LSTM 时序分析
        rf: 0.20,       // 随机森林
        xgboost: 0.15   // XGBoost
    },
    
    // 特征权重
    featureWeights: {
        hot_cold: 0.25,     // 冷热号
        skip_value: 0.20,   // 遗漏值
        sum: 0.15,          // 和值
        odd_even: 0.15,     // 奇偶比
        big_small: 0.15,    // 大小比
        zone: 0.10          // 区间比
    }
};

// ========== 模拟历史数据库 ==========
// 实际应用中应该从 API 获取真实数据

const HISTORICAL_DATA = {
    dlt: generateMockDLTData(100),  // 大乐透 100 期
    pl3: generateMockPL3Data(100),  // 排列三 100 期
    pl5: generateMockPL5Data(100),  // 排列五 100 期
    qxc: generateMockQXCData(100)   // 七星彩 100 期
};

/**
 * 生成模拟大乐透历史数据
 */
function generateMockDLTData(count) {
    const data = [];
    const baseDate = new Date('2026-03-25');
    
    for (let i = 0; i < count; i++) {
        const frontNumbers = randomSample(range(1, 35), 5).sort((a, b) => a - b);
        const backNumbers = randomSample(range(1, 12), 2).sort((a, b) => a - b);
        
        const drawDate = new Date(baseDate);
        drawDate.setDate(drawDate.getDate() - (i * 2));
        
        data.push({
            period: `26${String(31 + i).padStart(3, '0')}`,
            date: formatDate(drawDate),
            numbers: {
                front: frontNumbers,
                back: backNumbers
            },
            sum: frontNumbers.reduce((a, b) => a + b, 0),
            odd: frontNumbers.filter(n => n % 2 === 1).length,
            even: frontNumbers.filter(n => n % 2 === 0).length,
            big: frontNumbers.filter(n => n >= 18).length,
            small: frontNumbers.filter(n => n < 18).length
        });
    }
    
    return data;
}

/**
 * 生成模拟排列三历史数据
 */
function generateMockPL3Data(count) {
    const data = [];
    const baseDate = new Date('2026-03-26');
    
    for (let i = 0; i < count; i++) {
        const numbers = Array.from({ length: 3 }, () => randomInt(0, 9));
        
        const drawDate = new Date(baseDate);
        drawDate.setDate(drawDate.getDate() - i);
        
        data.push({
            period: `26${String(75 + i).padStart(3, '0')}`,
            date: formatDate(drawDate),
            numbers: numbers,
            sum: numbers.reduce((a, b) => a + b, 0),
            odd: numbers.filter(n => n % 2 === 1).length,
            even: numbers.filter(n => n % 2 === 0).length,
            big: numbers.filter(n => n >= 5).length,
            small: numbers.filter(n => n < 5).length
        });
    }
    
    return data;
}

/**
 * 生成模拟排列五历史数据
 */
function generateMockPL5Data(count) {
    const data = [];
    const baseDate = new Date('2026-03-26');
    
    for (let i = 0; i < count; i++) {
        const numbers = Array.from({ length: 5 }, () => randomInt(0, 9));
        
        const drawDate = new Date(baseDate);
        drawDate.setDate(drawDate.getDate() - i);
        
        data.push({
            period: `26${String(75 + i).padStart(3, '0')}`,
            date: formatDate(drawDate),
            numbers: numbers,
            sum: numbers.reduce((a, b) => a + b, 0)
        });
    }
    
    return data;
}

/**
 * 生成模拟七星彩历史数据
 */
function generateMockQXCData(count) {
    const data = [];
    const baseDate = new Date('2026-03-25');
    
    for (let i = 0; i < count; i++) {
        const frontNumbers = Array.from({ length: 6 }, () => randomInt(0, 9));
        const backNumber = randomInt(0, 14);
        
        const drawDate = new Date(baseDate);
        drawDate.setDate(drawDate.getDate() - (i * 2));
        
        data.push({
            period: `26${String(32 + i).padStart(3, '0')}`,
            date: formatDate(drawDate),
            numbers: {
                front: frontNumbers,
                back: backNumber
            },
            sum: frontNumbers.reduce((a, b) => a + b, 0) + backNumber
        });
    }
    
    return data;
}

// ========== 工具函数 ==========

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSample(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// ========== AI 分析引擎 ==========

/**
 * AI 多维度趋势分析
 */
function analyzeTrendsAI(lotteryType, dimension = 'hot_cold', period = 30) {
    console.log(`[AI Engine] 开始分析：${lotteryType}, ${dimension}, ${period}期`);
    
    const historicalData = HISTORICAL_DATA[lotteryType];
    if (!historicalData) {
        throw new Error('不支持的彩种类型');
    }
    
    // 截取指定期数的数据
    const recentData = historicalData.slice(0, period);
    
    let analysisResult;
    
    switch (dimension) {
        case 'hot_cold':
            analysisResult = analyzeHotCold(recentData, lotteryType);
            break;
        case 'skip_value':
            analysisResult = analyzeSkipValue(recentData, lotteryType);
            break;
        case 'sum_trend':
            analysisResult = analyzeSumTrend(recentData);
            break;
        case 'odd_even':
            analysisResult = analyzeOddEven(recentData);
            break;
        case 'big_small':
            analysisResult = analyzeBigSmall(recentData);
            break;
        case 'zone_analysis':
            analysisResult = analyzeZoneDistribution(recentData, lotteryType);
            break;
        default:
            analysisResult = analyzeHotCold(recentData, lotteryType);
    }
    
    console.log('[AI Engine] 分析完成:', analysisResult);
    return analysisResult;
}

/**
 * 冷热号分析
 */
function analyzeHotCold(data, lotteryType) {
    const frequency = {};
    const config = LOTTERY_CONFIG[lotteryType];
    
    // 统计每个号码出现次数
    data.forEach(draw => {
        if (config.frontRange) {
            // 大乐透类型
            draw.numbers.front.forEach(num => {
                frequency[num] = (frequency[num] || 0) + 1;
            });
            draw.numbers.back.forEach(num => {
                frequency[`B${num}`] = (frequency[`B${num}`] || 0) + 1;
            });
        } else {
            // 数字型彩票
            draw.numbers.forEach(num => {
                frequency[num] = (frequency[num] || 0) + 1;
            });
        }
    });
    
    // 排序
    const sortedFreq = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    
    const hotNumbers = sortedFreq.slice(0, 5).map(item => ({
        number: item[0],
        count: item[1],
        percentage: ((item[1] / data.length) * 100).toFixed(1)
    }));
    
    const coldNumbers = sortedFreq.slice(-5).map(item => ({
        number: item[0],
        count: item[1],
        percentage: ((item[1] / data.length) * 100).toFixed(1)
    }));
    
    return {
        type: 'hot_cold',
        lotteryType,
        period: data.length,
        hotNumbers,
        coldNumbers,
        analysis: generateHotColdAnalysis(hotNumbers, coldNumbers)
    };
}

/**
 * 遗漏值分析
 */
function analyzeSkipValue(data, lotteryType) {
    const config = LOTTERY_CONFIG[lotteryType];
    const skipValues = {};
    
    // 初始化所有号码的遗漏值
    if (config.frontRange) {
        for (let i = config.frontRange[0]; i <= config.frontRange[1]; i++) {
            skipValues[i] = 0;
        }
        for (let i = config.backRange[0]; i <= config.backRange[1]; i++) {
            skipValues[`B${i}`] = 0;
        }
    } else {
        for (let i = config.range[0]; i <= config.range[1]; i++) {
            skipValues[i] = 0;
        }
    }
    
    // 计算遗漏值（从最近一期往前推）
    for (let i = 0; i < data.length; i++) {
        const draw = data[i];
        const drawnNumbers = new Set();
        
        if (config.frontRange) {
            draw.numbers.front.forEach(n => drawnNumbers.add(n));
            draw.numbers.back.forEach(n => drawnNumbers.add(`B${n}`));
        } else {
            draw.numbers.forEach(n => drawnNumbers.add(n));
        }
        
        // 更新遗漏值
        Object.keys(skipValues).forEach(num => {
            if (drawnNumbers.has(Number(num)) || drawnNumbers.has(num)) {
                skipValues[num] = 0;
            } else {
                skipValues[num]++;
            }
        });
    }
    
    // 找出遗漏值最大的号码
    const maxSkip = Object.entries(skipValues)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(item => ({
            number: item[0],
            skipValue: item[1]
        }));
    
    return {
        type: 'skip_value',
        lotteryType,
        period: data.length,
        maxSkipNumbers: maxSkip,
        analysis: generateSkipValueAnalysis(maxSkip)
    };
}

/**
 * 和值走势分析
 */
function analyzeSumTrend(data) {
    const sums = data.map(d => d.sum);
    const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length;
    const maxSum = Math.max(...sums);
    const minSum = Math.min(...sums);
    
    // 和值区间分布
    const sumRanges = {
        low: sums.filter(s => s< avgSum * 0.8).length,
        medium: sums.filter(s => s >= avgSum * 0.8 && s <= avgSum * 1.2).length,
        high: sums.filter(s => s > avgSum * 1.2).length
    };
    
    return {
        type: 'sum_trend',
        period: data.length,
        average: avgSum.toFixed(1),
        max: maxSum,
        min: minSum,
        distribution: sumRanges,
        trend: sums.slice(0, 10).reverse(),
        analysis: generateSumTrendAnalysis(avgSum, sumRanges)
    };
}

/**
 * 奇偶比例分析
 */
function analyzeOddEven(data) {
    const oddCounts = data.map(d => d.odd || 0);
    const evenCounts = data.map(d => d.even || 0);
    
    const avgOdd = oddCounts.reduce((a, b) => a + b, 0) / oddCounts.length;
    const avgEven = evenCounts.reduce((a, b) => a + b, 0) / evenCounts.length;
    
    return {
        type: 'odd_even',
        period: data.length,
        averageOdd: avgOdd.toFixed(1),
        averageEven: avgEven.toFixed(1),
        ratio: (avgOdd / avgEven).toFixed(2),
        recentTrend: oddCounts.slice(0, 10).reverse(),
        analysis: generateOddEvenAnalysis(avgOdd, avgEven)
    };
}

/**
 * 大小号分析
 */
function analyzeBigSmall(data) {
    const bigCounts = data.map(d => d.big || 0);
    const smallCounts = data.map(d => d.small || 0);
    
    const avgBig = bigCounts.reduce((a, b) => a + b, 0) / bigCounts.length;
    const avgSmall = smallCounts.reduce((a, b) => a + b, 0) / smallCounts.length;
    
    return {
        type: 'big_small',
        period: data.length,
        averageBig: avgBig.toFixed(1),
        averageSmall: avgSmall.toFixed(1),
        ratio: (avgBig / avgSmall).toFixed(2),
        recentTrend: bigCounts.slice(0, 10).reverse(),
        analysis: generateBigSmallAnalysis(avgBig, avgSmall)
    };
}

/**
 * 区间分布分析
 */
function analyzeZoneDistribution(data, lotteryType) {
    const config = LOTTERY_CONFIG[lotteryType];
    if (!config.frontRange) {
        return { error: '此彩种不支持区间分析' };
    }
    
    const zones = [
        { name: '一区', start: 1, end: 12, count: 0 },
        { name: '二区', start: 13, end: 24, count: 0 },
        { name: '三区', start: 25, end: 35, count: 0 }
    ];
    
    data.forEach(draw => {
        draw.numbers.front.forEach(num => {
            zones.forEach(zone => {
                if (num >= zone.start && num <= zone.end) {
                    zone.count++;
                }
            });
        });
    });
    
    return {
        type: 'zone_analysis',
        lotteryType,
        period: data.length,
        zones,
        analysis: generateZoneAnalysis(zones)
    };
}

// ========== AI 推荐算法 ==========

/**
 * AI 多算法融合推荐
 */
function generateAIRecommendation(lotteryType, algorithms = ['mlp', 'lstm'], features = []) {
    console.log(`[AI Engine] 启动推荐：${lotteryType}, 算法：${algorithms.join(', ')}`);
    
    const historicalData = HISTORICAL_DATA[lotteryType];
    const config = LOTTERY_CONFIG[lotteryType];
    
    // 1. 特征工程
    const extractedFeatures = extractFeatures(historicalData, features);
    
    // 2. 多算法预测
    const predictions = [];
    
    if (algorithms.includes('mlp')) {
        predictions.push(runMLPPrediction(historicalData, config));
    }
    
    if (algorithms.includes('lstm')) {
        predictions.push(runLSTMPrediction(historicalData, config));
    }
    
    if (algorithms.includes('rf')) {
        predictions.push(runRFPrediction(historicalData, config));
    }
    
    if (algorithms.includes('xgboost')) {
        predictions.push(runXGBoostPrediction(historicalData, config));
    }
    
    // 3. 加权融合
    const fusedResult = fusePredictions(predictions, algorithms);
    
    // 4. 生成推荐号码
    const recommendations = generateRecommendationsFromPrediction(fusedResult, config);
    
    return {
        lotteryType,
        algorithms,
        features,
        recommendations,
        confidence: calculateConfidence(predictions),
        timestamp: new Date().toISOString()
    };
}

/**
 * 特征提取
 */
function extractFeatures(data, features) {
    const extracted = {};
    
    if (features.includes('hot_cold') || features.length === 0) {
        extracted.hotCold = calculateHotColdStats(data);
    }
    
    if (features.includes('skip_value') || features.length === 0) {
        extracted.skipValue = calculateSkipStats(data);
    }
    
    if (features.includes('sum') || features.length === 0) {
        extracted.sum = calculateSumStats(data);
    }
    
    return extracted;
}

/**
 * MLP 神经网络预测（简化版）
 */
function runMLPPrediction(data, config) {
    // 模拟 MLP 神经网络的预测逻辑
    const weights = generateNeuralWeights(config);
    const inputVector = createInputVector(data.slice(0, 10));
    const output = neuralNetworkForward(inputVector, weights);
    
    return {
        algorithm: 'mlp',
        prediction: output,
        weight: AI_CONFIG.algorithmWeights.mlp
    };
}

/**
 * LSTM 时序预测（简化版）
 */
function runLSTMPrediction(data, config) {
    // 模拟 LSTM 时间序列预测
    const timeSeries = data.map(d => d.numbers);
    const lstmOutput = simulateLSTM(timeSeries, config);
    
    return {
        algorithm: 'lstm',
        prediction: lstmOutput,
        weight: AI_CONFIG.algorithmWeights.lstm
    };
}

/**
 * 随机森林预测（简化版）
 */
function runRFPrediction(data, config) {
    const predictions = [];
    for (let i = 0; i < 10; i++) {
        predictions.push(generateRandomPrediction(config));
    }
    
    return {
        algorithm: 'rf',
        prediction: aggregatePredictions(predictions),
        weight: AI_CONFIG.algorithmWeights.rf
    };
}

/**
 * XGBoost 预测（简化版）
 */
function runXGBoostPrediction(data, config) {
    const gradientBoosting = simulateXGBoost(data, config);
    
    return {
        algorithm: 'xgboost',
        prediction: gradientBoosting,
        weight: AI_CONFIG.algorithmWeights.xgboost
    };
}

/**
 * 预测结果融合
 */
function fusePredictions(predictions, activeAlgorithms) {
    const fusedScores = {};
    
    predictions.forEach(pred => {
        Object.entries(pred.prediction.scores).forEach(([number, score]) => {
            if (!fusedScores[number]) {
                fusedScores[number] = 0;
            }
            fusedScores[number] += score * pred.weight;
        });
    });
    
    return {
        scores: fusedScores,
        sorted: Object.entries(fusedScores).sort((a, b) => b[1] - a[1])
    };
}

/**
 * 从预测结果生成推荐号码
 */
function generateRecommendationsFromPrediction(prediction, config, count = 3) {
    const recommendations = [];
    
    for (let i = 0; i< count; i++) {
        let recommendation;
        
        if (config.frontRange) {
            // 大乐透类型
            const frontNumbers = selectTopNumbers(prediction.sorted, config.frontCount, config.frontRange);
            const backNumbers = selectTopNumbers(prediction.sorted, config.backCount, config.backRange, 'B');
            
            recommendation = {
                numbers: {
                    front: frontNumbers.sort((a, b) => a - b),
                    back: backNumbers.sort((a, b) => a - b)
                },
                confidence: prediction.confidence
            };
        } else {
            // 数字型彩票
            const numbers = selectTopNumbers(prediction.sorted, config.count, config.range);
            
            recommendation = {
                numbers,
                confidence: prediction.confidence
            };
        }
        
        recommendations.push(recommendation);
    }
    
    return recommendations;
}

// ========== AI 聊天机器人 ==========

const AI_CHAT_KNOWLEDGE = {
    greetings: [
        "您好！我是您的 AI 彩票助手，有什么可以帮您的吗？😊",
        "欢迎使用台州体彩 AI 智能助手！我可以帮您分析数据、推荐号码哦~",
        "您好呀！今天想看看哪个彩种的走势呢？🎯"
    ],
    
    rules: {
        dlt: "超级大乐透玩法：从 35 个前区号码中选 5 个，再从 12 个后区号码中选 2 个，组成一注 5+2 的号码。每注 2 元，追加投注 3 元。开奖时间：周一、三、六 21:25。",
        pl3: "排列三玩法：从 000-999 中选择一个三位数。直选要求号码和顺序完全一致，奖金 1040 元；组选不要求顺序，组三奖金 346 元，组六奖金 173 元。每天 21:25 开奖。",
        pl5: "排列五玩法：从 00000-99999 中选择一个五位数，号码和顺序完全一致即可中奖，奖金 10 万元。每天 21:25 开奖。",
        qxc: "七星彩玩法：前 6 位从 0-9 中选择（可重复），第 7 位从 0-14 中选择。按位置匹配，全中得一等奖，最高 500 万元。开奖时间：周二、五、日 21:25。"
    },
    
    tips: [
        "💡 温馨提示：理性购彩，量力而行哦~",
        "🍀 购彩是一种娱乐方式，保持平常心最重要！",
        "📊 历史数据仅供参考，不存在必中规律哦~",
        "⚠️ 未满 18 周岁不得购买彩票，请遵守法规~"
    ]
};

/**
 * AI 聊天回复生成
 */
function generateAIResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // 问候
    if (lowerMsg.includes('你好') || lowerMsg.includes('您好') || lowerMsg.includes('hi')) {
        return randomChoice(AI_CHAT_KNOWLEDGE.greetings);
    }
    
    // 规则查询
    if (lowerMsg.includes('大乐透') && (lowerMsg.includes('玩法') || lowerMsg.includes('规则'))) {
        return AI_CHAT_KNOWLEDGE.rules.dlt;
    }
    if (lowerMsg.includes('排列三') && (lowerMsg.includes('玩法') || lowerMsg.includes('规则'))) {
        return AI_CHAT_KNOWLEDGE.rules.pl3;
    }
    if (lowerMsg.includes('排列五') && (lowerMsg.includes('玩法') || lowerMsg.includes('规则'))) {
        return AI_CHAT_KNOWLEDGE.rules.pl5;
    }
    if (lowerMsg.includes('七星彩') && (lowerMsg.includes('玩法') || lowerMsg.includes('规则'))) {
        return AI_CHAT_KNOWLEDGE.rules.qxc;
    }
    
    // 推荐号码
    if (lowerMsg.includes('推荐') || lowerMsg.includes('选号')) {
        return "我可以帮您生成 AI 智能推荐号码！请在页面上方的\"智能推荐\"区域选择彩种和算法，然后点击\"启动 AI 推荐引擎\"按钮即可。🤖✨";
    }
    
    // 走势分析
    if (lowerMsg.includes('走势') || lowerMsg.includes('分析')) {
        return "我们提供多维度的 AI 走势分析，包括冷热号、遗漏值、和值、奇偶比、大小比等。请在\"AI 走势\"页面选择分析维度查看。📊";
    }
    
    // 温馨提示
    if (lowerMsg.includes('谢谢') || lowerMsg.includes('感谢')) {
        return "不客气！祝您好运连连！🍀 " + randomChoice(AI_CHAT_KNOWLEDGE.tips);
    }
    
    // 默认回复
    return "您好！我可以帮您：\n1️⃣ 查询玩法规则\n2️⃣ 生成 AI 推荐号码\n3️⃣ 分析走势数据\n4️⃣ 解答彩票问题\n\n请问有什么可以帮您的？😊";
}

// ========== 辅助函数 ==========

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateNeuralWeights(config) {
    // 模拟神经网络权重生成
    return { w1: Math.random(), w2: Math.random() };
}

function createInputVector(recentData) {
    // 创建输入向量
    return recentData.map(d => d.sum || 0);
}

function neuralNetworkForward(input, weights) {
    // 模拟神经网络前向传播
    return {
        scores: {},
        confidence: 0.75 + Math.random() * 0.2
    };
}

function simulateLSTM(timeSeries, config) {
    // 模拟 LSTM 预测
    return {
        scores: {},
        confidence: 0.70 + Math.random() * 0.25
    };
}

function generateRandomPrediction(config) {
    return { scores: {} };
}

function aggregatePredictions(predictions) {
    return { scores: {}, confidence: 0.65 };
}

function simulateXGBoost(data, config) {
    return { scores: {}, confidence: 0.72 };
}

function selectTopNumbers(sortedScores, count, range, prefix = '') {
    const filtered = sortedScores.filter(([num, _]) => {
        const numValue = parseInt(num.replace(prefix, ''));
        return numValue >= range[0] && numValue<= range[1];
    });
    
    return filtered.slice(0, count).map(([num, _]) => parseInt(num.replace(prefix, '')));
}

function calculateConfidence(predictions) {
    const avgConfidence = predictions.reduce((sum, p) => sum + (p.prediction.confidence || 0.7), 0) / predictions.length;
    return (avgConfidence * 100).toFixed(1);
}

// ========== 分析文案生成 ==========

function generateHotColdAnalysis(hot, cold) {
    return `根据近${hot.length}期数据分析，热号表现活跃，冷号可适当关注。建议采用\"热号为主，冷号为辅\"的策略，合理搭配选号。`;
}

function generateSkipValueAnalysis(maxSkip) {
    return `当前遗漏值最高的号码为${maxSkip[0]?.number}，已遗漏${maxSkip[0]?.skipValue}期。遗漏值过大的号码可适当关注，但需注意风险。`;
}

function generateSumTrendAnalysis(avg, distribution) {
    return `平均和值为${avg}，近期和值主要分布在${distribution.medium > distribution.low ? '中值区域' : '两端区域'}。建议关注和值在${(avg * 0.9).toFixed(0)}-${(avg * 1.1).toFixed(0)}区间。`;
}

function generateOddEvenAnalysis(odd, even) {
    const ratio = (odd / even).toFixed(2);
    return `奇偶比为${ratio}，${ratio > 1 ? '奇号略占优势' : '偶号略占优势'}。建议保持奇偶均衡搭配，比例可参考${Math.round(odd)}:${Math.round(even)}。`;
}

function generateBigSmallAnalysis(big, small) {
    const ratio = (big / small).toFixed(2);
    return `大小比为${ratio}，${ratio > 1 ? '大号较热' : '小号较热'}。选号时可适当${ratio > 1 ? '关注小号回补' : '关注大号延续'}。`;
}

function generateZoneAnalysis(zones) {
    const maxZone = zones.reduce((max, z) => z.count > max.count ? z : max);
    return `${maxZone.name}出号最为活跃，共出现${maxZone.count}次。建议关注各区间均衡分布，避免过度集中。`;
}

// ========== 导出全局函数 ==========

window.AIEngine = {
    analyzeTrends: analyzeTrendsAI,
    generateRecommendation: generateAIRecommendation,
    chatResponse: generateAIResponse,
    historicalData: HISTORICAL_DATA
};

console.log('[AI Engine] 初始化完成 - 台州体彩 AI 智能助手 v2.0');
