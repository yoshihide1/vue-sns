import firebase from "../plugins/firebase";

export interface RootState {
  comment: string
}

export interface SnsState {
  storage: firebase;
  db: firebase;
  auth: firebase;

}