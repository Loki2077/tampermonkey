# 油猴脚本集合

这个仓库包含了一系列用于增强网页体验的油猴脚本（Tampermonkey Scripts）。每个脚本都有特定的功能，可以根据需要单独安装使用。

## 脚本列表

### 1. 抖音网页版深度清屏

**功能概述**

此脚本为抖音网页版提供了深度清屏功能，激活清屏时会：
- 隐藏多余UI元素，提供沉浸式观看体验
- 自动调整视频布局至全屏
- 自动选择最高清晰度
- 自动进入网页全屏模式
- 自动跳过直播视频
- 支持键盘快捷键(J)切换清屏模式

**使用方法**

1. 在抖音网页版视频播放页面，点击清屏按钮激活深度清屏模式
2. 也可以按键盘上的J键快速切换清屏状态
3. 再次点击清屏按钮或按J键可恢复正常显示

### 2. DeepSeek 自动重试

**功能概述**

此脚本用于在 DeepSeek 页面中，当出现"服务器繁忙，请稍后再试"的提示时，自动点击"重新生成"按钮进行重试。页面右下角显示一个控制面板，包含：
- 自动重试开关
- 点击次数上限设置
- 当前点击次数显示
- 间隔时间设置和倒计时显示

**使用提示**

> 建议不要连续一直重新生成，可能会导致临时IP限制。默认设置了点击次数上限，达到上限后自动关闭重试功能。

**自定义错误词**

脚本支持自定义错误提示关键词，可以在源码中修改：

```js
// 定义多个错误提示关键词
const errorPhrases = [
    "服务器繁忙，请稍后再试",
    "The server is busy. Please try again later.",
];
```

## 安装方法

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击对应脚本的安装链接，或手动将脚本代码复制到Tampermonkey中创建新脚本
3. 刷新目标网站页面即可使用

## 未来计划

计划添加更多实用的油猴脚本，如有建议或问题请提交issue。
