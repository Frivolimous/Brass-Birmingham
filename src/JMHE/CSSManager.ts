export const CSSManager = {
  addCSSClass: (className: string, rules: string) => {
    let style = document.createElement('style');
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(style);

    style.sheet.insertRule(`.${className}{${rules}}`, 0);
  },
};
