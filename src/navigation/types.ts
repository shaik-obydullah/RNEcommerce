export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

export type HomeTabParamList = {
  Home: undefined
  Products: undefined
  Cart: undefined
  Orders: undefined
  Profile: undefined
}

export type RootStackParamList = {
  Tabs: undefined
  ProductDetail: { productId: number }
  Checkout: undefined
  Login: undefined
  Register: undefined
}