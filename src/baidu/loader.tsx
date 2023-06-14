/*
 * @Author: mengzonefire
 * @Date: 2022-10-20 10:36:43
 * @LastEditTime: 2023-04-05 07:30:42
 * @LastEditors: mengzonefire
 * @Description: 主函数入口
 */

import {
  locUrl,
  baiduNewPage,
  baiduSyncPage,
  baiduSharePage,
  baiduMobilePage,
  updateInfoVer,
  TAG,
  version,
} from "@/common/const";
import { parseQueryLink } from "@/common/duParser";
import installNew from "./newPage/loader";
import installLegacy from "./legacyPage/loader";
import { swalInstance } from "./common/const";
import installSync from "./syncPage/loader";
import installShare from "./sharePage/loader";
import installMobile from "./mobilePage/loader";
import installMobileShare from "./mobileSharePage/loader";
import { isMobileVer } from "../common/utils";

export function loaderBaidu(): void {
  let load = () => {
    if (locUrl.includes(baiduNewPage)) {
      installNew();
    } else if (locUrl.includes(baiduSharePage)) {
      if (isMobileVer()) {
        installMobileShare();
      } else {
        installShare();
      }
    } else if (locUrl.includes(baiduSyncPage)) {
      installSync();
    } else if (isMobileVer() && locUrl.includes(baiduMobilePage)) {
      installMobile();
    } else {
      installLegacy();
    }

    // 进入页面后的弹窗任务
    let bdlink = parseQueryLink(locUrl); // 解析url中的秒传链接
    if (bdlink) {
      // 解析到秒传链接, 弹出转存窗口
      swalInstance.inputView(bdlink);
    } else if (!GM_getValue(`${updateInfoVer}_no_first`))
      // 检查是否首次运行, 若是则弹出更新信息窗口
      swalInstance.updateInfo(() => {
        GM_setValue(`${updateInfoVer}_no_first`, true);
      });

    // 预先绑定好按钮事件
    $(document).on("click", "#copy_fail_list", (btn) => {
      let listText = "";
      for (let item of swalInstance.parseResult.failList)
        listText += item.path + "\n";
      GM_setClipboard(listText);
      btn.target.innerText = "复制成功";
    }); // 失败文件列表复制
    $(document).on("click", "#copy_success_list", (btn) => {
      let listText = "";
      for (let item of swalInstance.parseResult.successList)
        listText += item.path + "\n";
      GM_setClipboard(listText);
      btn.target.innerText = "复制成功";
    }); // 成功文件列表复制
    $(document).on("click", "#copy_fail_branch_list", (btn) => {
      let ele = $(btn.target);
      GM_setClipboard(
        ele
          .parents("details.mzf_details_branch")
          .next()[0]
          .innerText.replace(/\n\n/g, "\n")
      );
      btn.target.innerText = "复制成功";
    }); // 失败文件分支列表复制

    try {
      // 添加油猴插件菜单按钮
      GM_registerMenuCommand("🕮 版本信息", () => {
        swalInstance.updateInfo(() => {});
      });
      GM_registerMenuCommand("⚙ 工具设置", () => {
        swalInstance.settingView();
      });
      GM_registerMenuCommand("⚡生成秒传(输入文件路径)", () => {
        swalInstance.genView();
      });
    } catch (_) {
      console.info(
        "%s version: %s 插件菜单添加失败, 使用的插件不支持GM_registerMenuCommand",
        TAG,
        version
      );
    }
  };
  // 绑定入口函数到dom事件
  const giveUpTime = Date.now() + 30000;
  function tryLoad() {
    if (["interactive", "complete"].includes(document.readyState)) {
      load();
    } else if (giveUpTime > Date.now()) {
      setTimeout(tryLoad, 100);
    } else {
      console.warn('插件添加失败');
    }
  }
  tryLoad();
}
