// 引入 ws
import ws from 'ws';

const state = {
  HEART: 0,
  MEAASGE: 1
}

// 创建 WebSocket 服务端 监听 8080 端口
const wss = new ws.Server({
  port: 8080
}, () => {
  console.log('websocket server listen 8080');
});
// 监听客户端连接
wss.on('connection', (scoket) => {
  console.log('client connected');
  // 监听客户端消息
  scoket.on('message', (msg) => {
    console.log(`接收到客户端的消息： ${msg.toString()}`);
    // 广播消息，将消息发送给所有连接的客户端
    wss.clients.forEach((client) => {
      // 判断是否为当前 scoket 客户端
      if (client.readyState === ws.OPEN) {
        // 向客户端发送消息
        client.send(JSON.stringify({
          state: state.MEAASGE,
          message: msg.toString()
        }));
      }
    })
    // scoket.send(`server send ${msg}`);
  })
  // scoket 长时间不使用、网络波动、弱网模式等，可能会导致 scoket 断开连接
  // 定时发送心跳检测，如果连接状态为 OPEN 则发送心跳检测，否则清除定时器
  let heartBeatTimer: any = null;
  // 心跳检测
  const heartBeat = () => {
    // 如果连接状态为 OPEN 则发送心跳检测
    if (scoket.readyState === ws.OPEN) {
      scoket.send(JSON.stringify({ state: state.HEART, message: 'heart beat' }));
    } else {
      // 否则清除定时器
      clearInterval(heartBeatTimer);
    }
  }
  // 定时发送心跳检测
  heartBeatTimer = setInterval(heartBeat, 3000);
});

