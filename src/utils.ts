export const getAbsolutePosition = (element: HTMLElement): [left: number, top: number] => {
    let left = 0;
    let top = 0;
  
    while (element.offsetParent) {
      left += element.offsetLeft;
      top += element.offsetTop;
      element = element.offsetParent as HTMLElement;
    }
  
    return [top, left];
}