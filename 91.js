/*
 * 91短视频净化脚本 - 2026终极版
 * 功能：
 * 1. CSS 隐藏广告（不破坏 Vue 结构，防止白屏）
 * 2. 移除 "确认满18岁" 弹窗
 * 3. 注入 JS 钩子拦截搜索页的恶意跳转 (.icu / .xyz)
 */

let body = $response.body;

if (body) {
    // --- 模块 1: CSS 样式注入 (视觉隐藏) ---
    const cssStyle = `
    <style type="text/css">
        /* 隐藏顶部横幅容器 (.mda) 及具体广告图 */
        .mda, 
        .imgad31, .imgad32, .imgad33, .imgad35,
        div[class*="imgad"] {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        /* 隐藏导航栏(Tab)中的垃圾链接 */
        /* 使用 href 特征匹配，精准且不会误伤 */
        a[href*="xbbbbing.com"],
        a[href*="vlrubju.com"],
        a[href*="formatj.com"],
        a[href*="vrd2sdggs1swesh3sghs1dg"],
        a[href*="fdep4jiowe8sdfew1wry"],
        a[href*="wordsj.com"],
        a[href*="dfsdb4sdf8vbfd1vv"] {
            display: none !important;
            width: 0 !important;
            flex-basis: 0 !important;
            min-width: 0 !important;
            pointer-events: none !important;
        }

        /* 尝试隐藏包含垃圾链接的 Tab 父容器，防止留白 */
        .van-tab:has(a[href*="xbbbbing.com"]),
        .van-tab:has(a[href*="vlrubju.com"]) {
            display: none !important;
        }
    </style>
    `;

    // --- 模块 2: JS 钩子注入 (行为拦截) ---
    // 针对搜索页下滑后触发的随机域名跳转
    const antiRedirectScript = `
    <script>
    (function() {
        console.log("91净化脚本已加载 - 防跳转模式");
        
        // 劫持 window.open，拦截恶意域名
        const originalOpen = window.open;
        const junkSuffixes = ['.icu', '.xyz', '.top', '.fun', '739765'];
        
        window.open = function(url, target, features) {
            if (url && typeof url === 'string') {
                // 如果 URL 包含垃圾后缀，直接拦截
                if (junkSuffixes.some(s => url.includes(s))) {
                    console.log('拦截恶意跳转:', url);
                    return null;
                }
            }
            return originalOpen.apply(this, arguments);
        };

        // 劫持 window.location.href (部分跳转使用此方式)
        // 注意：这种劫持比较激进，仅针对特定垃圾后缀
        let oldHref = window.location.href;
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            get: function() { return window.document.location; },
            set: function(val) {
                if (val && typeof val === 'string' && junkSuffixes.some(s => val.includes(s))) {
                    console.log('拦截恶意重定向:', val);
                    return;
                }
                window.document.location = val;
            }
        });
    })();
    </script>
    `;

    // 1. 注入 CSS 和 JS 钩子到 <head> 中
    // 放在 head 里能确保在页面加载初期就生效
    if (body.indexOf('</head>') !== -1) {
        body = body.replace('</head>', cssStyle + antiRedirectScript + '</head>');
    } else {
        body = body.replace('</body>', cssStyle + antiRedirectScript + '</body>');
    }

    // 2. 移除 "18岁确认" 弹窗代码
    // 替换掉 vant.showDialog 调用
    body = body.replace(/vant\.showDialog\(\{[\s\S]*?\}\);/g, 'console.log("弹窗已屏蔽");');

    $done({ body });
} else {
    $done({});
}
