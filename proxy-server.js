const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');

// 配置上游 SOCKS5 代理
const UPSTREAM_PROXY = 'socks5://127.0.0.1:23164';
const LOCAL_PORT = 8080;

console.log(`🔧 代理转发服务器启动中...`);
console.log(`📡 本地端口: ${LOCAL_PORT}`);
console.log(`🌐 上游代理: ${UPSTREAM_PROXY}\n`);

// 创建代理 agent
const agent = new SocksProxyAgent(UPSTREAM_PROXY);

// 创建本地代理服务器
const server = http.createServer((clientReq, clientRes) => {
    const options = {
        hostname: clientReq.headers.host,
        port: 443,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers,
        agent: agent
    };

    console.log(`${clientReq.method} ${clientReq.url}`);

    // 转发请求
    const proxyReq = http.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes);
    });

    proxyReq.on('error', (err) => {
        console.error(`❌ 代理错误: ${err.message}`);
        clientRes.writeHead(502);
        clientRes.end('Bad Gateway');
    });

    clientReq.pipe(proxyReq);
});

server.listen(LOCAL_PORT, () => {
    console.log(`✅ 代理服务器运行在 http://127.0.0.1:${LOCAL_PORT}\n`);
    console.log(`请在 .env 中设置: PROXY_URL=http://127.0.0.1:${LOCAL_PORT}\n`);
});

server.on('error', (err) => {
    console.error(`❌ 服务器错误: ${err.message}`);
    process.exit(1);
});
