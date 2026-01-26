/*
直接替换 API 返回 JSON 中的水印标识和 URL 参数
*/
let body = $response.body;

if (body) {
    // 1. 强制将所有水印标记改为 0
    body = body.replace(/"watermark":1/g, '"watermark":0');
    // 2. 针对 URL 中的 wm 字符进行替换（owm 为无水印标识）
    body = body.replace(/ratio=\d+/g, "ratio=1080p"); // 顺便强制请求最高画质
    body = body.replace(/watermark=\d/g, "watermark=0");
    
    $done({ body });
} else {
    $done({});
}
