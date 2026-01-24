/*
* 修复 91短视频 - 终极修复版
* 策略：只注入 CSS 隐藏广告，严禁删除任何 HTML 标签
* 解决：因删除标签导致的 Vue 崩溃、无法下滑、封面不显示问题
*/

let body = $response.body;

if (body) {
    // 定义 CSS 样式
    // display: none !important; 强制隐藏
    // height: 0 !important; 强制高度为 0，防止占位
    const css = `
    <style>
        /* 1. 隐藏顶部和列表中的横幅广告容器 */
        .mda {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 2. 隐藏导航栏中的 "领彩金" (通过链接特征匹配) */
        a[title="领彩金"],
        a[href*="jbsdvcs2sd1c3x1.cc"] {
            display: none !important;
        }

        /* 3. 隐藏分类 Tab 中的黄赌毒文字广告 (同城约炮、春药、脱衣等) */
        /* 通过域名关键词匹配，比匹配中文更稳定且安全 */
        
        /* 匹配 xbbbbing.com (同城约炮、催情春药) */
        a[href*="xbbbbing.com"],
        /* 匹配 vlrubju.com (一键脱衣) */
        a[href*="vlrubju.com"],
        /* 匹配 erha... (顶部横幅链接) */
        a[href*="erhage8hawefc"],
        /* 匹配 wordsj.com (顶部横幅链接) */
        a[href*="wordsj.com"],
        /* 匹配 dfsdb... (顶部横幅链接) */
        a[href*="dfsdb4sdf8vbfd1vv"] {
            display: none !important;
            width: 0 !important;
        }

        /* 4. 针对 Tab 栏的特殊处理：隐藏相关 Tab 的父级容器（如果支持 :has 语法）*/
        /* 防止留下空白间隙 */
        .van-tab:has(span:contains("同城约炮")),
        .van-tab:has(span:contains("催情春药")),
        .van-tab:has(span:contains("一键脱衣")) {
            display: none !important;
        }
    </style>
    `;

    // 将 CSS 样式插入到 </body> 标签之前，确保样式生效且不破坏头部结构
    // 这样做能够保证网页的主体 HTML 结构完整，JavaScript 能够正常找到 "More" 按钮
    body = body.replace("</body>", css + "</body>");

    $done({ body });
} else {
    $done({});
}