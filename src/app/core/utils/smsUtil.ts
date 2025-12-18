import { KeyValueOption } from "../models/KeyValueOption";

export class SmsUtil {

  /**
   * Generates initials from a full name.
   * Examples:
   *  - "Uzair Anwar" → "UA"
   *  - "John Ronald Reuel Tolkien" → "JT"
   *  - "monica" → "M"
   */
  static getInitials(name: string): string {
    if (!name) return "";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();

    return first + last;
  }



  static mapToKeyValue(obj: Record<string, any>): KeyValueOption[] {
  return Object.entries(obj).map(([key, label]) => ({ key, label: label as string }));
}
}