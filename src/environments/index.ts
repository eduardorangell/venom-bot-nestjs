export default () => ({
  // NestJS
  PORT: parseInt(process.env.PORT) || 3000,

  // file uploads
  FILE_UPLOAD_DIR: process.env.FILE_UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 20000000,
  MAX_FILES: parseInt(process.env.MAX_FILES) || 10,
  ALLOWED_FILETYPES:
    process.env.ALLOWED_FILETYPES || 'jpg|jpeg|png|gif|mp4|m4v|avif|webp',
});
