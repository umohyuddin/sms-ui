export class LoggerUtil {

  static log(
    module: string,
    tag: string,
    message: string,
    data?: any
  ): void {
    if (data !== undefined) {
      console.log(`[${module}][${tag}] ${message}`, data);
    } else {
      console.log(`[${module}][${tag}] ${message}`);
    }
  }

  static error(
    module: string,
    tag: string,
    message: string,
    error?: any
  ): void {
    console.error(`[${module}][${tag}] ${message}`, error);
  }

  static warn(
    module: string,
    tag: string,
    message: string,
    data?: any
  ): void {
    console.warn(`[${module}][${tag}] ${message}`, data);
  }

  static group(title: string): void {
    console.groupCollapsed(title);
  }

  static groupEnd(): void {
    console.groupEnd();
  }
}
