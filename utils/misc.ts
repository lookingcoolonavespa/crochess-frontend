export function createControlBtnObj(
  src?: string,
  alt?: string,
  text?: string,
  onClick?: () => void
) {
  return { src, alt, text, onClick };
}

export function getKeyByValue(
  obj: {
    [key: string]: any;
  },
  val: any
) {
  return Object.keys(obj).find((key) => obj[key] === val);
}
