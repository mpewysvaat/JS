/*
* 修复 91短视频 去广告导致的下滑和图片加载失败问题
* 采用 CSS 隐藏 + 安全移除策略
*/

let body = $response.body;

// 1. 注入 CSS 样式来隐藏广告块 (.mda) 和 也就是顶部的大横幅
// 这样做绝对安全，不会破坏 DOM 结构，修复 JS 崩溃问题
const hiddenStyle = `
<style>
    /* 隐藏顶部横幅广告容器 */
    .mda { display: none !important; height: 0 !important; overflow: hidden; }
    /* 隐藏特定的广告链接 (根据 href 特征) */
    a[href*="xbbbbing.com"],
    a[href*="jbsdvcs2sd1c3x1.cc"],
    a[href*="erhage8hawefc"],
    a[href*="wordsj.com"] { display: none !important; }
</style>
`;

// 将样式插入到 </head> 之前
body = body.replace("</head>", hiddenStyle + "</head>");

// 2. 精准移除导航栏中的文字广告 (例如 "领彩金")
// 因为 <li> 标签结构简单，正则误伤概率低
body = body.replace(/<li class="nav-menu-item"><a[^>]*>.*?领彩金.*?<\/a><\/li>/g, "");

// 3. 精准移除分类 Tab 中的广告 (例如 "同城约炮", "一键脱衣")
// 这些是 <a> 标签，不含嵌套，移除是安全的
// 建立关键词列表
const adKeywords = ["同城约炮", "催情春药", "一键脱衣", "美女正妹", "91大神"];

adKeywords.forEach(keyword => {
    // 匹配包含特定关键词的 <a> 标签整体
    const reg = new RegExp(`<a[^>]*href="[^"]*"[^>]*>[\\s\\S]*?<span[^>]*>${keyword}<\\/span>[\\s\\S]*?<\\/a>`, 'g');
    body = body.replace(reg, "");
});

$done({ body });