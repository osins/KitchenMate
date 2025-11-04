// /Users/shaoyingwang/works/codes/KitchenMate/api/kitchenmate-api/src/models/result.entity.ts

export class Result<T> {
  code: number;     // 状态码，例如 404
  message: string;  // 消息内容
  data?: T;          // 返回的数据，泛型支持任意类型

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  // 静态方法：创建成功的 Result 对象
  static success<T>(data: T): Result<T> {
    return new Result<T>(200, "success", data);
  }

  // 静态方法：创建成功的 Result 对象（支持 void 类型）
  static successVoid(): Result<void> {
    return new Result<void>(200, "success", undefined as any);
  }

  // 静态方法：创建失败的 Result 对象
  static error<T>(code: number, message: string, data?: T): Result<T> {
    return new Result<T>(code, message, data as T);
  }
}
