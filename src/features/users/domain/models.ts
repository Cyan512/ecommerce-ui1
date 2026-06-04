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
