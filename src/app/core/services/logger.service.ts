import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isDevelopment = !this.isProduction();

  constructor() { }

  private isProduction(): boolean {
    // Set to true in production environment
    return false;
  }

  /**
   * Start a console group for organized logging
   * @param label - The group label
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  /**
   * End the current console group
   */
  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Log general messages (alias for info)
   */
  log(message: string, data?: any): void {
    this.info(message, data);
  }

  /**
   * Log success messages (Green with ✅)
   */
  success(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.info(`✅ ${message}`, data || '');
    }
  }

  /**
   * Log error messages (Red with ❌)
   */
  error(message: string, data?: any): void {
    console.error(`❌ ${message}`, data || '');
  }

  /**
   * Log warning messages (Yellow with ⚠️)
   */
  warn(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.warn(`⚠️ ${message}`, data || '');
    }
  }

  /**
   * Log info messages (Blue with ℹ️)
   */
  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.info(`ℹ️ ${message}`, data || '');
    }
  }

  /**
   * Log debug messages (with 🐛)
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(`🐛 ${message}`, data || '');
    }
  }

  /**
   * Log HTTP requests/responses (with 📡)
   */
  http(method: string, url: string, status?: number, data?: any): void {
    if (this.isDevelopment) {
      const statusText = status ? ` [${status}]` : '';
      console.log(`📡 ${method} ${url}${statusText}`, data || '');
    }
  }

  /**
   * Log completion (with 🔚)
   */
  complete(message: string): void {
    if (this.isDevelopment) {
      console.log(`🔚 ${message}`);
    }
  }
}
