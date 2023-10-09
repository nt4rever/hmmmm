export function getAvatarUrl(avatar?: string) {
  return avatar
    ? `${process.env.AWS_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${avatar}`
    : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
}
