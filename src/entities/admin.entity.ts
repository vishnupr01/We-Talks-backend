export interface IAdmin {
  id:string,
  email:string,
  password:string
}
export interface IAdminLogin{
  email:string,
  token:string
}
export interface IJwtPayloadAdmin{
  email:string,
  name:string
}