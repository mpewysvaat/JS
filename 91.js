/*
 * 91短视频净化 - 2026 安全修正版 (Lite)
 * 修复：解决上一版导致的"搜索页无法下滑"、"无法加载更多"问题
 * 策略：只用 CSS 隐藏广告 + 去除 18岁弹窗 (不触碰任何滚动逻辑)
 */

let body = $response.body;

if (body) {
    // 1. CSS 强力隐藏广告
    // 使用 CSS 将广告区域的高度设为 0，视觉上消失，但 DOM 结构保留
    // 这样 Vue 渲染引擎不会报错，滚动加载也能正常触发
    const safeCss = `
    <style type="text/css">
        /* 顶部横幅容器 */
        .mda {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        /* 隐藏具体的广告图片(根据源码类名) */
        .imgad31, .imgad32, .imgad33, .imgad35,
        div[class*="imgad"] {
            display: none !important;
            width: 0 !important;
        }

        /* 隐藏 Tab 栏里的垃圾分类 */
        /* 使用 href 匹配，精准且不误伤正常分类 */
        .van-tab a[href*="xbbbbing.com"],
        .van-tab a[href*="vlrubju.com"],
        .van-tab a[href*="formatj.com"],
        .van-tab a[href*="vrd2sdggs1swesh3sghs1dg"],
        .van-tab a[href*="fdep4jiowe8sdfew1wry"] {
            display: none !important;
            pointer-events: none !important;
        }

        /* 隐藏包含垃圾链接的 Tab 父容器 (防止留白) */
        .van-tab:has(a[href*="xbbbbing.com"]),
        .van-tab:has(a[href*="vlrubju.com"]) {
            display: none !important;
        }
        
        /* 隐藏播放页底部可能出现的浮动广告 */
        .ad-float, .ad-banner {
            display: none !important;
        }
    </style>
    `;

    // 2. 注入 CSS 到 <head> 区域
    // 放在 head 里最安全，不会打断 body 内的数据加载
    if (body.indexOf('</head>') !== -1) {
        body = body.replace('</head>', safeCss + '</head>');
    } else {
        body = body.replace('</body>', safeCss + '</body>');
    }

    // 3. 移除 "确认已满18岁" 弹窗
    // 替换掉 vant.showDialog 函数调用
    body = body.replace(/vant\.showDialog\(\{[\s\S]*?\}\);/g, '');

    $done({ body });
} else {
    $done({});
}
