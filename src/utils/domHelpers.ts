// DOM 操作工具函数，确保类型安全
export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id) as T | null;
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

export function safeSetTextContent(element: HTMLElement | null, text: string | number): void {
  if (element) {
    element.textContent = text.toString();
  }
}

export function safeSetAttribute(element: HTMLElement | null, attribute: string, value: string): void {
  if (element) {
    element.setAttribute(attribute, value);
  }
}

export function safeAddEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | null,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  if (element) {
    element.addEventListener(type, listener, options);
  }
}

export function createImageElement(src: string, alt: string, className?: string): HTMLImageElement {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  if (className) {
    img.className = className;
  }
  return img;
}

// 检查元素是否存在并返回类型安全的元素
export function ensureElement<T extends HTMLElement>(id: string, type: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Required element with id "${id}" not found`);
  }
  return element as T;
}

// 批量获取元素
export function getElements<T extends HTMLElement>(ids: string[]): (T | null)[] {
  return ids.map(id => getElementById<T>(id));
}

// 显示/隐藏元素
export function toggleElement(element: HTMLElement | null, show: boolean): void {
  if (element) {
    element.style.display = show ? 'block' : 'none';
  }
}

// 添加/移除CSS类
export function toggleClass(element: HTMLElement | null, className: string, add: boolean): void {
  if (element) {
    if (add) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
} 