# DeepSeek 自动重试 & 点击次数上限

**简介**

此油猴脚本用于在 DeepSeek 页面中，当出现“服务器繁忙，请稍后再试”的提示时，自动点击 id 为“重新生成”的元素进行重试。页面右下角显示一个大盒子，包含自动重试开关、点击次数上限设置和倒计时显示。点击次数达到上限时自动关闭重试功能。
> 建议不要连续一直重新生成，我第一次没有加次数限制，35次左右，就被封ip了好像（一天）。不论我重新对话，还是历史对话，在浏览器中间顶部弹一个提示（繁忙还是什么忘了）。

**功能**

- 自动重试：当检测到“服务器繁忙，请稍后再试”提示时，自动点击“重新生成”按钮。
- 点击次数上限：用户可以设置最大点击次数，达到上限后自动重试功能关闭。
- 倒计时显示：显示下一次重试的倒计时，用户可以调整间隔时间。
