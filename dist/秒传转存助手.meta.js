// ==UserScript==
// @name           百度网盘秒传转存助手 支持PC及移动端 永久无广告绿色版
// @version        3.1.3
// @author         tousakasp
// @description    百度网盘秒传链接转存及生成 永久无广告绿色版 支持移动端界面 -- 再次感谢初代大佬伟大贡献
// @homepage       https://github.com/tousakasp/rapid-upload-userscript-rinsp
// @match          *://pan.baidu.com/disk/home*
// @match          *://pan.baidu.com/disk/main*
// @match          *://pan.baidu.com/disk/synchronization*
// @match          *://pan.baidu.com/s/*
// @match          *://yun.baidu.com/disk/home*
// @match          *://yun.baidu.com/disk/main*
// @match          *://yun.baidu.com/disk/synchronization*
// @match          *://yun.baidu.com/s/*
// @match          *://wangpan.baidu.com/disk/home*
// @match          *://wangpan.baidu.com/disk/main*
// @match          *://wangpan.baidu.com/disk/synchronization*
// @match          *://wangpan.baidu.com/s/*
// @match          *://pan.baidu.com/wap/home*
// @license        GPLv3
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABBUlEQVR4AZTTJRBUURTH4TtDwXuPdPrgbhHXiksf3CPucRNScHd3d3d3uO9bKeu7b79+fun8Q17CNHyMMUqaiPE4fEyYVjjGNKnNwQ4lpgV8lManEfwfosLHEGPU1N3ZnAv4qlT+NiQ56uPWSjKBrztUSnIaB66sY1vgxgxoMXB5NbsCB9rxcB5fN2M5/16nCFxeS6YTezpzsB1Pu/C2O7/78/99eYBYHXh+gqdHObGIK4GHgevjVIt1AgAnhvE4cGe8euoHbizgYuD2RGgx8O0RpwIPRmsmJDGqcrANd3pLo/qVr03hUlcpfSwf0/vD3JwkPdPK5/zhkOz+/f1FIDv/RcnOAEjywH/DhgADAAAAAElFTkSuQmCC
// @namespace      com.github.tousakasp
// @homepageURL    https://github.com/tousakasp/rapid-upload-userscript-rinsp
// @description:en input bdlink to get files or get bdlink for Baidu™ WebDisk.
// @compatible     firefox Violentmonkey
// @compatible     firefox Tampermonkey
// @compatible     chrome Violentmonkey
// @compatible     chrome Tampermonkey
// @compatible     edge Violentmonkey
// @compatible     edge Tampermonkey
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          unsafeWindow
// @run-at         document-body
// @connect        baidu.com
// @connect        baidupcs.com
// @connect        cdn.jsdelivr.net
// @connect        *
// @downloadURL    https://raw.githubusercontent.com/tousakasp/rapid-upload-userscript-rinsp/raw/main/dist/%E7%A7%92%E4%BC%A0%E8%BF%9E%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL      https://cdn.jsdelivr.net/gh/tousakasp/rapid-upload-userscript-rinsp@main/dist/%E7%A7%92%E4%BC%A0%E8%BF%9E%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @require        https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require        https://unpkg.com/js-base64@3.7.5/base64.js
// @require        https://unpkg.com/sweetalert2@11.4.8/dist/sweetalert2.min.js
// @require        https://unpkg.com/spark-md5@3.0.2/spark-md5.min.js
// ==/UserScript==
