/*
抖音去水印逻辑：将 play_addr 中的地址替换为无水印地址
*/
let body = $response.body;
if (body) {
    // 替换视频播放地址中的 watermark 为无水印标识
    body = body.replace(/"watermark":1/g, '"watermark":0');
    // 关键点：将 play_addr 替换为无水印的 download_addr 或修改 URL 参数
    body = body.replace(/wm/g, "owm"); 
    $done({ body });
} else {
    $done({});
}
