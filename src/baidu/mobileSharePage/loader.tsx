import { TAG, version } from "@/common/const";
import {
  setGetBdstoken,
  setGetShareFileList,
  setRefreshList,
  swalInstance,
} from "../common/const";

export default function installMobileShare() {
  console.info("%s version: %s MobileVer方式安装", TAG, version);
  swalInstance.swalGlobalArgs = {
    heightAuto: false,
    scrollbarPadding: false,
  }; // 添加swal参数以防止新版界面下的body样式突变
  setRefreshList(() => document.location.reload());
  setGetShareFileList(() => {
    const fileList : Array<any> = $('.main-container > .multifile > .file-list')[0].__vue__.allFileList;
    return Array.from(fileList).map(item => {
      return Object.assign({}, item, {
        category: item.category * 1,
        fs_id: item.fs_id * 1,
        isdir: item.isdir * 1,
        local_ctime: item.local_ctime * 1,
        local_mtime: item.local_mtime * 1,
        server_ctime: item.server_ctime * 1,
        server_mtime: item.server_mtime * 1,
        size: item.size * 1,
      });
    });
  });
  setGetBdstoken(() => unsafeWindow.locals.bdstoken);
  $(document).on("click", "#gen_bdlink_btn", () => {
    swalInstance.generatebdlinkTask.reset();
    swalInstance.generatebdlinkTask.isSharePage = true;
    swalInstance.checkUnfinish();
  }); // 绑定生成秒传按钮事件
  addBtn();
}

function addBtn() {
  // 轮询添加按钮, 防止新版页面重复init时, 将按钮覆盖
  let target = $(".main-container");
  if (target.length && !$("#gen_bdlink_btn").length)
    target.append('<span id="gen_bdlink_btn" class="wapfont none-pointer mobile-share-page"><span>');
  setTimeout(addBtn, 500);
}
