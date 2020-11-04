declare const __PATH_PREFIX__: string

declare module "*.css" {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}
