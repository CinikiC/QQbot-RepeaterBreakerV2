# QQbot-RepeaterBreakerV2
~~为庆祝复读机发明 28 周年发布的全新版本~~

使用由 Newbe36524 开发的全新 Newbe.Mahua.Framework v2 以及 node.js experss 进行重写的防复读机器人。

原有机器人的功能正在逐步测试中，请等待后续更新！

## 如何使用
1. 安装 [酷 Q 机器人](https://cqp.cc/)；
2. 安装 [Newbe.Mahua.Framework](https://www.newbe.pro/Newbe.Mahua/Start-With-Mahua-In-V2.0/) 并在酷 Q 机器人中启用；
3. 安装 [node.js](https://nodejs.org) 环境；
4. 克隆本仓库至任意目录，在仓库目录下启动终端，输入 `npm install`；
5. 输入 `npm run server`。

## 使用说明
机器人提供三种处理复读机的工作模式：

1. 普通模式：达到规定次数后禁言最后一个复读机；
2. 轮盘赌模式：达到规定次数后随机禁言一个复读机；
3. 强力模式：达到规定次数后禁言全部复读机。

工作模式、检测复读次数以及禁言时间可以在 app.js 中修改相关变量调整。

## TODO
1. 和机器人聊天修改相关参数；
2. 同时对多个群进行监控，实现每个群独立的复读检测和禁言功能。
