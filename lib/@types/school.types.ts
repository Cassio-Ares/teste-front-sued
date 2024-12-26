export interface SchoolTypes {
  id?: number,
  state_id: string | number
  city_id: string | number
  name: string
  total_students_morning: number
  total_students_afternoon: number
  total_students_nigth: number
  total_students_integral: number
  total_students: number
  phone: string
  email: string
  address: string
  deleted_at: null
}

export interface SchoolBasicTypes {
  id?: number,
  state_id: string | number
  city_id: string | number
  name: string
  deleted_at: null
}