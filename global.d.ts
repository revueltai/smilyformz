declare global {
  type ValueOf<T> = T[keyof T]
}
