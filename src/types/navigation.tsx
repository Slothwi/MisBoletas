export type RootStackParamList = {
  Login: undefined;
  '(tabs)': undefined;
  '+not-found': undefined;
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}