import firebase from "../plugins/firebase";

export interface RootState {
  comment: string
}

export interface SnsState {

}

export interface PostList {
  id: string;
  data: {
    displayName: string;
    comment: string;
    imageUrl?: string;
    fileName?: string;
    uid: string;
    timeStamp?: firebase.firestore.FieldValue
  };
}
export interface CommentList {
  id: string;
  data: {
    displayName: string;
    comment: string;
    docId: string;
    uid: string;
  }
}