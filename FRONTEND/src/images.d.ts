declare module "*.jpg" {
  const value: string;
  export = value;
}

declare module "*.png" {
  const value: string;
  export default value;
}
