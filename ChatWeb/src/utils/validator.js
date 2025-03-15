// // FILE
// export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// export const ALLOWED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf', 'application/doc', 'application/docx'];

// export const validateFile = (file) => {
//   // console.log('🚀 ~ validateFile ~ file:', file)
//   if (!file?.name || !file?.size || !file?.type) {
//     return 'File cannot be blank.';
//   }
//   if (file.size > MAX_FILE_SIZE) {
//     return 'Maximum file size exceeded. (10MB)';
//   }
//   if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//     return 'File type is invalid. Only accept jpg, jpeg, and png.';
//   }
//   return null;
// };
