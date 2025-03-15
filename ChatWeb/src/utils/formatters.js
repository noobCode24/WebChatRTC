// import moment from "moment-timezone";

// export const slugify = (val) => {
//   if (!val) return "";
//   return String(val)
//     .replace(/Đ/g, "D")
//     .replace(/đ/g, "d")
//     .normalize("NFKD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z0-9 -]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// };

// export const slugifyForSearch = (val) => {
//   if (!val) return "";
//   return String(val)
//     .replace(/Đ/g, "D")
//     .replace(/đ/g, "d")
//     .normalize("NFKD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z0-9\s]/g, "");
// };



// export const timeAgo = (timestamp) => {
//   const now = moment().tz("Asia/Ho_Chi_Minh");
//   const date = moment.utc(timestamp).tz("Asia/Ho_Chi_Minh");
//   const diffInMinutes = now.diff(date, "minutes");
//   if (diffInMinutes < 60) {
//     if (diffInMinutes < 1) {
//       return "Just now";
//     }
//     return `${diffInMinutes}m`;
//   }

//   const diffInHours = now.diff(date, "hours");
//   if (diffInHours < 24) return `${diffInHours}h`;

//   const diffInDays = now.diff(date, "days");
//   if (diffInDays < 30) return `${diffInDays}d`;

//   const diffInMonths = now.diff(date, "months");
//   if (diffInMonths < 12) return `${diffInMonths}mo`;

//   return `${now.diff(date, "years")}y`;
// };

// export const blobToBase64 = (blob) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// }

// export const convertBlobArrayToBase64 = async (blobArray) => {
//   return Promise.all(blobArray.map(blobToBase64));
// }

// export const formatFileSize = (sizeInBytes) => {
//   if (sizeInBytes < 1024) return `${sizeInBytes} B`;
//   let size = sizeInBytes / 1024;
//   if (size < 1024) return `${size.toFixed(2)} KB`;
//   size /= 1024;
//   if (size < 1024) return `${size.toFixed(2)} MB`;
//   size /= 1024;
//   return `${size.toFixed(2)} GB`;
// };


export function removeVietnameseDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formDataToBlobUrl(formData) {
  const entries = Array.from(formData.entries());
  const obj = Object.fromEntries(entries);
  const jsonString = JSON.stringify(obj, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  return URL.createObjectURL(blob);
}