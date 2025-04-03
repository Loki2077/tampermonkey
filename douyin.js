// ==UserScript==
// @name         抖音网页版深度清屏、动态清晰度、全屏与跳过直播
// @namespace    https://douyin.com/
// @version      1.3
// @description  监测清屏按钮状态，激活清屏时隐藏多余UI、调整视频布局、自动选择最高清晰度、自动进入网页全屏，并跳过直播视频；取消清屏时恢复原状
// @author       Loki2077
// @match        *://www.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/抖音网页版深度清屏.user.js
// @updateURL    https://update.greasyfork.org/scripts/抖音网页版深度清屏.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clearModeActive = false;
    // 用于记录被隐藏元素及视频容器原始样式
    const hiddenElements = new Map();

    // 需要隐藏的选择器列表（根据需要调整）
    const selectors = [
        "header",              // 顶部导航栏
        ".pc-footer",          // 底部信息栏
        ".layoutHeader",       // 可能的顶部栏
        ".layoutSide",         // 右侧推荐栏
        ".layoutSearch",       // 搜索框
        ".menu-container",     // 侧边菜单
        ".layoutAside",        // 右侧消息栏
        "div[data-e2e='live-ad']", // 可能的广告
        ".comment-container",  // 评论区
        ".douyin-share",       // 分享按钮
        ".user-card",          // 用户信息
        "div[data-e2e='hot-list']", // 可能的热榜
        ".feedback-button",    // 反馈按钮
        ".recommend-list",     // 推荐列表
    ];

    // 观察清屏按钮状态变化
    function observeClearScreenButton() {
        const clearBtn = document.querySelector('.xg-switch');
        if (!clearBtn) {
            console.log("未找到清屏按钮");
            return;
        }
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === "aria-checked") {
                    const checked = clearBtn.getAttribute("aria-checked");
                    if (checked === "true" && !clearModeActive) {
                        activateClearScreen();
                        clearModeActive = true;
                    } else if (checked === "false" && clearModeActive) {
                        restoreScreen();
                        clearModeActive = false;
                    }
                }
            });
        });
        observer.observe(clearBtn, { attributes: true });
    }

    // 激活清屏模式：隐藏不必要的UI，调整视频样式，自动全屏、选择最高清晰度，并尝试跳过直播
    function activateClearScreen() {
        // 隐藏指定的UI元素
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!hiddenElements.has(el)) {
                    hiddenElements.set(el, el.style.display);
                    el.style.display = "none";
                }
            });
        });

        // 调整视频容器样式（假设视频容器 class 为 .video-player）
        const videoContainer = document.querySelector('.video-player');
        if (videoContainer) {
            if (!hiddenElements.has(videoContainer)) {
                hiddenElements.set(videoContainer, {
                    position: videoContainer.style.position,
                    top: videoContainer.style.top,
                    left: videoContainer.style.left,
                    width: videoContainer.style.width,
                    height: videoContainer.style.height,
                    zIndex: videoContainer.style.zIndex
                });
            }
            videoContainer.style.position = "fixed";
            videoContainer.style.top = "0";
            videoContainer.style.left = "0";
            videoContainer.style.width = "100vw";
            videoContainer.style.height = "100vh";
            videoContainer.style.zIndex = "9999";
            document.body.style.overflow = "hidden";
        }

        // 自动进入网页全屏（非F11）
        autoFullScreen();

        // 自动选择最高清晰度
        autoSelectHighestClarity();

        // 自动跳过直播视频
        autoSkipLive();
    }

    // 恢复页面原始状态
    function restoreScreen() {
        hiddenElements.forEach((value, el) => {
            if (typeof value === "string") {
                el.style.display = value;
            } else if (typeof value === "object") {
                el.style.position = value.position;
                el.style.top = value.top;
                el.style.left = value.left;
                el.style.width = value.width;
                el.style.height = value.height;
                el.style.zIndex = value.zIndex;
            }
        });
        hiddenElements.clear();
        document.body.style.overflow = "";
    }

    // 自动选择最高清晰度（遍历所有选项，选择解析出的分辨率最大的一项）
    function autoSelectHighestClarity() {
        const clarityGear = document.querySelector('.gear.isSmoothSwitchClarityLogin');
        if (clarityGear) {
            const items = clarityGear.querySelectorAll('.item');
            let maxRes = -1;
            let targetItem = null;
            items.forEach(item => {
                const text = item.textContent;
                // 提取分辨率，如 "1080P", "720P" 等
                const match = text.match(/(\d+)\s*[pP]/);
                if (match) {
                    const res = parseInt(match[1]);
                    if (res > maxRes) {
                        maxRes = res;
                        targetItem = item;
                    }
                }
            });
            if (targetItem && !targetItem.classList.contains("selected")) {
                targetItem.click();
                console.log("已切换到最高清晰度: " + maxRes + "P");
            } else {
                console.log("最高清晰度已是当前状态或未找到有效选项");
            }
        } else {
            console.log("未找到清晰度选择区域");
        }
    }

    // 自动进入网页全屏（模拟点击页面全屏按钮）
    function autoFullScreen() {
        const fullScreenBtn = document.querySelector('.xgplayer-page-full-screen');
        if (fullScreenBtn) {
            if (fullScreenBtn.getAttribute("data-state") === "normal") {
                fullScreenBtn.click();
                console.log("已切换到网页全屏模式");
            }
        } else {
            console.log("未找到网页全屏按钮");
        }
    }

    // 自动跳过直播视频（此处仅为示例，需根据实际页面 DOM 调整选择器）
    function autoSkipLive() {
        // 延时等待视频状态加载
        setTimeout(() => {
            // 假设直播视频页面存在直播标识（例如 .live-indicator 或 .live-tag）
            const liveIndicator = document.querySelector('.live-indicator, .live-tag');
            if (liveIndicator) {
                // 如果是直播，尝试点击下一个视频按钮（假设选择器为 .next-video-button）
                const nextBtn = document.querySelector('.next-video-button');
                if (nextBtn) {
                    nextBtn.click();
                    console.log("直播视频，已自动跳过");
                } else {
                    console.log("直播视频，但未找到跳过按钮");
                }
            } else {
                console.log("当前视频非直播");
            }
        }, 1000);
    }

    // 辅助：通过键盘 J 键触发（模拟点击清屏按钮）
    document.addEventListener('keydown', function(event) {
        if (event.key === 'j' || event.key === 'J') {
            const clearBtn = document.querySelector('.xg-switch');
            if (clearBtn) {
                clearBtn.click();
            }
        }
    });

    // 初始化：开始监听清屏按钮状态变化
    observeClearScreenButton();

})();
