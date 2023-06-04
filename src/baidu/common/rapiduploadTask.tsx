/*
 * @Author: mengzonefire
 * @Date: 2021-08-25 01:30:29
 * @LastEditTime: 2023-05-04 18:09:10
 * @LastEditors: mengzonefire
 * @Description: 百度网盘 秒传转存任务实现
 */

import ajax from "@/common/ajax";
import { convertData, suffixChange, randomStringTransform, alternateCaseTransform } from "@/common/utils";
import {
  rapidupload_url,
  getBdstoken,
  illegalPathPattern,
} from "./const";
export default class RapiduploadTask {
  savePath: string;
  isDefaultPath: boolean;
  fileInfoList: Array<FileInfo>;
  bdstoken: string;
  onFinish: (fileInfoList: Array<FileInfo>) => void;
  onProcess: (i: number, fileInfoList: Array<FileInfo>) => void;

  reset(): void {
    this.bdstoken = getBdstoken();
    console.log(`bdstoken状态: ${this.bdstoken ? "获取成功" : "获取失败"}`); // debug
    this.fileInfoList = [];
    this.savePath = "";
    this.isDefaultPath = false;
    this.onFinish = () => {};
    this.onProcess = () => {};
  }

  start(): void {
    this.saveFileV2(0);
  }

  /**
   * @description: 转存秒传 接口2
   * @param {number} i
   */
  saveFileV2(i: number): void {
    if (i >= this.fileInfoList.length) {
      this.onFinish(this.fileInfoList);
      return;
    }
    this.onProcess(i, this.fileInfoList);
    let file = this.fileInfoList[i];
    // 文件名为空
    if (file.path === "/") {
      file.errno = -7;
      this.saveFileV2(i + 1);
      return;
    }
    let onFailed = (statusCode: number) => {
      file.errno = statusCode;
      this.saveFileV2(i + 1);
    };
    rapiduploadCreateFile.call(
      this,
      file,
      (data: any) => {
        console.info(JSON.stringify(data))
        data = data.response;
        file.errno = 2 === data.errno ? 114 : data.errno;
        file.errno = 31190 === file.errno ? 404 : file.errno;
        this.saveFileV2(i + 1);
      },
      onFailed
    );
  }
}

const retryTransforms = [
  {
    transformContentMd5(str: string) {
      return str.toUpperCase();
    },
    transformSliceMd5(str: string) {
      return str.toUpperCase();
    }
  },
  {
    transformContentMd5(str: string) {
      return str.toLowerCase();
    },
    transformSliceMd5(str: string) {
      return str.toLowerCase();
    }
  },
  {
    transformContentMd5(str: string) {
      return alternateCaseTransform(str)
    },
    transformSliceMd5(str: string) {
      return str.toLowerCase();
    }
  },
  {
    transformContentMd5(str: string) {
      const lower = str.toLowerCase();
      const upper = str.toUpperCase();
      if (lower === upper)
        return str;
      let ranStr = randomStringTransform(str);
      while (ranStr === lower || ranStr === upper) {
        ranStr = randomStringTransform(str);
      }
      return ranStr;
    },
    transformSliceMd5(str: string) {
      return str.toLowerCase();
    }
  },
];
const retryMax = retryTransforms.length - 1;

// 此接口测试结果如下: 错误md5->返回"errno": 31190, 正确md5+错误size->返回"errno": 2
// 此外, 即使md5和size均正确, 连续请求时依旧有小概率返回"errno": 2, 故建议加入retry策略
export function rapiduploadCreateFile(
  file: FileInfo,
  onResponsed: (data: any) => void,
  onFailed: (statusCode: number) => void,
  retry: number = 0
): void {
  const contentMd5 = retryTransforms[retry].transformContentMd5(file.md5);
  const sliceMd5 = retryTransforms[retry].transformSliceMd5(file.md5s);

  ajax(
    {
      url: `${rapidupload_url}${this.bdstoken ? "?bdstoken=" + this.bdstoken : ""}`, // bdstoken参数不能放在data里, 否则无效
      method: "POST",
      responseType: "json",
      data: convertData({
        path: this.savePath + file.path.replace(illegalPathPattern, "_"),
        "content-length": file.size,
        "content-md5": contentMd5,
        "slice-md5": sliceMd5,
        rtype: 0, // rtype=3覆盖文件, rtype=0则返回报错, 不覆盖文件, 默认为rtype=1 (自动重命名, 1和2是两种不同的重命名策略)
      }),
      headers: {
        "User-Agent": "netdisk",
      }
    },
    (data) => {
      // console.log(data.response); // debug
      if (31039 === data.response.errno && 31039 != file.errno) {
        file.errno = 31039;
        file.path = suffixChange(file.path);
        rapiduploadCreateFile.call(this, file, onResponsed, onFailed, retry);
      } else if (404 === data.response.errno && retry < retryMax) {
        // console.log(`转存接口错误, 重试${retry + 1}次: ${file.path}`); // debug
        rapiduploadCreateFile.call(this, file, onResponsed, onFailed, ++retry);
      } else if (0 !== data.response.errno) {
        onFailed(data.response.errno);
      } else onResponsed(data);
    },
    onFailed
  );
}
