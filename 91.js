/*
 * 91短视频 - 2026 终极稳定版
 * 策略：CSS 隐式注入 + 域名特征匹配
 * 解决：Vue 崩溃白屏、iOS 自动下载弹窗、Tab 栏空白间隙
 */

let body = $response.body;

if (body) {
    // 1. 定义 CSS 样式
    // 针对 Flex 布局的 Vue 组件，仅使用 display: none 可能会导致计算错误
    // 因此增加 width: 0 和 flex-basis: 0 以确保布局收缩
    const css = `
    <style type="text/css">
        /* --- 通用广告容器隐藏 --- */
        /* .mda 是顶部横幅的容器 */
        .mda,
        /* 源码中发现的具体广告图片类名 */
        .imgad31, .imgad32, .imgad33, .imgad35 {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        /* --- 导航栏与 Tab 栏广告隐藏 --- */
        /* 使用属性选择器匹配 href 中的恶意域名关键字 */
        /* 这种方式比匹配文字更安全，不会误伤正常内容 */
        
        /* 匹配: xbbbbing.com (同城约炮/催情春药) */
        a[href*="xbbbbing.com"],
        /* 匹配: vrd2sdggs... (领彩金 - 顶部导航) */
        a[href*="vrd2sdggs1swesh3sghs1dg"],
        /* 匹配: vlrubju.com (一键脱衣) */
        a[href*="vlrubju.com"],
        /* 匹配: formatj.com (顶部横幅跳转) */
        a[href*="formatj.com"],
        /* 匹配: fdep4jiowe... (其他广告) */
        a[href*="fdep4jiowe8sdfew1wry"],
        /* 匹配旧版残留域名 (保留以防回滚) */
        a[href*="wordsj.com"],
        a[href*="dfsdb4sdf8vbfd1vv"] {
            display: none !important;
            width: 0 !important;
            flex-basis: 0 !important; /* 强制 Flex 元素宽度为 0 */
            min-width: 0 !important;
            pointer-events: none !important;
        }

        /* --- 针对 van-tab 组件的特殊补丁 --- */
        /* 确保隐藏后的 tab 不会占据水平滚动条的宽度 */
        .van-tab[href*="xbbbbing.com"],
        .van-tab[href*="vlrubju.com"],
        .van-tab[href*="vrd2sdggs"] {
            display: none !important;
        }
    </style>
    `;

    // 2. 注入 CSS 到 </head> 之前
    // 这样做可以在页面渲染前就生效，避免广告闪一下再消失
    if (body.indexOf('</head>') !== -1) {
        body = body.replace('</head>', css + '</head>');
    } else {
        // 如果找不到 head，才回退到 body
        body = body.replace('</body>', css + '</body>');
    }

    // 3. 移除 "确认已满18岁" 弹窗 (JS 替换)
    // 源码 Line 881: vant.showDialog({...})
    // 替换为空操作，防止阻断交互，且不会破坏 HTML 结构
    body = body.replace(/vant\.showDialog\(\{[\s\S]*?\}\);/g, '');

    $done({ body });
} else {
    $done({});
}
