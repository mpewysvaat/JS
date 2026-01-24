// 91_clean.js
// 针对 91short 的去广告和防跳转脚本

let body = $response.body;

if (body) {
    // 1. 移除顶部的 GIF 广告横幅容器 (<div class="mda">...</div>)
    body = body.replace(/<div class="mda">[\s\S]*?<\/div>/g, "");

    // 2. 移除导航栏和 Tab 栏中的诱导按钮 (根据关键词：约炮、彩金、脱衣、春药等)
    // 匹配 <a ...><span>关键词</span></a> 这种结构
    const keywords = "领彩金|同城约炮|催情春药|一键脱衣|美女正妹|91大神";
    const regexNav = new RegExp(`<a href="[^"]*"[^>]*>[\\s\\S]*?(${keywords})[\\s\\S]*?<\\/a>`, "g");
    body = body.replace(regexNav, "");

    // 3. 【关键】移除指向恶意域名的跳转链接
    // 源码中这些域名出现在 <a href="..."> 中
    const badDomains = "jyrdgdf2fb1bfv31dvd|vlrubju|wordsj";
    const regexJump = new RegExp(`<a href="[^"]*(${badDomains})[^"]*"[\\s\\S]*?<\\/a>`, "g");
    body = body.replace(regexJump, "");
    
    // 4. 移除底部的文字广告链接 (如 erha...)
    body = body.replace(/<a href="[^"]*erhage8hawefc[^"]*"[\s\S]*?<\/a>/g, "");
}

$done({ body });
