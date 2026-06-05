export interface Direccion {
  id: string
  calle: string
  colonia: string
  ciudad: string
  estado: string
  codigoPostal: string
  pais: string
  principal: boolean
}

export interface DireccionRequest {
  calle: string
  colonia: string
  ciudad: string
  estado: string
  codigoPostal: string
  pais: string
  principal?: boolean
}

export interface AdminUserRequest {
  email: string
  password: string
  nombre: string
  tipo: 'CLIENTE' | 'VENDEDOR' | 'ADMINISTRADOR'
}

export interface AdminUserResponse {
  id: string
  email: string
  nombre: string
  tipo: string
  activo: boolean
}
