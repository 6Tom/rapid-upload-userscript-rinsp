import { TAG, version } from "@/common/const";
import {
  setGetBdstoken,
  setGetShareFileList,
  setGetSelectedFileList,
  setRefreshList,
  swalInstance,
} from "../common/const";
import { getShareFileList } from "@/common/utils";

const htmlBtnRapidNew = // 新版界面秒传按钮的html元素
  '<button id="bdlink_btn" class="mzf_new_btn"></i><span>秒传</span></button>';

export default function installMobile() {
  console.info("%s version: %s MobileVer方式安装", TAG, version);
  swalInstance.swalGlobalArgs = {
    heightAuto: false,
    scrollbarPadding: false,
  }; // 添加swal参数以防止新版界面下的body样式突变
  setRefreshList(() => document.location.reload());
  setGetShareFileList(getShareFileList);
  setGetSelectedFileList(() => {
    const fileList : Array<any> = $('.main-container > .multifile > .file-list')[0].__vue__.allFileList;
    return fileList.filter(item=>!!item.selected);
  });
  setGetBdstoken(() => unsafeWindow.locals.bdstoken);
  $(document).on("click", "#bdlink_btn", () => {
    swalInstance.inputView();
  }); // 绑定转存秒传按钮事件
  $(document).on("click", "#gen_bdlink_btn", () => {
    swalInstance.generatebdlinkTask.reset();
    swalInstance.checkUnfinish();
  }); // 绑定生成秒传按钮事件
  addBtn();
}

function addBtn() {
  // 轮询添加按钮, 防止新版页面重复init时, 将按钮覆盖
  let target = $(".main-container > header");
  if (target.length && !$("#bdlink_btn").length)
    target.append(htmlBtnRapidNew);
  let target2 = $(".main-container");
  if (target2.length && !$("#gen_bdlink_btn").length)
    target2.append('<span id="gen_bdlink_btn" class="wapfont none-pointer"><span>');
  setTimeout(addBtn, 500);
}
