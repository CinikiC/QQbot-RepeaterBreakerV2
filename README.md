# QQbot-RepeaterBreakerV2
~~为庆祝复读机发明 28 周年发布的全新版本~~

使用由 [Newbe36524](https://www.newbe.pro/) 开发的全新 [Newbe.Mahua.Framework v2](https://github.com/newbe36524/Newbe.Mahua.Framework) 以及 [node.js express](https://expressjs.com) 进行重写的防复读机器人。

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

可以和机器人加好友私聊修改各种参数：

1. 输入 “运行状态” 可以查看机器人当前的工作模式（mode = 1/2/3 分别对应普通/轮盘赌/强力模式）、复读检测次数和禁言时长设置；
2. 输入 “普通模式”/“轮盘赌模式”/“强力模式” 可以切换工作模式；
3. 输入大于 60 的任意整数可以调整禁言时长，单位为秒；
4. 输入 10 以内的任意整数可以调整复读检测次数；
5. 输入其他内容会返回可用的指令列表。

## TODO
1. ~~和机器人聊天修改相关参数；~~
2. 同时对多个群进行监控，实现每个群独立的复读检测和禁言功能。
