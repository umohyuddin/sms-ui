export class MenuUtils {

    static hasClass(el: HTMLElement | null, className: string): boolean {
        return el ? el.classList.contains(className) : false;
    }

    static addClass(el: HTMLElement | null, className: string): void {
        if (el) el.classList.add(className);
    }

    static removeClass(el: HTMLElement | null, className: string): void {
        if (el) el.classList.remove(className);
    }

    static child(el: HTMLElement | null, selector: string): HTMLElement | null {
        return el ? el.querySelector(`:scope > ${selector}`) : null;
    }

    static children(el: HTMLElement | null, selector: string): HTMLElement[] {
        return el ? Array.from(el.querySelectorAll(selector)) as HTMLElement[] : [];
    }

    static slideDown(el: HTMLElement, duration = 200, callback?: () => void) {
        el.style.height = '0px';
        el.style.overflow = 'hidden';
        el.style.transition = `height ${duration}ms ease`;

        requestAnimationFrame(() => {
            const h = el.scrollHeight + 'px';
            el.style.height = h;

            setTimeout(() => {
                el.style.height = '';
                el.style.overflow = '';
                callback?.();
            }, duration);
        });
    }

    static slideUp(el: HTMLElement, duration = 200, callback?: () => void) {
        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
        el.style.transition = `height ${duration}ms ease`;

        requestAnimationFrame(() => {
            el.style.height = '0px';

            setTimeout(() => {
                el.style.height = '';
                el.style.overflow = '';
                callback?.();
            }, duration);
        });
    }
}
