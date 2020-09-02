import firebase from "../plugins/firebase";

export interface RootState {
  comment: string
}

export interface SnsState {

}

export interface ImageList {
  id: string;
  data: {
    displayName: string;
    comment?: string;
    imageUrl?: string;
    fileName?: string;
    uid: string;
    timeStamp: {
      nanoseconds: number;
      seconds: number;
    };
  };
}
export interface CommentList {
  id: string;
  displayName: string;
  docId: string;
  uid: string
}